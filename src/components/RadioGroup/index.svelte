<script>
  export let legend = '';

  let className = '';
  export { className as class };
</script>

<fieldset class="radio-group {className}">
  {#if legend}
    <legend class="radio-group-legend">{legend}</legend>
  {/if}
  <slot />
</fieldset>

<style>
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
