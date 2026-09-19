<script>
  export let legend = '';
  /** @type {'vertical' | 'horizontal'} horizontal lays button radios out as one row */
  export let direction = 'vertical';

  let className = '';
  export { className as class };
</script>

<fieldset class="radio-group {className}">
  {#if legend}
    <legend class="radio-group-legend">{legend}</legend>
  {/if}
  <div class="radio-group-items" class:horizontal={direction === 'horizontal'}>
    <slot />
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
