<script lang="ts" module>
  export const segmentedControl = {};

  export interface SegmentedControlContext {
    readonly selected: unknown;
    readonly disabled: boolean;
    select(value: unknown): void;
  }
</script>

<script lang="ts">
  import { getContext, type Snippet } from 'svelte';
  import type { FocusEventHandler, MouseEventHandler } from 'svelte/elements';
  import Icon from './../Icon/index.svelte';
  import Tooltip from './../Tooltip/index.svelte';

  interface Props {
    value?: unknown;
    /** Icon mode when set: 24×24 icon, no padding */
    iconName?: string | null;
    disabled?: boolean;
    /** Shown on hover and focus; explains why a segment is disabled */
    tooltip?: string;
    /** Required for icon segments without a tooltip */
    ariaLabel?: string | null;
    class?: string;
    /** The label */
    children?: Snippet;
    /** After the segment is selected */
    onclick?: MouseEventHandler<HTMLButtonElement>;
    onfocus?: FocusEventHandler<HTMLButtonElement>;
    onblur?: FocusEventHandler<HTMLButtonElement>;
  }

  let {
    value = null,
    iconName = null,
    disabled = false,
    tooltip = '',
    ariaLabel = null,
    class: className = '',
    children,
    onclick,
    onfocus,
    onblur,
  }: Props = $props();

  const context = getContext<SegmentedControlContext | undefined>(segmentedControl);

  let active = $derived((context ? context.selected : null) === value);
  let groupDisabled = $derived(context?.disabled ?? false);
  // Group-disabled removes the segments from the tab order; a single disabled
  // segment stays focusable (aria-disabled) so its tooltip is reachable by keyboard.
  let unavailable = $derived(disabled || groupDisabled);
  let label = $derived(ariaLabel || (iconName ? tooltip : null) || undefined);

  function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    // Enter/Space on an already-selected segment must not deselect it
    if (!unavailable && !active) context?.select(value);
    onclick?.(event);
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
        disabled={groupDisabled}
        onclick={handleClick}
        {onfocus}
        {onblur}
      >
        {#if iconName}
          <Icon {iconName} color="--segment-icon-color" />
        {:else}
          <span class="segment-label">{@render children?.()}</span>
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
      disabled={groupDisabled}
      onclick={handleClick}
      {onfocus}
      {onblur}
    >
      {#if iconName}
        <Icon {iconName} color="--segment-icon-color" />
      {:else}
        <span class="segment-label">{@render children?.()}</span>
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
