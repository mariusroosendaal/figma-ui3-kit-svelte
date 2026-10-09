<script context="module">
  export const segmentedControl = {};
</script>

<script>
  import { getContext } from 'svelte';
  import { readable } from 'svelte/store';
  import Icon from './../Icon/index.svelte';
  import Tooltip from './../Tooltip/index.svelte';

  export let value = null;
  export let iconName = null; // icon mode when set: 24×24 icon, no padding
  export let disabled = false;
  export let tooltip = ''; // shown on hover/focus; explains why a segment is disabled
  export let ariaLabel = null; // required for icon segments without a tooltip

  let className = '';
  export { className as class };

  const context = getContext(segmentedControl);
  const selected = context?.selected ?? readable(null);
  const groupDisabled = context?.disabled ?? readable(false);

  $: active = $selected === value;
  // Group-disabled removes the segments from the tab order; a single disabled
  // segment stays focusable (aria-disabled) so its tooltip is reachable by keyboard.
  $: unavailable = disabled || $groupDisabled;
  $: label = ariaLabel || (iconName ? tooltip : null) || undefined;

  function handleClick() {
    // Enter/Space on an already-selected segment must not deselect it
    if (!unavailable && !active) context?.select(value);
  }
</script>

<div class="segment-cell {className}" class:icon={iconName}>
  {#if tooltip}
    <Tooltip label={tooltip} direction="Bottom">
      <button
        type="button"
        role="radio"
        class="segment"
        class:active
        class:disabled={unavailable}
        aria-checked={active}
        aria-disabled={unavailable || undefined}
        aria-label={label}
        disabled={$groupDisabled}
        on:click={handleClick}
        on:click
        on:focus
        on:blur
      >
        {#if iconName}
          <Icon {iconName} color="--segment-icon-color" />
        {:else}
          <span class="segment-label"><slot /></span>
        {/if}
      </button>
    </Tooltip>
  {:else}
    <button
      type="button"
      role="radio"
      class="segment"
      class:active
      class:disabled={unavailable}
      aria-checked={active}
      aria-disabled={unavailable || undefined}
      aria-label={label}
      disabled={$groupDisabled}
      on:click={handleClick}
      on:click
      on:focus
      on:blur
    >
      {#if iconName}
        <Icon {iconName} color="--segment-icon-color" />
      {:else}
        <span class="segment-label"><slot /></span>
      {/if}
    </button>
  {/if}
</div>

<style>
  .segment-cell {
    display: flex;
    flex: 1 0 0;
    min-width: 0;
  }

  /* Tooltip sets display inline on its wrapper; stretch it to fill the cell */
  .segment-cell > :global(.tooltip-wrapper) {
    display: flex !important;
    flex: 1 0 0;
    min-width: 0;
  }

  .segment {
    --segment-icon-color: var(--figma-color-icon-secondary);
    display: flex;
    flex: 1 0 0;
    align-items: center;
    justify-content: center;
    min-width: 0;
    height: var(--size-small); /* 24px */
    margin: 0;
    padding: var(--size-xxxsmall) var(--size-xxsmall); /* 4px 8px */
    border: 1px solid transparent;
    border-radius: var(--border-radius-medium); /* 5px */
    background-color: transparent; /* shows the control's bg-secondary */
    color: var(--figma-color-text-secondary);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
    cursor: pointer;
    user-select: none;
  }

  /* Icon sets its own cursor; let the button's cursor show through */
  .segment :global(.icon-component) {
    cursor: inherit;
  }

  .icon .segment {
    padding: 0;
  }

  .segment-label {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .segment:not(.active):not(.disabled):hover {
    --segment-icon-color: var(--figma-color-icon);
    color: var(--figma-color-text);
  }

  /* Active — raised against the control's gray track */
  .segment.active {
    --segment-icon-color: var(--figma-color-icon);
    background-color: var(--figma-color-bg);
    border-color: var(--figma-color-border);
    color: var(--figma-color-text);
  }

  /* Focus — keyboard only */
  .segment:focus-visible {
    outline: none;
    border-color: var(--figma-color-border-selected);
  }

  .segment:focus:not(:focus-visible) {
    outline: none;
  }

  /* Disabled — no fill or border, even when active */
  .segment.disabled {
    --segment-icon-color: var(--figma-color-icon-disabled);
    background-color: transparent;
    border-color: transparent;
    color: var(--figma-color-text-tertiary);
    cursor: default;
  }

  .segment.disabled:focus-visible {
    border-color: var(--figma-color-border-selected);
  }
</style>
