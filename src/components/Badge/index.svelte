<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from './../Icon/index.svelte';

  interface Props {
    /** default, brand, component, danger, success, warning, invert, selected, variable,
     * variable-selected, feedback, merged, archived, menu, figjam, count, count-inactive */
    variant?: string;
    /** True for strong variants (colored backgrounds) */
    strong?: boolean;
    /** SVG icon data, for variants that support icons */
    iconName?: string | null;
    /** Shown when there are no children */
    text?: string;
    /** Use when badge text alone doesn't convey the status type (WCAG 4.1.2) */
    ariaLabel?: string | null;
    /** Large uses body-large text (UI3's "Badge large") */
    size?: 'small' | 'large';
    /** UI3's "Badge Dot": an unread marker with no text, brand unless `variant` is danger,
     * success or warning. Set ariaLabel when it carries meaning. */
    dot?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    variant = 'default',
    strong = false,
    iconName = null,
    text = '',
    ariaLabel = null,
    size = 'small',
    dot = false,
    class: className = '',
    children,
  }: Props = $props();

  // Function to determine the correct icon color based on variant and state
  function getIconColor(variant: string, strong: boolean) {
    switch (variant) {
      case 'brand':
      case 'component':
      case 'danger':
      case 'success':
      case 'invert':
      case 'menu':
      case 'figjam':
        return strong ? '--figma-color-icon-onbrand' : '--figma-color-icon-brand';
      case 'selected':
      case 'variable-selected':
        return '--figma-color-icon-selected';
      case 'feedback':
        return '--figma-color-icon-brand';
      case 'merged':
        return '--figma-color-icon-success';
      case 'archived':
        return '--figma-color-icon-tertiary';
      case 'variable':
      default:
        return '--figma-color-icon';
    }
  }
  let iconColor = $derived(getIconColor(variant, strong));
</script>

{#if dot}
  <span
    class="badge-dot {className}"
    class:danger={variant === 'danger'}
    class:success={variant === 'success'}
    class:warning={variant === 'warning'}
    role={ariaLabel ? 'img' : undefined}
    aria-label={ariaLabel || undefined}
    aria-hidden={ariaLabel ? undefined : 'true'}
  ></span>
{:else}
  <!-- A span, not a div: a badge sits inside a tab button and a menu row, which take phrasing content. -->
  <span
    class="badge {className}"
    aria-label={ariaLabel || undefined}
    class:default={variant === 'default'}
    class:brand={variant === 'brand'}
    class:component={variant === 'component'}
    class:danger={variant === 'danger'}
    class:success={variant === 'success'}
    class:warning={variant === 'warning'}
    class:invert={variant === 'invert'}
    class:selected={variant === 'selected'}
    class:variable={variant === 'variable'}
    class:variable-selected={variant === 'variable-selected'}
    class:feedback={variant === 'feedback'}
    class:merged={variant === 'merged'}
    class:archived={variant === 'archived'}
    class:menu={variant === 'menu'}
    class:figjam={variant === 'figjam'}
    class:count={variant === 'count'}
    class:count-inactive={variant === 'count-inactive'}
    class:large={size === 'large'}
    class:strong
    class:has-icon={iconName !== null}
  >
    {#if iconName && (variant === 'variable' || variant === 'variable-selected' || variant === 'feedback' || variant === 'merged' || variant === 'archived')}
      <span class="badge-icon">
        <Icon {iconName} color={iconColor} />
      </span>
    {/if}
    <span class="badge-text">
      {#if children}{@render children()}{:else}{text}{/if}
    </span>
  </span>
{/if}

<style>
  .badge {
    display: inline-flex;
    height: var(--size-xsmall); /* 16px */
    align-items: center;
    padding: 0 var(--size-xxxsmall);
    /* Every badge reserves its border, so swapping an outlined variant for a
       filled one can't change the badge's width — a counter that switches on a
       toggle or a tab would otherwise shift the layout by 2px. */
    border: 1px solid transparent;
    border-radius: var(--border-radius-medium); /* 5px */
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
    white-space: nowrap;
    flex-shrink: 0;
    user-select: none;
  }

  .badge.large {
    font-size: var(--body-large-font-size);
    font-weight: var(--body-large-font-weight);
    line-height: var(--size-xsmall);
    letter-spacing: var(--body-large-letter-spacing);
  }

  .badge.has-icon {
    padding-left: 0;
  }

  .badge-icon {
    width: var(--size-xsmall); /* 16px */
    height: var(--size-xsmall); /* 16px */
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .badge-text {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* DEFAULT VARIANT */
  .badge.default {
    background-color: transparent;
    color: var(--figma-color-text);
    border-color: var(--figma-color-border);
  }

  /* Filled gray, as in UI3's "Badge small alt" and "Badge large" defaults */
  .badge.default.strong {
    background-color: var(--figma-color-bg-tertiary);
    border-color: transparent;
  }

  /* COUNT VARIANTS — tab and list counts, from UI3's "Badge small alt": `count`
     is its Count New, `count-inactive` its Count Inactive, and a count with no
     new/read meaning is `default` + `strong` (its filled grey Default). */
  .badge.count {
    background-color: var(--figma-color-bg-selected);
    color: var(--figma-color-text);
  }

  .badge.count-inactive {
    background-color: var(--figma-color-bg-hover);
    color: var(--figma-color-text-secondary);
  }

  /* DOT — a 5px brand dot on a 9px canvas-colored square */
  .badge-dot {
    position: relative;
    display: inline-block;
    flex-shrink: 0;
    width: 9px;
    height: 9px;
    border-radius: var(--border-radius-medium);
    background-color: var(--figma-color-bg);
  }

  .badge-dot::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 5px;
    height: 5px;
    border-radius: 3px;
    background-color: var(--figma-color-bg-brand);
  }

  .badge-dot.danger::after {
    background-color: var(--figma-color-bg-danger);
  }

  .badge-dot.success::after {
    background-color: var(--figma-color-bg-success);
  }

  .badge-dot.warning::after {
    background-color: var(--figma-color-bg-warning);
  }

  /* BRAND VARIANT */
  .badge.brand.strong {
    background-color: var(--figma-color-bg-brand);
    color: var(--figma-color-text-onbrand);
  }

  .badge.brand:not(.strong) {
    background-color: transparent;
    border-color: var(--figma-color-border-brand);
    color: var(--figma-color-text-brand);
  }

  /* COMPONENT VARIANT */
  .badge.component.strong {
    background-color: var(--figma-color-bg-component);
    color: var(--figma-color-text-oncomponent);
  }

  .badge.component:not(.strong) {
    background-color: transparent;
    border-color: var(--figma-color-border-component);
    color: var(--figma-color-text-component);
  }

  /* DANGER VARIANT */
  .badge.danger.strong {
    background-color: var(--figma-color-bg-danger);
    color: var(--figma-color-text-ondanger);
  }

  .badge.danger:not(.strong) {
    background-color: transparent;
    border-color: var(--figma-color-border-danger);
    color: var(--figma-color-text-danger);
  }

  /* SUCCESS VARIANT */
  .badge.success.strong {
    background-color: var(--figma-color-bg-success);
    color: var(--figma-color-text-onsuccess);
  }

  .badge.success:not(.strong) {
    background-color: transparent;
    border-color: var(--figma-color-border-success);
    color: var(--figma-color-text-success);
  }

  /* WARNING VARIANT */
  .badge.warning.strong {
    background-color: var(--figma-color-bg-warning);
    color: var(--figma-color-text-onwarning);
  }

  .badge.warning:not(.strong) {
    background-color: transparent;
    border-color: var(--figma-color-border-warning);
    color: var(--figma-color-text-warning);
  }

  /* INVERT VARIANT */
  .badge.invert.strong {
    background-color: var(--figma-color-bg-inverse);
    color: var(--figma-color-text-oninverse);
  }

  .badge.invert:not(.strong) {
    background-color: transparent;
    border-color: var(--figma-color-border);
    color: var(--figma-color-text);
  }

  /* SELECTED VARIANT */
  .badge.selected {
    background-color: transparent;
    color: var(--figma-color-text-selected);
    border-color: var(--figma-color-border-onselected);
  }

  /* Filled, for a badge sitting on the selected fill itself, where gray reads as
     a foreign chip and an outline as a seam. */
  .badge.selected.strong {
    background-color: var(--figma-color-bg-onselected);
    color: var(--figma-color-text-onselected);
    border-color: transparent;
  }

  /* VARIABLE VARIANT */
  .badge.variable {
    background-color: transparent;
    color: var(--figma-color-text);
    border-color: var(--figma-color-border);
  }

  /* VARIABLE SELECTED VARIANT */
  .badge.variable-selected {
    background-color: transparent;
    color: var(--figma-color-text-selected);
    border-color: var(--figma-color-border-onselected);
  }

  /* FEEDBACK VARIANT */
  .badge.feedback {
    background-color: transparent;
    color: var(--figma-color-text-brand);
    border-color: var(--figma-color-border-brand);
  }

  /* MERGED VARIANT */
  .badge.merged {
    background-color: transparent;
    color: var(--figma-color-text-success);
    border-color: var(--figma-color-border-success);
  }

  /* ARCHIVED VARIANT */
  .badge.archived {
    background-color: transparent;
    color: var(--figma-color-text-tertiary);
    border-color: var(--figma-color-border-disabled);
  }

  /* MENU VARIANT */
  .badge.menu {
    background-color: var(--color-bg-toolbar);
    color: var(--figma-color-text-onbrand);
  }

  /* FIGJAM VARIANT (using component tokens as they're both purple) */
  .badge.figjam.strong {
    background-color: var(--figma-color-bg-component);
    color: var(--figma-color-text-oncomponent);
  }

  .badge.figjam:not(.strong) {
    background-color: transparent;
    border-color: var(--figma-color-border-component);
    color: var(--figma-color-text-component);
  }
</style>
