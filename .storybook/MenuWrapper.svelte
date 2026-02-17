<script>
  import Menu from '../src/components/Menu/index.svelte';
  import Button from '../src/components/Button/index.svelte';
  
  export let menuItems = [];
  export let showGroupLabels = false;
  export let position = 'bottom-left';
  export let itemVariant = 'default';
  export let minWidth = null;
  
  let isOpen = false;
  let anchorElement = null;
  
  function handleSelect(event) {
    console.log('Selected:', event.detail);
    isOpen = false;
  }
  
  function handleClose() {
    isOpen = false;
  }
</script>

<div style="display: flex; align-items: center; gap: 8px; padding: 20px; min-height: 60px; width: 100%;">
  <Button 
    bind:element={anchorElement}
    variant="secondary"
    label="Menu"
    on:click={() => isOpen = !isOpen}
  />
  <Menu
    bind:isOpen
    {menuItems}
    {anchorElement}
    {position}
    {showGroupLabels}
    {itemVariant}
    minWidth={minWidth}
    on:select={handleSelect}
    on:close={handleClose}
  />
</div>

