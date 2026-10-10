<script lang="ts">
  // Renders a component with a text label as its children, which stories
  // can't pass directly.
  import type { Component as ComponentType } from 'svelte';

  interface Props {
    component: ComponentType<Record<string, unknown>>;
    label?: string;
    props?: Record<string, unknown>;
  }

  let { component: Component, label = '', props = {} }: Props = $props();
</script>

<Component {...props}>{label}</Component>
