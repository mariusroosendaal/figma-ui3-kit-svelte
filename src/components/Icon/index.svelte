<script lang="ts">
  interface Props {
    /** SVG markup, from an imported icon */
    iconName?: string | null;
    spin?: boolean;
    /** Text in place of an icon */
    iconText?: string | null;
    /** A CSS variable name */
    color?: string;
    size?: number;
    ariaLabel?: string | null;
    class?: string;
  }

  let {
    iconName = null,
    spin = false,
    iconText = null,
    color = '--figma-color-icon',
    size = 24,
    ariaLabel = null,
    class: className = '',
  }: Props = $props();
</script>

<div
  class:spin
  class="icon-component {className}"
  style="width: {size}px; height: {size}px; color: var({color}); fill: var({color})"
  role={ariaLabel ? 'img' : undefined}
  aria-label={ariaLabel || undefined}
  aria-hidden={ariaLabel ? undefined : 'true'}
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

  /* A mask's shapes say what shows by their luminance, so they keep the fills
     they're drawn with: painted the icon's color, they hid most of it
     (lock.small, heart). */
  :global(.icon-component svg *:not(mask, mask *)) {
    fill: currentColor !important;
    color: currentColor;
  }
</style>
