<script lang="ts">
  import Modal from '../src/components/Modal/index.svelte';
  import Button from '../src/components/Button/index.svelte';
  import Dropdown from '../src/components/Dropdown/index.svelte';
  import Text from '../src/components/Text/index.svelte';

  // UI3's "Modal header" Dropdown variant: a control in place of the title
  let { title = 'Library' }: { title?: string } = $props();
  let isOpen = $state(false);
  const libraries = [
    { label: 'UI3 kit', value: 'ui3' },
    { label: 'Icons', value: 'icons' },
  ];
  let library = $state(libraries[0]);
</script>

<div style="padding: 20px;">
  <Button variant="primary" label="Open Modal" onclick={() => (isOpen = true)} />
  <Modal bind:isOpen {title} onclose={() => (isOpen = false)}>
    {#snippet header()}
      <Dropdown menuItems={libraries} bind:value={library} ariaLabel="Library" />
    {/snippet}
    <Text>{library?.label} components go here.</Text>
  </Modal>
</div>
