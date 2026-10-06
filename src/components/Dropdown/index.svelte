<script>
  import { createEventDispatcher } from 'svelte';
  import Menu from '../Menu/index.svelte';
  import Badge from '../Badge/index.svelte';
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
  /** @type {string | string[] | null} a lead chit when no chosen item carries one; wins over `iconName` */
  export let chit = null;
  /** @type {string | null} button text when it should not be the chosen item's menu label — a menu
      row can carry more than the button has room for. `''` shows the placeholder whatever is chosen. */
  export let label = null;
  /** Badge between the label and the chevron: the kit Badge's `text`, or a list of
      texts and `{ text, variant?, strong? }` for several */
  /** @type {string | { text: string, variant?: string, strong?: boolean } | Array<string | { text: string, variant?: string, strong?: boolean }>} */
  export let badge = '';
  /** the kit Badge's `variant`, for badges that give none */
  export let badgeVariant = 'default';

  let className = '';
  export { className as class };
  const dispatch = createEventDispatcher();
  let isOpen = false;
  let menuWrapper, menuButton;
  let triggerWidth = null;

  // Unique identifier for this dropdown instance
  const dropdownId = Math.random().toString(36).substr(2, 9);

  // The chosen item's own lead (icon or chit) shows in the button, else the prop's chit or icon
  $: leadChit = (value && value.chit) || chit || null;
  $: leadIcon = !leadChit && value && value.iconName ? value.iconName : leadChit ? null : iconName;
  // `label` overrides what the button says, including `''` for "always the placeholder"
  $: text = label ?? value?.label ?? null;
  $: badges = (Array.isArray(badge) ? badge : [badge])
    .filter(Boolean)
    .map((b) => (typeof b === 'string' ? { text: b } : b));

  // Get icon color based on state
  function getIconColor(disabled) {
    if (disabled) {
      return '--figma-color-icon-disabled';
    }
    return '--figma-color-icon';
  }
  // A $: statement, so the color follows its inputs; a call in the markup would not re-run.
  $: iconColor = getIconColor(disabled);

  // Mark the chosen item on menuItems as the menu opens: dropdowns can share one
  // list, and marking it whenever value changes left the last one's choice in all
  $: if (isOpen && menuItems && menuItems.length > 0) {
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
    aria-label={ariaLabel || undefined}
    class:selected={isOpen}
    class:borderless={!stroke}
    class:large={size === 'large'}
    class:has-lead={leadChit || leadIcon}
  >
    {#if leadChit}
      <span class="icon"><Chit color={leadChit} /></span>
    {:else if leadIcon}
      <span class="icon"><Icon iconName={leadIcon} color={iconColor} /></span>
    {/if}

    {#if text}
      <span class="label">{text}</span>
    {:else}
      <span class="label placeholder">{placeholder}</span>
    {/if}

    {#if badges.length}
      <span class="badge">
        {#each badges as b (b.text)}
          <Badge variant={b.variant ?? badgeVariant} strong={b.strong ?? false} text={b.text} />
        {/each}
      </span>
    {/if}

    <span class="caret" aria-hidden="true">
      <Icon iconName={IconChevronDown} color={iconColor} />
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

  /* UI3's Dropdown has no Hover state — only Default, Focused and Active — and a
     borderless one already answers the pointer by revealing its border below. */

  /* The edge while the menu is up: UI3's Active and Focused both carry it. */
  button.selected {
    border-color: var(--figma-color-border-selected);
  }

  button:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }

  button:disabled .label {
    color: var(--figma-color-icon-disabled);
  }

  button:disabled {
    border-color: var(--figma-color-border-disabled);
    cursor: not-allowed;
  }

  /* The Badge has no disabled look of its own. */
  button:disabled .badge {
    opacity: 0.4;
  }

  button:disabled .placeholder {
    color: var(--figma-color-icon-disabled);
  }

  button * {
    pointer-events: none;
  }

  /* The label gives way first: the badge and the chevron keep their room. */
  .label {
    flex: 1 1 auto;
    min-width: 0;
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  /* No color of its own: UI3's Dropdown draws Value at full strength in every
     state and has no placeholder variant, so dimming it reads as disabled —
     doubly so with stroke={false}, where there is no border to carry the shape. */

  .badge {
    display: flex;
    flex: 0 0 auto;
    gap: var(--size-xxxsmall);
    margin-left: var(--size-xxxsmall);
  }

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
    display: flex;
    flex: 0 0 auto;
    margin-left: auto;
  }

  .icon {
    flex: 0 0 auto;
    margin-left: -8px;
    margin-right: 0;
  }
</style>
