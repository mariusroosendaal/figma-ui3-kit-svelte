<script>
  import { tick } from 'svelte';

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

  export let label = 'Tooltip text';
  export let hotkey = false;
  export let hotkeyText = '⌘V';
  export let direction = 'Top';
  export let disabled = false;

  let className = '';
  export { className as class };
  let wrapperElement;
  let tooltipElement;
  let showTooltip = false;
  let hoverTimeout;
  let tooltipPosition = { top: 0, left: 0 };

  // Arrow SVG paths for different directions
  const arrowPath = 'M6 0L12 6H0L6 0Z';

  async function handleMouseEnter() {
    if (disabled) return;

    // Clear any existing reset timeout since user is actively hovering
    if (globalTooltipState.resetTimeout) {
      clearTimeout(globalTooltipState.resetTimeout);
      globalTooltipState.resetTimeout = null;
    }

    // Use shorter delay if user has already seen a tooltip recently
    const delay = globalTooltipState.hasShownFirstTooltip ? 50 : 500;

    hoverTimeout = setTimeout(async () => {
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

  function handleMouseLeave() {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    showTooltip = false;

    // Start the reset timeout only when user leaves a tooltip
    if (globalTooltipState.hasShownFirstTooltip) {
      if (globalTooltipState.resetTimeout) {
        clearTimeout(globalTooltipState.resetTimeout);
      }
      globalTooltipState.resetTimeout = setTimeout(() => {
        globalTooltipState.hasShownFirstTooltip = false;
      }, 3000);
    }
  }

  function calculatePosition() {
    if (!wrapperElement || !tooltipElement) return;

    const triggerRect = wrapperElement.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let top = 0;
    let left = 0;

    switch (direction) {
      case 'Top':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'TopLeft':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left;
        break;
      case 'TopRight':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.right - tooltipRect.width;
        break;
      case 'Bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'BottomLeft':
        top = triggerRect.bottom + 8;
        left = triggerRect.left;
        break;
      case 'BottomRight':
        top = triggerRect.bottom + 8;
        left = triggerRect.right - tooltipRect.width;
        break;
      case 'Left':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width - 8;
        break;
      case 'Right':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + 8;
        break;
    }

    // Keep tooltip within viewport bounds
    if (left < 8) left = 8;
    if (left + tooltipRect.width > viewport.width - 8) {
      left = viewport.width - tooltipRect.width - 8;
    }
    if (top < 8) top = 8;
    if (top + tooltipRect.height > viewport.height - 8) {
      top = viewport.height - tooltipRect.height - 8;
    }

    tooltipPosition = { top, left };
  }
</script>

<div
  bind:this={wrapperElement}
  class="tooltip-wrapper {className}"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  style="display: inline-block;"
  role="presentation"
>
  <slot />
</div>

{#if showTooltip}
  <div
    bind:this={tooltipElement}
    class="tooltip {direction}"
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

    <!-- Arrow -->
    <div class="tooltip-arrow {direction}">
      <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
        <path d={arrowPath} fill="var(--color-bg-tooltip)" />
      </svg>
    </div>
  </div>
{/if}

<style>
  .tooltip-wrapper {
    position: relative;
  }

  .tooltip {
    position: fixed;
    max-width: 200px;
    background-color: var(--color-bg-tooltip);
    border-radius: var(--border-radius-medium);
    padding: var(--size-xxxsmall) var(--size-xxsmall);
    box-shadow: var(--elevation-300-light);
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
    left: -6px;
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
  }

  /* Left - arrow points right (tooltip is to the left of trigger) */
  .tooltip-arrow.Left {
    right: -6px;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
  }
</style>
