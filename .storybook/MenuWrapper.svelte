<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { MenuOption } from '../src/types';
  import Menu from '../src/components/Menu/index.svelte';
  import Button from '../src/components/Button/index.svelte';

  type MenuProps = ComponentProps<typeof Menu>;

  interface Props {
    menuItems?: MenuOption[];
    showGroupLabels?: boolean;
    position?: MenuProps['position'];
    itemVariant?: MenuProps['itemVariant'];
    minWidth?: string | null;
    searchable?: boolean;
    searchPlaceholder?: string;
    footerLabel?: string;
    footerVariant?: 'button' | 'row';
  }

  let {
    menuItems = $bindable([]),
    showGroupLabels = false,
    position = 'bottom-left',
    itemVariant = 'default',
    minWidth = null,
    searchable = false,
    searchPlaceholder = 'Search',
    footerLabel = '',
    footerVariant = 'button',
  }: Props = $props();

  let isOpen = $state(false);
  let anchorElement: HTMLButtonElement | undefined = $state();

  // Menu closes itself after an action and stays open for checkbox and toggle rows
  function handleSelect(item: MenuOption) {
    console.log('Selected:', item);
  }

  // The multi-select stories use the footer to clear every checkbox
  function handleFooter() {
    menuItems = menuItems.map((item) =>
      item.type === 'checkbox' ? { ...item, checked: false } : item
    );
  }
</script>

<div
  style="display: flex; align-items: center; gap: 8px; padding: 20px; min-height: 60px; width: 100%;"
>
  <Button
    bind:element={anchorElement}
    variant="secondary"
    label="Menu"
    onclick={() => (isOpen = !isOpen)}
  />
  <Menu
    bind:isOpen
    bind:menuItems
    {anchorElement}
    {position}
    {showGroupLabels}
    {itemVariant}
    {minWidth}
    {searchable}
    {searchPlaceholder}
    {footerLabel}
    {footerVariant}
    onselect={handleSelect}
    onfooter={handleFooter}
  />
</div>
