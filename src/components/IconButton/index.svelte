<script lang="ts">
  import type { FocusEventHandler, MouseEventHandler } from 'svelte/elements';
  import Icon from './../Icon/index.svelte';

  interface Props {
    /** SVG icon data */
    iconName?: string;
    iconText?: string | null;
    variant?: 'default' | 'secondary';
    disabled?: boolean;
    spin?: boolean;
    tabindex?: number;
    /** A CSS variable name, in place of the variant's icon color */
    iconColor?: string | null;
    /** Required: the button has no text (WCAG 4.1.2) */
    ariaLabel?: string;
    type?: 'button' | 'submit' | 'reset';
    class?: string;
    /** The button, for `bind:element` */
    element?: HTMLButtonElement | null;
    onclick?: MouseEventHandler<HTMLButtonElement>;
    onfocus?: FocusEventHandler<HTMLButtonElement>;
    onblur?: FocusEventHandler<HTMLButtonElement>;
  }

  let {
    iconName = '',
    iconText = null,
    variant = 'default',
    disabled = false,
    spin = false,
    tabindex = 0,
    iconColor = null,
    ariaLabel = '',
    type = 'button',
    class: className = '',
    element = $bindable(),
    onclick,
    onfocus,
    onblur,
  }: Props = $props();

  $effect(() => {
    if (!ariaLabel) {
      console.warn('[IconButton] ariaLabel is required for icon-only buttons (WCAG 4.1.2)');
    }
  });

  let computedColor = $derived(
    iconColor ? iconColor : disabled ? '--figma-color-icon-disabled' : '--figma-color-icon'
  );
</script>

<button
  bind:this={element}
  {onclick}
  {onblur}
  {onfocus}
  {type}
  aria-label={ariaLabel || undefined}
  class="icon-button {className}"
  class:default={variant === 'default'}
  class:secondary={variant === 'secondary'}
  class:disabled
  {disabled}
  {tabindex}
>
  <Icon {iconName} {iconText} {spin} color={computedColor} />
</button>

<style>
  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size-small); /* 24px */
    height: var(--size-small); /* 24px */
    border-radius: var(--border-radius-medium); /* 5px */
    border: 1px solid transparent;
    background-color: transparent;
    cursor: pointer;
    outline: none;
    user-select: none;
    transition: background-color 0.15s ease;
  }

  /* DEFAULT VARIANT */
  .icon-button.default:hover:not(:disabled) {
    background-color: var(--color-bg-transparent-hover);
  }

  .icon-button.default:active:not(:disabled) {
    background-color: var(--color-bg-transparent-pressed);
  }

  .icon-button.default:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }

  .icon-button.default:disabled {
    cursor: not-allowed;
  }

  /* SECONDARY VARIANT */
  .icon-button.secondary {
    border: 1px solid var(--color-border-transparent);
  }

  .icon-button.secondary:hover:not(:disabled) {
    background-color: var(--color-bg-transparent-hover);
  }

  .icon-button.secondary:active:not(:disabled) {
    background-color: var(--color-bg-transparent-pressed);
  }

  .icon-button.secondary:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }

  .icon-button.secondary:disabled {
    cursor: not-allowed;
  }

  /* Remove focus outline for mouse clicks */
  .icon-button:focus:not(:focus-visible) {
    outline: none;
  }
</style>
