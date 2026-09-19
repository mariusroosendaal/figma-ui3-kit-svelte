<script>
  import Menu from '../src/components/Menu/index.svelte';
  import Button from '../src/components/Button/index.svelte';

  export let menuItems = [];
  export let showGroupLabels = false;
  export let position = 'bottom-left';
  export let itemVariant = 'default';
  export let minWidth = null;
  export let searchable = false;
  export let searchPlaceholder = 'Search';
  export let footerLabel = '';

  let isOpen = false;
  let anchorElement = null;

  // Menu closes itself after an action and stays open for checkbox and toggle rows
  function handleSelect(event) {
    console.log('Selected:', event.detail);
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
    on:click={() => (isOpen = !isOpen)}
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
    on:select={handleSelect}
    on:footer={handleFooter}
  />
</div>
