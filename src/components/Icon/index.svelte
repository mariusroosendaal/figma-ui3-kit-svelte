<script>
  export let iconName = null; //pass svg data into this var by importing an svg in parent
  export let spin = false;
  export let iconText = null;
  export let color = '--figma-color-icon';
  export let size = 24;

  let className = '';
  export { className as class };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<div
  class:spin
  class="icon-component {className}"
  style="width: {size}px; height: {size}px; color: var({color}); fill: var({color})"
  on:click
  role="img"
>
  {#if iconText}
    {iconText}
  {:else if iconName}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- SVG content is trusted -->
    {@html iconName}
  {/if}
</div>

<style>
  .icon-component {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
    font-family: var(--font-stack);
    font-size: var(--body-small-font-size);
    font-weight: var(--body-small-font-weight);
    letter-spacing: var(--body-small-letter-spacing);
    line-height: var(--body-small-line-height);
    user-select: none;
  }

  .spin {
    animation: rotating 1s linear infinite;
  }

  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  :global(.icon-component svg) {
    fill: currentColor !important;
    color: currentColor;
  }

  :global(.icon-component svg *) {
    fill: currentColor !important;
    color: currentColor;
  }
</style>
