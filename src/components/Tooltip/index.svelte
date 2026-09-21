<script>
  import { tick, onMount, onDestroy } from 'svelte';
  import { placeTooltip, arrowStyle } from './position.js';

  // Global tooltip state - shared across all Tooltip instances
  // Using window object to ensure true global state across all instances
  if (typeof window !== 'undefined' && !window.__tooltipGlobalState) {
    window.__tooltipGlobalState = {
      hasShownFirstTooltip: false,
      resetTimeout: null,
    };
  }

  const globalTooltipState =
    typeof window !== 'undefined'
      ? window.__tooltipGlobalState
      : {
          hasShownFirstTooltip: false,
          resetTimeout: null,
        };

  export let label = '';
  export let hotkey = false;
  export let hotkeyText = '⌘V';
  export let direction = 'Top';
  export let disabled = false;

  let className = '';
  export { className as class };
  let wrapperElement;
  let tooltipElement;
  let tooltipId = 'tooltip--' + (Math.random() * 10000000).toFixed(0).toString();
  let showTooltip = false;
  let hoverTimeout;
  let tooltipPosition = { top: 0, left: 0 };
  // The side actually used (it flips when the asked-for side has no room) and the arrow's offset
  let placedDirection = direction;
  let arrow = null;

  // Arrow SVG paths for different directions
  const arrowPath = 'M6 0L12 6H0L6 0Z';

  const FIRST_DELAY = 1000;
  const WARM_DELAY = 200;

  function show(delay) {
    if (disabled) return;

    // Hovering then clicking fires mouseenter and focusin: one pending timer, not two
    clearTimeout(hoverTimeout);

    // Clear any existing reset timeout since user is actively hovering
    if (globalTooltipState.resetTimeout) {
      clearTimeout(globalTooltipState.resetTimeout);
      globalTooltipState.resetTimeout = null;
    }

    hoverTimeout = setTimeout(async () => {
      hoverTimeout = null;
      showTooltip = true;

      // Mark that we've shown the first tooltip
      if (!globalTooltipState.hasShownFirstTooltip) {
        globalTooltipState.hasShownFirstTooltip = true;
      }

      // Wait for DOM to update, then calculate position
      await tick();
      calculatePosition();
    }, delay);
  }

  // Use shorter delay if user has already seen a tooltip recently
  function handleMouseEnter() {
    show(globalTooltipState.hasShownFirstTooltip ? WARM_DELAY : FIRST_DELAY);
  }

  // Keyboard focus asked for the element, so it gets the short delay; focus from a
  // click follows the pointer's timing, which mouseenter already started.
  function handleFocusIn(event) {
    if (event.target?.matches?.(':focus-visible')) {
      show(WARM_DELAY);
    }
  }

  function handleMouseLeave() {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
    showTooltip = false;

    // Start the reset timeout only when user leaves a tooltip
    if (globalTooltipState.hasShownFirstTooltip) {
      if (globalTooltipState.resetTimeout) {
        clearTimeout(globalTooltipState.resetTimeout);
      }
      globalTooltipState.resetTimeout = setTimeout(() => {
        globalTooltipState.hasShownFirstTooltip = false;
      }, 1000);
    }
  }

  function handleFocusOut(event) {
    if (wrapperElement?.contains(event.relatedTarget)) return;
    handleMouseLeave();
  }

  function handleKeydown(event) {
    if (showTooltip && event.key === 'Escape') handleMouseLeave();
  }

  onDestroy(() => clearTimeout(hoverTimeout));

  onMount(() => {
    const trigger = wrapperElement?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (trigger) trigger.setAttribute('aria-describedby', tooltipId);
  });

  function calculatePosition() {
    if (!wrapperElement || !tooltipElement) return;
    const placed = placeTooltip(
      direction,
      wrapperElement.getBoundingClientRect(),
      tooltipElement.getBoundingClientRect()
    );
    tooltipPosition = { top: placed.top, left: placed.left };
    placedDirection = placed.direction;
    arrow = placed.arrow;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Always in DOM so aria-describedby resolves at focus time -->
<span id={tooltipId} role="tooltip" class="sr-only">
  {label}{hotkey ? ' ' + hotkeyText : ''}
</span>

<div
  bind:this={wrapperElement}
  class="tooltip-wrapper {className}"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  on:focusin={handleFocusIn}
  on:focusout={handleFocusOut}
  style="display: inline-block;"
  role="none"
>
  <slot />
</div>

{#if showTooltip}
  <div
    bind:this={tooltipElement}
    class="tooltip {placedDirection}"
    aria-hidden="true"
    style="position: fixed; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 1000;"
  >
    <div class="tooltip-content">
      <div class="tooltip-text">
        <p>{label}</p>
      </div>
      {#if hotkey}
        <div class="tooltip-hotkey">
          <p>{hotkeyText}</p>
        </div>
      {/if}
    </div>

    <div
      class="tooltip-arrow {placedDirection}"
      style={arrowStyle(placedDirection, arrow)}
      aria-hidden="true"
    >
      <svg width="12" height="6" viewBox="0 0 12 6" fill="none" aria-hidden="true">
        <path d={arrowPath} fill="var(--color-bg-tooltip)" />
      </svg>
    </div>
  </div>
{/if}

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .tooltip-wrapper {
    position: relative;
  }

  .tooltip {
    position: fixed;
    max-width: min(200px, calc(100vw - 16px));
    background-color: var(--color-bg-tooltip);
    border-radius: var(--border-radius-medium);
    padding: var(--size-xxxsmall) var(--size-xxsmall);
    /* A filter, not box-shadow, so the shadow follows the arrow as well as the body */
    filter: var(--elevation-300-tooltip-filter);
  }

  .tooltip-content {
    display: flex;
    align-items: center;
    gap: var(--size-xxxsmall);
  }

  .tooltip-text p {
    margin: 0;
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    color: var(--color-text-tooltip);
  }

  .tooltip-hotkey p {
    margin: 0;
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    color: var(--color-text-tooltip-secondary);
    white-space: nowrap;
  }

  .tooltip-arrow {
    position: absolute;
    width: 12px;
    height: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Top Center - arrow points down (tooltip is above trigger) */
  .tooltip-arrow.Top {
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(180deg);
  }

  /* Top Left - arrow points down (tooltip is above trigger) */
  .tooltip-arrow.TopLeft {
    bottom: -6px;
    left: var(--size-xxsmall);
    transform: rotate(180deg);
  }

  /* Top Right - arrow points down (tooltip is above trigger) */
  .tooltip-arrow.TopRight {
    bottom: -6px;
    right: var(--size-xxsmall);
    transform: rotate(180deg);
  }

  /* Bottom Center - arrow points up (tooltip is below trigger) */
  .tooltip-arrow.Bottom {
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
  }

  /* Bottom Left - arrow points up (tooltip is below trigger) */
  .tooltip-arrow.BottomLeft {
    top: -6px;
    left: var(--size-xxsmall);
  }

  /* Bottom Right - arrow points up (tooltip is below trigger) */
  .tooltip-arrow.BottomRight {
    top: -6px;
    right: var(--size-xxsmall);
  }

  /* Right - arrow points left (tooltip is to the right of trigger) */
  .tooltip-arrow.Right {
    left: -9px; /* the 12×6 box turns about its centre: 6px out needs 3px more */
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
  }

  /* Left - arrow points right (tooltip is to the left of trigger) */
  .tooltip-arrow.Left {
    right: -9px; /* as Right */
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
  }
</style>
