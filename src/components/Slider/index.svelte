<script>
  import { createEventDispatcher } from 'svelte';

  export let value = 50;
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let variant = 'range'; // 'delta' | 'range' | 'stepper'
  export let disabled = false;
  export let tabindex = 0;
  export let defaultValue = null; // For delta variant - the reference/starting point

  let className = '';
  export { className as class };

  let uniqueId = 'slider--' + (Math.random() * 10000000).toFixed(0).toString();
  let isFocused = false;

  const dispatch = createEventDispatcher();

  // Calculate percentage position of value
  $: percentage = ((value - min) / (max - min)) * 100;

  // Calculate default position for delta variant
  $: actualDefaultValue = defaultValue !== null ? defaultValue : (min + max) / 2;
  $: defaultPercentage = ((actualDefaultValue - min) / (max - min)) * 100;

  // Check if handle is at default position (for delta variant handle styling)
  $: isAtDefault = variant === 'delta' && value === actualDefaultValue;

  // For delta variant, calculate fill from default to current value
  $: deltaFillLeft =
    variant === 'delta' ? (percentage < defaultPercentage ? percentage : defaultPercentage) : 0;
  $: deltaFillWidth = variant === 'delta' ? Math.abs(percentage - defaultPercentage) : percentage;
  $: fillHasValue = variant === 'delta' ? deltaFillWidth > 0 : percentage > 0;

  // Calculate tick marks for stepper variant
  $: tickCount = variant === 'stepper' ? Math.floor((max - min) / step) + 1 : 0;
  $: tickPositions =
    variant === 'stepper'
      ? Array.from({ length: tickCount }, (_, i) => {
          const tickValue = min + i * step;
          return {
            value: tickValue,
            position: ((tickValue - min) / (max - min)) * 100,
            isActive: tickValue <= value,
          };
        })
      : [];

  function handleInput(event) {
    if (!disabled) {
      value = Number(event.target.value);
      dispatch('input', { value });
    }
  }

  function handleChange(event) {
    if (!disabled) {
      value = Number(event.target.value);
      dispatch('change', { value });
    }
  }

  function handleFocus(event) {
    if (!disabled) {
      isFocused = true;
      dispatch('focus', event);
    }
  }

  function handleBlur(event) {
    if (!disabled) {
      isFocused = false;
      dispatch('blur', event);
    }
  }
</script>

<div class="slider-container {className}" class:disabled>
  <div class="slider-track" class:disabled>
    <!-- Native range input (full width, invisible) -->
    <input
      type="range"
      id={uniqueId}
      bind:value
      {min}
      {max}
      {step}
      {disabled}
      {tabindex}
      class="slider-input"
      on:input={handleInput}
      on:change={handleChange}
      on:focus={handleFocus}
      on:blur={handleBlur}
    />

    <!-- Fill portion -->
    {#if variant === 'delta'}
      <!-- Delta: fill from default to current value -->
      <div
        class="slider-fill"
        class:disabled
        style="left: {deltaFillLeft}%; width: {deltaFillWidth}%"
      ></div>
      <!-- Default position indicator (sits on top with z-index: 3) -->
      <div class="slider-default-indicator" class:disabled style="left: {defaultPercentage}%"></div>
    {:else}
      <!-- Range/Stepper: fill from start to handle -->
      <div
        class="slider-fill"
        class:disabled
        class:hasValue={fillHasValue}
        style="width: {percentage}%"
      ></div>
    {/if}

    <!-- Stepper tick marks -->
    {#if variant === 'stepper'}
      {#each tickPositions as tick, index (index)}
        <div
          class="slider-tick"
          class:active={tick.isActive}
          class:disabled
          style="left: {tick.position}%"
        ></div>
      {/each}
    {/if}

    <!-- Handle (visual only) -->
    <div class="slider-handle-wrapper" style="left: {percentage}%">
      <div
        class="slider-handle"
        class:focused={isFocused}
        class:disabled
        class:at-default={isAtDefault}
        class:modified={variant === 'delta' && !isAtDefault}
      ></div>
    </div>
  </div>
</div>

<style>
  .slider-container {
    display: flex;
    align-items: center;
    width: 100%;
    padding: var(--size-xxxsmall) var(--size-xxsmall);
    cursor: default;
  }

  .slider-container.disabled {
    cursor: not-allowed;
  }

  .slider-track {
    position: relative;
    width: 100%;
    height: 16px;
    background-color: var(--figma-color-bg-secondary);
    border: 1px solid var(--color-border-transparent);
    box-sizing: border-box;
  }

  .slider-fill {
    position: absolute;
    left: -1px;
    top: -1px;
    bottom: -1px;
    background-color: var(--figma-color-bg-brand);
    pointer-events: none;
    border: none;
  }

  .slider-fill.disabled {
    background-color: var(--figma-color-bg-disabled);
  }

  .slider-fill.rounded-delta {
    border-radius: 8px;
  }

  .slider-track::before,
  .slider-track::after,
  .slider-fill::before,
  .slider-fill::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 16px;
    background-color: inherit;
    pointer-events: none;
  }
  .slider-track::before,
  .slider-fill::before {
    left: -8px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  .slider-track::after,
  .slider-fill::after {
    right: -8px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .slider-track::before,
  .slider-track::after {
    border: 1px solid var(--color-border-transparent);
    box-sizing: border-box;
  }

  .slider-track::before {
    border-right: none;
  }

  .slider-track::after {
    border-left: none;
  }

  .slider-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    z-index: 2;
  }

  .slider-handle-wrapper {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    pointer-events: none;
    z-index: 1;
  }

  .slider-input:disabled {
    cursor: not-allowed;
  }

  /* Hide native slider track and thumb */
  .slider-input::-webkit-slider-runnable-track {
    background: transparent;
  }

  .slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: transparent;
    cursor: pointer;
  }
  .slider-input:disabled::-webkit-slider-thumb {
    cursor: not-allowed !important;
  }

  .slider-input::-moz-range-track {
    background: transparent;
    border: none;
  }

  .slider-input::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: transparent;
    border: none;
    cursor: pointer;
  }
  .slider-input:disabled::-moz-range-thumb {
    cursor: not-allowed !important;
  }

  .slider-handle {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--figma-color-icon-onbrand);
    pointer-events: none;
    box-shadow: var(--elevation-200);
  }

  /* Inner circle for modified/stroke state */
  .slider-handle::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--figma-color-bg-brand);
  }

  /* Delta variant: at default position - solid blue fill */
  .slider-handle.at-default {
    background-color: var(--figma-color-icon-onbrand);
  }

  .slider-handle.at-default::before {
    display: none;
  }

  /* Focused state */
  .slider-handle.focused {
    border: 1px solid var(--figma-color-border-selected);
  }

  .slider-handle.disabled {
    background-color: var(--figma-color-bg-disabled);
    border-color: var(--figma-color-border-disabled);
    box-shadow: none;
  }

  .slider-handle.disabled::before {
    display: none;
  }

  .slider-tick {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(--figma-color-icon-tertiary);
    pointer-events: none;
    z-index: 2;
  }

  .slider-tick.disabled {
    display: none;
  }

  .slider-default-indicator {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(--figma-color-icon-onbrand);
    pointer-events: none;
    z-index: 3;
  }

  .slider-default-indicator.disabled {
    background-color: var(--figma-color-icon-disabled);
  }
</style>
