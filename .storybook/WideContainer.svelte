<script>
  export let width = '300px';
  export let childComponent;
  export let childProps = {};
</script>

<div style="width: {width}; max-width: 100%; margin: 0 auto;">
  {#if childComponent}
    <svelte:component this={childComponent} {...childProps} />
  {:else}
    <slot />
  {/if}
</div>

