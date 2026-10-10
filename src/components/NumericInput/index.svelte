<!--
  NumericInput: UI3's numeric field ("Numeric input" in the UI3 file).

  - A lead cell holds a letter (`label="W"`) or an icon; dragging it scrubs the
    value, one `step` per pixel (Shift: ×10) past 3px of slack.
  - ArrowUp/ArrowDown step the value (Shift: ×10); Enter commits and keeps focus,
    Escape reverts. Simple arithmetic is accepted: `24*2`, `100/3`, `16+8`.
  - The value is clamped to `min`/`max` and rounded to `precision` decimals. An
    empty or unparseable entry reverts; `value = null` shows the placeholder
    ("Mixed", say).
  - `options` adds a chevron that opens a list of presets (Figma's "Combo input").

  `oninput` is called while scrubbing, `onchange` whenever a value is committed.
-->
<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import type { FocusEventHandler, KeyboardEventHandler } from 'svelte/elements';
  import Icon from '../Icon/index.svelte';
  import IconButton from '../IconButton/index.svelte';
  import Menu from '../Menu/index.svelte';
  import VariablePill from '../VariablePill/index.svelte';
  import IconChevronDown from './../../icons/24/icon.24.chevron.down.svg';
  import IconDetach from './../../icons/24/icon.24.detach.small.svg';
  import { endScrub, evaluate, scrubOffset, startScrub, type Scrub } from './numeric.js';

  interface Props {
    /** A numeric string ("12", from older saved settings say) reads as its number */
    value?: number | string | null;
    min?: number | null;
    max?: number | null;
    step?: number;
    /** Decimals kept when committing; null keeps up to 2. */
    precision?: number | null;
    /** A letter in the lead cell, e.g. "X" or "W". */
    label?: string;
    /** An icon in the lead cell (SVG import); wins over `label`. */
    iconName?: string | null;
    /** Trailing unit, e.g. "px" or "%". */
    unit?: string;
    placeholder?: string;
    disabled?: boolean;
    /** A red edge, as Input's: the value is part of a problem shown elsewhere. */
    invalid?: boolean;
    /** Presets for the chevron menu: numbers, or `{ label, value }`. */
    options?: Array<number | { label: string; value: number }> | null;
    id?: string | null;
    name?: string | null;
    ariaLabel?: string;
    /** A bound variable's name: shown as a pill in place of the value, with a detach button */
    variable?: string | null;
    class?: string;
    /** A committed value, after `value` updates */
    onchange?: (value: number) => void;
    /** While scrubbing, after `value` updates */
    oninput?: (value: number) => void;
    /** The detach button, or a preset picked while bound: the variable's name */
    ondetach?: (variable: string) => void;
    /** The variable pill: the variable's name */
    onvariableclick?: (variable: string) => void;
    /** The field's, or the pill's while bound */
    onfocus?: FocusEventHandler<HTMLElement>;
    onblur?: FocusEventHandler<HTMLElement>;
    onkeydown?: KeyboardEventHandler<HTMLElement>;
  }

  let {
    value = $bindable(),
    min = null,
    max = null,
    step = 1,
    precision = null,
    label = '',
    iconName = null,
    unit = '',
    placeholder = '',
    disabled = false,
    invalid = false,
    options = null,
    id = null,
    name = null,
    ariaLabel = '',
    variable = null,
    class: className = '',
    onchange,
    oninput,
    ondetach,
    onvariableclick,
    onfocus,
    onblur,
    onkeydown,
  }: Props = $props();

  let input: HTMLInputElement | undefined = $state();
  let chevron: HTMLButtonElement | undefined = $state();
  let text = $state('');
  let focused = $state(false);
  let menuOpen = $state(false);
  let scrub: Scrub | null = $state(null);
  let selectOnMouseUp = false;
  let pillFocused = $state(false);

  let decimals = $derived(precision ?? 2);
  // A numeric string ("12", from older saved settings say) reads as its number.
  let numeric = $derived(typeof value === 'string' ? evaluate(value) : value);
  $effect.pre(() => {
    if (!focused) text = format(numeric);
  });
  let hasLead = $derived(Boolean(iconName || label));
  let hasOptions = $derived(Boolean(options && options.length > 0));
  let menuItems = $derived(
    (options ?? []).map((option) => {
      const item =
        typeof option === 'number' ? { label: format(option), value: option } : { ...option };
      return { ...item, selected: item.value === numeric };
    })
  );

  function format(n: number | null | undefined) {
    if (n == null || Number.isNaN(n)) return '';
    return String(Number(n.toFixed(decimals)));
  }

  function clamp(n: number) {
    if (min != null) n = Math.max(min, n);
    if (max != null) n = Math.min(max, n);
    return Number(n.toFixed(decimals));
  }

  function commit(n: number | null) {
    if (n == null || Number.isNaN(n)) {
      text = format(numeric);
      return;
    }
    const next = clamp(n);
    text = format(next);
    if (next !== numeric || typeof value !== 'number') {
      value = next;
      onchange?.(next);
      // A parent may answer the change with another value — snapping to a
      // preset, say. Show it even though the field still has focus, so the
      // next arrow key steps from what the parent kept.
      tick().then(() => {
        if (!focused) return;
        text = format(numeric);
        if (input && document.activeElement === input) input.select();
      });
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const base = evaluate(text) ?? numeric ?? 0;
      const delta = step * (event.shiftKey ? 10 : 1) * (event.key === 'ArrowUp' ? 1 : -1);
      commit(base + delta);
      input?.select();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      commit(evaluate(text));
      input?.select();
    } else if (event.key === 'Escape') {
      // Undoes the field alone: a modal it's in stays open
      event.stopPropagation();
      text = format(numeric);
      input?.blur();
    }
  }

  function handleFocus() {
    focused = true;
    selectOnMouseUp = true;
    input?.select();
  }

  function handleBlur() {
    focused = false;
    commit(evaluate(text));
  }

  // A click that focuses the field keeps the whole value selected, as a tab does.
  function handleMouseUp(event: MouseEvent) {
    if (selectOnMouseUp) event.preventDefault();
    selectOnMouseUp = false;
  }

  // SCRUBBING

  function scrubStart(event: PointerEvent & { currentTarget: EventTarget & HTMLElement }) {
    if (disabled || variable || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    // A focused field keeps its own text, which blur would commit over the
    // scrubbed value: commit what's typed now, and scrub from it.
    if (focused) input?.blur();
    const start = typeof value === 'number' ? value : (numeric ?? evaluate(text) ?? 0);
    scrub = startScrub(event, start);
  }

  function scrubMove(event: PointerEvent) {
    if (!scrub) return;
    // Let go outside the plugin's window, where the release went unheard
    if (event.buttons === 0) return scrubEnd(event);
    const offset = scrubOffset(scrub, event, step);
    if (offset == null) return;
    const next = clamp(scrub.start + offset);
    // Held at min or max, the drag turns back from there, not from past it.
    scrub.offset = next - scrub.start;
    if (next !== value) {
      value = next;
      oninput?.(next);
    }
  }

  function scrubEnd(event: PointerEvent) {
    if (!scrub || event.pointerId !== scrub.id) return;
    const { moved, start } = scrub;
    scrub = null;
    endScrub();
    if (moved && typeof value === 'number' && value !== start) onchange?.(value);
    if (!moved) input?.focus();
  }

  onDestroy(() => {
    if (scrub) endScrub();
  });

  // PRESETS

  // Picking a preset while bound sets a raw value, so the binding goes: ask the parent to detach.
  function handlePreset(item: { value?: unknown }) {
    if (variable) ondetach?.(variable);
    commit(item.value as number);
  }
</script>

<svelte:window onpointermove={scrubMove} onpointerup={scrubEnd} onpointercancel={scrubEnd} />

<!--
  With `options` this is UI3's combo input: one box whose hover and focus borders
  run round the whole shape, the presets chevron split off by a 1px line.
-->
<div
  class="numeric-input {className}"
  class:disabled
  class:invalid
  class:has-options={hasOptions}
  class:bound={variable}
>
  <div class="field" class:has-lead={hasLead}>
    {#if hasLead}
      <!-- Scrubbing is a pointer shortcut; the field's arrow keys do the same. -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <span
        class="lead"
        class:scrubbing={scrub?.moved}
        class:static={variable}
        onpointerdown={scrubStart}
      >
        {#if iconName}
          <Icon
            {iconName}
            color={disabled ? '--figma-color-icon-disabled' : '--figma-color-icon-secondary'}
          />
        {:else}
          <Icon
            iconText={label}
            color={disabled ? '--figma-color-text-disabled' : '--figma-color-text-secondary'}
          />
        {/if}
      </span>
    {/if}
    {#if variable}
      <!--
        A button, not a span: the pill is the field's control while it is bound
        (clicking it rebinds, as in Figma), it takes the field's `id` so a
        `<label for>` still reaches it, and it keeps the field in the tab order.
      -->
      <button
        type="button"
        class="pill-slot"
        {id}
        {name}
        {disabled}
        aria-label={ariaLabel ? `${ariaLabel}: bound to ${variable}` : `Bound to ${variable}`}
        onclick={() => variable && onvariableclick?.(variable)}
        onfocus={(event) => {
          pillFocused = true;
          onfocus?.(event);
        }}
        onblur={(event) => {
          pillFocused = false;
          onblur?.(event);
        }}
        {onkeydown}
      >
        <VariablePill label={variable} onSelected={pillFocused} {disabled} />
      </button>
      {#if !disabled && !hasOptions}
        <IconButton
          class="detach"
          iconName={IconDetach}
          ariaLabel="Detach {variable}"
          onclick={() => variable && ondetach?.(variable)}
        />
      {/if}
    {:else}
      <input
        bind:this={input}
        bind:value={text}
        type="text"
        inputmode="decimal"
        role="spinbutton"
        autocomplete="off"
        spellcheck="false"
        {id}
        {name}
        {disabled}
        {placeholder}
        aria-label={ariaLabel || undefined}
        aria-invalid={invalid || undefined}
        aria-valuenow={numeric ?? undefined}
        aria-valuemin={min ?? undefined}
        aria-valuemax={max ?? undefined}
        onkeydown={(event) => {
          handleKeydown(event);
          onkeydown?.(event);
        }}
        onfocus={(event) => {
          handleFocus();
          onfocus?.(event);
        }}
        onblur={(event) => {
          handleBlur();
          onblur?.(event);
        }}
        onmouseup={handleMouseUp}
      />
      {#if unit && text !== ''}
        <span class="unit" aria-hidden="true">{unit}</span>
      {/if}
    {/if}
  </div>
  {#if hasOptions}
    <button
      bind:this={chevron}
      type="button"
      class="chevron"
      tabindex="-1"
      aria-label="Presets"
      aria-haspopup="menu"
      aria-expanded={menuOpen}
      {disabled}
      onclick={() => (menuOpen = !menuOpen)}
    >
      <Icon
        iconName={IconChevronDown}
        color={disabled ? '--figma-color-icon-disabled' : '--figma-color-icon'}
      />
    </button>
    <Menu
      bind:isOpen={menuOpen}
      {menuItems}
      anchorElement={chevron}
      position="bottom-right"
      itemVariant="checkmark"
      onselect={handlePreset}
    />
  {/if}
</div>

<style>
  .numeric-input {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    height: var(--size-small); /* 24px */
    border: 1px solid transparent;
    border-radius: var(--border-radius-medium); /* 5px */
    background-color: var(--figma-color-bg-secondary);
  }

  /* The visible edge is drawn over the children, so a fill that runs to the
     field's edge (the chevron's hover) can't leave a seam against it or hide it.
     The element keeps its own transparent border for layout. */
  .numeric-input::after {
    content: '';
    position: absolute;
    inset: -1px;
    border: 1px solid transparent;
    border-radius: inherit;
    pointer-events: none;
  }

  .numeric-input:hover:not(.disabled)::after {
    border-color: var(--figma-color-border);
  }

  /* Focus in the value or the pill; the chevron's own focus doesn't count */
  .numeric-input:has(.field:focus-within)::after {
    border-color: var(--figma-color-border-selected);
  }

  /* Red at rest, hovered and focused, as Input's invalid border. */
  .numeric-input.invalid::after,
  .numeric-input.invalid:hover::after,
  .numeric-input.invalid:has(.field:focus-within)::after {
    border-color: var(--figma-color-border-danger-strong);
  }

  .numeric-input.disabled {
    background-color: transparent;
  }

  .numeric-input.disabled::after {
    border-color: var(--figma-color-border);
  }

  .field {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    min-width: 0;
    height: 100%;
  }

  .lead {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: var(--size-small); /* 24px */
    height: var(--size-small);
    margin: -1px 0 -1px -1px; /* sits on the border, as in UI3 */
    cursor: ew-resize;
    touch-action: none;
    user-select: none;
  }

  /* Set on the page while a lead is dragged (see numeric.js) */
  :global(html.numeric-scrubbing),
  :global(html.numeric-scrubbing *) {
    cursor: ew-resize !important;
    user-select: none !important;
  }

  .lead :global(.icon-component) {
    cursor: inherit;
  }

  .disabled .lead {
    cursor: default;
  }

  input {
    flex: 1 1 auto;
    min-width: 0;
    height: 100%;
    margin: 0;
    padding: 0 var(--size-xxsmall); /* 8px */
    border: 0;
    outline: none;
    background: transparent;
    color: var(--figma-color-text);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    text-overflow: ellipsis;
  }

  .has-lead input {
    padding-left: 0;
  }

  input::placeholder {
    color: var(--figma-color-text-tertiary);
  }

  input::selection {
    background-color: var(--text-highlight);
  }

  input:disabled {
    color: var(--figma-color-text-disabled);
  }

  /* The pill starts where a value's text would: 8px in, or against the lead */
  .pill-slot {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    justify-content: flex-start;
    min-width: 0;
    height: 100%;
    margin: 0;
    padding: 0 var(--size-xxxsmall) 0 7px; /* 8px from the field's edge, less its border */
    border: 0;
    outline: none;
    background: transparent;
    font: inherit;
    cursor: default;
  }

  .has-lead .pill-slot {
    padding-left: 0;
  }

  .lead.static {
    cursor: default;
  }

  /* The detach button shows while the field is hovered or holds focus */
  .field :global(.detach) {
    flex: 0 0 auto;
    margin: -1px -1px -1px 0;
    opacity: 0;
  }

  /* No fill of its own: it sits in the field, as in Figma */
  .field :global(.icon-button.detach:hover:not(:disabled)),
  .field :global(.icon-button.detach:active:not(:disabled)) {
    background-color: transparent;
  }

  .bound:hover .field :global(.detach),
  .field:focus-within :global(.detach) {
    opacity: 1;
  }

  .unit {
    flex: 0 0 auto;
    padding-right: var(--size-xxsmall);
    color: var(--figma-color-text-tertiary);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    pointer-events: none;
    user-select: none;
  }

  /* Its own button, split off by a 1px line in the canvas color; it runs under
     the field's edge and darkens on hover and while its menu is open. */
  .chevron {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--size-small);
    height: var(--size-small);
    margin: -1px -1px -1px 0;
    padding: 0;
    border: 0;
    border-left: 1px solid var(--figma-color-bg);
    border-radius: 0 var(--border-radius-medium) var(--border-radius-medium) 0;
    background: transparent;
  }

  .chevron :global(.icon-component) {
    cursor: inherit;
  }

  .chevron:hover:not(:disabled),
  .chevron[aria-expanded='true'] {
    background-color: var(--figma-color-bg-tertiary);
  }

  .disabled .chevron {
    border-left-color: var(--figma-color-border);
  }
</style>
