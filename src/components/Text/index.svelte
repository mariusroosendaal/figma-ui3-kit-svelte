<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: string;
    align?: 'start' | 'center' | 'end';
    block?: boolean;
    /** A CSS variable name or any CSS color */
    color?: string;
    /** Shown when there are no children */
    text?: string;
    as?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    variant = 'body-medium',
    align = 'start',
    block = false,
    color = '--figma-color-text',
    text = '',
    as = 'span',
    class: className = '',
    children,
  }: Props = $props();

  const headingElements: Record<string, string> = {
    'heading-large': 'h2',
    'heading-medium': 'h3',
    'heading-small': 'h4',
  };
  let resolvedAs = $derived(as !== 'span' ? as : (headingElements[variant] ?? 'span'));
  let cssColorVar = $derived(color.startsWith('--') ? `var(${color})` : color);
  let displayStyle = $derived(
    block ? 'block' : resolvedAs in headingElements ? 'block' : 'inline-block'
  );
</script>

<svelte:element
  this={resolvedAs}
  class="text {className} {variant} align-{align}"
  style="color: {cssColorVar}; display: {displayStyle};"
>
  {#if children}{@render children()}{:else}{text}{/if}
</svelte:element>

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
