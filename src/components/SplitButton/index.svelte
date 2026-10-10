<!--
  SplitButton: UI3's "Button icon split" — an icon button for the main action
  and a chevron beside it that opens a menu of alternatives.

  `onclick` is the main action; the menu calls `onselect` with the item, as Menu does.
-->
<script lang="ts" generics="T extends MenuOption = MenuOption">
  import type { FocusEventHandler, MouseEventHandler } from 'svelte/elements';
  import type { MenuOption } from '../../types';
  import Icon from '../Icon/index.svelte';
  import Menu from '../Menu/index.svelte';
  import IconChevronDown from './../../icons/16/icon.16.chevron.down.svg';

  interface Props {
    /** SVG icon data, for the main action */
    iconName?: string | null;
    /** Names the main action, e.g. "Present". */
    ariaLabel?: string;
    /** Names the chevron. */
    menuAriaLabel?: string;
    menuItems?: T[];
    itemVariant?: 'default' | 'checkmark';
    showGroupLabels?: boolean;
    size?: 'small' | 'large';
    disabled?: boolean;
    class?: string;
    /** The main action */
    onclick?: MouseEventHandler<HTMLButtonElement>;
    onfocus?: FocusEventHandler<HTMLButtonElement>;
    onblur?: FocusEventHandler<HTMLButtonElement>;
    /** A row of the menu, as Menu's */
    onselect?: (item: T) => void;
  }

  let {
    iconName = null,
    ariaLabel = '',
    menuAriaLabel = 'More options',
    menuItems = [],
    itemVariant = 'default',
    showGroupLabels = false,
    size = 'small',
    disabled = false,
    class: className = '',
    onclick,
    onfocus,
    onblur,
    onselect,
  }: Props = $props();

  let isOpen = $state(false);
  let chevron: HTMLButtonElement | undefined = $state();

  $effect(() => {
    if (!ariaLabel) {
      console.warn('[SplitButton] ariaLabel is required for the icon-only action (WCAG 4.1.2)');
    }
  });
  let iconColor = $derived(disabled ? '--figma-color-icon-disabled' : '--figma-color-icon');
</script>

<div class="split-button {size} {className}" class:disabled class:open={isOpen}>
  <button
    type="button"
    class="primary"
    aria-label={ariaLabel || undefined}
    {disabled}
    {onclick}
    {onfocus}
    {onblur}
  >
    <Icon {iconName} color={iconColor} />
  </button>
  <button
    bind:this={chevron}
    type="button"
    class="secondary"
    aria-label={menuAriaLabel}
    aria-haspopup="menu"
    aria-expanded={isOpen}
    {disabled}
    onclick={() => (isOpen = !isOpen)}
  >
    <Icon iconName={IconChevronDown} color={iconColor} size={16} />
  </button>
  <Menu
    bind:isOpen
    {menuItems}
    {itemVariant}
    {showGroupLabels}
    anchorElement={chevron}
    {onselect}
  />
</div>

<style>
  .split-button {
    display: inline-flex;
    flex: 0 0 auto;
    gap: 1px;
    height: var(--size-small); /* 24px */
    border-radius: var(--border-radius-medium); /* 5px */
  }

  .split-button.large {
    height: var(--size-medium); /* 32px */
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 100%;
    margin: 0;
    padding: 0;
    border: 1px solid transparent;
    outline: none;
    background: transparent;
    user-select: none;
  }

  button :global(.icon-component) {
    cursor: inherit;
  }

  .primary {
    width: var(--size-small);
    border-radius: var(--border-radius-medium) 0 0 var(--border-radius-medium);
  }

  .large .primary {
    width: var(--size-medium);
  }

  .secondary {
    width: var(--size-xsmall); /* 16px */
    border-radius: 0 var(--border-radius-medium) var(--border-radius-medium) 0;
  }

  /* Hovering, pressing or focusing either half tints both; the half in use
     gets the stronger fill or the focus ring. */
  .split-button:not(.disabled):hover button,
  .split-button:not(.disabled):focus-within button,
  .split-button.open button {
    background-color: var(--color-bg-transparent-hover);
  }

  button:active:not(:disabled),
  .open .secondary {
    background-color: var(--color-bg-transparent-pressed) !important;
  }

  button:focus-visible {
    border-color: var(--figma-color-border-selected);
  }
</style>
