<script>
  import Icon from './../Icon/index.svelte';
  import Icon16Mixed from './../../icons/16/icon.16.mixed.svg';

  export let checked = false;
  export let value = '';
  export let disabled = false;
  export let tabindex = 0;
  export let mixed = false; // indeterminate state

  let className = '';
  export { className as class };
  let uniqueId = 'switch--' + (Math.random() * 10000000).toFixed(0).toString();
</script>

<div class="switch-container {className}">
  <input
    type="checkbox"
    id={uniqueId}
    bind:checked
    bind:value
    {disabled}
    {tabindex}
    onclick="this.blur();"
    on:change
    on:focus
    on:blur
  />
  <label for={uniqueId} class="switch-label">
    <div class="switch-track" class:checked class:mixed class:disabled>
      {#if mixed}
        <Icon iconName={Icon16Mixed} color="--figma-color-icon-onbrand" />
      {:else}
        <div class="switch-knob" class:checked></div>
      {/if}
    </div>
    <span class="switch-text">
      <slot />
    </span>
  </label>
</div>

<style>
  /* Container */
  .switch-container {
    display: flex;
    align-items: center;
    gap: var(--size-xxsmall); /* 8px gap */
    cursor: default;
    padding: var(--size-xxxsmall) 0; /* 4px top/bottom padding */
  }

  /* Hidden input */
  input {
    opacity: 0;
    position: absolute;
    width: 0;
    height: 0;
    margin: 0;
    padding: 0;
  }

  /* Label */
  .switch-label {
    display: flex;
    align-items: center;
    gap: var(--size-xxsmall); /* 8px gap */
    cursor: pointer;
    user-select: none;
  }

  /* Switch track */
  .switch-track {
    width: 32px; /* 32px width */
    height: 16px; /* 16px height */
    border-radius: 13px; /* 13px border radius */
    background-color: var(--figma-color-bg-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
  }

  /* Switch knob */
  .switch-knob {
    width: 14px; /* 14px knob */
    height: 14px; /* 14px knob */
    border-radius: 13px; /* 13px border radius */
    background-color: var(--figma-color-icon-onbrand);
    position: absolute;
    left: 1px; /* 1px from left when unchecked */
  }

  /* Switch text */
  .switch-text {
    color: var(--figma-color-text);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
  }

  /* Checked state */
  .switch-track.checked {
    background-color: var(--figma-color-bg-brand);
  }

  .switch-knob.checked {
    left: 17px; /* 17px from left when checked (32px - 14px - 1px) */
  }

  /* Mixed state */
  .switch-track.mixed {
    background-color: var(--figma-color-bg-brand);
  }

  /* Disabled state */
  .switch-track.disabled {
    background-color: var(--figma-color-bg-disabled);
  }

  .switch-container:has(input:disabled) .switch-text {
    color: var(--figma-color-text-disabled);
  }

  /* Focus state */
  input:enabled:focus + .switch-label .switch-track {
    border: 1px solid var(--figma-color-border-selected);
    box-shadow: 0 0 0 1px inset var(--white);
  }

  /* Focus state - adjust knob size */
  input:enabled:focus + .switch-label .switch-knob {
    width: 14px; /* 13px knob when focused */
    height: 14px; /* 13px knob when focused */
    left: 0;
  }

  /* Adjust knob position when focused and checked */
  input:enabled:focus + .switch-label .switch-knob.checked {
    left: 16px; /* 18px from left when checked and focused (32px - 13px - 1px) */
  }
</style>
