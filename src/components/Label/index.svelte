<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    size?: 'medium' | 'small';
    /** Shown when there are no children */
    text?: string;
    htmlFor?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    size = 'medium',
    text = '',
    htmlFor = '',
    class: className = '',
    children,
  }: Props = $props();
</script>

<label class="label {size} {className}" for={htmlFor || undefined}>
  {#if children}{@render children()}{:else}{text}{/if}
</label>

<style>
  .label {
    color: var(--figma-color-text);
    width: 100%;
    display: flex;
    align-items: center;
    cursor: default;
    user-select: none;
  }

  .label.medium {
    font-size: var(--body-medium-font-size);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
    font-weight: var(--body-medium-font-weight);
  }

  .label.small {
    color: var(--figma-color-text-secondary);
    font-size: var(--body-small-font-size);
    line-height: var(--body-small-line-height);
    letter-spacing: var(--body-small-letter-spacing);
    font-weight: var(--body-small-font-weight);
  }
</style>
