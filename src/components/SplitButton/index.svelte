<!--
  SplitButton: UI3's "Button icon split" — an icon button for the main action
  and a chevron beside it that opens a menu of alternatives.

  `click` is the main action; the menu fires `select` with the item, as Menu does.
-->
<script>
  import Icon from '../Icon/index.svelte';
  import Menu from '../Menu/index.svelte';
  import IconChevronDown from './../../icons/16/icon.16.chevron.down.svg';

  export let iconName = null;
  /** Names the main action, e.g. "Present". */
  export let ariaLabel = '';
  /** Names the chevron. */
  export let menuAriaLabel = 'More options';
  /** @type {any[]} */
  export let menuItems = [];
  export let itemVariant = 'default';
  export let showGroupLabels = false;
  /** @type {'small' | 'large'} */
  export let size = 'small';
  export let disabled = false;

  let className = '';
  export { className as class };

  let isOpen = false;
  /** @type {HTMLButtonElement} */
  let chevron;

  $: if (!ariaLabel && typeof window !== 'undefined') {
    console.warn('[SplitButton] ariaLabel is required for the icon-only action (WCAG 4.1.2)');
  }
  $: iconColor = disabled ? '--figma-color-icon-disabled' : '--figma-color-icon';
</script>

<div class="split-button {size} {className}" class:disabled class:open={isOpen}>
  <button
    type="button"
    class="primary"
    aria-label={ariaLabel || undefined}
    {disabled}
    on:click
    on:focus
    on:blur
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
    on:click={() => (isOpen = !isOpen)}
  >
    <Icon iconName={IconChevronDown} color={iconColor} size={16} />
  </button>
  <Menu bind:isOpen {menuItems} {itemVariant} {showGroupLabels} anchorElement={chevron} on:select />
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
