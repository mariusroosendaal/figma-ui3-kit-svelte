<script>
  import { createEventDispatcher, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { segmentedControl } from './../Segment/index.svelte';

  export let value = null;
  export let disabled = false;
  export let ariaLabel = null;

  let className = '';
  export { className as class };

  const dispatch = createEventDispatcher();
  const selected = writable(value);
  const groupDisabled = writable(disabled);
  let element;

  $: selected.set(value);
  $: groupDisabled.set(disabled);

  setContext(segmentedControl, {
    selected,
    disabled: groupDisabled,
    select(segmentValue) {
      if (disabled) return;
      value = segmentValue;
      dispatch('change', segmentValue);
    },
  });

  // Every segment is its own tab stop; arrow keys move focus between them
  // without changing the selection (Enter/Space selects).
  function handleKeydown(event) {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;

    const segments = Array.from(element.querySelectorAll('[role="radio"]:enabled'));
    const index = segments.indexOf(document.activeElement);
    if (index === -1) return;

    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = Math.min(index + 1, segments.length - 1);
    else if (event.key === 'ArrowLeft') next = Math.max(index - 1, 0);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = segments.length - 1;
    segments[next].focus();
  }
</script>

<!-- svelte-ignore a11y-interactive-supports-focus -->
<div
  bind:this={element}
  role="radiogroup"
  aria-label={ariaLabel || undefined}
  aria-disabled={disabled || undefined}
  class="segmented-control {className}"
  on:keydown={handleKeydown}
>
  <slot />
</div>

<style>
  .segmented-control {
    display: flex;
    align-items: flex-start;
    overflow: hidden;
    border-radius: var(--border-radius-medium); /* 5px */
    background-color: var(--figma-color-bg-secondary);
  }
</style>
