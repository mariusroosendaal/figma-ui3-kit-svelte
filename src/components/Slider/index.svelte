<script lang="ts">
  interface Props {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    variant?: 'delta' | 'range' | 'stepper' | 'hue' | 'opacity';
    /** Opacity variant: the color faded over the checkerboard. */
    color?: string;
    disabled?: boolean;
    tabindex?: number;
    /** Delta: the reference point. Range: a marker dot there (UI3's corner radius slider). */
    defaultValue?: number | null;
    /** Required (WCAG 4.1.2) */
    ariaLabel?: string;
    ariaValueText?: string;
    class?: string;
    /** While dragging, after `value` updates */
    oninput?: (detail: { value: number }) => void;
    /** On release, after `value` updates */
    onchange?: (detail: { value: number }) => void;
    /** Not while disabled */
    onfocus?: (event: FocusEvent) => void;
    onblur?: (event: FocusEvent) => void;
  }

  let {
    value = $bindable(),
    min = 0,
    max = 100,
    step = 1,
    variant = 'range',
    color = '#000000',
    disabled = false,
    tabindex = 0,
    defaultValue = null,
    ariaLabel = '',
    ariaValueText = '',
    class: className = '',
    oninput,
    onchange,
    onfocus,
    onblur,
  }: Props = $props();

  $effect(() => {
    if (!ariaLabel) {
      console.warn(
        '[Slider] ariaLabel is required for accessibility. Provide a descriptive label.'
      );
    }
  });

  let uniqueId = 'slider--' + (Math.random() * 10000000).toFixed(0).toString();
  let isFocused = $state(false);

  // Unset, it sits halfway, as a range input does
  let current = $derived(value ?? (min + max) / 2);

  // Calculate percentage position of value
  let percentage = $derived(((current - min) / (max - min)) * 100);

  // Calculate default position for delta variant
  let actualDefaultValue = $derived(defaultValue !== null ? defaultValue : (min + max) / 2);
  let defaultPercentage = $derived(((actualDefaultValue - min) / (max - min)) * 100);

  // Hue and opacity draw a color track with a plain white knob instead of a fill
  let spectrum = $derived(variant === 'hue' || variant === 'opacity');
  let showMarker = $derived(variant === 'range' && defaultValue !== null);

  // Check if handle is at default position (for delta variant handle styling)
  let isAtDefault = $derived(variant === 'delta' && current === actualDefaultValue);
  // UI3's "Stroke (Modified)" handle — a ring whose hole shows the fill and ticks beneath.
  // Delta at its default, hue and opacity use the plain "Fill (Default)" disc instead.
  let stroke = $derived(!spectrum && !disabled && !isAtDefault);

  // The fill, in px from the track's padding box. Range runs from the pill's start (8px before
  // the track) to the handle; delta from the default to the handle, 8px past each. The handle
  // covers handleX ± 8, and a fill edge on that outline antialiases into a blue fringe round
  // the handle, so any edge within 1px of it is pulled 2px inside, under the white ring. The
  // hole (± 4) still shows the fill.
  let trackWidth = $state(0);
  let handleX = $derived((percentage / 100) * trackWidth);
  let defaultX = $derived((defaultPercentage / 100) * trackWidth);
  let rawStart = $derived(variant === 'delta' ? Math.min(handleX, defaultX) - 8 : -8);
  let rawEnd = $derived(variant === 'delta' ? Math.max(handleX, defaultX) + 8 : handleX + 8);
  let fillStart = $derived(rawStart > handleX - 9 ? handleX - 6 : rawStart);
  let fillEnd = $derived(rawEnd < handleX + 9 ? handleX + 6 : rawEnd);
  // Wholly under the handle (range at its minimum, delta at its default): shrink it to a
  // 12px disc so its top and bottom stay off the outline too.
  let fillCompact = $derived(fillStart >= handleX - 8 && fillEnd <= handleX + 8);

  // Calculate tick marks for stepper variant
  let tickCount = $derived(variant === 'stepper' ? Math.floor((max - min) / step) + 1 : 0);
  let tickPositions = $derived(
    variant === 'stepper'
      ? Array.from({ length: tickCount }, (_, i) => {
          const tickValue = min + i * step;
          return {
            value: tickValue,
            position: ((tickValue - min) / (max - min)) * 100,
            isDefault: Math.abs(tickValue - actualDefaultValue) < 1e-9,
          };
        })
      : []
  );

  type RangeEvent = Event & { currentTarget: EventTarget & HTMLInputElement };

  function handleInput(event: RangeEvent) {
    if (!disabled) {
      const next = Number(event.currentTarget.value);
      value = next;
      oninput?.({ value: next });
    }
  }

  function handleChange(event: RangeEvent) {
    if (!disabled) {
      const next = Number(event.currentTarget.value);
      value = next;
      onchange?.({ value: next });
    }
  }

  function handleFocus(event: FocusEvent) {
    if (!disabled) {
      isFocused = true;
      onfocus?.(event);
    }
  }

  function handleBlur(event: FocusEvent) {
    if (!disabled) {
      isFocused = false;
      onblur?.(event);
    }
  }
</script>

<div class="slider-container {className}" class:disabled>
  <div
    class="slider-track"
    class:disabled
    class:spectrum
    style:--slider-color={color}
    bind:clientWidth={trackWidth}
  >
    {#if spectrum}
      <div class="slider-spectrum {variant}" class:disabled></div>
    {/if}
    <!-- Native range input (full width, invisible) -->
    <input
      type="range"
      id={uniqueId}
      value={current}
      {min}
      {max}
      {step}
      {disabled}
      {tabindex}
      aria-label={ariaLabel || undefined}
      aria-valuetext={ariaValueText || undefined}
      class="slider-input"
      oninput={handleInput}
      onchange={handleChange}
      onfocus={handleFocus}
      onblur={handleBlur}
    />

    <!-- Fill portion -->
    {#if variant === 'delta'}
      <!-- Delta: fill from default to current value -->
      <div
        class="slider-fill"
        class:disabled
        class:compact={fillCompact}
        style="left: {fillStart}px; width: {fillEnd - fillStart}px"
      ></div>
      <!-- Default position indicator; the handle covers it when the value is at the default -->
      <div class="slider-default-indicator" class:disabled style="left: {defaultPercentage}%"></div>
    {:else if !spectrum}
      <!-- Range/Stepper: fill from start to handle -->
      <div
        class="slider-fill"
        class:disabled
        class:compact={fillCompact}
        style="left: {fillStart}px; width: {fillEnd - fillStart}px"
      ></div>
    {/if}

    {#if showMarker}
      <div
        class="slider-marker"
        class:on-fill={defaultPercentage <= percentage}
        style="left: {defaultPercentage}%"
      ></div>
    {/if}

    <!-- Stepper tick marks -->
    {#if variant === 'stepper'}
      {#each tickPositions as tick, index (index)}
        <div
          class="slider-tick"
          class:default={tick.isDefault}
          class:disabled
          style="left: {tick.position}%"
        ></div>
      {/each}
    {/if}

    <!-- Handle (visual only) -->
    <div class="slider-handle-wrapper" style="left: {percentage}%">
      <div class="slider-handle" class:focused={isFocused} class:disabled class:stroke></div>
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
    user-select: none;
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

  /* Left and width come from the script; -1px top and bottom covers the track's border. */
  .slider-fill {
    position: absolute;
    top: -1px;
    bottom: -1px;
    border-radius: 8px;
    background-color: var(--figma-color-bg-brand);
    pointer-events: none;
    /* Above the track's ::after end cap, which otherwise paints over the fill's right end.
       Ticks, markers and the handle are also z-index 1 and come later, so they stay on top. */
    z-index: 1;
  }

  .slider-fill.compact {
    top: 1px;
    bottom: 1px;
    border-radius: 6px;
  }

  .slider-fill.disabled {
    background-color: var(--figma-color-bg-disabled);
  }

  .slider-track::before,
  .slider-track::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 16px;
    background-color: inherit;
    pointer-events: none;
  }
  .slider-track::before {
    left: -8px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  .slider-track::after {
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
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--figma-color-icon-onbrand);
    pointer-events: none;
    box-shadow: var(--elevation-200-canvas);
  }

  /* A 4px ring around an 8px hole; the inset shadow is the hole's 0.5px edge */
  .slider-handle.stroke {
    background-color: transparent;
    border: 4px solid var(--figma-color-icon-onbrand);
    box-shadow:
      var(--elevation-300-tooltip),
      inset 0 0 0 0.5px var(--figma-color-bordertranslucent, var(--color-border-transparent));
  }

  /* An outline, so the ring's border and the disc's size are left alone */
  .slider-handle.focused {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }

  .slider-handle.disabled {
    background-color: var(--figma-color-bg-disabled);
    border-color: var(--figma-color-border-disabled);
    box-shadow: none;
  }

  /* One translucent token for every tick: over the blue fill it composites dark,
     over the track it reads grey. Only the default value's tick differs. */
  .slider-tick {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(--figma-color-icon-tertiary);
    pointer-events: none;
    z-index: 1;
  }

  .slider-tick.default {
    background-color: var(--figma-color-icon);
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
    background-color: var(--figma-color-icon-tertiary);
    pointer-events: none;
    z-index: 1;
  }

  /* HUE AND OPACITY — the track is the color; the pill spans the end caps too */
  .slider-track.spectrum,
  .slider-track.spectrum::before,
  .slider-track.spectrum::after {
    background-color: transparent;
    border-color: transparent;
  }

  .slider-spectrum {
    position: absolute;
    top: -1px;
    bottom: -1px;
    left: -8px;
    right: -8px;
    border-radius: 8px;
    box-shadow: inset 0 0 0 1px
      var(--figma-color-bordertranslucent, var(--color-border-transparent));
    pointer-events: none;
  }

  .slider-spectrum.hue {
    background: linear-gradient(
      to right,
      #ff0000 0%,
      #ffff00 16.67%,
      #00ff00 33.33%,
      #00ffff 50%,
      #0000ff 66.67%,
      #ff00ff 83.33%,
      #ff0000 100%
    );
  }

  /* The checkerboard is UI3's chit pattern (see Chit), at the slider's 10.68px tile. */
  .slider-spectrum.opacity {
    background:
      linear-gradient(to right, transparent, var(--slider-color)),
      url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVR42mN4iAH+YwCGIasIUwhT25BVBABMTZUQNDC5rAAAAABJRU5ErkJggg==')
        top left / 10.68px 10.68px;
  }

  .slider-spectrum.disabled {
    opacity: 0.4;
  }

  /* RANGE MARKER — a reference point on the track */
  .slider-marker {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(--figma-color-icon-tertiary);
    pointer-events: none;
    z-index: 1;
  }

  .slider-marker.on-fill {
    background-color: var(--figma-color-icon-onbrand);
  }

  .slider-default-indicator.disabled {
    background-color: var(--figma-color-icon-disabled);
  }
</style>
