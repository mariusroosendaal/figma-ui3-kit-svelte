<script>
  import Icon from './../Icon/index.svelte';
  import { createEventDispatcher } from 'svelte';

  export let variant = 'primary'; // primary, secondary, destructive, secondary-destructive, inverse, success, figjam, link, link-danger, ghost
  export let size = 'default'; // default, large, wide
  export let disabled = false;
  export let ariaDisabled = false;
  export let iconName = null; // Icon component to display
  export let iconLead = 'left'; // left, center - Only applies to wide variant
  export let label = ''; // Button label text (falls back to slot content if provided)
  export let ariaLabel = '';
  /** @type {'button' | 'submit' | 'reset'} */
  export let type = 'button';

  let className = '';
  export { className as class };
  /** @type {HTMLButtonElement|undefined} */
  let buttonElement = undefined;
  const dispatch = createEventDispatcher();

  // Export the button element for external binding (optional - use bind:element if needed)
  export { buttonElement as element };

  function handleClick(event) {
    if (!disabled && !ariaDisabled) {
      dispatch('click', event);
    }
  }

  // Variants UI3 fills with bg-disabled when disabled; the rest stay transparent
  const filledVariants = ['primary', 'destructive', 'inverse', 'success', 'figjam'];

  // Function to determine the correct icon color based on variant and state
  function getIconColor(disabled, ariaDisabled, variant) {
    if (disabled || ariaDisabled) {
      // White on the grey fill; on a transparent button white would vanish
      return filledVariants.includes(variant)
        ? '--figma-color-icon-ondisabled'
        : '--figma-color-icon-disabled';
    }

    switch (variant) {
      case 'primary':
      case 'success':
        return '--figma-color-icon-onbrand';
      case 'inverse':
        return '--figma-color-icon-oninverse';
      case 'figjam':
        return '--figma-color-icon-oncomponent';
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
  // A $: statement, so the color follows its inputs; a call in the markup would not re-run.
  $: iconColor = getIconColor(disabled, ariaDisabled, variant);
</script>

<button
  bind:this={buttonElement}
  on:click={handleClick}
  on:submit|preventDefault
  on:blur
  on:focus
  {type}
  {disabled}
  aria-disabled={ariaDisabled || undefined}
  aria-label={ariaLabel || undefined}
  class="button {variant} {size} {className}"
  class:has-icon={iconName}
  class:wide-icon-left={iconName && iconLead === 'left' && size === 'wide'}
  class:wide-icon-center={iconName && iconLead === 'center' && size === 'wide'}
  class:default-icon-left={iconName && iconLead === 'left' && size !== 'wide'}
  class:default-icon-center={iconName && iconLead === 'center' && size !== 'wide'}
>
  {#if iconName && iconLead === 'left'}
    <div class="button-icon-left">
      <Icon {iconName} color={iconColor} />
    </div>
  {/if}

  {#if iconName && iconLead === 'center'}
    <div class="button-icon-center">
      <Icon {iconName} color={iconColor} />
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
    padding: var(--size-xxxsmall) 12px; /* UI3's large button; no 12px token */
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

  .button.primary:active:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--figma-color-bg-brand-pressed);
  }

  .button.primary:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
    box-shadow: 0 0 0 1px inset var(--figma-color-bg);
  }

  .button.primary:disabled,
  .button.primary[aria-disabled='true'] {
    background-color: var(--figma-color-bg-disabled);
    color: var(--figma-color-text-ondisabled);
  }

  /* SECONDARY VARIANT */
  .button.secondary {
    background-color: transparent;
    border: 1px solid var(--color-border-transparent); /* UI3's bordertranslucent */
    color: var(--figma-color-text);
  }

  .button.secondary:active:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--figma-color-bg-pressed);
  }

  .button.secondary:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }

  .button.secondary:disabled,
  .button.secondary[aria-disabled='true'] {
    border-color: var(--figma-color-border-disabled);
    color: var(--figma-color-text-disabled);
  }

  /* DESTRUCTIVE VARIANT */
  .button.destructive {
    background-color: var(--figma-color-bg-danger);
    color: var(--figma-color-text-onbrand);
  }

  .button.destructive:active:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--figma-color-bg-danger-pressed);
  }

  .button.destructive:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
    box-shadow: 0 0 0 1px inset var(--figma-color-bg);
  }

  .button.destructive:disabled,
  .button.destructive[aria-disabled='true'] {
    background-color: var(--figma-color-bg-disabled);
    color: var(--figma-color-text-ondisabled);
  }

  /* SECONDARY DESTRUCTIVE VARIANT */
  .button.secondary-destructive {
    background-color: transparent;
    border: 1px solid var(--figma-color-border-danger);
    color: var(--figma-color-text-danger);
  }

  .button.secondary-destructive:active:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--figma-color-bg-pressed);
  }

  .button.secondary-destructive:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }

  .button.secondary-destructive:disabled,
  .button.secondary-destructive[aria-disabled='true'] {
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

  .button.inverse:disabled,
  .button.inverse[aria-disabled='true'] {
    background-color: var(--figma-color-bg-disabled);
    color: var(--figma-color-text-ondisabled);
  }

  /* SUCCESS VARIANT */
  .button.success {
    background-color: var(--figma-color-bg-success);
    color: var(--figma-color-text-onbrand);
  }

  .button.success:active:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--figma-color-bg-success-pressed);
  }

  .button.success:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
    box-shadow: 0 0 0 1px inset var(--figma-color-bg);
  }

  .button.success:disabled,
  .button.success[aria-disabled='true'] {
    background-color: var(--figma-color-bg-disabled);
    color: var(--figma-color-text-ondisabled);
  }

  /* FIGJAM VARIANT — UI3's bg-figjam and its pressed shade share the component
     purple's values in both themes, so it borrows those tokens */
  .button.figjam {
    background-color: var(--figma-color-bg-component);
    color: var(--figma-color-text-oncomponent);
  }

  .button.figjam:active:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--figma-color-bg-component-pressed);
  }

  .button.figjam:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
    box-shadow: 0 0 0 1px inset var(--figma-color-bg);
  }

  .button.figjam:disabled,
  .button.figjam[aria-disabled='true'] {
    background-color: var(--figma-color-bg-disabled);
    color: var(--figma-color-text-ondisabled);
  }

  /* LINK VARIANT */
  .button.link {
    background-color: transparent;
    color: var(--figma-color-text-brand);
  }

  .button.link:active:not(:disabled):not([aria-disabled='true']) {
    background: var(--figma-color-bg-brand-tertiary);
  }

  .button.link:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }

  .button.link:disabled,
  .button.link[aria-disabled='true'] {
    color: var(--figma-color-text-disabled);
  }

  /* LINK DANGER VARIANT */
  .button.link-danger {
    background-color: transparent;
    color: var(--figma-color-text-danger);
  }

  .button.link-danger:active:not(:disabled):not([aria-disabled='true']) {
    background: var(--figma-color-bg-danger-tertiary);
  }

  .button.link-danger:focus-visible {
    outline: 1px solid var(--figma-color-border-danger);
    outline-offset: -1px;
  }

  .button.link-danger:disabled,
  .button.link-danger[aria-disabled='true'] {
    color: var(--figma-color-text-disabled);
  }

  /* GHOST VARIANT */
  .button.ghost {
    background-color: transparent;
    color: var(--figma-color-text);
  }

  .button.ghost:hover:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--black1);
  }

  .button.ghost:active:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--black15);
  }

  .button.ghost:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }

  .button.ghost:disabled,
  .button.ghost[aria-disabled='true'] {
    color: var(--figma-color-text-disabled);
  }

  /* Remove focus outline for mouse clicks */
  .button:focus:not(:focus-visible) {
    outline: none;
  }

  /* Disabled state overrides */
  .button:disabled,
  .button[aria-disabled='true'] {
    cursor: not-allowed;
  }

</style>
