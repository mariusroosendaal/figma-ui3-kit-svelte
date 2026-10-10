<script lang="ts">
  import type { FocusEventHandler, MouseEventHandler } from 'svelte/elements';
  import Icon from './../Icon/index.svelte';
  import IconClose from './../../icons/24/icon.24.close.svg';

  interface Props {
    variant?: 'default' | 'component';
    label?: string;
    /** SVG icon data */
    iconName?: string | null;
    closable?: boolean;
    focused?: boolean;
    disabled?: boolean;
    class?: string;
    onclick?: MouseEventHandler<HTMLDivElement>;
    /** The close button; the chip's `onclick` doesn't fire */
    onclose?: (detail: { label: string }) => void;
    /** The chip's and the close button's */
    onfocus?: FocusEventHandler<HTMLElement>;
    onblur?: FocusEventHandler<HTMLElement>;
  }

  let {
    variant = 'default',
    label = '',
    iconName = null,
    closable = false,
    focused = false,
    disabled = false,
    class: className = '',
    onclick,
    onclose,
    onfocus,
    onblur,
  }: Props = $props();

  function handleClose(event: MouseEvent) {
    event.stopPropagation();
    onclose?.({ label });
  }

  function handleKeydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  function getIconColor(disabled: boolean, variant: string) {
    if (disabled) {
      return '--figma-color-icon-disabled';
    }
    switch (variant) {
      case 'component':
        return '--figma-color-icon-component';
      default:
        return '--figma-color-icon';
    }
  }
  let iconColor = $derived(getIconColor(disabled, variant));
</script>

<div
  class="chip {className} {variant}"
  class:focused
  class:disabled
  class:closable
  class:has-icon={iconName}
  tabindex={disabled ? -1 : 0}
  role="button"
  aria-pressed={focused}
  aria-disabled={disabled}
  {onclick}
  onkeydown={handleKeydown}
  {onblur}
  {onfocus}
>
  {#if iconName}
    <div class="chip-icon">
      <Icon {iconName} color={iconColor} />
    </div>
  {/if}

  <div class="chip-content">
    <span class="chip-label">{label}</span>
  </div>

  {#if closable}
    <button
      type="button"
      class="chip-close"
      onclick={handleClose}
      {onblur}
      {onfocus}
      {disabled}
      aria-label="Remove {label}"
    >
      <Icon iconName={IconClose} color={iconColor} />
    </button>
  {/if}
</div>

<style>
  .chip {
    display: inline-flex;
    align-items: center;
    height: var(--size-small); /* 24px height */
    border-radius: var(--border-radius-medium); /* 5px */
    border: 1px solid var(--figma-color-border);
    overflow: hidden;
    max-width: 200px; /* Prevent chips from getting too wide */
    background-color: var(--figma-color-bg);
    user-select: none;
  }

  .chip-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size-small); /* 24px */
    height: var(--size-small); /* 24px */
    flex-shrink: 0;
  }

  .chip-content {
    display: flex;
    align-items: center;
    padding: 0 var(--size-xxsmall); /* 8px horizontal padding */
    flex: 1;
    min-width: 0; /* Allow text to truncate */
  }

  /* Remove left padding when there's an icon */
  .chip.has-icon .chip-content {
    padding-left: 0;
  }

  /* Remove right padding when there's a close button */
  .chip.closable .chip-content {
    padding-right: 0;
  }

  .chip.component {
    background-color: var(--figma-color-bg-component-tertiary);
    border: 1px solid var(--figma-color-border-component);
    color: var(--figma-color-text-component);
  }

  .chip-label {
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Default text color */
  .chip .chip-label {
    color: var(--figma-color-text);
  }

  /* Component variant text color */
  .chip.component .chip-label {
    color: var(--figma-color-text-component);
  }

  .chip-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size-small); /* 24px */
    height: var(--size-small); /* 24px */
    border: none;
    background: none;
    cursor: pointer;
    flex-shrink: 0;
    padding: 0;
    margin: 0;
  }

  .chip-close:hover {
    opacity: 0.75;
  }

  .chip:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }

  .chip:focus:not(:focus-visible) {
    outline: none;
  }

  .chip-close:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }

  .chip-close:focus:not(:focus-visible) {
    outline: none;
  }

  /* Focused state */
  .chip.focused {
    border-color: var(--figma-color-border-selected);
    background-color: var(--figma-color-bg-selected);
  }

  /* Disabled state */
  .chip.disabled {
    background-color: var(--figma-color-bg-disabled);
    border-color: var(--figma-color-border-disabled);
  }

  .chip.disabled .chip-label {
    color: var(--figma-color-text-disabled);
  }

  .chip.disabled .chip-close {
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
