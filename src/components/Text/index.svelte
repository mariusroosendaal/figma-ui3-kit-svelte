<script>
  export let variant = 'body-medium';
  export let align = 'start';
  export let block = false;
  export let color = '--figma-color-text';
  export let text = ''; // Text content (falls back to slot content if provided)

  let className = '';
  export { className as class };

  $: cssColorVar = color.startsWith('--') ? `var(${color})` : color;
  $: displayStyle = block ? 'block' : 'inline-block';
</script>

<span
  class="text {className} {variant} align-{align}"
  style="color: {cssColorVar}; display: {displayStyle};"
>
  <slot>{text}</slot>
</span>

<style>
  .text {
    font-family: var(--font-stack);
  }

  /* Heading variants */
  .heading-large {
    font-size: var(--heading-large-font-size);
    line-height: var(--heading-large-line-height);
    letter-spacing: var(--heading-large-letter-spacing);
    font-weight: var(--heading-large-font-weight);
  }

  .heading-medium {
    font-size: var(--heading-medium-font-size);
    line-height: var(--heading-medium-line-height);
    letter-spacing: var(--heading-medium-letter-spacing);
    font-weight: var(--heading-medium-font-weight);
  }

  .heading-small {
    font-size: var(--heading-small-font-size);
    line-height: var(--heading-small-line-height);
    letter-spacing: var(--heading-small-letter-spacing);
    font-weight: var(--heading-small-font-weight);
  }

  /* Body variants */
  .body-large {
    font-size: var(--body-large-font-size);
    line-height: var(--body-large-line-height);
    letter-spacing: var(--body-large-letter-spacing);
    font-weight: var(--body-large-font-weight);
  }

  .body-large-strong {
    font-size: var(--body-large-font-size);
    line-height: var(--body-large-line-height);
    letter-spacing: var(--body-large-letter-spacing);
    font-weight: var(--font-weight-strong);
  }

  .body-medium {
    font-size: var(--body-medium-font-size);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
    font-weight: var(--body-medium-font-weight);
  }

  .body-medium-strong {
    font-size: var(--body-medium-font-size);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
    font-weight: var(--font-weight-strong);
  }

  .body-small {
    font-size: var(--body-small-font-size);
    line-height: var(--body-small-line-height);
    letter-spacing: var(--body-small-letter-spacing);
    font-weight: var(--body-small-font-weight);
  }

  .body-small-strong {
    font-size: var(--body-small-font-size);
    line-height: var(--body-small-line-height);
    letter-spacing: var(--body-small-letter-spacing);
    font-weight: var(--font-weight-strong);
  }

  /* Alignment */
  .align-start {
    text-align: start;
  }
  .align-center {
    text-align: center;
  }
  .align-end {
    text-align: end;
  }
</style>
