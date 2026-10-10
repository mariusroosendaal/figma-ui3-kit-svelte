<script lang="ts">
  import type { Component, Snippet } from 'svelte';

  interface Props {
    width?: string;
    childComponent?: Component<Record<string, unknown>>;
    childProps?: Record<string, unknown>;
    children?: Snippet;
  }

  let { width = '300px', childComponent: Child, childProps = {}, children }: Props = $props();
</script>

<div style="width: {width}; max-width: 100%; margin: 0 auto;">
  {#if Child}
    <Child {...childProps} />
  {:else}
    {@render children?.()}
  {/if}
</div>
