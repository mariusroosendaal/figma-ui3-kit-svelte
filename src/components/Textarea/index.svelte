<script>
  export let id = null;
  export let value = null;
  export let rows = 2;
  export let name = null;
  export let disabled = false;
  export let placeholder = 'Input something here...';
  export let invalid = false;
  export let errorMessage = 'Error message';

  let className = '';
  export { className as class };
</script>

<div class="textarea {className}">
  <textarea
    on:input
    on:change
    on:keydown
    on:focus
    on:blur
    bind:value
    {id}
    {name}
    {rows}
    {disabled}
    {placeholder}
    class:invalid
  ></textarea>
  {#if invalid}
    <div class="error">
      {errorMessage}
    </div>
  {/if}
</div>

<style>
  .textarea {
    position: relative;
  }

  textarea {
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    position: relative;
    display: block;
    width: 100%;
    min-height: 48px; /* 3 lines minimum (16px * 3) */
    margin: 1px 0 1px 0;
    padding: var(--size-xxsmall); /* 8px all around */
    color: var(--figma-color-text);
    border: 1px solid var(--figma-color-border);
    border-radius: var(--border-radius-medium); /* 5px */
    outline: none;
    background-color: var(--figma-color-bg);
    resize: vertical; /* Allow vertical resize only */
    overflow-y: auto;
    font-family: var(--font-stack);
  }
  textarea:hover,
  textarea:placeholder-shown:hover {
    color: var(--figma-color-text-hover);
    border: 1px solid var(--figma-color-border);
    background-image: none;
  }
  textarea::selection {
    color: var(--figma-color-text);
    background-color: var(--text-highlight);
  }
  textarea::placeholder {
    color: var(--figma-color-text-tertiary);
    border: 1px solid transparent;
  }
  textarea:placeholder-shown {
    color: var(--figma-color-text);
    border: 1px solid var(--figma-color-border);
    background-image: none;
  }
  textarea:focus:placeholder-shown {
    border: 1px solid var(--figma-color-border-selected);
    /* box-shadow: 0 0 0 2px inset var(--figma-color-bg); */
  }

  textarea:active,
  textarea:focus {
    color: var(--figma-color-text);
    border: 1px solid var(--figma-color-border-selected);
    /* box-shadow: 0 0 0 2px inset var(--figma-color-bg); */
  }
  textarea:disabled {
    position: relative;
    color: var(--figma-color-text-disabled);
    background-image: none;
  }
  textarea:disabled:active {
    outline: none;
    border: 1px solid var(--figma-color-border);
  }

  .invalid,
  .invalid:hover,
  .invalid:focus {
    border: 1px solid var(--figma-color-border-danger-strong);
    outline: none;
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
