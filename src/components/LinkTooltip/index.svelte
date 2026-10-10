<!--
  LinkTooltip: UI3's "Tooltip link" — the dark strip that appears against a link
  (or a selection being linked) with an action and its alternatives, or a field
  to type the URL into.

  Unlike Tooltip it is interactive and controlled: the parent opens it against
  `anchor` and it stays until an action is picked, Escape is pressed, the pointer
  goes down outside it, or something behind it scrolls.
-->
<script lang="ts">
  import { onDestroy, tick, untrack } from 'svelte';
  import type { FormEventHandler } from 'svelte/elements';
  import Icon from '../Icon/index.svelte';
  import { placeTooltip, arrowStyle } from '../Tooltip/position';

  interface Props {
    isOpen?: boolean;
    /** What it points at: an element, or a rect such as a text selection's */
    anchor?: HTMLElement | DOMRect | null;
    /** The side of the anchor it prefers; it flips when there's no room */
    direction?: 'Top' | 'Bottom';
    /** The main action's text, e.g. "Open google.com"; calls `onprimary` */
    label?: string;
    /** Icon before the main action (SVG import) */
    iconName?: string | null;
    /** Actions after the main one, e.g. Edit; each calls `onaction` */
    actions?: Array<{ label: string; value: string }>;
    /** Show a URL field instead of actions (UI3's URL variant); Enter calls `onsubmit` */
    input?: boolean;
    value?: string;
    placeholder?: string;
    ariaLabel?: string;
    class?: string;
    /** Escape, a pointer down outside, a resize or a scroll, after `isOpen` turns false */
    onclose?: () => void;
    /** Enter in the URL field: the URL */
    onsubmit?: (value: string) => void;
    /** The main action */
    onprimary?: () => void;
    /** One of `actions` */
    onaction?: (detail: { value: string; label: string }) => void;
    /** The URL field, after `value` updates */
    oninput?: FormEventHandler<HTMLInputElement>;
  }

  let {
    isOpen = $bindable(),
    anchor = null,
    direction = 'Top',
    label = '',
    iconName = null,
    actions = [],
    input = false,
    value = $bindable(),
    placeholder = 'Type or paste URL',
    ariaLabel = '',
    class: className = '',
    onclose,
    onsubmit,
    onprimary,
    onaction,
    oninput,
  }: Props = $props();

  let element: HTMLDivElement | undefined = $state();
  let field: HTMLInputElement | undefined = $state();
  let position = $state({ top: 0, left: 0 });
  // The side used, which may be the other one after a flip
  let placedDirection: string = $derived(direction);
  let arrow: number | null = $state(null);
  let placed = $state(false);
  let listening = false;

  $effect.pre(() => {
    const shown = !!isOpen;
    untrack(() => handleOpen(shown));
  });
  // Follows a new anchor or side, and its own new size, while open
  $effect.pre(() => {
    if (placed) {
      void [anchor, direction, input, label, actions];
      untrack(reposition);
    }
  });
  // Switching to the field (Edit) puts the caret in it
  $effect.pre(() => {
    if (placed && input) untrack(focusField);
  });

  async function reposition() {
    await tick();
    place();
  }

  async function focusField() {
    await tick();
    field?.focus({ preventScroll: true });
    field?.select();
  }

  async function handleOpen(isOpen: boolean) {
    if (!isOpen) {
      stopListening();
      placed = false;
      return;
    }
    await tick();
    if (!isOpen) return;
    place();
    placed = true;
    // A tick later, so the pointerdown that opened it isn't taken for one outside
    setTimeout(() => {
      if (isOpen) startListening();
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
    if (!isOpen) return;
    isOpen = false;
    onclose?.();
  }

  function onPointerDown(event: PointerEvent) {
    if (element && !element.contains(event.target as Node | null)) close();
  }

  // Placed against its anchor once; anything scrolling behind it would leave it floating
  function onScroll(event: Event) {
    if (element && !element.contains(event.target as Node | null)) close();
  }

  // On the window: it often opens while focus stays in the text being linked
  function onKeydown(event: KeyboardEvent) {
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

  function handleFieldKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      onsubmit?.(value ?? '');
    }
  }
</script>

{#if isOpen}
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
          onkeydown={handleFieldKeydown}
          {oninput}
        />
      {:else}
        <button
          type="button"
          class="action primary"
          class:has-icon={iconName}
          onclick={() => onprimary?.()}
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
            onclick={() => onaction?.({ value: item.value, label: item.label })}
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
    /* A filter, not box-shadow, so the shadow follows the arrow as well as the body */
    filter: var(--elevation-300-tooltip-filter);
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
