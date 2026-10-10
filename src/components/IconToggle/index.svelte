<!--
  IconToggle: UI3's icon toggle buttons, one component for two Figma sets.

  - With `iconNameOn` it swaps icons (eye / hidden, link / unlink) — "Button icon
    toggle". The pressed fill shows only when `highlighted` (its Highlighted
    variant, for rows that are themselves selected).
  - Without it, one icon sits on the selected fill while pressed — "Button icon
    dialog toggle", e.g. a panel that is open.

  `pressed` binds; `change` hands back the new state.
-->
<script lang="ts">
  import type { FocusEventHandler, MouseEventHandler } from 'svelte/elements';
  import Icon from '../Icon/index.svelte';

  interface Props {
    pressed?: boolean;
    /** SVG icon data */
    iconName?: string | null;
    /** Icon while pressed; swaps instead of filling. */
    iconNameOn?: string | null;
    variant?: 'default' | 'secondary';
    /** Shows the pressed fill with swapped icons too. */
    highlighted?: boolean;
    disabled?: boolean;
    /** Required: the button has no text (WCAG 4.1.2) */
    ariaLabel?: string;
    tabindex?: number;
    class?: string;
    /** The new pressed state */
    onchange?: (pressed: boolean) => void;
    /** After `onchange` */
    onclick?: MouseEventHandler<HTMLButtonElement>;
    onfocus?: FocusEventHandler<HTMLButtonElement>;
    onblur?: FocusEventHandler<HTMLButtonElement>;
  }

  let {
    pressed = $bindable(),
    iconName = null,
    iconNameOn = null,
    variant = 'default',
    highlighted = false,
    disabled = false,
    ariaLabel = '',
    tabindex = 0,
    class: className = '',
    onchange,
    onclick,
    onfocus,
    onblur,
  }: Props = $props();

  $effect(() => {
    if (!ariaLabel) {
      console.warn('[IconToggle] ariaLabel is required for icon-only buttons (WCAG 4.1.2)');
    }
  });

  let icon = $derived(pressed && iconNameOn ? iconNameOn : iconName);
  let filled = $derived(pressed && (!iconNameOn || highlighted));

  function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    if (!disabled) {
      pressed = !pressed;
      onchange?.(pressed);
    }
    onclick?.(event);
  }
</script>

<button
  type="button"
  class="icon-toggle {variant} {className}"
  class:filled
  aria-pressed={!!pressed}
  aria-label={ariaLabel || undefined}
  {disabled}
  {tabindex}
  onclick={handleClick}
  {onfocus}
  {onblur}
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
