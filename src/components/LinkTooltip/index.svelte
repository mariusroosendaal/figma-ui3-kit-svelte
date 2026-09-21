<!--
  LinkTooltip: UI3's "Tooltip link" — the dark strip that appears against a link
  (or a selection being linked) with an action and its alternatives, or a field
  to type the URL into.

  Unlike Tooltip it is interactive and controlled: the parent opens it against
  `anchor` and it stays until an action is picked, Escape is pressed, the pointer
  goes down outside it, or something behind it scrolls.
-->
<script>
  import { createEventDispatcher, onDestroy, tick } from 'svelte';
  import Icon from '../Icon/index.svelte';
  import { placeTooltip, arrowStyle } from '../Tooltip/position.js';

  export let open = false;
  /** @type {HTMLElement | DOMRect | null} what it points at: an element, or a rect such as a text selection's */
  export let anchor = null;
  /** @type {'Top' | 'Bottom'} the side of the anchor it prefers; it flips when there's no room */
  export let direction = 'Top';
  /** The main action's text, e.g. "Open google.com"; fires `primary` */
  export let label = '';
  /** Icon before the main action (SVG import) */
  export let iconName = null;
  /** @type {Array<{ label: string, value: string }>} actions after the main one, e.g. Edit; each fires `action` */
  export let actions = [];
  /** Show a URL field instead of actions (UI3's URL variant); Enter fires `submit` */
  export let input = false;
  export let value = '';
  export let placeholder = 'Type or paste URL';
  export let ariaLabel = '';

  let className = '';
  export { className as class };

  const dispatch = createEventDispatcher();

  /** @type {HTMLDivElement} */
  let element;
  /** @type {HTMLInputElement} */
  let field;
  let position = { top: 0, left: 0 };
  /** @type {string} the side used, which may be the other one after a flip */
  let placedDirection = direction;
  let arrow = null;
  let placed = false;
  let listening = false;

  $: handleOpen(open);
  // Follows a new anchor or side, and its own new size, while open
  $: if (placed) reposition(anchor, direction, input, label, actions);
  // Switching to the field (Edit) puts the caret in it
  $: if (placed && input) focusField();

  // The arguments are only there so the $: statement re-runs when they change
  async function reposition(..._changed) {
    await tick();
    place();
  }

  async function focusField() {
    await tick();
    field?.focus({ preventScroll: true });
    field?.select();
  }

  async function handleOpen(isOpen) {
    if (!isOpen) {
      stopListening();
      placed = false;
      return;
    }
    await tick();
    if (!open) return;
    place();
    placed = true;
    // A tick later, so the pointerdown that opened it isn't taken for one outside
    setTimeout(() => {
      if (open) startListening();
    }, 0);
  }

  function anchorRect() {
    if (!anchor) return null;
    return 'getBoundingClientRect' in anchor ? anchor.getBoundingClientRect() : anchor;
  }

  function place() {
    const rect = anchorRect();
    if (!rect || !element) return;
    const result = placeTooltip(direction, rect, element.getBoundingClientRect());
    position = { top: result.top, left: result.left };
    placedDirection = result.direction;
    arrow = result.arrow;
  }

  function close() {
    if (!open) return;
    open = false;
    dispatch('close');
  }

  function onPointerDown(event) {
    if (element && !element.contains(event.target)) close();
  }

  // Placed against its anchor once; anything scrolling behind it would leave it floating
  function onScroll(event) {
    if (element && !element.contains(event.target)) close();
  }

  // On the window: it often opens while focus stays in the text being linked
  function onKeydown(event) {
    if (event.key === 'Escape') close();
  }

  function startListening() {
    if (listening) return;
    listening = true;
    document.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', close);
    window.addEventListener('keydown', onKeydown);
  }

  function stopListening() {
    if (!listening) return;
    listening = false;
    document.removeEventListener('pointerdown', onPointerDown, true);
    window.removeEventListener('scroll', onScroll, true);
    window.removeEventListener('resize', close);
    window.removeEventListener('keydown', onKeydown);
  }

  onDestroy(stopListening);

  function handleFieldKeydown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      dispatch('submit', value);
    }
  }
</script>

{#if open}
  <div
    bind:this={element}
    class="link-tooltip {placedDirection} {className}"
    class:placed
    style="top: {position.top}px; left: {position.left}px;"
    role={input ? 'dialog' : 'toolbar'}
    aria-label={ariaLabel || (input ? placeholder : label) || undefined}
  >
    <div class="body" class:field-body={input}>
      {#if input}
        <input
          bind:this={field}
          bind:value
          type="url"
          spellcheck="false"
          autocomplete="off"
          {placeholder}
          aria-label={ariaLabel || placeholder}
          on:keydown={handleFieldKeydown}
          on:input
        />
      {:else}
        <button
          type="button"
          class="action primary"
          class:has-icon={iconName}
          on:click={() => dispatch('primary')}
        >
          {#if iconName}
            <Icon {iconName} color="--color-text-tooltip-secondary" />
          {/if}
          <span class="label">{label}</span>
        </button>
        {#each actions as item (item.value)}
          <span class="separator" aria-hidden="true"></span>
          <button
            type="button"
            class="action"
            on:click={() => dispatch('action', { value: item.value, label: item.label })}
          >
            <span class="label">{item.label}</span>
          </button>
        {/each}
      {/if}
    </div>
    <div
      class="arrow {placedDirection}"
      style={arrowStyle(placedDirection, arrow)}
      aria-hidden="true"
    >
      <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
        <path d="M6 0L12 6H0L6 0Z" fill="var(--color-bg-tooltip)" />
      </svg>
    </div>
  </div>
{/if}

<style>
  .link-tooltip {
    position: fixed;
    z-index: 1000;
    visibility: hidden;
    /* UI3's light tooltip elevation as drop-shadows, so it follows the arrow too */
    filter: drop-shadow(0 0 0.5px rgba(0, 0, 0, 0.15)) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1))
      drop-shadow(0 5px 12px rgba(0, 0, 0, 0.13));
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
  }

  /* Hidden until placed, so it never flashes at the window's corner */
  .link-tooltip.placed {
    visibility: visible;
  }

  .body {
    display: flex;
    align-items: stretch;
    height: var(--size-small); /* 24px */
    overflow: hidden;
    border-radius: var(--border-radius-medium);
    background-color: var(--color-bg-tooltip);
  }

  .action {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    margin: 0;
    padding: 0 var(--size-xxsmall); /* 8px */
    border: 0;
    outline: none;
    background: transparent;
    color: var(--color-text-tooltip);
    font: inherit;
    letter-spacing: inherit;
    white-space: nowrap;
    cursor: default;
  }

  /* The icon takes its own 24px cell, so the label starts 24px in */
  .action.has-icon {
    padding-left: 0;
  }

  .action :global(.icon-component) {
    cursor: inherit;
  }

  .action:hover {
    background-color: var(--color-bg-menu-hover);
  }

  .action:focus-visible {
    box-shadow: inset 0 0 0 1px var(--color-bg-menu-selected);
  }

  .label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .separator {
    flex: 0 0 1px;
    background-color: var(--color-border-tooltip);
  }

  .field-body {
    width: 200px;
    padding: var(--size-xxxsmall) var(--size-xxsmall); /* 4px 8px */
  }

  input {
    flex: 1 1 auto;
    min-width: 0;
    height: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--color-text-tooltip);
    caret-color: var(--color-text-tooltip);
    font: inherit;
    letter-spacing: inherit;
  }

  input::placeholder {
    color: var(--color-text-tooltip-secondary);
  }

  input::selection {
    background-color: var(--text-highlight);
  }

  /* The arrow sits in the 8px gap; its tip points at the anchor */
  .arrow {
    position: absolute;
    display: flex;
    width: 12px;
    height: 6px;
  }

  .arrow.Top {
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(180deg);
  }

  .arrow.Bottom {
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
