<!--
  ToggleButton: the text counterpart of IconToggle's dialog toggle — one label
  that sits on the selected (blue) fill while it is on, for a filter or a panel
  the plugin keeps open.

  Takes an optional lead icon and a trailing Badge, e.g. how many items the
  filter matches. Text and icon keep their default colour on the fill, as UI3's
  On state does; the badge is filled rather than outlined — the quiet count an
  unselected tab carries, and the on-selected fill while pressed, so it still
  reads on the blue.

  `pressed` binds; `change` hands back the new state.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from '../Icon/index.svelte';
  import Badge from '../Badge/index.svelte';

  export let pressed = false;
  /** Button text; falls back to slot content */
  export let label = '';
  /** @type {string | null} lead icon */
  export let iconName = null;
  /** Badge after the label; the kit Badge's `text` */
  export let badge = '';
  /** the kit Badge's `variant`; `default` follows the pressed state */
  export let badgeVariant = 'default';
  /** @type {'default' | 'secondary'} `secondary` carries a resting border */
  export let variant = 'default';
  /** @type {'default' | 'large'} 24px or 32px tall, as Button */
  export let size = 'default';
  export let disabled = false;
  /** Only needed when the label does not name the action */
  export let ariaLabel = '';
  export let tabindex = 0;

  let className = '';
  export { className as class };
  /** @type {HTMLButtonElement|undefined} */
  let buttonElement = undefined;
  export { buttonElement as element };

  const dispatch = createEventDispatcher();

  $: iconColor = disabled ? '--figma-color-icon-disabled' : '--figma-color-icon';
  // The same pair Tabs draws on: the quiet "Count Inactive" while the button
  // rests, and a fill from the on-selected tokens while it is pressed, which
  // Badge has no variant for until `strong`. Disabled keeps the quiet one, since
  // the button drops to the disabled fill.
  $: resolvedBadgeVariant =
    badgeVariant === 'default'
      ? pressed && !disabled
        ? 'selected'
        : 'count-inactive'
      : badgeVariant;
  // The filled badge family: no outline against the button.
  $: badgeStrong = ['default', 'selected', 'invert'].includes(resolvedBadgeVariant);

  function toggle() {
    if (disabled) return;
    pressed = !pressed;
    dispatch('change', pressed);
  }
</script>

<button
  bind:this={buttonElement}
  type="button"
  class="toggle-button {variant} {className}"
  class:pressed
  class:large={size === 'large'}
  class:has-icon={iconName}
  aria-pressed={pressed}
  aria-label={ariaLabel || undefined}
  {disabled}
  {tabindex}
  on:click={toggle}
  on:click
  on:focus
  on:blur
>
  {#if iconName}
    <span class="icon"><Icon {iconName} color={iconColor} /></span>
  {/if}

  <span class="label"><slot>{label}</slot></span>

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
    padding: 0 var(--size-xsmall); /* 12px */
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
     own colour — UI3 changes only the fill. */
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
