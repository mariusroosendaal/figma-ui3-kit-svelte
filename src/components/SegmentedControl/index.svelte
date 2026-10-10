<script lang="ts" generics="T">
  import { setContext, type Snippet } from 'svelte';
  import { segmentedControl, type SegmentedControlContext } from './../Segment/index.svelte';

  interface Props {
    value?: T | null;
    disabled?: boolean;
    ariaLabel?: string | null;
    class?: string;
    /** The Segment components */
    children?: Snippet;
    /** The chosen segment's value, after `value` updates */
    onchange?: (value: T) => void;
  }

  let {
    value = $bindable(),
    disabled = false,
    ariaLabel = null,
    class: className = '',
    children,
    onchange,
  }: Props = $props();

  let element: HTMLDivElement | undefined = $state();

  setContext<SegmentedControlContext>(segmentedControl, {
    get selected() {
      return value;
    },
    get disabled() {
      return disabled;
    },
    select(segmentValue) {
      if (disabled) return;
      value = segmentValue as T;
      onchange?.(segmentValue as T);
    },
  });

  // Every segment is its own tab stop; arrow keys move focus between them
  // without changing the selection (Enter/Space selects).
  function handleKeydown(event: KeyboardEvent) {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key) || !element) return;

    const segments = Array.from(element.querySelectorAll<HTMLElement>('[role="radio"]:enabled'));
    const index = segments.indexOf(document.activeElement as HTMLElement);
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

<!-- svelte-ignore a11y_interactive_supports_focus -->
<div
  bind:this={element}
  role="radiogroup"
  aria-label={ariaLabel || undefined}
  aria-disabled={disabled || undefined}
  class="segmented-control {className}"
  onkeydown={handleKeydown}
>
  {@render children?.()}
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
