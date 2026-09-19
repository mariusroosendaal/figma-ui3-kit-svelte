<script>
  // Renders a component with a text label in its default slot, which stories
  // can't pass directly.
  export let component;
  export let label = '';
  export let props = {};
</script>

<svelte:component this={component} {...props}>{label}</svelte:component>
