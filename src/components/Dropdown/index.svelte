<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import Menu from '../Menu/index.svelte';
  import Icon from '../Icon/index.svelte';
  import IconChevronDown from './../../icons/24/icon.24.chevron.down.svg';

  export let placeholder = "Please make a selection.";
  export let value = null; //stores the current selection, note, the value will be an object from your array
  export let menuItems = []; //pass data in via this prop to generate menu items
  export let showGroupLabels = false; //default prop, true will show option group labels
  export let disabled = false;
  export let iconName = null;

  let className = '';
  export { className as class };
  const dispatch = createEventDispatcher();
  let isOpen = false;
  let menuWrapper, menuButton;
  let triggerWidth = null;
  
  // Unique identifier for this dropdown instance
  const dropdownId = Math.random().toString(36).substr(2, 9);

  // Get icon color based on state
  function getIconColor() {
    if (disabled) {
      return '--figma-color-icon-disabled';
    }
    return '--figma-color-icon';
  }

  // Calculate trigger width when menu opens
  function calculateTriggerWidth() {
    if (menuButton) {
      const rect = menuButton.getBoundingClientRect();
      triggerWidth = rect.width;
    }
  }

  // Update trigger width when isOpen changes
  $: if (isOpen) {
    // Use setTimeout to ensure the element is rendered
    setTimeout(() => {
      calculateTriggerWidth();
    }, 0);
  }

  // Handle menu selection
  function handleSelect(event) {
    value = event.detail;
    dispatch('change', event.detail);
  }

  // Handle menu close
  function handleClose() {
    isOpen = false;
  }

  // Handle button click
  function handleButtonClick() {
    if (!disabled) {
      const newIsOpen = !isOpen;
      if (newIsOpen) {
        // Dispatch event to close other dropdowns
        if (typeof document !== 'undefined') {
          document.dispatchEvent(new CustomEvent('dropdown:open', {
            detail: { dropdownId }
          }));
        }
      }
      isOpen = newIsOpen;
    }
  }

  // Handle other dropdowns opening - close this one if it's not the one that opened
  function handleOtherDropdownOpen(event) {
    if (event.detail.dropdownId !== dropdownId && isOpen) {
      isOpen = false;
    }
  }

  // Listen for other dropdowns opening
  onMount(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('dropdown:open', handleOtherDropdownOpen);
    }
  });

  // Clean up event listener
  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('dropdown:open', handleOtherDropdownOpen);
    }
  });
</script>

<div 
  bind:this={menuWrapper}
  {disabled}
  {placeholder}
  {showGroupLabels}
  class="wrapper {className}"
  >

  <button 
    bind:this={menuButton} 
    on:click={handleButtonClick} 
    disabled={disabled}
    role="combobox"
    aria-expanded={isOpen}
    aria-haspopup="menu"
    aria-controls="menu-list"
    class:selected={isOpen}
  >
    {#if iconName}
      <span class="icon"><Icon iconName={iconName} color="black3"/></span>
    {/if}

    {#if value}
      <span class="label">{value.label}</span>
    {:else}
      <span class="placeholder">{placeholder}</span>
    {/if}

    {#if !disabled}
      <span class="caret">
        <Icon iconName={IconChevronDown} color={getIconColor()} />
      </span>
    {/if}
  </button>

  <Menu
    bind:isOpen={isOpen}
    menuItems={menuItems}
    showGroupLabels={showGroupLabels}
    anchorElement={menuButton}
    minWidth={triggerWidth ? triggerWidth + 'px' : null}
    itemVariant="checkmark"
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

  button:disabled:hover {
    justify-content: flex-start;
    border-color: transparent;
  }

  button:disabled:hover .placeholder {
    color: var(--figma-color-icon-disabled);
  }

  button * {
    pointer-events: none;
  }

  .label, .placeholder {
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

  .caret {
    display: block;
    margin-left: auto;
  }

  .icon {
    margin-left: -8px;
    margin-right: 0;
  }
</style>
