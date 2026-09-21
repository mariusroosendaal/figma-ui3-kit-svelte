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
  export let ariaLabel = '';
  /** Secondary line under the label, e.g. a side effect of the setting. */
  export let description = '';

  let className = '';
  export { className as class };
  let uniqueId = 'checkbox--' + (Math.random() * 10000000).toFixed(0).toString();
  $: descriptionId = description ? `${uniqueId}-description` : undefined;
  let inputEl;

  $: if (inputEl) inputEl.indeterminate = mixed;

  // Function to determine the correct icon color based on state
  function getIconColor(disabled, muted, ghost) {
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
  // A $: statement, so the color follows its inputs; a call in the markup would not re-run.
  $: iconColor = getIconColor(disabled, muted, ghost);
</script>

<div
  class="checkbox-container {className}"
  class:has-description={description}
  class:muted
  class:ghost
>
  <input
    type="checkbox"
    id={uniqueId}
    bind:this={inputEl}
    bind:checked
    bind:value
    {disabled}
    {tabindex}
    aria-label={ariaLabel || undefined}
    aria-describedby={descriptionId}
    aria-checked={mixed ? 'mixed' : undefined}
    on:change
    on:focus
    on:blur
  />
  <label for={uniqueId} class="checkbox-label">
    <div class="checkbox-box" class:checked class:mixed class:disabled>
      {#if mixed}
        <Icon iconName={Icon16Mixed} color={iconColor} />
      {:else if checked}
        <Icon iconName={Icon16Check} color={iconColor} />
      {/if}
    </div>
    <span class="checkbox-text">
      <slot />
    </span>
  </label>
  {#if description}
    <p class="checkbox-description" id={descriptionId}>{description}</p>
  {/if}
</div>

<style>
  .checkbox-container.has-description {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--size-xxxsmall); /* 4px */
  }

  .checkbox-description {
    margin: 0;
    padding-left: 24px /* box 16 + gap 8 */;
    color: var(--figma-color-text-secondary);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
  }

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
    border-color: var(--figma-color-border-selected-strong);
  }

  .checkbox-box.checked :global(.icon-component) {
    color: var(--figma-color-icon-onbrand);
  }

  /* Mixed state */
  .checkbox-box.mixed {
    background-color: var(--figma-color-bg-brand);
    border-color: var(--figma-color-border-selected-strong);
  }

  .checkbox-box.mixed :global(.icon-component) {
    color: var(--figma-color-icon-onbrand);
  }

  .checkbox-container:has(input:disabled) .checkbox-text {
    color: var(--figma-color-text-disabled);
  }

  /* Focus state — keyboard only */
  input:enabled:focus-visible + .checkbox-label .checkbox-box {
    border-color: var(--figma-color-border-selected-strong);
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

  /* Ghost variant — the static menu fill: it sits in dark menus in both themes */
  .checkbox-container.ghost .checkbox-box {
    background-color: var(--color-bg-menu);
    border-color: transparent;
  }

  .checkbox-container.ghost .checkbox-box.checked {
    background-color: var(--color-bg-menu);
    border-color: transparent;
  }

  .checkbox-container.ghost .checkbox-box.checked :global(.icon-component) {
    color: var(--figma-color-icon-onbrand);
  }

  .checkbox-container.ghost .checkbox-box.mixed {
    background-color: var(--color-bg-menu);
    border-color: transparent;
  }

  .checkbox-container.ghost .checkbox-box.mixed :global(.icon-component) {
    color: var(--figma-color-icon-onbrand);
  }

  /* Focus for ghost variant — keyboard only */
  .checkbox-container.ghost input:enabled:focus-visible + .checkbox-label .checkbox-box {
    border-color: var(--figma-color-border-selected);
    box-shadow: none;
  }

  /* Disabled — last, so it wins over muted and ghost. Unchecked is an empty
     outline; checked and mixed sit on the grey fill. */
  .checkbox-container .checkbox-box.disabled {
    background-color: transparent;
    border-color: var(--figma-color-border-disabled);
  }

  .checkbox-container .checkbox-box.disabled.checked,
  .checkbox-container .checkbox-box.disabled.mixed {
    background-color: var(--figma-color-bg-disabled);
    border-color: transparent;
  }
</style>
