<script>
  import Disclosure from '../src/components/Disclosure/index.svelte';
  import DisclosureItem from '../src/components/DisclosureItem/index.svelte';
  
  export let multiple = false;
</script>

<Disclosure {multiple}>
  <DisclosureItem title="Item 1">Content for item 1</DisclosureItem>
  <DisclosureItem title="Item 2">Content for item 2</DisclosureItem>
  <DisclosureItem title="Item 3">Content for item 3</DisclosureItem>
</Disclosure>

