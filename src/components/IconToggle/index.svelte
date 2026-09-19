<!--
  IconToggle: UI3's icon toggle buttons, one component for two Figma sets.

  - With `iconNameOn` it swaps icons (eye / hidden, link / unlink) — "Button icon
    toggle". The pressed fill shows only when `highlighted` (its Highlighted
    variant, for rows that are themselves selected).
  - Without it, one icon sits on the selected fill while pressed — "Button icon
    dialog toggle", e.g. a panel that is open.

  `pressed` binds; `change` hands back the new state.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from '../Icon/index.svelte';

  export let pressed = false;
  export let iconName = null;
  /** Icon while pressed; swaps instead of filling. */
  export let iconNameOn = null;
  /** @type {'default' | 'secondary'} */
  export let variant = 'default';
  /** Shows the pressed fill with swapped icons too. */
  export let highlighted = false;
  export let disabled = false;
  export let ariaLabel = '';
  export let tabindex = 0;

  let className = '';
  export { className as class };

  const dispatch = createEventDispatcher();

  $: if (!ariaLabel && typeof window !== 'undefined') {
    console.warn('[IconToggle] ariaLabel is required for icon-only buttons (WCAG 4.1.2)');
  }

  $: icon = pressed && iconNameOn ? iconNameOn : iconName;
  $: filled = pressed && (!iconNameOn || highlighted);

  function toggle() {
    if (disabled) return;
    pressed = !pressed;
    dispatch('change', pressed);
  }
</script>

<button
  type="button"
  class="icon-toggle {variant} {className}"
  class:filled
  aria-pressed={pressed}
  aria-label={ariaLabel || undefined}
  {disabled}
  {tabindex}
  on:click={toggle}
  on:click
  on:focus
  on:blur
>
  <Icon iconName={icon} color={disabled ? '--figma-color-icon-disabled' : '--figma-color-icon'} />
</button>

<style>
  .icon-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--size-small); /* 24px */
    height: var(--size-small);
    padding: 0;
    border: 1px solid transparent;
    border-radius: var(--border-radius-medium); /* 5px */
    outline: none;
    background-color: transparent;
    user-select: none;
  }

  .icon-toggle :global(.icon-component) {
    cursor: inherit;
  }

  .icon-toggle.secondary:not(.filled) {
    border-color: var(--color-border-transparent);
  }

  .icon-toggle:hover:not(:disabled) {
    background-color: var(--color-bg-transparent-hover);
  }

  .icon-toggle:active:not(:disabled) {
    background-color: var(--color-bg-transparent-pressed);
  }

  .icon-toggle.filled {
    background-color: var(--figma-color-bg-selected);
  }

  .icon-toggle.filled:hover:not(:disabled) {
    background-color: var(--figma-color-bg-selected-secondary);
  }

  .icon-toggle.filled:active:not(:disabled) {
    background-color: var(--figma-color-bg-selected);
  }

  .icon-toggle.filled:disabled {
    background-color: var(--figma-color-bg-disabled);
  }

  .icon-toggle:focus-visible {
    border-color: var(--figma-color-border-selected);
  }
</style>
