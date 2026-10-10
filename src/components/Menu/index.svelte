<!--
  Menu: UI3's dark menu, built from data.

  Items are `{ label, value?, group?, section?, showHeading?, disabled?, type?,
  checked?, selected?, iconName?, chit?, detail?, badge?, subMenu? }`,
  `badge` as MenuItem takes it, one or several:

  - `type` makes a row a control. 'check' draws a leading checkmark (`checked:
    'mixed'` draws a dot) and closes the menu like any action; 'checkbox' and
    'toggle' draw a trailing checkbox or a leading switch and keep it open, so
    several can be flipped in one go. Each flips `checked` and calls `onselect`.
  - Without a type, a row is an action. With `itemVariant="checkmark"` the rows
    are a single choice instead, marked by `selected` (how Dropdown uses it).
  - A group change draws a divider, and a heading when `showHeading` (or
    `showGroupLabels`) says so; `section` separates dividers from headings.

  Keyboard: arrows and Home/End move the highlight, Enter or Space picks,
  ArrowRight/ArrowLeft open and leave a sub-menu, Escape closes. With
  `searchable` the field keeps focus while the arrows move through what it
  leaves. The highlight follows the pointer too, so there is only ever one.
-->
<script lang="ts" generics="T extends MenuOption = MenuOption">
  import { onDestroy, onMount, tick, untrack } from 'svelte';
  import type { MenuOption } from '../../types';
  import Menu from './index.svelte';
  import MenuItem from '../MenuItem/index.svelte';
  import MenuDivider from '../MenuDivider/index.svelte';
  import MenuHeading from '../MenuHeading/index.svelte';
  import Icon from '../Icon/index.svelte';
  import IconSearch from './../../icons/24/icon.24.search.small.svg';
  import IconChevronDown from './../../icons/24/icon.24.chevron.down.svg';
  import IconChevronUp from './../../icons/24/icon.24.chevron.up.svg';
  import IconPlus from './../../icons/16/icon.16.plus.svg';

  interface Props {
    isOpen?: boolean;
    /** Menu sets their `checked` and `selected` as rows are picked */
    menuItems?: T[];
    showGroupLabels?: boolean;
    anchorElement?: HTMLElement | null;
    /** 'right' places sub-menus */
    position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'right';
    minWidth?: string | null;
    itemVariant?: 'default' | 'checkmark';
    /** Nesting level for z-index calculation (0 = top-level) */
    nestingLevel?: number;
    menuListId?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    /** Label of a full-width button under the list, e.g. "Clear all"; calls `onfooter`. */
    footerLabel?: string;
    /** button: a bordered button (multi-select menus); row: a centered "+ label" row (UI3's Menu row/Footer) */
    footerVariant?: 'button' | 'row';
    /** Row footer's icon; a plus by default */
    footerIconName?: string | null;
    /** Whether the menu takes focus when it opens. Sub-menus opened by the pointer don't. */
    autofocus?: boolean;
    class?: string;
    /** A picked row, a sub-menu's included, after its `checked` or `selected` updates */
    onselect?: (item: T) => void;
    /** After `isOpen` turns false. A sub-menu passes `{ all, returnFocus }` to close
     * the whole menu, and nothing to close itself. */
    onclose?: (detail?: { all: boolean; returnFocus: boolean }) => void;
    /** The footer button */
    onfooter?: () => void;
  }

  let {
    isOpen = $bindable(),
    menuItems = $bindable(),
    showGroupLabels = false,
    anchorElement = null,
    position = 'bottom-left',
    minWidth = null,
    itemVariant = 'default',
    nestingLevel = 0,
    menuListId = '',
    searchable = false,
    searchPlaceholder = 'Search',
    footerLabel = '',
    footerVariant = 'button',
    footerIconName = null,
    autofocus = true,
    class: className = '',
    onselect,
    onclose,
    onfooter,
  }: Props = $props();

  // Unset, it has no rows
  let items = $derived(menuItems ?? []);

  const menuId = Math.random().toString(36).slice(2, 11);
  const GAP = 4;
  const MARGIN = 8;

  let wrapper: HTMLDivElement | undefined = $state();
  let list: HTMLUListElement | undefined = $state();
  let input: HTMLInputElement | undefined = $state();
  let searchRow: HTMLDivElement | undefined = $state();
  let footer: HTMLDivElement | undefined = $state();

  let query = $state('');
  let active = $state(-1); // index into menuItems
  let placed = $state(false);
  let place_ = $state({ top: 0, left: 0, maxHeight: 0 });
  let openSub = $state(-1);
  let subByKeyboard = $state(false);
  let subAnchor: HTMLElement | null = $state(null);
  let openTimer: ReturnType<typeof setTimeout> | undefined;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  // Overflow: arrow rows at the edges scroll the list on hover (UI3's Menu row/Expand)
  let canScrollUp = $state(false);
  let canScrollDown = $state(false);
  let scrollFrame: number | null = null;
  // Rows are flipped in place, on the caller's objects, which a plain array
  // doesn't report: counting the flips redraws them.
  let flips = $state(0);

  let listId = $derived(menuListId || `menu-${menuId}`);
  const rowId = (index: number) => `${listId}-${index}`;
  // Called from the markup rather than kept as a reactive value: `active` is set
  // inside functions that reactive statements call, which a derived value misses.
  const activeIdOf = (open: boolean, index: number) =>
    open && index >= 0 ? `menu-item-${rowId(index)}` : undefined;

  const hasSub = (item: MenuOption | undefined) =>
    Array.isArray(item?.subMenu) && item.subMenu.length > 0;
  const sectionOf = (item: MenuOption) => item.section ?? item.group ?? null;
  const headingOf = (item: MenuOption) => item.group && (item.showHeading ?? showGroupLabels);
  const haystack = (item: MenuOption) =>
    [item.label, item.group, item.detail].filter(Boolean).join(' ').toLowerCase();

  let needle = $derived(searchable ? query.trim().toLowerCase() : '');
  let rows = $derived.by(() => {
    void flips;
    return items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !needle || haystack(item).includes(needle));
  });
  let enabled = $derived(rows.filter(({ item }) => !item.disabled).map(({ index }) => index));
  // Every row keeps the check column once one row needs it, so labels line up.
  let checkColumn = $derived(
    itemVariant === 'checkmark' || items.some((item) => item.type === 'check')
  );

  function rowVariant(item: MenuOption) {
    if (item.type === 'checkbox' || item.type === 'toggle') return item.type;
    return checkColumn ? 'checkmark' : 'default';
  }

  function rowSelected(item: MenuOption) {
    if (item.type) return item.checked ?? false;
    return itemVariant === 'checkmark' ? Boolean(item.selected) : false;
  }

  function rowRole(item: MenuOption) {
    if (item.type) return 'menuitemcheckbox';
    return itemVariant === 'checkmark' ? 'menuitemradio' : 'menuitem';
  }

  // OPEN AND CLOSE

  $effect.pre(() => {
    const open = !!isOpen;
    untrack(() => handleOpenChange(open));
  });

  async function handleOpenChange(open: boolean) {
    if (!open) {
      stopListening();
      return;
    }
    query = '';
    placed = false;
    openSub = -1;
    const chosen = items.findIndex((item) => item.selected && !item.disabled);
    const first = items.findIndex((item) => !item.disabled);
    active = chosen >= 0 ? chosen : nestingLevel > 0 && autofocus ? first : -1;
    if (nestingLevel === 0) {
      document.dispatchEvent(new CustomEvent('dropdown:open', { detail: { dropdownId: menuId } }));
    }
    await tick();
    if (!isOpen) return;
    place();
    placed = true;
    await tick();
    updateOverflow();
    if (autofocus) (searchable ? input : list)?.focus({ preventScroll: true });
    scrollToActive();
    // A tick later, so the click that opened the menu isn't taken for one outside.
    setTimeout(() => {
      if (isOpen && nestingLevel === 0) startListening();
    }, 0);
  }

  /** Closes the menu. `returnFocus` sends focus back to the trigger when it was inside. */
  function close(returnFocus = false) {
    if (isOpen) shut(returnFocus, wrapper?.contains(document.activeElement) ?? false);
  }

  // Closes even a menu its caller has closed already, from `onselect`: that
  // caller still hears `onclose`, and the focus still goes back.
  function shut(returnFocus: boolean, hadFocus: boolean) {
    clearTimers();
    openSub = -1;
    if (nestingLevel > 0) {
      onclose?.({ all: true, returnFocus });
      return;
    }
    // Only when the caller hasn't: writing a prop the caller has just changed
    // leaves Svelte 5.35+ deaf to it, as in Modal's closeModal
    if (isOpen) isOpen = false;
    stopListening();
    onclose?.();
    if (returnFocus && hadFocus) anchorElement?.focus();
  }

  function onSubClose(detail?: { all: boolean; returnFocus: boolean }) {
    if (detail?.all) {
      shut(detail.returnFocus, wrapper?.contains(document.activeElement) ?? false);
      return;
    }
    const byKeyboard = subByKeyboard;
    openSub = -1;
    if (byKeyboard) (searchable ? input : list)?.focus({ preventScroll: true });
  }

  function onClickOutside(event: MouseEvent) {
    if (isOpen && wrapper && !wrapper.contains(event.target as Node | null)) close();
  }

  // The menu is placed against its trigger once; anything scrolling behind it
  // would leave it floating, so that closes it.
  function onScroll(event: Event) {
    if (isOpen && wrapper && !wrapper.contains(event.target as Node | null)) close();
  }

  function onOtherMenuOpen(event: Event) {
    const { detail } = event as CustomEvent<{ dropdownId: string } | undefined>;
    if (isOpen && nestingLevel === 0 && detail?.dropdownId !== menuId) close();
  }

  function startListening() {
    document.addEventListener('click', onClickOutside);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
  }

  function stopListening() {
    document.removeEventListener('click', onClickOutside);
    window.removeEventListener('scroll', onScroll, true);
    window.removeEventListener('resize', onResize);
  }

  function onResize() {
    if (isOpen) place();
  }

  onMount(() => document.addEventListener('dropdown:open', onOtherMenuOpen));

  onDestroy(() => {
    clearTimers();
    stopScroll();
    if (typeof document === 'undefined') return;
    stopListening();
    document.removeEventListener('dropdown:open', onOtherMenuOpen);
  });

  // PLACEMENT

  function updateOverflow() {
    if (!list) return;
    canScrollUp = list.scrollTop > 0;
    canScrollDown = list.scrollTop + list.clientHeight < list.scrollHeight - 1;
  }

  // Re-measured when the rows change (search) — after they render.
  $effect(() => {
    if (isOpen && placed) {
      void rows;
      tick().then(updateOverflow);
    }
  });

  function startScroll(direction: number) {
    stopScroll();
    const stepFrame = () => {
      if (!list) return;
      list.scrollTop += direction * 4;
      updateOverflow();
      if ((direction < 0 && canScrollUp) || (direction > 0 && canScrollDown)) {
        scrollFrame = window.requestAnimationFrame(stepFrame);
      }
    };
    scrollFrame = window.requestAnimationFrame(stepFrame);
  }

  function stopScroll() {
    if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    scrollFrame = null;
  }

  function place() {
    if (!wrapper) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // What the whole menu would take, not what it is squeezed to now.
    const wanted =
      (searchRow?.offsetHeight ?? 0) + (list?.scrollHeight ?? 0) + (footer?.offsetHeight ?? 0) + 2;
    const width = wrapper.offsetWidth;
    if (!anchorElement) {
      place_ = { top: MARGIN, left: MARGIN, maxHeight: vh - MARGIN * 2 };
      return;
    }
    const anchor = anchorElement.getBoundingClientRect();

    if (position === 'right') {
      // Beside the parent row, its first row level with it; flipped left when
      // there is no room on the right.
      let left = anchor.right + 12;
      if (left + width > vw - MARGIN) left = anchor.left - width - 12;
      const maxHeight = vh - MARGIN * 2;
      const height = Math.min(wanted, maxHeight);
      const top = Math.min(Math.max(MARGIN, anchor.top - 9), vh - MARGIN - height);
      place_ = { top, left: Math.max(MARGIN, left), maxHeight };
      return;
    }

    const below = vh - anchor.bottom - GAP - MARGIN;
    const above = anchor.top - GAP - MARGIN;
    const prefersUp = position.startsWith('top');
    const up = prefersUp ? wanted <= above || above >= below : !(wanted <= below || below >= above);
    // At least 120px tall, but never taller than the window; in a short window
    // the menu moves over its trigger to stay inside, and scrolls.
    const maxHeight = Math.min(vh - MARGIN * 2, Math.max(120, up ? above : below));
    const height = Math.min(wanted, maxHeight);
    const top = up ? anchor.top - GAP - height : anchor.bottom + GAP;
    let left = position.endsWith('right') ? anchor.right - width : anchor.left;
    left = Math.min(left, vw - width - MARGIN);
    place_ = {
      top: Math.max(MARGIN, Math.min(top, vh - MARGIN - height)),
      left: Math.max(MARGIN, left),
      maxHeight,
    };
  }

  // HIGHLIGHT

  function setActive(index: number, scroll = false) {
    active = index;
    if (scroll) scrollToActive();
  }

  async function scrollToActive() {
    await tick();
    if (active < 0) return;
    document.getElementById(`menu-item-${rowId(active)}`)?.scrollIntoView({ block: 'nearest' });
  }

  function move(step: number) {
    if (enabled.length === 0) return;
    const at = enabled.indexOf(active);
    const next =
      at === -1
        ? step > 0
          ? 0
          : enabled.length - 1
        : (at + step + enabled.length) % enabled.length;
    setActive(enabled[next], true);
  }

  // Typing moves the highlight to the first match, so Enter picks it. Handed
  // what it reads, so it re-runs on a keystroke and not on an arrow key.
  $effect.pre(() => {
    if (isOpen && searchable) {
      const text = needle;
      const matches = enabled;
      untrack(() => firstMatch(text, matches));
    }
  });
  function firstMatch(text: string, matches: number[]) {
    if (text) active = matches.length ? matches[0] : -1;
  }

  // SUB-MENUS

  function openSubMenu(index: number, byKeyboard: boolean) {
    clearTimers();
    subAnchor = document.getElementById(`menu-item-${rowId(index)}`);
    subByKeyboard = byKeyboard;
    openSub = index;
  }

  function clearTimers() {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    openTimer = closeTimer = undefined;
  }

  function onRowEnter(index: number) {
    setActive(index);
    const item = items[index];
    clearTimers();
    if (index === openSub) return;
    if (hasSub(item) && !item.disabled) {
      openTimer = setTimeout(() => openSubMenu(index, false), 120);
    } else if (openSub >= 0) {
      closeTimer = setTimeout(() => (openSub = -1), 300);
    }
  }

  function onListLeave() {
    if (openSub < 0) active = -1;
  }

  // PICKING

  // Tells a caller that binds `menuItems` that its rows changed
  function flipped() {
    flips++;
    menuItems = items;
  }

  function activate(index: number, byKeyboard: boolean) {
    const item = items[index];
    if (!item || item.disabled) return;
    if (hasSub(item)) {
      openSubMenu(index, byKeyboard);
      return;
    }
    if (item.type === 'checkbox' || item.type === 'toggle') {
      item.checked = item.checked !== true;
      flipped();
      onselect?.(item);
      return;
    }
    if (item.type === 'check') {
      item.checked = item.checked !== true;
      flipped();
    } else if (itemVariant === 'checkmark') {
      items.forEach((i) => (i.selected = false));
      item.selected = true;
      flipped();
    }
    const hadFocus = wrapper?.contains(document.activeElement) ?? false;
    onselect?.(item);
    shut(byKeyboard, hadFocus);
  }

  function handleKeydown(event: KeyboardEvent) {
    const inField = event.currentTarget === input;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Home':
      case 'End':
        if (inField) return;
        event.preventDefault();
        if (enabled.length) setActive(enabled[event.key === 'Home' ? 0 : enabled.length - 1], true);
        break;
      case 'Enter':
        event.preventDefault();
        if (active >= 0) activate(active, true);
        break;
      case ' ':
        if (inField) return;
        event.preventDefault();
        if (active >= 0) activate(active, true);
        break;
      case 'ArrowRight':
        if (inField) return;
        event.preventDefault();
        if (active >= 0 && hasSub(items[active]) && !items[active].disabled) {
          openSubMenu(active, true);
        }
        break;
      case 'ArrowLeft':
        if (inField || nestingLevel === 0) return;
        event.preventDefault();
        onclose?.();
        break;
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        if (nestingLevel > 0) onclose?.();
        else close(true);
        break;
      case 'Tab':
        // Tab may move to the footer button; anywhere else closes the menu.
        if (!footerLabel || event.shiftKey) close();
        break;
    }
  }

  function onFocusOut(event: FocusEvent) {
    const next = event.relatedTarget as Node | null;
    // Focus moving to the trigger is a click on it, which toggles the menu
    // itself; closing here too would have that click open it again. Tab, the
    // keyboard's way there, closes the menu on keydown.
    if (anchorElement?.contains(next)) return;
    if (isOpen && nestingLevel === 0 && next && wrapper && !wrapper.contains(next)) close();
  }
</script>

{#if isOpen}
  <div
    bind:this={wrapper}
    class="menu-wrapper {className}"
    class:placed
    style="--menu-min-width: {minWidth ||
      'auto'}; top: {place_.top}px; left: {place_.left}px; max-height: {place_.maxHeight ||
      'none'}{place_.maxHeight ? 'px' : ''}; z-index: {1001 + nestingLevel};"
    onfocusout={onFocusOut}
  >
    {#if searchable}
      <div class="search-row" bind:this={searchRow}>
        <div class="search-field">
          <Icon iconName={IconSearch} color="--color-text-menu-secondary" />
          <input
            bind:this={input}
            bind:value={query}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeIdOf(isOpen, active)}
            aria-label={searchPlaceholder}
            placeholder={searchPlaceholder}
            autocomplete="off"
            spellcheck="false"
            onkeydown={handleKeydown}
          />
        </div>
      </div>
    {/if}

    <div class="list-area" class:no-top-edge={searchable} class:no-bottom-edge={footerLabel}>
      <ul
        bind:this={list}
        onscroll={updateOverflow}
        class="menu"
        role="menu"
        id={listId}
        tabindex={searchable ? -1 : 0}
        aria-activedescendant={searchable ? undefined : activeIdOf(isOpen, active)}
        onkeydown={handleKeydown}
        onmouseleave={onListLeave}
        onmousedown={(event) => event.preventDefault()}
      >
        {#each rows as { item, index }, k (index)}
          {@const prev = k > 0 ? rows[k - 1].item : null}
          {#if prev && sectionOf(item) !== sectionOf(prev)}
            <li role="separator" class="separator"><MenuDivider /></li>
          {/if}
          {#if headingOf(item) && (!prev || prev.group !== item.group)}
            <li role="presentation"><MenuHeading text={item.group} /></li>
          {/if}
          <MenuItem
            id={rowId(index)}
            variant={rowVariant(item)}
            role={rowRole(item)}
            selected={rowSelected(item)}
            highlighted={index === active || index === openSub}
            disabled={item.disabled}
            hasSubMenu={hasSub(item)}
            iconName={item.iconName ?? null}
            chit={item.chit ?? null}
            avatar={item.avatar ?? null}
            detail={item.detail ?? ''}
            badge={item.badge ?? ''}
            onmouseenter={() => onRowEnter(index)}
            onmousemove={() => active !== index && onRowEnter(index)}
            onclick={() => activate(index, false)}
          >
            {item.label}
          </MenuItem>
        {:else}
          <li role="presentation" class="empty">
            {needle ? `No matches for “${query.trim()}”` : 'Nothing to show'}
          </li>
        {/each}
      </ul>
      <!-- Pointer-only, as in UI3: the keys scroll the list by moving the highlight. -->
      {#if canScrollUp}
        <div
          class="overflow-arrow up"
          aria-hidden="true"
          onmouseenter={() => startScroll(-1)}
          onmouseleave={stopScroll}
        >
          <Icon iconName={IconChevronUp} color="--color-icon-menu" />
        </div>
      {/if}
      {#if canScrollDown}
        <div
          class="overflow-arrow down"
          aria-hidden="true"
          onmouseenter={() => startScroll(1)}
          onmouseleave={stopScroll}
        >
          <Icon iconName={IconChevronDown} color="--color-icon-menu" />
        </div>
      {/if}
    </div>

    {#if footerLabel}
      <div class="footer" class:row={footerVariant === 'row'} bind:this={footer}>
        <button
          type="button"
          class={footerVariant === 'row' ? 'footer-row' : 'footer-button'}
          onclick={() => onfooter?.()}
        >
          {#if footerVariant === 'row'}
            <Icon iconName={footerIconName || IconPlus} color="--color-icon-menu" size={16} />
          {/if}
          {footerLabel}
        </button>
      </div>
    {/if}

    {#if openSub >= 0 && hasSub(items[openSub]) && subAnchor}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="sub-menu" onmouseenter={clearTimers}>
        <Menu
          isOpen={true}
          menuItems={items[openSub].subMenu as T[]}
          {showGroupLabels}
          {itemVariant}
          position="right"
          nestingLevel={nestingLevel + 1}
          anchorElement={subAnchor}
          autofocus={subByKeyboard}
          onselect={(item) => onselect?.(item)}
          onclose={onSubClose}
        />
      </div>
    {/if}
  </div>
{/if}

<style>
  .menu-wrapper {
    position: fixed;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    min-width: max(140px, var(--menu-min-width, auto));
    max-width: min(300px, calc(100vw - 16px));
    visibility: hidden;
    border-radius: var(--border-radius-large); /* 13px */
    background-color: var(--color-bg-menu); /* #1e1e1e */
    /* UI3's menu panel elevation; on the dark theme its inset 0.5px highlights draw the edge */
    box-shadow: var(--elevation-400-menu-panel);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
  }

  /* Hidden until placed, so it never flashes at the window's corner. */
  .menu-wrapper.placed {
    visibility: visible;
  }

  .list-area {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
  }

  /* The arrows cover the list's edges; keyboard scrolling keeps rows clear of them. */
  .overflow-arrow {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--size-small); /* 24px */
    background-color: var(--color-bg-menu);
    cursor: default;
    z-index: 1;
  }

  .overflow-arrow:hover {
    background-color: var(--color-bg-menu-hover);
  }

  .overflow-arrow.up {
    top: 0;
    border-radius: var(--border-radius-large) var(--border-radius-large) 0 0;
  }

  .overflow-arrow.down {
    bottom: 0;
    border-radius: 0 0 var(--border-radius-large) var(--border-radius-large);
  }

  .no-top-edge .overflow-arrow.up,
  .no-bottom-edge .overflow-arrow.down {
    border-radius: 0;
  }

  .menu {
    flex: 1 1 auto;
    min-height: 0;
    scroll-padding: var(--size-small) 0;
    scrollbar-width: none;
    margin: 0;
    padding: var(--size-xxsmall); /* 8px */
    overflow-y: auto;
    list-style: none;
    outline: none;
  }

  .separator {
    display: block;
  }

  .search-row {
    flex: 0 0 auto;
    padding: var(--size-xxsmall);
    border-bottom: 1px solid var(--color-border-menu);
  }

  .search-field {
    display: flex;
    align-items: center;
    height: var(--size-small); /* 24px */
    padding-right: var(--size-xxsmall);
    border: 1px solid transparent;
    border-radius: var(--border-radius-medium);
    background-color: rgba(255, 255, 255, 0.1);
  }

  .search-field:focus-within {
    border-color: var(--color-bg-menu-selected);
  }

  .search-field input {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--color-text-menu);
    font: inherit;
  }

  .search-field input::placeholder {
    color: var(--color-text-menu-secondary);
  }

  .empty {
    padding: var(--size-xxxsmall) var(--size-xxsmall);
    color: var(--color-text-menu-tertiary);
    user-select: none;
  }

  .footer {
    flex: 0 0 auto;
    padding: var(--size-xxsmall);
    border-top: 1px solid var(--color-border-menu);
  }

  .footer.row {
    padding: var(--size-xxsmall);
  }

  .footer-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-xxxsmall); /* 4px */
    width: 100%;
    height: var(--size-small);
    padding: 0 var(--size-xxsmall);
    border: 0;
    border-radius: var(--border-radius-medium);
    background: transparent;
    color: var(--color-text-menu);
    font: inherit;
    cursor: default;
  }

  .footer-row:hover {
    background-color: var(--color-bg-menu-selected);
  }

  .footer-row:focus-visible {
    outline: 1px solid var(--color-bg-menu-selected);
    outline-offset: -1px;
  }

  .footer-button {
    width: 100%;
    height: var(--size-small); /* 24px */
    padding: 0 var(--size-xxsmall);
    border: 1px solid rgba(255, 255, 255, 0.1); /* UI3's bordertranslucent on the dark menu */
    border-radius: var(--border-radius-medium);
    background: transparent;
    color: var(--color-text-menu);
    font: inherit;
    cursor: default;
  }

  .footer-button:hover {
    background-color: rgba(255, 255, 255, 0.06);
  }

  .footer-button:focus-visible {
    outline: 1px solid var(--color-bg-menu-selected);
    outline-offset: -1px;
    border-color: var(--color-bg-menu-selected);
  }

  /* No scrollbar: the overflow arrows stand in for it, as in UI3 */
  .menu::-webkit-scrollbar {
    display: none;
  }
</style>
