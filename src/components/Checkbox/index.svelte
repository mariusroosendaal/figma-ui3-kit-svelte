<script>
  import Icon from './../Icon/index.svelte';
  import Icon16Check from './../../icons/16/icon.16.check.svg';
  import Icon16Mixed from './../../icons/16/icon.16.mixed.svg';

  export let checked = false;
  export let value = '';
  export let disabled = false;
  export let tabindex = 0;
  export let mixed = false; // indeterminate state
  export let muted = false; // secondary styling
  export let ghost = false; // dark background variant

  let className = '';
  export { className as class };
  let uniqueId = 'checkbox--' + (Math.random() * 10000000).toFixed(0).toString();

  // Function to determine the correct icon color based on state
  function getIconColor() {
    if (disabled) {
      return '--figma-color-icon-ondisabled';
    } else if (muted) {
      return '--figma-color-icon';
    } else if (ghost) {
      return '--figma-color-icon-onbrand';
    } else {
      return '--figma-color-icon-onbrand';
    }
  }
</script>

<div class="checkbox-container {className}" class:muted class:ghost>
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
  <label for={uniqueId} class="checkbox-label">
    <div class="checkbox-box" class:checked class:mixed class:disabled>
      {#if mixed}
        <Icon iconName={Icon16Mixed} color={getIconColor()} />
      {:else if checked}
        <Icon iconName={Icon16Check} color={getIconColor()} />
      {/if}
    </div>
    <span class="checkbox-text">
      <slot />
    </span>
  </label>
</div>

<style>
  /* Container */
  .checkbox-container {
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
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--size-xxsmall); /* 8px gap */
    cursor: pointer;
    user-select: none;
  }

  /* Checkbox box */
  .checkbox-box {
    width: var(--size-xsmall); /* 16px */
    height: var(--size-xsmall); /* 16px */
    border-radius: var(--border-radius-medium); /* 5px */
    border: 1px solid var(--figma-color-border);
    background-color: var(--figma-color-bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* Checkbox text */
  .checkbox-text {
    color: var(--figma-color-text);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
  }

  /* Checked state */
  .checkbox-box.checked {
    background-color: var(--figma-color-bg-brand);
    border-color: var(--figma-color-bg-brand-hover);
  }

  .checkbox-box.checked :global(.icon-component) {
    color: var(--figma-color-icon-onbrand);
  }

  /* Mixed state */
  .checkbox-box.mixed {
    background-color: var(--figma-color-bg-brand);
    border-color: var(--figma-color-bg-brand-hover);
  }

  .checkbox-box.mixed :global(.icon-component) {
    color: var(--figma-color-icon-onbrand);
  }

  /* Disabled state */
  .checkbox-box.disabled {
    background-color: var(--figma-color-bg-disabled);
    border-color: var(--figma-color-border-disabled);
  }

  .checkbox-box.disabled :global(.icon-component) {
    color: var(--figma-color-icon-ondisabled);
  }

  .checkbox-container:has(input:disabled) .checkbox-text {
    color: var(--figma-color-text-disabled);
  }

  /* Focus state */
  input:enabled:focus + .checkbox-label .checkbox-box {
    border-color: var(--figma-color-bg-brand-hover);
    box-shadow: 0 0 0 1px inset var(--figma-color-bg);
  }

  /* Muted variant */
  .checkbox-container.muted .checkbox-box {
    background-color: var(--figma-color-bg-secondary);
    border-color: var(--figma-color-border);
  }

  .checkbox-container.muted .checkbox-box.checked {
    background-color: var(--figma-color-bg-secondary);
    border-color: var(--figma-color-border);
  }

  .checkbox-container.muted .checkbox-box.checked :global(.icon-component) {
    color: var(--figma-color-icon);
  }

  .checkbox-container.muted .checkbox-box.mixed {
    background-color: var(--figma-color-bg-secondary);
    border-color: var(--figma-color-border);
  }

  .checkbox-container.muted .checkbox-box.mixed :global(.icon-component) {
    color: var(--figma-color-icon);
  }

  /* Ghost variant */
  .checkbox-container.ghost .checkbox-box {
    background-color: var(--figma-color-bg-inverse);
    border-color: transparent;
  }

  .checkbox-container.ghost .checkbox-box.checked {
    background-color: var(--figma-color-bg-inverse);
    border-color: var(--figma-color-bg-brand-hover);
  }

  .checkbox-container.ghost .checkbox-box.checked :global(.icon-component) {
    color: var(--figma-color-icon-onbrand);
  }

  .checkbox-container.ghost .checkbox-box.mixed {
    background-color: var(--figma-color-bg-inverse);
    border-color: var(--figma-color-bg-brand-hover);
  }

  .checkbox-container.ghost .checkbox-box.mixed :global(.icon-component) {
    color: var(--figma-color-icon-onbrand);
  }

  /* Focus for ghost variant */
  .checkbox-container.ghost input:enabled:focus + .checkbox-label .checkbox-box {
    border-color: var(--figma-color-bg-brand-hover);
    box-shadow: 0 0 0 1px inset var(--figma-color-bg);
  }
</style>
