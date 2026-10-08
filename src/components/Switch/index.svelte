<script>
  import Icon from './../Icon/index.svelte';
  import Icon16Mixed from './../../icons/16/icon.16.mixed.svg';

  export let checked = false;
  export let value = '';
  export let disabled = false;
  export let tabindex = 0;
  export let mixed = false; // indeterminate state
  export let ariaLabel = '';
  /** Secondary line under the label, e.g. a side effect of the setting. */
  export let description = '';

  let className = '';
  export { className as class };
  let uniqueId = 'switch--' + (Math.random() * 10000000).toFixed(0).toString();
  $: descriptionId = description ? `${uniqueId}-description` : undefined;

  function handleClick(e) {
    if (/** @type {any} */ (e).pointerType === 'mouse') e.currentTarget.blur();
  }
</script>

<div class="switch-container {className}" class:has-description={description}>
  <input
    type="checkbox"
    id={uniqueId}
    bind:checked
    bind:value
    {disabled}
    {tabindex}
    role={mixed ? undefined : 'switch'}
    aria-label={ariaLabel || undefined}
    aria-describedby={descriptionId}
    aria-checked={mixed ? 'mixed' : checked}
    on:click={handleClick}
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
  {#if description}
    <p class="switch-description" id={descriptionId}>{description}</p>
  {/if}
</div>

<style>
  .switch-container.has-description {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--size-xxxsmall); /* 4px */
  }

  .switch-description {
    margin: 0;
    padding-left: 40px /* track 32 + gap 8 */;
    color: var(--figma-color-text-secondary);
    cursor: default;
    user-select: none;
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
  }

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

  /* Focus state - keyboard only */
  input:enabled:focus-visible + .switch-label .switch-track {
    border: 1px solid var(--figma-color-border-selected);
    box-shadow: 0 0 0 1px inset var(--white);
  }

  /* On the brand fill the ring is the strong selection blue */
  input:enabled:focus-visible + .switch-label .switch-track.checked,
  input:enabled:focus-visible + .switch-label .switch-track.mixed {
    border-color: var(--figma-color-border-selected-strong);
  }

  input:enabled:focus-visible + .switch-label .switch-knob {
    width: 14px;
    height: 14px;
    left: 0;
  }

  input:enabled:focus-visible + .switch-label .switch-knob.checked {
    left: 16px;
  }

  input:enabled:focus:not(:focus-visible) + .switch-label .switch-track {
    border-color: transparent;
    box-shadow: none;
  }
</style>
