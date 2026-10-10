<!--
  ToggleButton: the text counterpart of IconToggle's dialog toggle — one label
  that sits on the selected (blue) fill while it is on, for a filter or a panel
  the plugin keeps open.

  Takes an optional lead icon and a trailing Badge, e.g. how many items the
  filter matches. Text and icon keep their default color on the fill, as UI3's
  On state does; the badge is filled rather than outlined — the quiet count an
  unselected tab carries, and the on-selected fill while pressed, so it still
  reads on the blue.

  `pressed` binds; `change` hands back the new state.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { FocusEventHandler, MouseEventHandler } from 'svelte/elements';
  import Icon from '../Icon/index.svelte';
  import Badge from '../Badge/index.svelte';

  interface Props {
    pressed?: boolean;
    /** Shown when there are no children */
    label?: string;
    /** Lead icon, SVG icon data */
    iconName?: string | null;
    /** Badge after the label; the kit Badge's `text` */
    badge?: string;
    /** The kit Badge's `variant`; `default` follows the pressed state */
    badgeVariant?: string;
    /** `secondary` carries a resting border */
    variant?: 'default' | 'secondary';
    /** 24px or 32px tall, as Button */
    size?: 'default' | 'large';
    disabled?: boolean;
    /** Only needed when the label does not name the action */
    ariaLabel?: string;
    tabindex?: number;
    class?: string;
    /** The button, for `bind:element` */
    element?: HTMLButtonElement | null;
    children?: Snippet;
    /** The new pressed state */
    onchange?: (pressed: boolean) => void;
    /** After `onchange` */
    onclick?: MouseEventHandler<HTMLButtonElement>;
    onfocus?: FocusEventHandler<HTMLButtonElement>;
    onblur?: FocusEventHandler<HTMLButtonElement>;
  }

  let {
    pressed = $bindable(),
    label = '',
    iconName = null,
    badge = '',
    badgeVariant = 'default',
    variant = 'default',
    size = 'default',
    disabled = false,
    ariaLabel = '',
    tabindex = 0,
    class: className = '',
    element = $bindable(),
    children,
    onchange,
    onclick,
    onfocus,
    onblur,
  }: Props = $props();

  let iconColor = $derived(disabled ? '--figma-color-icon-disabled' : '--figma-color-icon');
  // The same pair Tabs draws on: the quiet "Count Inactive" while the button
  // rests, and a fill from the on-selected tokens while it is pressed, which
  // Badge has no variant for until `strong`. Disabled keeps the quiet one, since
  // the button drops to the disabled fill.
  let resolvedBadgeVariant = $derived(
    badgeVariant === 'default'
      ? pressed && !disabled
        ? 'selected'
        : 'count-inactive'
      : badgeVariant
  );
  // The filled badge family: no outline against the button.
  let badgeStrong = $derived(['default', 'selected', 'invert'].includes(resolvedBadgeVariant));

  function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    if (!disabled) {
      pressed = !pressed;
      onchange?.(pressed);
    }
    onclick?.(event);
  }
</script>

<button
  bind:this={element}
  type="button"
  class="toggle-button {variant} {className}"
  class:pressed
  class:large={size === 'large'}
  class:has-icon={iconName}
  aria-pressed={!!pressed}
  aria-label={ariaLabel || undefined}
  {disabled}
  {tabindex}
  onclick={handleClick}
  {onfocus}
  {onblur}
>
  {#if iconName}
    <span class="icon"><Icon {iconName} color={iconColor} /></span>
  {/if}

  <span class="label"
    >{#if children}{@render children()}{:else}{label}{/if}</span
  >

  {#if badge}
    <span class="badge">
      <Badge variant={resolvedBadgeVariant} strong={badgeStrong} text={badge} />
    </span>
  {/if}
</button>

<style>
  .toggle-button {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: var(--size-small); /* 24px */
    padding: 0 var(--size-xxsmall); /* 8px */
    border: 1px solid transparent;
    border-radius: var(--border-radius-medium); /* 5px */
    background-color: transparent;
    color: var(--figma-color-text);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    user-select: none;
    transition: background-color 0.15s ease;
  }

  .toggle-button.large {
    height: var(--size-medium); /* 32px */
    padding: 0 12px; /* as Button; no 12px token */
  }

  /* The icon sits on its own 24px cell, so the text lines up with Button's */
  .toggle-button.has-icon {
    padding-left: var(--size-xxxsmall); /* 4px */
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size-small); /* 24px */
    height: var(--size-small);
    flex-shrink: 0;
  }

  .label {
    display: flex;
    align-items: center;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .badge {
    display: flex;
    flex: 0 0 auto;
    margin-left: var(--size-xxxsmall); /* 4px */
  }

  .toggle-button.secondary:not(.pressed) {
    border-color: var(--color-border-transparent);
  }

  .toggle-button:hover:not(:disabled) {
    background-color: var(--color-bg-transparent-hover);
  }

  .toggle-button:active:not(:disabled) {
    background-color: var(--color-bg-transparent-pressed);
  }

  /* ON: the selected fill, as IconToggle's dialog toggle. The label keeps its
     own color — UI3 changes only the fill. */
  .toggle-button.pressed {
    background-color: var(--figma-color-bg-selected);
  }

  .toggle-button.pressed:hover:not(:disabled) {
    background-color: var(--figma-color-bg-selected-secondary);
  }

  .toggle-button.pressed:active:not(:disabled) {
    background-color: var(--figma-color-bg-selected);
  }

  .toggle-button:focus-visible {
    border-color: var(--figma-color-border-selected);
  }

  .toggle-button:disabled {
    color: var(--figma-color-text-disabled);
    cursor: not-allowed;
  }

  .toggle-button.pressed:disabled {
    background-color: var(--figma-color-bg-disabled);
  }

  /* The Badge has no disabled look of its own. */
  .toggle-button:disabled .badge {
    opacity: 0.4;
  }

  .toggle-button :global(.icon-component) {
    cursor: inherit;
  }
</style>
