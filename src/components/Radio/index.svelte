<script>
  export let group = null;
  export let value = null;
  export let disabled = false;
  export let tabindex = 0;

  let className = '';
  export { className as class };
  let uniqueId = 'radio--' + (Math.random() * 10000000).toFixed(0).toString();
  $: checked = group === value;
</script>

<div class="radio-container {className}">
  <input
    type="radio"
    {value}
    {checked}
    {disabled}
    {tabindex}
    id={uniqueId}
    bind:group
    onclick="this.blur();"
    on:change
    on:focus
    on:blur
  />
  <label for={uniqueId} class="radio-label">
    <div class="radio-button" class:checked class:disabled>
      {#if checked}
        <div class="radio-dot"></div>
      {/if}
    </div>
    <span class="radio-text">
      <slot />
    </span>
  </label>
</div>

<style>
  /* Container */
  .radio-container {
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
  .radio-label {
    display: flex;
    align-items: center;
    gap: var(--size-xxsmall); /* 8px gap */
    cursor: pointer;
    user-select: none;
  }

  /* Radio button */
  .radio-button {
    width: var(--size-xsmall); /* 16px */
    height: var(--size-xsmall); /* 16px */
    border-radius: 50%; /* Perfect circle */
    border: 1px solid var(--figma-color-icon);
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* Radio dot */
  .radio-dot {
    width: var(--size-xxsmall); /* 8px */
    height: var(--size-xxsmall); /* 8px */
    border-radius: 50%;
    background-color: var(--figma-color-icon);
  }

  /* Radio text */
  .radio-text {
    color: var(--figma-color-text);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
  }

  /* Checked state */
  .radio-button.checked {
    border-color: var(--figma-color-icon);
  }

  /* Disabled state */
  .radio-button.disabled {
    background-color: var(--figma-color-bg-disabled);
    border-color: var(--figma-color-border-disabled);
  }

  .radio-button.disabled .radio-dot {
    background-color: var(--figma-color-icon-ondisabled);
  }

  .radio-container:has(input:disabled) .radio-text {
    color: var(--figma-color-text-disabled);
  }

  /* Focus state */
  input:enabled:focus + .radio-label .radio-button {
    border-color: var(--figma-color-bg-brand-hover);
  }
</style>
