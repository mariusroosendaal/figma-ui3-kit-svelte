<script>
  import Modal from '../src/components/Modal/index.svelte';
  import Button from '../src/components/Button/index.svelte';
  import Dropdown from '../src/components/Dropdown/index.svelte';
  import Text from '../src/components/Text/index.svelte';

  // UI3's "Modal header" Dropdown variant: a control in place of the title
  export let title = 'Library';
  let isOpen = false;
  const libraries = [
    { label: 'UI3 kit', value: 'ui3' },
    { label: 'Icons', value: 'icons' },
  ];
  let library = libraries[0];
</script>

<div style="padding: 20px;">
  <Button variant="primary" label="Open Modal" on:click={() => (isOpen = true)} />
  <Modal bind:isOpen {title} onClose={() => (isOpen = false)}>
    <svelte:fragment slot="header">
      <Dropdown menuItems={libraries} bind:value={library} ariaLabel="Library" />
    </svelte:fragment>
    <Text>{library.label} components go here.</Text>
  </Modal>
</div>
