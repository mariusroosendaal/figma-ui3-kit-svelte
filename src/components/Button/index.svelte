<script>
  import Icon from './../Icon/index.svelte';
  import { createEventDispatcher } from 'svelte';

  export let variant = 'primary'; // primary, secondary, destructive, secondary-destructive, inverse, success, link, link-danger, ghost
  export let size = 'default'; // default, large, wide
  export let disabled = false;
  export let iconName = null; // Icon component to display
  export let iconLead = 'left'; // left, center - Only applies to wide variant
  export let label = ''; // Button label text (falls back to slot content if provided)

  let className = '';
  export { className as class };
  let buttonElement;
  const dispatch = createEventDispatcher();

  // Export the button element for external binding
  export { buttonElement as element };

  function handleClick(event) {
    if (!disabled) {
      dispatch('click', event);
    }
  }

  // Function to determine the correct icon color based on variant and state
  function getIconColor() {
    if (disabled) {
      return '--figma-color-icon-ondisabled';
    }

    switch (variant) {
      case 'primary':
      case 'success':
        return '--figma-color-icon-onbrand';
      case 'inverse':
        return '--figma-color-icon-oninverse';
      case 'destructive':
        return '--figma-color-icon-onbrand';
      case 'link-danger':
      case 'secondary-destructive':
        return '--figma-color-icon-danger';
      case 'secondary':
      case 'ghost':
        return '--figma-color-icon';
      case 'link':
        return '--figma-color-icon-brand';
      default:
        return '--figma-color-icon';
    }
  }
</script>

<button
  bind:this={buttonElement}
  on:click={handleClick}
  on:submit|preventDefault
  on:blur
  on:focus
  {disabled}
  class="button {variant} {size} {className}"
  class:has-icon={iconName}
  class:wide-icon-left={iconName && iconLead === 'left' && size === 'wide'}
  class:wide-icon-center={iconName && iconLead === 'center' && size === 'wide'}
  class:default-icon-left={iconName && iconLead === 'left' && size !== 'wide'}
  class:default-icon-center={iconName && iconLead === 'center' && size !== 'wide'}
>
  {#if iconName && iconLead === 'left'}
    <div class="button-icon-left">
      <Icon {iconName} color={getIconColor()} />
    </div>
  {/if}

  {#if iconName && iconLead === 'center'}
    <div class="button-icon-center">
      <Icon {iconName} color={getIconColor()} />
    </div>
  {/if}

  <span class="button-text">
    <slot>{label}</slot>
  </span>
</button>

<style>
  /* Base button styles */
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-medium); /* 5px */
    border: 1px solid transparent;
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
    text-decoration: none;
    outline: none;
    user-select: none;
    cursor: pointer;
    position: relative;
    white-space: nowrap;
  }

  /* Size variants */
  .button.default {
    height: var(--size-small); /* 24px */
    padding: var(--size-xxxsmall) var(--size-xxsmall); /* 4px vertical, 8px horizontal */
  }

  .button.large {
    height: var(--size-medium); /* 32px */
    padding: var(--size-xxxsmall) var(--size-xsmall); /* 4px vertical, 12px horizontal */
  }

  .button.wide {
    height: var(--size-small); /* 24px */
    padding: var(--size-xxxsmall) var(--size-xxsmall); /* 4px vertical, 8px horizontal */
    width: 100%;
  }

  /* Wide variant with icon left: icon on left, text centered */
  .button.wide.wide-icon-left {
    justify-content: flex-start;
    padding-left: 0; /* 8px left padding */
    position: relative;
  }

  .button.wide.wide-icon-left .button-text {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    justify-content: center;
  }

  /* Wide variant with icon center: icon and text together centered */
  .button.wide.wide-icon-center {
    justify-content: center;
  }

  .button.wide.wide-icon-center .button-icon-center {
    margin-right: var(--size-xxxsmall); /* 4px gap between icon and text */
  }

  /* Icon positioning - for non-wide variants */
  .button.default-icon-left .button-icon-left,
  .button.large.default-icon-left .button-icon-left {
    width: var(--size-small); /* 24px */
    height: var(--size-small); /* 24px */
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0; /* No gap - text sits against icon */
  }

  .button.default-icon-center .button-icon-center,
  .button.large.default-icon-center .button-icon-center {
    width: var(--size-small); /* 24px */
    height: var(--size-small); /* 24px */
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0; /* No gap - text sits against icon */
  }

  /* Icon positioning - for wide variant */
  .button.wide .button-icon-left {
    width: var(--size-small); /* 24px */
    height: var(--size-small); /* 24px */
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

  .button.wide .button-icon-center {
    width: var(--size-small); /* 24px */
    height: var(--size-small); /* 24px */
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button-text {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Adjust padding when icon is present - non-wide variants */
  .button.default-icon-left:not(.wide),
  .button.large.default-icon-left {
    padding: var(--size-xxxsmall) var(--size-xxsmall) var(--size-xxxsmall) var(--size-xxxsmall); /* 4px vertical, 8px right, 4px left */
  }

  .button.default-icon-center:not(.wide),
  .button.large.default-icon-center {
    padding: var(--size-xxxsmall) var(--size-xxsmall) var(--size-xxxsmall) var(--size-xxxsmall); /* 4px vertical, 8px right, 4px left */
  }

  /* PRIMARY VARIANT */
  .button.primary {
    background-color: var(--figma-color-bg-brand);
    color: var(--figma-color-text-onbrand);
  }

  .button.primary:active:not(:disabled) {
    background-color: var(--figma-color-bg-brand-pressed);
  }

  .button.primary:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
    box-shadow: 0 0 0 1px inset var(--figma-color-bg);
  }

  .button.primary:disabled {
    background-color: var(--figma-color-bg-disabled);
    color: var(--figma-color-text-disabled);
  }

  /* SECONDARY VARIANT */
  .button.secondary {
    background-color: transparent;
    border: 1px solid var(--figma-color-border);
    color: var(--figma-color-text);
  }

  .button.secondary:active:not(:disabled) {
    background-color: var(--figma-color-bg-pressed);
  }

  .button.secondary:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }

  .button.secondary:disabled {
    border-color: var(--figma-color-border-disabled);
    color: var(--figma-color-text-disabled);
  }

  /* DESTRUCTIVE VARIANT */
  .button.destructive {
    background-color: var(--figma-color-bg-danger);
    color: var(--figma-color-text-onbrand);
  }

  .button.destructive:active:not(:disabled) {
    background-color: var(--figma-color-bg-danger-pressed);
  }

  .button.destructive:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
    box-shadow: 0 0 0 1px inset var(--figma-color-bg);
  }

  .button.destructive:disabled {
    background-color: var(--figma-color-bg-disabled);
    color: var(--figma-color-text-disabled);
  }

  /* SECONDARY DESTRUCTIVE VARIANT */
  .button.secondary-destructive {
    background-color: transparent;
    border: 1px solid var(--figma-color-border-danger);
    color: var(--figma-color-text-danger);
  }

  .button.secondary-destructive:active:not(:disabled) {
    background-color: var(--figma-color-bg-pressed);
  }

  .button.secondary-destructive:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }

  .button.secondary-destructive:disabled {
    border-color: var(--figma-color-border-disabled);
    color: var(--figma-color-text-disabled);
  }

  /* INVERSE VARIANT */
  .button.inverse {
    background-color: var(--figma-color-bg-inverse);
    color: var(--figma-color-text-oninverse);
  }

  .button.inverse:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
    box-shadow: 0 0 0 1px inset var(--figma-color-bg);
  }

  .button.inverse:disabled {
    background-color: var(--figma-color-bg-disabled);
    color: var(--figma-color-text-disabled);
  }

  /* SUCCESS VARIANT */
  .button.success {
    background-color: var(--figma-color-bg-success);
    color: var(--figma-color-text-onbrand);
  }

  .button.success:active:not(:disabled) {
    background-color: var(--figma-color-bg-success-pressed);
  }

  .button.success:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
    box-shadow: 0 0 0 1px inset var(--figma-color-bg);
  }

  .button.success:disabled {
    background-color: var(--figma-color-bg-disabled);
    color: var(--figma-color-text-disabled);
  }

  /* LINK VARIANT */
  .button.link {
    background-color: transparent;
    color: var(--figma-color-text-brand);
  }

  .button.link:active:not(:disabled) {
    background: var(--figma-color-bg-brand-tertiary);
  }

  .button.link:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }

  .button.link:disabled {
    color: var(--figma-color-text-disabled);
  }

  /* LINK DANGER VARIANT */
  .button.link-danger {
    background-color: transparent;
    color: var(--figma-color-text-danger);
  }

  .button.link-danger:active:not(:disabled) {
    background: var(--figma-color-bg-danger-tertiary);
  }

  .button.link-danger:focus-visible {
    outline: 1px solid var(--figma-color-border-danger);
    outline-offset: -1px;
  }

  .button.link-danger:disabled {
    color: var(--figma-color-text-disabled);
  }

  /* GHOST VARIANT */
  .button.ghost {
    background-color: transparent;
    color: var(--figma-color-text);
  }

  .button.ghost:hover:not(:disabled) {
    background-color: var(--black1);
  }

  .button.ghost:active:not(:disabled) {
    background-color: var(--black15);
  }

  .button.ghost:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }

  .button.ghost:disabled {
    color: var(--figma-color-text-disabled);
  }

  /* Remove focus outline for mouse clicks */
  .button:focus:not(:focus-visible) {
    outline: none;
  }

  /* Disabled state overrides */
  .button:disabled {
    cursor: not-allowed;
  }

  .button:disabled .button-icon-left :global(.icon-component),
  .button:disabled .button-icon-center :global(.icon-component) {
    color: var(--figma-color-icon-ondisabled);
  }
</style>
