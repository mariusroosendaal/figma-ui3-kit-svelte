<!--
  NumericInputMulti: UI3's "Numeric input multi" — several numbers in one field
  behind one lead, e.g. the four corner radii or paddings.

  Each cell behaves like NumericInput: arrow keys step (Shift ×10), Enter
  commits, Escape reverts, arithmetic works. Dragging the lead scrubs every
  enabled cell together. `disabled` is one flag for the field or one per cell.

  `change` hands back `{ values, index }` (the cell that changed; -1 for all).
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from '../Icon/index.svelte';
  import { evaluate } from '../NumericInput/numeric.js';

  /** @type {Array<number | null>} */
  export let values = [0, 0, 0, 0];
  /** @type {number | null} */
  export let min = null;
  /** @type {number | null} */
  export let max = null;
  export let step = 1;
  /** @type {number | null} */
  export let precision = null;
  export let iconName = null;
  export let label = '';
  /** Names the field as a whole, e.g. 'Corner radius'. Falls back to `label`. */
  export let ariaLabel = '';
  /** Names each cell, e.g. ['Top left', 'Top right', 'Bottom right', 'Bottom left']. */
  export let ariaLabels = [];
  export let placeholder = '';
  /** @type {boolean | boolean[]} */
  export let disabled = false;

  let className = '';
  export { className as class };

  const dispatch = createEventDispatcher();

  /** @type {HTMLInputElement[]} */
  let inputs = [];
  let texts = [];
  let focusedIndex = -1;
  let scrub = null;

  $: decimals = precision ?? 2;
  $: cellDisabled = values.map((_, i) =>
    Array.isArray(disabled) ? Boolean(disabled[i]) : disabled
  );
  $: allDisabled = cellDisabled.every(Boolean);
  $: texts = values.map((v, i) => (i === focusedIndex ? texts[i] : format(v)));
  $: hasLead = Boolean(iconName || label);
  // Every cell is a spinbutton, so every cell needs a name. Without `ariaLabels`
  // they are numbered off the field's own name, which beats four unnamed fields.
  $: groupLabel = ariaLabel || label;
  $: cellLabels = values.map(
    (_, i) => ariaLabels[i] || (groupLabel ? `${groupLabel} ${i + 1}` : `Value ${i + 1}`)
  );

  function format(n) {
    if (n == null || Number.isNaN(n)) return '';
    return String(Number(Number(n).toFixed(decimals)));
  }

  function clamp(n) {
    if (min != null) n = Math.max(min, n);
    if (max != null) n = Math.min(max, n);
    return Number(n.toFixed(decimals));
  }

  function commit(index, n) {
    if (n == null || Number.isNaN(n)) {
      texts[index] = format(values[index]);
      return;
    }
    const next = clamp(n);
    texts[index] = format(next);
    if (next !== values[index]) {
      values[index] = next;
      values = values;
      dispatch('change', { values, index });
    }
  }

  function handleKeydown(event, index) {
    const input = inputs[index];
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const base = evaluate(texts[index]) ?? values[index] ?? 0;
      commit(index, base + step * (event.shiftKey ? 10 : 1) * (event.key === 'ArrowUp' ? 1 : -1));
      input.select();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      commit(index, evaluate(texts[index]));
      input.select();
    } else if (event.key === 'Escape') {
      texts[index] = format(values[index]);
      input.blur();
    }
  }

  function handleFocus(index) {
    focusedIndex = index;
    inputs[index].select();
  }

  function handleBlur(index) {
    commit(index, evaluate(texts[index]));
    if (focusedIndex === index) focusedIndex = -1;
  }

  function scrubStart(event) {
    if (allDisabled || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    scrub = { x: event.clientX, start: [...values], moved: false };
  }

  function scrubMove(event) {
    if (!scrub) return;
    const dx = Math.round(event.clientX - scrub.x);
    if (dx === 0 && !scrub.moved) return;
    scrub.moved = true;
    const delta = dx * step * (event.shiftKey ? 10 : 1);
    values = scrub.start.map((v, i) => (cellDisabled[i] ? v : clamp((v ?? 0) + delta)));
    // A focused cell keeps its own text, so scrubbing has to rewrite it or it
    // would sit on a stale number until blur.
    if (focusedIndex !== -1 && !cellDisabled[focusedIndex]) {
      texts[focusedIndex] = format(values[focusedIndex]);
    }
    dispatch('input', { values, index: -1 });
  }

  function scrubEnd() {
    if (!scrub) return;
    const moved = scrub.moved;
    scrub = null;
    if (moved) dispatch('change', { values, index: -1 });
  }
</script>

<div
  class="numeric-input-multi {className}"
  class:disabled={allDisabled}
  class:focused={focusedIndex !== -1}
  role="group"
  aria-label={groupLabel || undefined}
>
  {#if hasLead}
    <!-- Scrubbing is a pointer shortcut; each cell's arrow keys do the same. -->
    <span
      class="lead"
      on:pointerdown={scrubStart}
      on:pointermove={scrubMove}
      on:pointerup={scrubEnd}
      on:pointercancel={scrubEnd}
    >
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
  {#each values as _, index (index)}
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
      aria-valuenow={values[index] ?? undefined}
      aria-valuemin={min ?? undefined}
      aria-valuemax={max ?? undefined}
      on:focus={() => handleFocus(index)}
      on:blur={() => handleBlur(index)}
      on:keydown={(e) => handleKeydown(e, index)}
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
