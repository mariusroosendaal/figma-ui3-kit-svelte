<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import Modal from '../src/components/Modal/index.svelte';
  import Button from '../src/components/Button/index.svelte';
  import Text from '../src/components/Text/index.svelte';

  type ModalProps = ComponentProps<typeof Modal>;

  let {
    isOpen = $bindable(false),
    title = 'Modal Title',
    width = 'medium',
    height = 'auto',
    position = 'center',
    headerVariant = 'default',
    footerVariant = 'default',
    footerBorder = true,
    showOverlay = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    overlayPadding = '16px',
    contentPadding = true,
    icon2 = false,
    icon2Name = null,
    headerTabs = [],
  }: Omit<ModalProps, 'headerTabs'> & { headerTabs?: string[] } = $props();
  let selectedTab = $state(0);

  function handleClose() {
    isOpen = false;
  }
</script>

<div style="padding: 20px;">
  <Button variant="primary" label="Open Modal" onclick={() => (isOpen = true)} />
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
    {headerTabs}
    bind:selectedTab
    onback={() => console.log('Back')}
    onclose={handleClose}
  >
    <div>
      <Text
        >{headerTabs.length
          ? `${headerTabs[selectedTab]} content goes here.`
          : 'Modal content goes here.'}</Text
      >
    </div>

    {#snippet footerLeft()}
      <div>
        <Button variant="secondary" label="Cancel" onclick={handleClose} />
      </div>
    {/snippet}

    {#snippet footerRight()}
      <div>
        <Button variant="primary" label="Save" onclick={handleClose} />
      </div>
    {/snippet}
  </Modal>
</div>
