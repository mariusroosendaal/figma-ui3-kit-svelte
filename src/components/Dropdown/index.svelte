<script>
  import { createEventDispatcher } from 'svelte';
  import Menu from '../Menu/index.svelte';
  import Chit from '../Chit/index.svelte';
  import Icon from '../Icon/index.svelte';
  import IconChevronDown from './../../icons/24/icon.24.chevron.down.svg';

  export let placeholder = 'Select an option';
  export let value = null; //stores the current selection, note, the value will be an object from your array
  export let menuItems = []; //pass data in via this prop to generate menu items
  export let showGroupLabels = false; //default prop, true will show option group labels
  export let disabled = false;
  export let iconName = null;
  export let ariaLabel = '';
  /** false: no border until hovered (UI3's Stroke=False, for dense panels) */
  export let stroke = true;
  /** @type {'default' | 'large'} */
  export let size = 'default';
  export let searchable = false; // search field above long lists
  export let searchPlaceholder = 'Search';

  let className = '';
  export { className as class };
  const dispatch = createEventDispatcher();
  let isOpen = false;
  let menuWrapper, menuButton;
  let triggerWidth = null;

  // Unique identifier for this dropdown instance
  const dropdownId = Math.random().toString(36).substr(2, 9);

  // The chosen item's own lead (icon or chit) shows in the button, else the prop's icon
  $: leadChit = value && value.chit ? value.chit : null;
  $: leadIcon = !leadChit && value && value.iconName ? value.iconName : iconName;

  // Get icon color based on state
  function getIconColor() {
    if (disabled) {
      return '--figma-color-icon-disabled';
    }
    return '--figma-color-icon';
  }

  // Sync selected state on menuItems whenever value changes
  $: if (menuItems && menuItems.length > 0) {
    menuItems.forEach((item) => {
      item.selected =
        item === value ||
        (value != null && value.value !== undefined && item.value === value.value);
    });
  }

  // Handle menu selection
  function handleSelect(event) {
    value = event.detail;
    dispatch('change', event.detail);
  }

  // Menu returns focus to the trigger itself when it closes from the keyboard
  function handleClose() {
    isOpen = false;
  }

  function handleButtonClick() {
    if (disabled) return;
    // The menu is at least as wide as the trigger; measured before it places itself
    if (!isOpen) triggerWidth = menuButton?.getBoundingClientRect().width ?? null;
    isOpen = !isOpen;
  }
</script>

<div bind:this={menuWrapper} class="wrapper {className}" class:disabled>
  <button
    bind:this={menuButton}
    on:click={handleButtonClick}
    {disabled}
    aria-expanded={isOpen}
    aria-haspopup="menu"
    aria-controls="dropdown-{dropdownId}-menu"
    aria-label={ariaLabel || placeholder || undefined}
    class:selected={isOpen}
    class:borderless={!stroke}
    class:large={size === 'large'}
    class:has-lead={leadChit || leadIcon}
  >
    {#if leadChit}
      <span class="icon"><Chit color={leadChit} /></span>
    {:else if leadIcon}
      <span class="icon"><Icon iconName={leadIcon} color={getIconColor()} /></span>
    {/if}

    {#if value}
      <span class="label">{value.label}</span>
    {:else}
      <span class="placeholder">{placeholder}</span>
    {/if}

    <span class="caret" aria-hidden="true">
      <Icon iconName={IconChevronDown} color={getIconColor()} />
    </span>
  </button>

  <Menu
    bind:isOpen
    {menuItems}
    {showGroupLabels}
    anchorElement={menuButton}
    minWidth={triggerWidth ? triggerWidth + 'px' : null}
    itemVariant="checkmark"
    menuListId="dropdown-{dropdownId}-menu"
    {searchable}
    {searchPlaceholder}
    on:select={handleSelect}
    on:close={handleClose}
  />
</div>

<style>
  .wrapper {
    position: relative;
  }

  button {
    display: flex;
    align-items: center;
    border: 1px solid var(--figma-color-border);
    height: var(--size-small);
    width: 100%;
    padding: 0 0 0 var(--size-xxsmall);
    overflow-y: hidden;
    border-radius: var(--border-radius-medium);
    background-color: var(--figma-color-bg);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    color: var(--figma-color-text);
    font-family: var(--font-stack);
    user-select: none;
  }

  button:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }

  button:focus-visible .placeholder {
    color: var(--figma-color-text);
  }

  button:disabled .label {
    color: var(--figma-color-icon-disabled);
  }

  button:disabled {
    cursor: not-allowed;
  }

  button:disabled .placeholder {
    color: var(--figma-color-icon-disabled);
  }

  button * {
    pointer-events: none;
  }

  .label,
  .placeholder {
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  /* .placeholder {
    color: var(--figma-color-text-tertiary); 
  } */

  button.borderless:not(:hover):not(:focus-visible):not(.selected) {
    border-color: transparent;
  }

  button.large {
    height: var(--size-medium); /* 32px */
    padding-right: var(--size-xxxsmall);
  }

  /* Large: the lead sits on a 24px grey tile inside a 32px cell */
  button.large.has-lead {
    padding-left: 0;
  }

  button.large .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size-medium);
    height: var(--size-medium);
    margin-left: 0;
  }

  button.large .icon > :global(*) {
    border-radius: var(--border-radius-medium);
    background-color: var(--figma-color-bg-secondary);
  }

  .caret {
    display: block;
    margin-left: auto;
  }

  .icon {
    margin-left: -8px;
    margin-right: 0;
  }
</style>
