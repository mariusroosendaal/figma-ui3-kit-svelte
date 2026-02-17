<script>
  import Modal from '../src/components/Modal/index.svelte';
  import Button from '../src/components/Button/index.svelte';
  import Text from '../src/components/Text/index.svelte';
  
  export let isOpen = false;
  export let title = "Modal Title";
  export let width = "medium";
  export let height = "auto";
  export let position = "center";
  export let headerVariant = "default";
  export let footerVariant = "default";
  export let footerBorder = true;
  export let showOverlay = true;
  export let closeOnOverlayClick = true;
  export let closeOnEscape = true;
  export let overlayPadding = "16px";
  export let contentPadding = true;
  export let icon2 = false;
  export let icon2Name = null;
  
  function handleClose() {
    isOpen = false;
  }
</script>

<div style="padding: 20px;">
  <Button 
    variant="primary"
    label="Open Modal"
    on:click={() => isOpen = true}
  />
  <Modal
    bind:isOpen
    {title}
    {width}
    {height}
    {position}
    {headerVariant}
    {footerVariant}
    {footerBorder}
    {showOverlay}
    {closeOnOverlayClick}
    {closeOnEscape}
    {overlayPadding}
    {contentPadding}
    {icon2}
    {icon2Name}
    onClose={handleClose}
  >
    <div>
      <Text>Modal content goes here.</Text>
    </div>
    
    <div slot="footer-left">
      <Button variant="secondary" label="Cancel" on:click={handleClose} />
    </div>
    
    <div slot="footer-right">
      <Button variant="primary" label="Save" on:click={handleClose} />
    </div>
  </Modal>
</div>

