<script lang="ts">
  import Disclosure from '../src/components/Disclosure/index.svelte';
  import DisclosureItem from '../src/components/DisclosureItem/index.svelte';

  let { multiple = false }: { multiple?: boolean } = $props();
</script>

<Disclosure {multiple}>
  <DisclosureItem title="Item 1">Content for item 1</DisclosureItem>
  <DisclosureItem title="Item 2">Content for item 2</DisclosureItem>
  <DisclosureItem title="Item 3">Content for item 3</DisclosureItem>
</Disclosure>
