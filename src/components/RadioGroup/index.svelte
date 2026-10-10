<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    legend?: string;
    /** horizontal lays button radios out as one row */
    direction?: 'vertical' | 'horizontal';
    class?: string;
    /** The Radio components */
    children?: Snippet;
  }

  let { legend = '', direction = 'vertical', class: className = '', children }: Props = $props();
</script>

<fieldset class="radio-group {className}">
  {#if legend}
    <legend class="radio-group-legend">{legend}</legend>
  {/if}
  <div class="radio-group-items" class:horizontal={direction === 'horizontal'}>
    {@render children?.()}
  </div>
</fieldset>

<style>
  .radio-group-items {
    display: flex;
    flex-direction: column;
  }

  .radio-group-items.horizontal {
    flex-direction: row;
    gap: var(--size-xxsmall); /* 8px */
  }

  .radio-group {
    border: none;
    margin: 0;
    padding: 0;
  }

  .radio-group-legend {
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--font-weight-strong);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
    color: var(--figma-color-text);
    margin-bottom: var(--size-xxxsmall);
    padding: 0;
  }
</style>
