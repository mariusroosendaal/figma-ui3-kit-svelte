<script lang="ts">
  import { setContext, type Snippet } from 'svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import { disclosure, type DisclosureContext } from './../DisclosureItem/index.svelte';

  interface Props {
    /** Several items open at once; otherwise opening one closes the rest */
    multiple?: boolean;
    label?: string;
    class?: string;
    /** The DisclosureItem components */
    children?: Snippet;
    /** The open items' `uniqueId`s */
    onchange?: (ids: string[]) => void;
  }

  let { multiple = false, label = '', class: className = '', children, onchange }: Props = $props();

  const selected = new SvelteSet<string>();

  setContext<DisclosureContext>(disclosure, {
    selected,
    clickHandler(itemId) {
      if (selected.has(itemId)) {
        selected.delete(itemId); // Toggle off
      } else {
        if (!multiple) {
          selected.clear(); // Clear others in accordion mode
        }
        selected.add(itemId); // Toggle on
      }
      onchange?.(Array.from(selected));
    },
    open(itemId) {
      selected.add(itemId);
    },
  });
</script>

<ul class={className} aria-label={label || undefined}>
  {@render children?.()}
</ul>

<style>
  ul {
    position: relative;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style-type: none;
    display: flex;
    flex-direction: column;
    user-select: none;
  }
</style>
