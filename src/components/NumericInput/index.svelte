<!--
  NumericInput: UI3's numeric field ("Numeric input" in the UI3 file).

  - A lead cell holds a letter (`label="W"`) or an icon; dragging it scrubs the
    value, one `step` per pixel (Shift: ×10).
  - ArrowUp/ArrowDown step the value (Shift: ×10); Enter commits and keeps focus,
    Escape reverts. Simple arithmetic is accepted: `24*2`, `100/3`, `16+8`.
  - The value is clamped to `min`/`max` and rounded to `precision` decimals. An
    empty or unparseable entry reverts; `value = null` shows the placeholder
    ("Mixed", say).
  - `options` adds a chevron that opens a list of presets (Figma's "Combo input").

  `input` fires while scrubbing, `change` whenever a value is committed.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from '../Icon/index.svelte';
  import Menu from '../Menu/index.svelte';
  import IconChevronDown from './../../icons/24/icon.24.chevron.down.svg';

  /** @type {number | null} */
  export let value = null;
  /** @type {number | null} */
  export let min = null;
  /** @type {number | null} */
  export let max = null;
  export let step = 1;
  /** Decimals kept when committing; null keeps up to 2. */
  /** @type {number | null} */
  export let precision = null;
  /** A letter in the lead cell, e.g. "X" or "W". */
  export let label = '';
  /** An icon in the lead cell (SVG import); wins over `label`. */
  export let iconName = null;
  /** Trailing unit, e.g. "px" or "%". */
  export let unit = '';
  export let placeholder = '';
  export let disabled = false;
  /** Presets for the chevron menu: numbers, or `{ label, value }`. */
  /** @type {Array<number | { label: string, value: number }> | null} */
  export let options = null;
  export let id = null;
  export let name = null;
  export let ariaLabel = '';

  let className = '';
  export { className as class };

  const dispatch = createEventDispatcher();

  /** @type {HTMLInputElement} */
  let input;
  /** @type {HTMLButtonElement} */
  let chevron;
  let text = '';
  let focused = false;
  let menuOpen = false;
  let scrub = null; // { x, start, moved }
  let selectOnMouseUp = false;

  $: decimals = precision ?? 2;
  // A numeric string ("12", from older saved settings say) reads as its number.
  $: numeric = typeof value === 'string' ? evaluate(value) : value;
  $: if (!focused) text = format(numeric);
  $: hasLead = Boolean(iconName || label);
  $: menuItems = (options ?? []).map((option) => {
    const item =
      typeof option === 'number' ? { label: format(option), value: option } : { ...option };
    return { ...item, selected: item.value === numeric };
  });

  function format(n) {
    if (n == null || Number.isNaN(n)) return '';
    return String(Number(n.toFixed(decimals)));
  }

  function clamp(n) {
    if (min != null) n = Math.max(min, n);
    if (max != null) n = Math.min(max, n);
    return Number(n.toFixed(decimals));
  }

  function commit(n) {
    if (n == null || Number.isNaN(n)) {
      text = format(numeric);
      return;
    }
    const next = clamp(n);
    text = format(next);
    if (next !== numeric || typeof value !== 'number') {
      value = next;
      dispatch('change', value);
    }
  }

  function handleKeydown(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const base = evaluate(text) ?? numeric ?? 0;
      const delta = step * (event.shiftKey ? 10 : 1) * (event.key === 'ArrowUp' ? 1 : -1);
      commit(base + delta);
      input.select();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      commit(evaluate(text));
      input.select();
    } else if (event.key === 'Escape') {
      text = format(numeric);
      input.blur();
    }
  }

  function handleFocus() {
    focused = true;
    selectOnMouseUp = true;
    input.select();
  }

  function handleBlur() {
    focused = false;
    commit(evaluate(text));
  }

  // A click that focuses the field keeps the whole value selected, as a tab does.
  function handleMouseUp(event) {
    if (selectOnMouseUp) event.preventDefault();
    selectOnMouseUp = false;
  }

  // SCRUBBING

  function scrubStart(event) {
    if (disabled || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    scrub = { x: event.clientX, start: numeric ?? evaluate(text) ?? 0, moved: false };
  }

  function scrubMove(event) {
    if (!scrub) return;
    const dx = Math.round(event.clientX - scrub.x);
    if (dx === 0 && !scrub.moved) return;
    scrub.moved = true;
    const next = clamp(scrub.start + dx * step * (event.shiftKey ? 10 : 1));
    if (next !== value) {
      value = next;
      dispatch('input', value);
    }
  }

  function scrubEnd() {
    if (!scrub) return;
    const { moved, start } = scrub;
    scrub = null;
    if (moved && value !== start) dispatch('change', value);
    if (!moved) input.focus();
  }

  // PRESETS

  function handlePreset(event) {
    commit(event.detail.value);
  }

  // Arithmetic without eval: numbers, + - * /, parentheses and unary minus.
  // Anything else is not a number.
  function evaluate(source) {
    const src = String(source ?? '')
      .replace(/,/g, '.')
      .replace(/\s+/g, '');
    if (!src) return null;
    let at = 0;
    const peek = () => src[at];
    function expr() {
      let v = term();
      while (peek() === '+' || peek() === '-') v = src[at++] === '+' ? v + term() : v - term();
      return v;
    }
    function term() {
      let v = factor();
      while (peek() === '*' || peek() === '/') v = src[at++] === '*' ? v * factor() : v / factor();
      return v;
    }
    function factor() {
      if (peek() === '-') {
        at++;
        return -factor();
      }
      if (peek() === '+') {
        at++;
        return factor();
      }
      if (peek() === '(') {
        at++;
        const v = expr();
        if (src[at++] !== ')') throw new Error('unclosed');
        return v;
      }
      const match = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(src.slice(at));
      if (!match) throw new Error('not a number');
      at += match[0].length;
      return parseFloat(match[0]);
    }
    try {
      const v = expr();
      return at === src.length && Number.isFinite(v) ? v : null;
    } catch {
      return null;
    }
  }
</script>

<div
  class="numeric-input {className}"
  class:focused
  class:disabled
  class:has-lead={hasLead}
  class:has-options={options && options.length > 0}
>
  {#if hasLead}
    <!-- Scrubbing is a pointer shortcut; the field's arrow keys do the same. -->
    <span
      class="lead"
      class:scrubbing={scrub?.moved}
      on:pointerdown={scrubStart}
      on:pointermove={scrubMove}
      on:pointerup={scrubEnd}
      on:pointercancel={scrubEnd}
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
    aria-valuenow={numeric ?? undefined}
    aria-valuemin={min ?? undefined}
    aria-valuemax={max ?? undefined}
    on:keydown={handleKeydown}
    on:focus={handleFocus}
    on:blur={handleBlur}
    on:mouseup={handleMouseUp}
    on:focus
    on:blur
    on:keydown
  />
  {#if unit && text !== ''}
    <span class="unit" aria-hidden="true">{unit}</span>
  {/if}
  {#if options && options.length > 0}
    <button
      bind:this={chevron}
      type="button"
      class="chevron"
      tabindex="-1"
      aria-label="Presets"
      aria-haspopup="menu"
      aria-expanded={menuOpen}
      {disabled}
      on:click={() => (menuOpen = !menuOpen)}
    >
      <Icon
        iconName={IconChevronDown}
        color={disabled ? '--figma-color-icon-disabled' : '--figma-color-icon-secondary'}
      />
    </button>
    <Menu
      bind:isOpen={menuOpen}
      {menuItems}
      anchorElement={chevron}
      position="bottom-right"
      itemVariant="checkmark"
      on:select={handlePreset}
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

  .numeric-input:hover:not(.disabled) {
    border-color: var(--figma-color-border);
  }

  .numeric-input.focused,
  .numeric-input.focused:hover {
    border-color: var(--figma-color-border-selected);
  }

  .numeric-input.disabled {
    border-color: var(--figma-color-border);
    background-color: transparent;
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

  .chevron {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: var(--size-small);
    height: var(--size-small);
    margin: -1px -1px -1px 0;
    padding: 0;
    border: 1px solid transparent;
    border-radius: 0 var(--border-radius-medium) var(--border-radius-medium) 0;
    background: transparent;
  }

  .chevron :global(.icon-component) {
    cursor: inherit;
  }

  .has-options:hover:not(.disabled) .chevron,
  .has-options.focused .chevron {
    border-left-color: var(--figma-color-border);
  }

  .chevron:hover:not(:disabled) {
    background-color: var(--figma-color-bg-hover);
  }

  .chevron[aria-expanded='true'] {
    background-color: var(--figma-color-bg-pressed, var(--figma-color-bg-hover));
  }
</style>
