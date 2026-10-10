<!--
  NumericInputMulti: UI3's "Numeric input multi" — several numbers in one field
  behind one lead, e.g. the four corner radii or paddings.

  Each cell behaves like NumericInput: arrow keys step (Shift ×10), Enter
  commits, Escape reverts, arithmetic works. Dragging the lead scrubs every
  enabled cell together. `disabled` is one flag for the field or one per cell.

  `onchange` gets `{ values, index }` (the cell that changed; -1 for all).
-->
<script lang="ts">
  import { onDestroy, untrack } from 'svelte';
  import Icon from '../Icon/index.svelte';
  import {
    endScrub,
    evaluate,
    scrubOffset,
    startScrub,
    type Scrub,
  } from '../NumericInput/numeric.js';

  type Values = Array<number | null>;

  interface Props {
    values?: Values;
    min?: number | null;
    max?: number | null;
    step?: number;
    precision?: number | null;
    /** An icon in the lead cell (SVG import); wins over `label`. */
    iconName?: string | null;
    label?: string;
    /** Names the field as a whole, e.g. 'Corner radius'. Falls back to `label`. */
    ariaLabel?: string;
    /** Names each cell, e.g. ['Top left', 'Top right', 'Bottom right', 'Bottom left']. */
    ariaLabels?: string[];
    placeholder?: string;
    /** One flag for the field, or one per cell */
    disabled?: boolean | boolean[];
    class?: string;
    /** A committed value, after `values` updates: the cell that changed, -1 for all */
    onchange?: (detail: { values: Values; index: number }) => void;
    /** While scrubbing, after `values` updates */
    oninput?: (detail: { values: Values; index: number }) => void;
  }

  let {
    values = $bindable(),
    min = null,
    max = null,
    step = 1,
    precision = null,
    iconName = null,
    label = '',
    ariaLabel = '',
    ariaLabels = [],
    placeholder = '',
    disabled = false,
    class: className = '',
    onchange,
    oninput,
  }: Props = $props();

  // Unset, it has four cells at 0
  let cells = $derived(values ?? [0, 0, 0, 0]);

  let inputs: HTMLInputElement[] = $state([]);
  let texts: string[] = $state([]);
  let focusedIndex = $state(-1);
  let scrub: Scrub<Values> | null = $state(null);

  let decimals = $derived(precision ?? 2);
  let cellDisabled = $derived(
    cells.map((_, i) => (Array.isArray(disabled) ? Boolean(disabled[i]) : disabled))
  );
  let allDisabled = $derived(cellDisabled.every(Boolean));
  // A focused cell keeps what is typed in it
  $effect.pre(() => {
    const next = cells.map((v, i) => (i === focusedIndex ? untrack(() => texts[i]) : format(v)));
    texts = next;
  });
  let hasLead = $derived(Boolean(iconName || label));
  // Every cell is a spinbutton, so every cell needs a name. Without `ariaLabels`
  // they are numbered off the field's own name, which beats four unnamed fields.
  let groupLabel = $derived(ariaLabel || label);
  let cellLabels = $derived(
    cells.map((_, i) => ariaLabels[i] || (groupLabel ? `${groupLabel} ${i + 1}` : `Value ${i + 1}`))
  );

  function format(n: number | null | undefined) {
    if (n == null || Number.isNaN(n)) return '';
    return String(Number(Number(n).toFixed(decimals)));
  }

  function clamp(n: number) {
    if (min != null) n = Math.max(min, n);
    if (max != null) n = Math.min(max, n);
    return Number(n.toFixed(decimals));
  }

  function commit(index: number, n: number | null) {
    if (n == null || Number.isNaN(n)) {
      texts[index] = format(cells[index]);
      return;
    }
    const next = clamp(n);
    texts[index] = format(next);
    if (next !== cells[index]) {
      values = cells.map((v, i) => (i === index ? next : v));
      onchange?.({ values: cells, index });
    }
  }

  function handleKeydown(event: KeyboardEvent, index: number) {
    const input = inputs[index];
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const base = evaluate(texts[index]) ?? cells[index] ?? 0;
      commit(index, base + step * (event.shiftKey ? 10 : 1) * (event.key === 'ArrowUp' ? 1 : -1));
      input.select();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      commit(index, evaluate(texts[index]));
      input.select();
    } else if (event.key === 'Escape') {
      // Undoes the field alone: a modal it's in stays open
      event.stopPropagation();
      texts[index] = format(cells[index]);
      input.blur();
    }
  }

  function handleFocus(index: number) {
    focusedIndex = index;
    inputs[index].select();
  }

  function handleBlur(index: number) {
    commit(index, evaluate(texts[index]));
    if (focusedIndex === index) focusedIndex = -1;
  }

  function scrubStart(event: PointerEvent & { currentTarget: EventTarget & HTMLElement }) {
    if (allDisabled || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    scrub = startScrub(event, [...cells]);
  }

  function scrubMove(event: PointerEvent) {
    if (!scrub) return;
    // Let go outside the plugin's window, where the release went unheard
    if (event.buttons === 0) return scrubEnd(event);
    const delta = scrubOffset(scrub, event, step);
    if (delta == null) return;
    values = scrub.start.map((v, i) => (cellDisabled[i] ? v : clamp((v ?? 0) + delta)));
    // A focused cell keeps its own text, so scrubbing has to rewrite it or it
    // would sit on a stale number until blur.
    if (focusedIndex !== -1 && !cellDisabled[focusedIndex]) {
      texts[focusedIndex] = format(cells[focusedIndex]);
    }
    oninput?.({ values: cells, index: -1 });
  }

  function scrubEnd(event: PointerEvent) {
    if (!scrub || event.pointerId !== scrub.id) return;
    const moved = scrub.moved;
    scrub = null;
    endScrub();
    if (moved) onchange?.({ values: cells, index: -1 });
  }

  onDestroy(() => {
    if (scrub) endScrub();
  });
</script>

<svelte:window onpointermove={scrubMove} onpointerup={scrubEnd} onpointercancel={scrubEnd} />

<div
  class="numeric-input-multi {className}"
  class:disabled={allDisabled}
  class:focused={focusedIndex !== -1}
  role="group"
  aria-label={groupLabel || undefined}
>
  {#if hasLead}
    <!-- Scrubbing is a pointer shortcut; each cell's arrow keys do the same. -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span class="lead" onpointerdown={scrubStart}>
      {#if iconName}
        <Icon
          {iconName}
          color={allDisabled ? '--figma-color-icon-disabled' : '--figma-color-icon-secondary'}
        />
      {:else}
        <Icon
          iconText={label}
          color={allDisabled ? '--figma-color-text-disabled' : '--figma-color-text-secondary'}
        />
      {/if}
    </span>
  {/if}
  {#each cells as _, index (index)}
    <input
      bind:this={inputs[index]}
      bind:value={texts[index]}
      class="cell"
      class:first={index === 0 && !hasLead}
      type="text"
      inputmode="decimal"
      role="spinbutton"
      autocomplete="off"
      spellcheck="false"
      {placeholder}
      disabled={cellDisabled[index]}
      aria-label={cellLabels[index]}
      aria-valuenow={cells[index] ?? undefined}
      aria-valuemin={min ?? undefined}
      aria-valuemax={max ?? undefined}
      onfocus={() => handleFocus(index)}
      onblur={() => handleBlur(index)}
      onkeydown={(e) => handleKeydown(e, index)}
    />
  {/each}
</div>

<style>
  .numeric-input-multi {
    display: flex;
    align-items: stretch;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    height: var(--size-small); /* 24px */
    border: 1px solid transparent;
    border-radius: var(--border-radius-medium);
    background-color: var(--figma-color-bg-secondary);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
  }

  .numeric-input-multi:hover:not(.disabled) {
    border-color: var(--figma-color-border);
  }

  .numeric-input-multi.focused,
  .numeric-input-multi.focused:hover {
    border-color: var(--figma-color-border-selected);
  }

  .numeric-input-multi.disabled {
    border-color: var(--figma-color-border);
    background-color: var(--figma-color-bg);
  }

  .lead {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: var(--size-small);
    margin: -1px 0 -1px -1px;
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

  /* Cells split the rest evenly; a canvas-colored line between them, as in UI3. */
  .cell {
    flex: 1 1 0;
    min-width: 0;
    height: 100%;
    margin: 0;
    padding: 0 var(--size-xxxsmall);
    border: 0;
    border-right: 1px solid var(--figma-color-bg);
    outline: none;
    background: transparent;
    color: var(--figma-color-text);
    font: inherit;
    letter-spacing: inherit;
  }

  .cell.first {
    padding-left: var(--size-xxsmall);
  }

  .cell:last-child {
    border-right: 0;
  }

  .disabled .cell {
    border-right-color: transparent;
  }

  .cell::placeholder {
    color: var(--figma-color-text-tertiary);
  }

  .cell::selection {
    background-color: var(--text-highlight);
  }

  .cell:disabled {
    color: var(--figma-color-text-disabled);
  }
</style>
