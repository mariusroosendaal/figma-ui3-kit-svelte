<script>
  import Icon from './../Icon/index.svelte';

  export let id = null;
  export let value = null;
  export let name = null;
  export let disabled = false;
  export let iconName = null;
  export let invalid = false;
  export let errorMessage = 'Error message';
  export let placeholder = 'Input something here...';
  export let size = 'default'; // 'default' (24px) or 'large' (32px)

  let className = '';
  export { className as class };
</script>

{#if iconName}
  <div class="input {className}">
    <div class="icon">
      <Icon {iconName} color="--figma-color-icon" />
    </div>
    <input
      type="input"
      on:input
      on:change
      on:keydown
      on:focus
      on:blur
      bind:value
      {id}
      {name}
      {disabled}
      {placeholder}
      class="indent"
      class:invalid
      class:large={size === 'large'}
    />
    {#if invalid}
      <div class="error">
        {errorMessage}
      </div>
    {/if}
  </div>
{:else}
  <div class="input {className}">
    <input
      type="input"
      on:input
      on:change
      on:keydown
      on:focus
      on:blur
      bind:value
      {id}
      {name}
      {disabled}
      {placeholder}
      class:invalid
      class:large={size === 'large'}
    />
    {#if invalid}
      <div class="error">
        {errorMessage}
      </div>
    {/if}
  </div>
{/if}

<style>
  .input {
    position: relative;
    transition: flex 0s 0.2s;
  }

  input {
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    position: relative;
    display: flex;
    overflow: visible;
    align-items: center;
    width: 100%;
    height: var(--size-small); /* 24px default */
    padding: 0 var(--size-xxsmall); /* 8px all around */
    color: var(--figma-color-text);
    border: 1px solid transparent;
    border-radius: var(--border-radius-medium); /* 5px */
    outline: none;
    background-color: var(--figma-color-bg-secondary);
  }

  /* Large size variant */
  input.large {
    height: var(--size-medium); /* 32px */
  }
  input:hover,
  input:placeholder-shown:hover {
    color: var(--figma-color-text-hover);
    border: 1px solid var(--figma-color-border);
    background-image: none;
  }
  input::selection {
    color: var(--figma-color-text);
    background-color: var(--text-highlight);
  }
  input::placeholder {
    color: var(--figma-color-text-tertiary);
    border: 1px solid transparent;
  }
  input:placeholder-shown {
    color: var(--figma-color-text);
    border: 1px solid transparent;
    background-image: none;
  }
  input:focus:placeholder-shown {
    border: 1px solid var(--figma-color-border-selected);
  }
  input:disabled:hover {
    border: 1px solid transparent;
  }
  input:active,
  input:focus {
    color: var(--figma-color-text);
    border: 1px solid var(--figma-color-border-selected);
  }
  input:disabled {
    position: relative;
    color: var(--figma-color-text-disabled);
    background-image: none;
  }
  input:disabled:active {
    outline: none;
  }

  .indent {
    padding-left: var(--size-small); /* 24px - matches icon container size */
  }

  /* Large input with icon - adjust padding for 4px icon offset */
  input.large.indent {
    padding-left: calc(var(--size-small) + var(--size-xxxsmall)); /* 24px + 4px = 28px */
  }

  .invalid,
  .invalid:hover,
  .invalid:focus {
    border: 1px solid var(--figma-color-border-danger-strong);
    outline: none;
  }

  .icon {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: var(--size-small); /* 24px icon container */
    height: var(--size-small); /* 24px icon container */
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Large input icon positioning */
  .input:has(input.large) .icon {
    left: var(--size-xxxsmall); /* 4px from left for large inputs */
  }

  .error {
    color: var(--figma-color-text-danger);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    padding-top: var(--size-xxxsmall);
    padding-bottom: var(--size-xxsmall);
  }
</style>
