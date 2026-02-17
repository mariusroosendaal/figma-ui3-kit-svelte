<script>
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import MenuItem from '../MenuItem/index.svelte';
  import MenuDivider from '../MenuDivider/index.svelte';
  import MenuHeading from '../MenuHeading/index.svelte';

  export let isOpen = false;
  export let menuItems = [];
  export let showGroupLabels = false;
  export let anchorElement = null;
  export let position = 'bottom-left';
  export let minWidth = null;
  export let itemVariant = 'default'; // "default" | "checkmark"
  export let nestingLevel = 0; // Nesting level for z-index calculation (0 = top-level)

  let className = '';
  export { className as class };

  const dispatch = createEventDispatcher();
  let menuWrapper, menuList;
  let menuPosition = { top: 0, left: 0 };

  // Unique identifier for this menu instance
  const menuId = Math.random().toString(36).substr(2, 9);

  // Sub-menu state management
  let openSubMenuId = null; // ID of item with open sub-menu
  let hoverTimeouts = new Map(); // Timeouts for hover delays
  let hoverTimeout = null; // Global hover timeout for closing sub-menus

  // Keyboard navigation state
  let focusedItemId = null; // ID of currently focused menu item

  $: (menuItems, updateSelectedAndIds());
  $: if (isOpen && anchorElement) {
    // Calculate position immediately when menu opens, before it renders
    updateMenuPosition();
  }
  $: if (isOpen && anchorElement && menuWrapper) {
    // Update position with actual dimensions after menu renders
    updateMenuPosition();
  }

  // Reset focused item when menu opens
  /* eslint-disable svelte/infinite-reactive-loop */
  $: if (isOpen && menuList) {
    // Focus first item when menu opens
    setTimeout(() => {
      const firstItem = menuList.querySelector('li[id]');
      if (firstItem) {
        firstItem.focus();
        focusedItemId = parseInt(firstItem.getAttribute('id'));
      }
    }, 0);
  }
  /* eslint-enable svelte/infinite-reactive-loop */

  // Dispatch event when this menu opens (only for top-level menus)
  $: if (isOpen && nestingLevel === 0) {
    if (typeof document !== 'undefined') {
      document.dispatchEvent(
        new CustomEvent('dropdown:open', {
          detail: { dropdownId: menuId },
        })
      );
    }
  }

  //FUNCTIONS

  //assign id's to the input array
  onMount(async () => {
    updateSelectedAndIds();
    // Listen for other menus/dropdowns opening
    if (typeof document !== 'undefined') {
      document.addEventListener('dropdown:open', handleOtherDropdownOpen);
    }
  });

  // Calculate menu position relative to anchor element
  function updateMenuPosition() {
    if (!anchorElement) return;

    const anchorRect = anchorElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Use estimated dimensions for initial positioning
    const estimatedMenuWidth = 200; // reasonable default
    const estimatedMenuHeight = 150; // reasonable default

    let top = 0;
    let left = 0;

    // Calculate position based on position prop
    switch (position) {
      case 'bottom-left':
        top = anchorRect.bottom + 4; // 4px gap
        left = anchorRect.left;
        break;
      case 'bottom-right':
        top = anchorRect.bottom + 4;
        left = anchorRect.right - estimatedMenuWidth;
        break;
      case 'top-left':
        top = anchorRect.top - estimatedMenuHeight - 4;
        left = anchorRect.left;
        break;
      case 'top-right':
        top = anchorRect.top - estimatedMenuHeight - 4;
        left = anchorRect.right - estimatedMenuWidth;
        break;
      default:
        top = anchorRect.bottom + 4;
        left = anchorRect.left;
    }

    menuPosition = { top, left };

    // Update position with actual dimensions after menu renders
    if (menuWrapper) {
      const actualMenuWidth = menuWrapper.offsetWidth;
      const actualMenuHeight = menuWrapper.offsetHeight;

      if (actualMenuWidth > 0 && actualMenuHeight > 0) {
        // Recalculate with actual dimensions
        let adjustedTop = top;
        let adjustedLeft = left;

        // Adjust for actual width if needed
        if (position.includes('right')) {
          adjustedLeft = anchorRect.right - actualMenuWidth;
        }

        // Adjust for actual height if needed
        if (position.includes('top')) {
          adjustedTop = anchorRect.top - actualMenuHeight - 4;
        }

        // Re-check viewport boundaries with actual dimensions
        if (adjustedLeft + actualMenuWidth > viewportWidth) {
          adjustedLeft = viewportWidth - actualMenuWidth - 8;
        }
        if (adjustedLeft < 8) {
          adjustedLeft = 8;
        }
        if (adjustedTop + actualMenuHeight > viewportHeight) {
          if (anchorRect.top - actualMenuHeight - 4 > 0) {
            adjustedTop = anchorRect.top - actualMenuHeight - 4;
          } else {
            adjustedTop = viewportHeight - actualMenuHeight - 8;
          }
        }
        if (adjustedTop < 8) {
          adjustedTop = 8;
        }
        menuPosition = { top: adjustedTop, left: adjustedLeft };
      }
    }
  }

  // Prevent body scroll when menu is open
  function preventBodyScroll() {
    document.body.style.overflow = 'hidden';
  }

  function restoreBodyScroll() {
    document.body.style.overflow = '';
  }

  // this function runs everytime the menuItems array is updated
  // it will auto assign ids and keep the value var updated
  function updateSelectedAndIds() {
    if (menuItems) {
      menuItems.forEach((item, index) => {
        //update id
        item['id'] = index;
      });
    }
  }

  //menu highlight function on the selected menu item
  function removeHighlight(event) {
    let items = Array.from(event.target.parentNode.children);
    items.forEach((item) => {
      item.blur();
      item.classList.remove('highlight');
    });
  }

  //run for all menu click events
  function menuClick(event) {
    if (menuList.contains(event.target)) {
      //find selected item in array
      let itemId = parseInt(event.target.getAttribute('id'));
      const item = menuItems[itemId];

      // If item has sub-menu, don't close menu or dispatch select
      if (item.subMenu && Array.isArray(item.subMenu) && item.subMenu.length > 0) {
        // Don't handle click for items with sub-menus (hover handles it)
        return;
      }

      //remove current selection if there is one
      menuItems.forEach((item) => {
        item.selected = false;
      });
      item.selected = true; //select current item
      updateSelectedAndIds();
      dispatch('select', item);
      closeMenu();
    }
  }

  // Calculate sub-menu position
  function calculateSubMenuPosition(parentItemElement, subMenuItems) {
    if (!parentItemElement) return { top: 0, left: 0 };

    const parentRect = parentItemElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Estimate sub-menu dimensions
    const estimatedSubMenuWidth = 200;
    const estimatedSubMenuHeight = subMenuItems.length * 32; // ~32px per item

    let top = parentRect.top - 9; // Align top edge of sub-menu with top edge of parent item
    let left = parentRect.right + 12; // Default: position to the right with 4px gap

    // Check if there's enough room on the right
    const spaceOnRight = viewportWidth - parentRect.right;
    if (spaceOnRight < estimatedSubMenuWidth + 50) {
      // Position on left side instead
      left = parentRect.left - estimatedSubMenuWidth - 12;
    }

    // Adjust for viewport boundaries
    if (left < 8) {
      left = 8;
    }
    if (left + estimatedSubMenuWidth > viewportWidth - 8) {
      left = viewportWidth - estimatedSubMenuWidth - 8;
    }

    // Adjust vertical position if sub-menu would go below viewport
    if (top + estimatedSubMenuHeight > viewportHeight - 8) {
      top = Math.max(8, viewportHeight - estimatedSubMenuHeight - 8);
    }
    if (top < 8) {
      top = 8;
    }

    return { top, left };
  }

  // Handle mouse enter on menu item with sub-menu
  function handleMenuItemHover(event, itemId) {
    const item = menuItems[itemId];
    if (!item || !item.subMenu || !Array.isArray(item.subMenu) || item.subMenu.length === 0) {
      return;
    }

    // Clear any existing hover timeout
    if (hoverTimeouts.has(itemId)) {
      clearTimeout(hoverTimeouts.get(itemId));
      hoverTimeouts.delete(itemId);
    }

    // Close any other open sub-menu
    if (openSubMenuId !== null && openSubMenuId !== itemId) {
      openSubMenuId = null;
    }

    // Open sub-menu after small delay
    const timeoutId = setTimeout(() => {
      openSubMenuId = itemId;
      hoverTimeouts.delete(itemId);
    }, 120); // 120ms delay

    hoverTimeouts.set(itemId, timeoutId);
  }

  // Handle mouse leave on menu item
  function handleMenuItemLeave(event, itemId) {
    // Start timeout for closing sub-menu
    if (hoverTimeouts.has(itemId)) {
      clearTimeout(hoverTimeouts.get(itemId));
      hoverTimeouts.delete(itemId);
    }

    // Close sub-menu after delay if mouse doesn't return
    hoverTimeout = setTimeout(() => {
      if (openSubMenuId === itemId) {
        openSubMenuId = null;
      }
    }, 300); // 300ms timeout
  }

  function closeMenu() {
    // Close all sub-menus first
    openSubMenuId = null;

    // Clear all hover timeouts
    hoverTimeouts.forEach((timeout) => clearTimeout(timeout));
    hoverTimeouts.clear();
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }

    isOpen = false;
    restoreBodyScroll();
    dispatch('close');
  }

  // Handle other menus/dropdowns opening - close this one if it's not the one that opened
  function handleOtherDropdownOpen(event) {
    if (event.detail.dropdownId !== menuId && isOpen) {
      closeMenu();
    }
  }

  // Handle clicks outside the menu to close it
  function handleClickOutside(event) {
    if (!isOpen) return;

    // Check if click is outside this menu and all its sub-menus
    let clickedInsideMenu = menuWrapper.contains(event.target);

    // Check all sub-menu wrappers (query for them dynamically)
    if (!clickedInsideMenu) {
      const subMenuWrappers = document.querySelectorAll('.sub-menu-wrapper');
      for (const wrapper of subMenuWrappers) {
        if (wrapper.contains(event.target)) {
          clickedInsideMenu = true;
          break;
        }
      }
    }

    if (!clickedInsideMenu) {
      closeMenu();
    }
  }

  // Add/remove global click listener when menu opens/closes
  $: if (isOpen) {
    // Use setTimeout to avoid capturing the same click that opened the menu
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
      preventBodyScroll();
    }, 0);
  } else {
    document.removeEventListener('click', handleClickOutside);
    restoreBodyScroll();
  }

  // Cleanup on component destroy
  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
    if (typeof document !== 'undefined') {
      document.removeEventListener('dropdown:open', handleOtherDropdownOpen);
    }
    // Clear all timeouts
    hoverTimeouts.forEach((timeout) => clearTimeout(timeout));
    hoverTimeouts.clear();
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    restoreBodyScroll();
  });

  // Handle keyboard navigation
  function handleKeydown(event) {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        if (nestingLevel > 0) {
          // Close this sub-menu level, return to parent
          closeMenu();
        } else {
          closeMenu();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        focusNextItem();
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusPreviousItem();
        break;
      case 'ArrowRight':
        event.preventDefault();
        // Open sub-menu if current item has one, or navigate into sub-menu
        if (focusedItemId !== null) {
          const item = menuItems[focusedItemId];
          if (item && item.subMenu && Array.isArray(item.subMenu) && item.subMenu.length > 0) {
            openSubMenuId = focusedItemId;
            // Focus first item in sub-menu
            setTimeout(() => {
              // Find the sub-menu wrapper that corresponds to this menu item
              const focusedItem = menuList?.querySelector(`li[id="${focusedItemId}"]`);
              if (focusedItem) {
                // Find sub-menu wrapper near the focused item (next sibling or nearby)
                const allSubMenus = document.querySelectorAll('.sub-menu-wrapper');
                for (const subMenuWrapper of allSubMenus) {
                  const menuInstance = subMenuWrapper.querySelector('.menu');
                  if (menuInstance) {
                    /** @type {HTMLElement|null} */
                    const firstMenuItem = menuInstance.querySelector('li[id]');
                    if (firstMenuItem) {
                      firstMenuItem.focus();
                      break;
                    }
                  }
                }
              }
            }, 50);
          }
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        // Close sub-menu if open, or close this menu if it's a sub-menu
        if (openSubMenuId !== null) {
          openSubMenuId = null;
        } else if (nestingLevel > 0) {
          closeMenu();
        }
        break;
      case 'Enter':
        event.preventDefault();
        // Select focused item or open sub-menu
        if (focusedItemId !== null) {
          const item = menuItems[focusedItemId];
          if (item) {
            if (item.subMenu && Array.isArray(item.subMenu) && item.subMenu.length > 0) {
              // Open sub-menu
              openSubMenuId = focusedItemId;
            } else {
              // Select item
              menuItems.forEach((i) => (i.selected = false));
              item.selected = true;
              updateSelectedAndIds();
              dispatch('select', item);
              closeMenu();
            }
          }
        }
        break;
    }
  }

  // Focus next menu item
  function focusNextItem() {
    if (!menuList) return;

    const items = Array.from(menuList.querySelectorAll('li[id]'));
    if (items.length === 0) return;

    let currentIndex = -1;
    if (focusedItemId !== null) {
      currentIndex = items.findIndex((item) => parseInt(item.getAttribute('id')) === focusedItemId);
    }

    const nextIndex = (currentIndex + 1) % items.length;
    const nextItem = items[nextIndex];
    if (nextItem) {
      nextItem.focus();
      focusedItemId = parseInt(nextItem.getAttribute('id'));
    }
  }

  // Focus previous menu item
  function focusPreviousItem() {
    if (!menuList) return;

    const items = Array.from(menuList.querySelectorAll('li[id]'));
    if (items.length === 0) return;

    let currentIndex = -1;
    if (focusedItemId !== null) {
      currentIndex = items.findIndex((item) => parseInt(item.getAttribute('id')) === focusedItemId);
    }

    const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
    const prevItem = items[prevIndex];
    if (prevItem) {
      prevItem.focus();
      focusedItemId = parseInt(prevItem.getAttribute('id'));
    }
  }

  // Add keyboard listener when menu is open
  $: if (isOpen) {
    document.addEventListener('keydown', handleKeydown);
  } else {
    document.removeEventListener('keydown', handleKeydown);
  }

  onDestroy(() => {
    document.removeEventListener('keydown', handleKeydown);
  });
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div
    bind:this={menuWrapper}
    class="menu-wrapper {className}"
    style="--menu-min-width: {minWidth ||
      'auto'}; top: {menuPosition.top}px; left: {menuPosition.left}px; z-index: {50 +
      nestingLevel};"
  >
    <ul class="menu" bind:this={menuList} role="menu">
      {#if menuItems && menuItems.length > 0}
        {#each menuItems as item, i (item.id ?? i)}
          {#if i === 0}
            {#if item.group && (item.showHeading ?? showGroupLabels)}
              <MenuHeading text={item.group} />
            {/if}
          {:else if i > 0 && item.group && menuItems[i - 1].group != item.group}
            {#if item.showHeading ?? showGroupLabels}
              <MenuDivider />
              <MenuHeading text={item.group} />
            {:else}
              <MenuDivider />
            {/if}
          {/if}
          <MenuItem
            on:click={menuClick}
            on:mouseenter={(e) => {
              removeHighlight(e);
              const hasSubMenu =
                item.subMenu && Array.isArray(item.subMenu) && item.subMenu.length > 0;
              if (hasSubMenu) {
                handleMenuItemHover(e, item.id);
              }
            }}
            on:mouseleave={(e) => {
              const hasSubMenu =
                item.subMenu && Array.isArray(item.subMenu) && item.subMenu.length > 0;
              if (hasSubMenu) {
                handleMenuItemLeave(e, item.id);
              }
            }}
            id={item.id}
            bind:selected={item.selected}
            variant={itemVariant}
            hasSubMenu={item.subMenu && Array.isArray(item.subMenu) && item.subMenu.length > 0}
          >
            {item.label}
          </MenuItem>
        {/each}
      {/if}
    </ul>
  </div>
{/if}

{#if isOpen}
  {#each menuItems as item (item.id)}
    {#if item.subMenu && Array.isArray(item.subMenu) && item.subMenu.length > 0 && openSubMenuId === item.id}
      {#key item.id}
        {#if menuList}
          {@const parentItemEl = menuList.querySelector(`li[id="${item.id}"]`)}
          {#if parentItemEl}
            {@const subMenuPosition = calculateSubMenuPosition(parentItemEl, item.subMenu)}
            <div
              class="sub-menu-wrapper"
              role="presentation"
              style="position: fixed; top: {subMenuPosition.top}px; left: {subMenuPosition.left}px; z-index: {50 +
                nestingLevel +
                1};"
              on:mouseenter={() => {
                // Cancel close timeout when mouse enters sub-menu
                if (hoverTimeout) {
                  clearTimeout(hoverTimeout);
                  hoverTimeout = null;
                }
              }}
              on:mouseleave={() => {
                // Start timeout for closing sub-menu
                hoverTimeout = setTimeout(() => {
                  if (openSubMenuId === item.id) {
                    openSubMenuId = null;
                  }
                }, 300);
              }}
            >
              <svelte:self
                isOpen={true}
                menuItems={item.subMenu}
                {showGroupLabels}
                position="right"
                {itemVariant}
                nestingLevel={nestingLevel + 1}
                anchorElement={null}
                on:select={(e) => {
                  dispatch('select', e.detail);
                  // Close menu after selection
                  closeMenu();
                }}
                on:close={() => {
                  openSubMenuId = null;
                }}
              />
            </div>
          {/if}
        {/if}
      {/key}
    {/if}
  {/each}
{/if}

<style>
  .menu-wrapper {
    position: fixed;
    min-width: 140px;
    max-width: 300px;
  }

  .sub-menu-wrapper {
    pointer-events: auto;
  }

  /* Override nested Menu wrapper positioning to be relative to parent wrapper */
  .sub-menu-wrapper :global(.menu-wrapper) {
    position: relative !important;
    top: 0 !important;
    left: 0 !important;
  }

  .menu {
    background-color: var(--color-bg-menu); /* #1e1e1e */
    border: 1px solid var(--color-border-menu); /* #383838 */
    box-shadow:
      0px 0px 0.5px 0px rgba(0, 0, 0, 0.12),
      0px 10px 16px 0px rgba(0, 0, 0, 0.12),
      0px 2px 5px 0px rgba(0, 0, 0, 0.15);
    padding: var(--size-xxsmall); /* 8px all sides */
    border-radius: var(--border-radius-large); /* 13px */
    margin: 0;
    max-height: calc(100vh - 32px);
    overflow-y: auto;
    list-style: none;
    min-width: var(--menu-min-width, auto);
  }

  .menu::-webkit-scrollbar {
    width: 12px;
    background-color: transparent;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=);
    background-repeat: repeat;
    background-size: 100% auto;
  }
  .menu::-webkit-scrollbar-track {
    border: solid 3px transparent;
    -webkit-box-shadow: inset 0 0 10px 10px transparent;
    box-shadow: inset 0 0 10px 10px transparent;
  }
  .menu::-webkit-scrollbar-thumb {
    border: solid 3px transparent;
    border-radius: 6px;
    -webkit-box-shadow: inset 0 0 10px 10px rgba(255, 255, 255, 0.4);
    box-shadow: inset 0 0 10px 10px rgba(255, 255, 255, 0.4);
  }
</style>
