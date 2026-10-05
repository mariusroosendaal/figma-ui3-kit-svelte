<!--
  ColorInput: UI3's color field ("Color input" in the UI3 file) — a chit, the hex
  and, when `opacity` is set, an opacity cell.

  - The hex takes 3, 6 or 8 digits, with or without `#`; eight digits also set
    the opacity. An unreadable entry reverts.
  - The chit opens a color picker (`pickable`), which fires `input` while it
    moves and `change` when it settles: the system's, or with `picker="panel"`
    the kit's ColorPicker, Figma's own, offering `swatches`.
  - `variable` shows a bound variable's name instead of the hex, as Figma does;
    it isn't editable here.

  `change` hands back `{ value, opacity }`; `value` is always `#RRGGBB`.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import Chit from '../Chit/index.svelte';
  import ColorPicker from '../ColorPicker/index.svelte';
  import { parseHex } from '../ColorPicker/color.js';

  export let value = '#000000';
  /** 0–100; null hides the opacity cell. */
  /** @type {number | null} */
  export let opacity = null;
  /** @type {string | null} a bound variable's name, shown instead of the hex */
  export let variable = null;
  export let pickable = true;
  /** @type {'system' | 'panel'} the system picker, or the kit's ColorPicker */
  export let picker = 'system';
  /** @type {Array<any>} the ColorPicker's swatches, with `picker="panel"` */
  export let swatches = [];
  export let disabled = false;
  export let id = null;
  export let ariaLabel = 'Color';

  let className = '';
  export { className as class };

  const dispatch = createEventDispatcher();

  let hexText = '';
  let opacityText = '';
  let hexFocused = false;
  let opacityFocused = false;
  let root;
  let panelOpen = false;

  $: hex = normalize(value)?.hex ?? '#000000';
  $: if (!hexFocused) hexText = hex.slice(1).toUpperCase();
  $: if (!opacityFocused) opacityText = opacity == null ? '' : String(Math.round(opacity));

  /** '#RGB', 'RRGGBB', '#RRGGBBAA'… → { hex: '#rrggbb', alpha: 0–100 | null } */
  function normalize(input) {
    const parsed = parseHex(input);
    if (!parsed) return null;
    return { hex: parsed.hex, alpha: parsed.alpha == null ? null : Math.round(parsed.alpha * 100) };
  }

  // Reads `value`, not the derived `hex`, which only catches up after the update.
  function emit(event = 'change') {
    dispatch(event, { value: normalize(value)?.hex ?? hex, opacity });
  }

  function commitHex() {
    const parsed = normalize(hexText);
    if (!parsed) {
      hexText = hex.slice(1).toUpperCase();
      return;
    }
    const opacityChanged = parsed.alpha != null && opacity != null && parsed.alpha !== opacity;
    if (parsed.hex === hex && !opacityChanged) {
      hexText = hex.slice(1).toUpperCase();
      return;
    }
    value = parsed.hex;
    if (opacityChanged) opacity = parsed.alpha;
    hexText = parsed.hex.slice(1).toUpperCase();
    emit();
  }

  function commitOpacity(n) {
    if (n == null || Number.isNaN(n)) {
      opacityText = String(Math.round(opacity ?? 100));
      return;
    }
    const next = Math.min(100, Math.max(0, Math.round(n)));
    opacityText = String(next);
    if (next !== opacity) {
      opacity = next;
      emit();
    }
  }

  function handleHexKeydown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitHex();
      event.currentTarget.select();
    } else if (event.key === 'Escape') {
      // Undoes the field alone: a modal it's in stays open
      event.stopPropagation();
      hexText = hex.slice(1).toUpperCase();
      event.currentTarget.blur();
    }
  }

  function handleOpacityKeydown(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const step = (event.shiftKey ? 10 : 1) * (event.key === 'ArrowUp' ? 1 : -1);
      commitOpacity((parseFloat(opacityText) || 0) + step);
      event.currentTarget.select();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      commitOpacity(parseFloat(opacityText));
      event.currentTarget.select();
    } else if (event.key === 'Escape') {
      // Undoes the field alone: a modal it's in stays open
      event.stopPropagation();
      opacityText = String(Math.round(opacity ?? 100));
      event.currentTarget.blur();
    }
  }

  function handlePicker(event, kind) {
    value = event.currentTarget.value;
    emit(kind);
  }

  function handlePanel(event, kind) {
    value = event.detail.value;
    if (opacity != null) opacity = event.detail.opacity;
    dispatch(kind, { value, opacity });
  }
</script>

<div bind:this={root} class="color-input {className}" class:disabled class:bound={variable}>
  {#if pickable && !disabled && !variable && picker === 'panel'}
    <button
      type="button"
      class="chit-cell pickable chit-button"
      title="Pick a color"
      aria-label="{ariaLabel} picker"
      aria-haspopup="dialog"
      aria-expanded={panelOpen}
      on:click={() => (panelOpen = !panelOpen)}
    >
      <Chit color={hex} opacity={opacity ?? 100} />
    </button>
  {:else if pickable && !disabled && !variable}
    <label class="chit-cell pickable" title="Pick a color">
      <Chit color={hex} opacity={opacity ?? 100} />
      <input
        type="color"
        class="picker"
        value={hex}
        aria-label="{ariaLabel} picker"
        on:input={(e) => handlePicker(e, 'input')}
        on:change={(e) => handlePicker(e, 'change')}
      />
    </label>
  {:else}
    <span class="chit-cell"><Chit color={hex} opacity={opacity ?? 100} /></span>
  {/if}

  {#if variable}
    <span class="variable" title={variable}>{variable}</span>
  {:else}
    <input
      class="hex"
      type="text"
      autocomplete="off"
      spellcheck="false"
      maxlength="9"
      {id}
      {disabled}
      aria-label={ariaLabel}
      bind:value={hexText}
      on:focus={(e) => {
        hexFocused = true;
        e.currentTarget.select();
      }}
      on:blur={() => {
        hexFocused = false;
        commitHex();
      }}
      on:keydown={handleHexKeydown}
    />
    {#if opacity != null}
      <span class="opacity">
        <input
          type="text"
          inputmode="numeric"
          role="spinbutton"
          autocomplete="off"
          aria-label="{ariaLabel} opacity"
          aria-valuenow={opacity}
          aria-valuemin="0"
          aria-valuemax="100"
          {disabled}
          bind:value={opacityText}
          on:focus={(e) => {
            opacityFocused = true;
            e.currentTarget.select();
          }}
          on:blur={() => {
            opacityFocused = false;
            commitOpacity(parseFloat(opacityText));
          }}
          on:keydown={handleOpacityKeydown}
        />
        <span class="percent" aria-hidden="true">%</span>
      </span>
    {/if}
  {/if}
</div>

{#if picker === 'panel'}
  <ColorPicker
    bind:isOpen={panelOpen}
    anchorElement={root}
    value={hex}
    {opacity}
    {swatches}
    on:input={(e) => handlePanel(e, 'input')}
    on:change={(e) => handlePanel(e, 'change')}
  />
{/if}

<style>
  .color-input {
    display: flex;
    align-items: stretch;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    height: var(--size-small); /* 24px */
    border: 1px solid transparent;
    border-radius: var(--border-radius-medium); /* 5px */
    background-color: var(--figma-color-bg-secondary);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
  }

  .color-input:hover:not(.disabled) {
    border-color: var(--figma-color-border);
  }

  .color-input:focus-within,
  .color-input:focus-within:hover {
    border-color: var(--figma-color-border-selected);
  }

  /* A bound variable reads as a pill on the canvas color, as in UI3. */
  .color-input.bound {
    border-color: var(--figma-color-border);
    background-color: var(--figma-color-bg);
  }

  .color-input.disabled {
    border-color: var(--figma-color-border);
    background-color: transparent;
  }

  .chit-cell {
    position: relative;
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: var(--size-small); /* 24px */
    margin: -1px 0 -1px -1px;
  }

  /* The native picker, invisible over the chit so a click opens it. */
  .picker {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    opacity: 0;
    cursor: default;
  }

  .chit-button {
    padding: 0;
    border: 0;
    background: none;
    cursor: default;
  }

  .pickable:focus-within {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -3px;
    border-radius: var(--border-radius-medium);
  }

  /* The panel's chit is a button: its ring is for the keyboard only */
  .chit-button:focus:not(:focus-visible) {
    outline: none;
  }

  input.hex,
  .opacity input,
  .variable {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--figma-color-text);
    font: inherit;
    letter-spacing: inherit;
  }

  input.hex,
  .variable {
    flex: 1 1 auto;
    padding-right: var(--size-xxsmall);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .variable {
    display: flex;
    align-items: center;
    user-select: none;
  }

  .opacity {
    display: flex;
    flex: 0 0 53px;
    align-items: center;
    box-sizing: border-box;
    padding: 0 var(--size-xxsmall) 0 7px;
    border-left: 1px solid var(--figma-color-bg);
  }

  .opacity input {
    flex: 1 1 auto;
    width: 100%;
  }

  .percent {
    flex: 0 0 auto;
    color: var(--figma-color-text-secondary);
    user-select: none;
  }

  input::selection {
    background-color: var(--text-highlight);
  }

  input:disabled,
  .disabled .percent {
    color: var(--figma-color-text-disabled);
  }
</style>
