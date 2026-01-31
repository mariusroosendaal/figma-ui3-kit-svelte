<script>
  import { createEventDispatcher, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { disclosure } from './../DisclosureItem/index.svelte';

  export let multiple = false;

  let className = '';
  export { className as class };
  const dispatch = createEventDispatcher();
  // Always use Set for state management
  const selected = writable(new Set());
  let disclosureWrapper;

  const clickHandler = function (itemId) {
    selected.update(($selected) => {
      const newSet = new Set($selected);
      if (newSet.has(itemId)) {
        newSet.delete(itemId); // Toggle off
      } else {
        if (!multiple) {
          newSet.clear(); // Clear others in accordion mode
        }
        newSet.add(itemId); // Toggle on
      }
      dispatch('change', Array.from(newSet));
      return newSet;
    });
  };

  setContext(disclosure, { clickHandler, selected, multiple });
</script>

<ul class={className} bind:this={disclosureWrapper}>
  <slot></slot>
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
  }
</style>
