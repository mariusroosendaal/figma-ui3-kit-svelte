<!--
  ColorPicker: Figma's color picker (its Custom tab) — the saturation and
  brightness square, hue and opacity sliders, the eyedropper, a format dropdown
  with its fields, and swatches.

  - It floats by `anchorElement` while `isOpen`, below it or else above, and
    closes on X, Escape or a click outside. `inline` draws it in the flow.
  - Dragging fires `input`; letting go, a field, a swatch, the eyedropper or a
    key fires `change`. Both hand back `{ value, opacity }`; `value` is always
    `#RRGGBB`.
  - `swatches` takes colors — '#RRGGBB', '#RRGGBBAA', any CSS color, or
    `{ color, opacity?, label? }` — or groups of them, `{ label, colors }`,
    which a dropdown switches between, as Figma's "On this page".
  - The eyedropper is the browser's EyeDropper, left out where there is none.
  - `opacity={null}` leaves out the opacity slider and field.
  - `compact` makes the square 144px tall, the least it shrinks to in a short
    window, for a plugin with little room.
-->
<script>
  import { createEventDispatcher, onDestroy, tick } from 'svelte';
  import ModalHeader from '../ModalHeader/index.svelte';
  import Dropdown from '../Dropdown/index.svelte';
  import IconButton from '../IconButton/index.svelte';
  import IconEyedropper from '../../icons/24/icon.24.eyedropper.small.svg';
  import {
    clamp,
    parseHex,
    parseCss,
    hexToRgb,
    rgbToHex,
    hsvToRgb,
    rgbToHsv,
    hsvToHsl,
    hslToHsv,
  } from './color.js';

  export let value = '#000000';
  /** 0–100; null leaves out the opacity slider and field */
  /** @type {number | null} */
  export let opacity = 100;
  export let isOpen = false;
  /** @type {HTMLElement | null} what the picker floats by */
  export let anchorElement = null;
  /** true: drawn in the flow, always open */
  export let inline = false;
  /** @type {'hex' | 'rgb' | 'css' | 'hsl' | 'hsb'} */
  export let format = 'hex';
  /** @type {Array<any>} colors, or `{ label, colors }` groups */
  export let swatches = [];
  export let title = 'Color picker';
  /** true: the square 144px tall instead of 208px */
  export let compact = false;

  let className = '';
  export { className as class };

  const dispatch = createEventDispatcher();
  const titleId = `color-picker-${Math.random().toString(36).slice(2, 9)}-title`;

  const FORMATS = [
    { label: 'Hex', value: 'hex' },
    { label: 'RGB', value: 'rgb' },
    { label: 'CSS', value: 'css' },
    { label: 'HSL', value: 'hsl' },
    { label: 'HSB', value: 'hsb' },
  ];
  const FIELDS = {
    hex: [{ key: 'hex', label: 'Hex', text: true }],
    css: [{ key: 'css', label: 'CSS color', text: true }],
    rgb: [
      { key: 'rgb.r', label: 'Red', max: 255 },
      { key: 'rgb.g', label: 'Green', max: 255 },
      { key: 'rgb.b', label: 'Blue', max: 255 },
    ],
    hsl: [
      { key: 'hsl.h', label: 'Hue', max: 360 },
      { key: 'hsl.s', label: 'Saturation', max: 100 },
      { key: 'hsl.l', label: 'Lightness', max: 100 },
    ],
    hsb: [
      { key: 'hsb.h', label: 'Hue', max: 360 },
      { key: 'hsb.s', label: 'Saturation', max: 100 },
      { key: 'hsb.b', label: 'Brightness', max: 100 },
    ],
  };
  const OPACITY_FIELD = { key: 'opacity', label: 'Opacity', max: 100 };
  // Dropdown marks its items selected, so each picker has its own
  const formatItems = FORMATS.map((f) => ({ ...f }));

  // HSV, so a grey keeps its hue and black its saturation
  let h = 0;
  let s = 0;
  let v = 0;
  let a = 1;
  let synced = null;

  $: hasAlpha = opacity != null;
  $: sync(value, opacity);
  $: rgb = hsvToRgb({ h, s, v });
  $: hex = rgbToHex(rgb);
  $: hueHex = rgbToHex(hsvToRgb({ h, s: 1, v: 1 }));
  $: rgbChannels = [rgb.r, rgb.g, rgb.b].map(Math.round).join(' ');
  $: texts = channels(h, s, v, a);
  $: fields = FIELDS[format] ?? FIELDS.hex;
  $: opacityCell = hasAlpha && format !== 'css';
  $: columns = [...fields.map(() => '1fr'), ...(opacityCell ? ['54px'] : [])].join(' ');
  $: formatItem = formatItems.find((f) => f.value === format) ?? formatItems[0];

  // Takes value and opacity from outside unless they're what the picker last
  // set: a hex can't hold the reticle's exact spot, or a grey's hue.
  function sync(val, op) {
    const parsed = parseHex(val);
    if (!parsed) return;
    const key = `${parsed.hex}/${op}`;
    if (key === synced) return;
    synced = key;
    if (op != null) a = clamp(op, 0, 100) / 100;
    if (parsed.hex !== rgbToHex(hsvToRgb({ h, s, v }))) set(keep(rgbToHsv(hexToRgb(parsed.hex))));
  }

  /** an HSV from a color, keeping the current hue for a grey and saturation for black */
  function keep(next) {
    return {
      h: next.s > 0 && next.v > 0 ? next.h : h,
      s: next.v > 0 ? next.s : s,
      v: next.v,
    };
  }

  /** Moves the picker; `event` names what to fire, if anything */
  function set(next, event = null) {
    if (next.h != null) h = clamp(next.h, 0, 360);
    if (next.s != null) s = clamp(next.s, 0, 1);
    if (next.v != null) v = clamp(next.v, 0, 1);
    if (next.a != null && hasAlpha) a = clamp(next.a, 0, 1);
    value = rgbToHex(hsvToRgb({ h, s, v }));
    if (hasAlpha) opacity = Math.round(a * 100);
    synced = `${value}/${opacity}`;
    if (event) dispatch(event, { value, opacity });
  }

  /** set, firing `change` only if the color or opacity moved */
  function apply(next) {
    const before = `${value}/${opacity}`;
    set(next);
    if (`${value}/${opacity}` !== before) dispatch('change', { value, opacity });
  }

  function channels(h, s, v, a) {
    const c = hsvToRgb({ h, s, v });
    const [r, g, b] = [c.r, c.g, c.b].map(Math.round);
    const hsl = hsvToHsl({ h, s, v });
    const pct = (n) => String(Math.round(n * 100));
    return {
      hex: rgbToHex(c).slice(1).toUpperCase(),
      css: a < 1 ? `rgba(${r}, ${g}, ${b}, ${+a.toFixed(2)})` : `rgb(${r}, ${g}, ${b})`,
      opacity: pct(a),
      'rgb.r': String(r),
      'rgb.g': String(g),
      'rgb.b': String(b),
      'hsl.h': String(Math.round(h)),
      'hsl.s': pct(hsl.s),
      'hsl.l': pct(hsl.l),
      'hsb.h': String(Math.round(h)),
      'hsb.s': pct(s),
      'hsb.b': pct(v),
    };
  }

  // ── Dragging ──────────────────────────────────────────────────────────

  let stopDrag = null;

  // Window listeners, not pointer capture, which the plugin iframe can drop
  function track(event, read) {
    if (event.button !== 0) return;
    event.preventDefault();
    stopDrag?.();
    const move = (e) => set(read(e), 'input');
    const up = () => {
      stopDrag?.();
      dispatch('change', { value, opacity });
    };
    stopDrag = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      stopDrag = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    move(event);
  }

  function drag(event, read) {
    if (event.button !== 0) return;
    const element = event.currentTarget;
    element.focus();
    track(event, (e) => read(e, element.getBoundingClientRect()));
  }

  // The % beside the opacity scrubs it, 1% a pixel, as in Figma
  function scrub(event) {
    if (event.button !== 0) return;
    if (editing) /** @type {HTMLElement} */ (document.activeElement)?.blur();
    const x = event.clientX;
    const start = a * 100;
    track(event, (e) => ({ a: Math.round(start + e.clientX - x) / 100 }));
  }

  onDestroy(() => stopDrag?.());

  const readSpectrum = (e, r) => ({
    s: clamp((e.clientX - r.left) / r.width, 0, 1),
    v: 1 - clamp((e.clientY - r.top) / r.height, 0, 1),
  });
  // A thumb's centre runs from 8px in at one end of the track to 8px in at the other
  const along = (e, r) => clamp((e.clientX - r.left - 8) / (r.width - 16), 0, 1);
  const readHue = (e, r) => ({ h: along(e, r) * 360 });
  const readAlpha = (e, r) => ({ a: along(e, r) });

  // ── Keys ──────────────────────────────────────────────────────────────

  function spectrumKey(event) {
    const d = event.shiftKey ? 0.1 : 0.01;
    const next = {
      ArrowLeft: { s: s - d },
      ArrowRight: { s: s + d },
      ArrowUp: { v: v + d },
      ArrowDown: { v: v - d },
    }[event.key];
    if (!next) return;
    event.preventDefault();
    apply(next);
  }

  function sliderKey(event, current, max, toColor) {
    const d = event.shiftKey ? 10 : 1;
    const next = {
      ArrowLeft: current - d,
      ArrowDown: current - d,
      ArrowRight: current + d,
      ArrowUp: current + d,
      Home: 0,
      End: max,
    }[event.key];
    if (next == null) return;
    event.preventDefault();
    apply(toColor(clamp(Math.round(next), 0, max)));
  }

  // ── Fields ────────────────────────────────────────────────────────────

  let editing = null;
  let draft = '';

  function commit(key, text) {
    if (text.trim() === texts[key]) return;
    if (key === 'hex' || key === 'css') {
      const parsed = key === 'hex' ? parseHex(text) : parseCss(text);
      if (!parsed) return;
      apply({ ...keep(rgbToHsv(hexToRgb(parsed.hex))), a: parsed.alpha ?? undefined });
      return;
    }
    const n = parseFloat(text);
    if (Number.isNaN(n)) return;
    if (key === 'opacity') {
      apply({ a: clamp(Math.round(n), 0, 100) / 100 });
      return;
    }
    const [space, channel] = key.split('.');
    const field = FIELDS[space].find((f) => f.key === key);
    const amount = clamp(Math.round(n), 0, field.max);
    if (space === 'hsb') {
      apply({ [channel === 'b' ? 'v' : channel]: channel === 'h' ? amount : amount / 100 });
    } else if (space === 'hsl') {
      const hsl = hsvToHsl({ h, s, v });
      hsl[channel] = channel === 'h' ? amount : amount / 100;
      const next = hslToHsv(hsl);
      // The typed hue holds even for a grey
      apply({ h: hsl.h, s: next.v > 0 ? next.s : s, v: next.v });
    } else {
      const next = hsvToRgb({ h, s, v });
      next[channel] = amount;
      apply(keep(rgbToHsv(next)));
    }
  }

  function startEdit(event, key) {
    editing = key;
    draft = texts[key];
    event.currentTarget.select();
  }

  function endEdit(key) {
    if (editing !== key) return;
    commit(key, draft);
    editing = null;
  }

  async function fieldKey(event, field) {
    const input = event.currentTarget;
    if (event.key === 'Enter') {
      event.preventDefault();
      commit(field.key, draft);
      draft = channels(h, s, v, a)[field.key];
      await tick();
      input.select();
    } else if (event.key === 'Escape') {
      // Undoes the field alone: the picker stays open
      event.stopPropagation();
      draft = texts[field.key];
      input.blur();
    } else if (field.max && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      event.preventDefault();
      const d = (event.shiftKey ? 10 : 1) * (event.key === 'ArrowUp' ? 1 : -1);
      commit(field.key, String((parseFloat(draft) || 0) + d));
      draft = channels(h, s, v, a)[field.key];
      await tick();
      input.select();
    }
  }

  // ── Eyedropper ────────────────────────────────────────────────────────

  const canSample = typeof window !== 'undefined' && 'EyeDropper' in window;

  async function sample() {
    try {
      // @ts-ignore EyeDropper is Chromium-only and not in every DOM lib
      const { sRGBHex } = await new window.EyeDropper().open();
      const parsed = parseHex(sRGBHex) ?? parseCss(sRGBHex);
      if (parsed) apply(keep(rgbToHsv(hexToRgb(parsed.hex))));
    } catch {
      // Escape cancels the eyedropper; nothing to do
    }
  }

  // ── Swatches ──────────────────────────────────────────────────────────

  let groupIndex = 0;

  $: groups = toGroups(swatches);
  $: if (groupIndex >= groups.length) groupIndex = 0;
  $: groupItems = groups.map((g, i) => ({ label: g.label ?? `Swatches ${i + 1}`, value: i }));
  $: groupLabels = groups.some((g) => g.label);

  function toGroups(list) {
    if (!Array.isArray(list) || !list.length) return [];
    const grouped = list.every((g) => g && typeof g === 'object' && Array.isArray(g.colors));
    return (grouped ? list : [{ label: null, colors: list }])
      .map((g) => ({ label: g.label ?? null, colors: g.colors.map(toSwatch).filter(Boolean) }))
      .filter((g) => g.colors.length);
  }

  function toSwatch(item) {
    const raw = typeof item === 'string' ? { color: item } : item;
    if (!raw?.color) return null;
    const parsed = parseHex(raw.color) ?? parseCss(raw.color);
    if (!parsed) return null;
    const alpha = (parsed.alpha ?? 1) * ((raw.opacity ?? 100) / 100);
    const { r, g, b } = hexToRgb(parsed.hex);
    return {
      hex: parsed.hex,
      opacity: Math.round(alpha * 100),
      label: raw.label ?? null,
      lightness: (Math.max(r, g, b) + Math.min(r, g, b)) / 510,
    };
  }

  function swatchName(swatch) {
    const name = swatch.label ?? swatch.hex.slice(1).toUpperCase();
    return swatch.opacity < 100 ? `${name}, ${swatch.opacity}%` : name;
  }

  function pickSwatch(swatch) {
    apply({ ...keep(rgbToHsv(hexToRgb(swatch.hex))), a: swatch.opacity / 100 });
  }

  // ── Floating ──────────────────────────────────────────────────────────

  let panel;
  let top = 0;
  let left = 0;
  let placed = false;
  let wasOpen = false;
  /** @type {HTMLElement | null} where focus was when the picker opened */
  let opener = null;

  $: if (!inline) toggle(isOpen);

  async function toggle(open) {
    if (open === wasOpen) return;
    wasOpen = open;
    placed = false;
    if (!open) return;
    opener = /** @type {HTMLElement | null} */ (document.activeElement);
    await tick();
    place();
    panel?.focus({ preventScroll: true });
  }

  // Below the anchor, or above it, or as low as fits; inside the window either way
  function place() {
    if (!panel || inline) return;
    const gap = 8;
    const margin = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    const anchor = anchorElement?.getBoundingClientRect() ?? {
      left: (vw - width) / 2,
      top: margin,
      bottom: margin - gap,
    };
    left = clamp(anchor.left, margin, Math.max(margin, vw - width - margin));
    if (anchor.bottom + gap + height <= vh - margin) top = anchor.bottom + gap;
    else if (anchor.top - gap - height >= margin) top = anchor.top - gap - height;
    else top = Math.max(margin, vh - margin - height);
    placed = true;
  }

  function close() {
    if (inline) {
      dispatch('close');
      return;
    }
    const hadFocus = panel?.contains(document.activeElement);
    isOpen = false;
    dispatch('close');
    if (hadFocus && opener?.isConnected) opener.focus();
  }

  function handleOutside(event) {
    if (inline || !isOpen || !panel) return;
    if (panel.contains(event.target) || anchorElement?.contains(event.target)) return;
    close();
  }

  function handleKeydown(event) {
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    // Stops here, so a modal the picker opened from stays open
    event.preventDefault();
    event.stopPropagation();
    close();
  }
</script>

<svelte:window on:pointerdown|capture={handleOutside} on:resize={() => isOpen && place()} />

{#if inline || isOpen}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div
    bind:this={panel}
    class="color-picker {className}"
    class:floating={!inline}
    class:placed
    class:compact
    role="dialog"
    aria-labelledby={titleId}
    tabindex="-1"
    style:top={inline ? null : `${top}px`}
    style:left={inline ? null : `${left}px`}
    style:--picker-hue={hueHex}
    style:--picker-color={hex}
    style:--picker-rgb={rgbChannels}
    on:keydown={handleKeydown}
  >
    <ModalHeader {title} {titleId} variant="tabs" tabs={['Custom']} on:close={close} />

    <div class="body">
      <div class="spectrum-wrap">
        <div
          class="spectrum"
          role="slider"
          tabindex="0"
          aria-label="Saturation and brightness"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={Math.round(s * 100)}
          aria-valuetext="Saturation {Math.round(s * 100)}%, brightness {Math.round(v * 100)}%"
          on:pointerdown={(e) => drag(e, readSpectrum)}
          on:keydown={spectrumKey}
        >
          <span class="thumb reticle" style:left="{s * 100}%" style:top="{(1 - v) * 100}%">
            <span class="thumb-shadow"></span>
            <span class="thumb-fill" style:background-color="var(--picker-color)"></span>
          </span>
        </div>
      </div>

      <div class="controls-panel">
        <div class="controls">
          {#if canSample}
            <IconButton iconName={IconEyedropper} ariaLabel="Sample color" on:click={sample} />
          {/if}
          <div class="sliders">
            <div
              class="slider hue"
              role="slider"
              tabindex="0"
              aria-label="Hue"
              aria-valuemin="0"
              aria-valuemax="360"
              aria-valuenow={Math.round(h)}
              on:pointerdown={(e) => drag(e, readHue)}
              on:keydown={(e) => sliderKey(e, h, 360, (n) => ({ h: n }))}
            >
              <span class="thumb" style:left="calc((100% - 16px) * {h / 360})">
                <span class="thumb-shadow"></span>
                <span class="thumb-fill" style:background-color="var(--picker-hue)"></span>
              </span>
            </div>
            {#if hasAlpha}
              <div
                class="slider alpha"
                role="slider"
                tabindex="0"
                aria-label="Opacity"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={Math.round(a * 100)}
                aria-valuetext="{Math.round(a * 100)}%"
                on:pointerdown={(e) => drag(e, readAlpha)}
                on:keydown={(e) => sliderKey(e, a * 100, 100, (n) => ({ a: n / 100 }))}
              >
                <span class="thumb" style:left="calc((100% - 16px) * {a})">
                  <span class="thumb-shadow"></span>
                  <span class="thumb-fill" style:background-color="var(--picker-color)"></span>
                </span>
              </div>
            {/if}
          </div>
        </div>

        <div class="format-row">
          <Dropdown
            class="format"
            menuItems={formatItems}
            value={formatItem}
            ariaLabel="Color format"
            on:change={(e) => (format = e.detail.value)}
          />
          <div class="fields" style:grid-template-columns={columns}>
            {#each opacityCell ? [...fields, OPACITY_FIELD] : fields as field (field.key)}
              <span class="cell" class:text={field.text}>
                <input
                  type="text"
                  autocomplete="off"
                  spellcheck="false"
                  inputmode={field.max ? 'numeric' : undefined}
                  aria-label={field.label}
                  value={editing === field.key ? draft : texts[field.key]}
                  on:focus={(e) => startEdit(e, field.key)}
                  on:input={(e) => (draft = e.currentTarget.value)}
                  on:blur={() => endEdit(field.key)}
                  on:keydown={(e) => fieldKey(e, field)}
                />
                {#if field === OPACITY_FIELD}
                  <span class="percent" aria-hidden="true" on:pointerdown={scrub}>%</span>
                {/if}
              </span>
            {/each}
          </div>
        </div>
      </div>

      {#if groups.length}
        <div class="library">
          {#if groupLabels}
            <div class="set">
              <Dropdown
                menuItems={groupItems}
                value={groupItems[groupIndex]}
                ariaLabel="Color swatch set"
                on:change={(e) => (groupIndex = e.detail.value)}
              />
            </div>
          {/if}
          <div class="swatches">
            {#each groups[groupIndex]?.colors ?? [] as swatch, i (i)}
              <button
                type="button"
                class="swatch"
                class:ring-light={swatch.lightness > 0.9}
                class:ring-dark={swatch.lightness < 0.2}
                style:--swatch-color={swatch.hex}
                style:--swatch-clear={1 - swatch.opacity / 100}
                title={swatchName(swatch)}
                aria-label={swatchName(swatch)}
                on:click={() => pickSwatch(swatch)}
              >
                {#if swatch.opacity < 100}
                  <span class="checker"></span>
                {/if}
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Measured off Figma's own picker: 240 wide, hugging its content up to what
     the window has room for, past which the swatches scroll. */
  .color-picker {
    /* The opacity track's checkerboard: Figma's are #fff and #e1e1e1 in light,
       the panel and bg-secondary in dark */
    --picker-checker-a: var(--figma-color-bg);
    --picker-checker-b: #e1e1e1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 240px;
    max-height: calc(100vh - 16px);
    overflow: hidden;
    border-radius: var(--border-radius-large); /* 13px */
    background-color: var(--figma-color-bg);
    box-shadow: var(--elevation-400-menu-panel);
    color: var(--figma-color-text);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    outline: none;
  }

  :global(.figma-dark) .color-picker {
    --picker-checker-b: var(--figma-color-bg-secondary);
  }

  .floating {
    position: fixed;
    z-index: 1000;
    visibility: hidden;
  }

  .floating.placed {
    visibility: visible;
  }

  .color-picker > :global(.modal-header) {
    flex: 0 0 auto;
  }

  /* Figma's Custom tab is bold text alone, without the selected fill */
  .color-picker :global(.tab.single-tab) {
    background-color: transparent;
  }

  /* In a short plugin window the swatches give way first, down to a row, then
     the square, down to 144px tall; shorter still, the whole body scrolls */
  .body {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;
  }

  /* ── Square and sliders ── */

  .spectrum-wrap {
    display: flex;
    flex: 0 1 auto;
    flex-direction: column;
    min-height: 160px; /* the square's 144px and its 16px top */
    padding: var(--size-xsmall) var(--size-xsmall) 0;
  }

  .spectrum {
    position: relative;
    flex: 0 1 208px;
    min-height: 144px;
    border-radius: var(--border-radius-medium); /* 5px */
    outline: 1px solid var(--figma-color-bordertranslucent, rgba(0, 0, 0, 0.1));
    background:
      linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, var(--picker-hue));
    touch-action: none;
  }

  .compact .spectrum {
    flex-basis: 144px;
  }

  .slider {
    position: relative;
    height: var(--size-xsmall); /* 16px */
    border-radius: 9999px;
    outline: 1px solid var(--figma-color-bordertranslucent, rgba(0, 0, 0, 0.1));
    touch-action: none;
  }

  /* Figma's hit area: 4px past the track all round */
  .slider::after {
    content: '';
    position: absolute;
    inset: -4px;
  }

  .spectrum:focus-visible,
  .slider:focus-visible {
    outline-color: var(--figma-color-border-selected);
  }

  /* Red sits under the thumb's centre at either end */
  .hue {
    background-image: linear-gradient(
      90deg,
      #f00 8px,
      #ff0,
      #0f0,
      #0ff,
      #00f,
      #f0f,
      #f00 calc(100% - 8px)
    );
  }

  .alpha {
    background-image:
      linear-gradient(
        90deg,
        rgb(var(--picker-rgb) / 0) 8px,
        rgb(var(--picker-rgb)) calc(100% - 8px)
      ),
      conic-gradient(
        var(--picker-checker-a) 0 25%,
        var(--picker-checker-b) 0 50%,
        var(--picker-checker-a) 0 75%,
        var(--picker-checker-b) 0
      );
    background-size:
      auto,
      10.6667px 10.6667px;
  }

  /* The thumb: a 4px white ring round the color, with the tooltip elevation on
     a 12px disc tucked 2px below it. White in both themes, as in Figma. */
  .thumb {
    position: absolute;
    top: 0;
    z-index: 1;
    width: var(--size-xsmall);
    height: var(--size-xsmall);
    pointer-events: none;
  }

  .reticle {
    transform: translate(-50%, -50%);
  }

  .thumb-shadow {
    position: absolute;
    top: 4px;
    left: 2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    box-shadow: var(--elevation-300-tooltip);
  }

  .thumb-fill {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    border: 4px solid #fff;
    border-radius: 50%;
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.2),
      inset 0 0 0 1px rgba(0, 0, 0, 0.2);
  }

  /* ── Eyedropper, sliders, format ── */

  .controls-panel {
    flex: none;
    padding: var(--size-xxsmall) 0;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 52px;
    padding: 0 var(--size-xsmall);
  }

  .sliders {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
    min-width: 0;
  }

  .format-row {
    display: grid;
    grid-template-columns: 56px minmax(0, 1fr);
    align-items: center;
    gap: var(--size-xxsmall);
    height: var(--size-large); /* 40px */
    padding: 0 var(--size-xsmall);
  }

  /* The format dropdown hugs its label, as Figma's does */
  .format-row :global(.format) {
    width: max-content;
  }

  .fields {
    position: relative;
    display: grid;
    gap: 1px;
    height: var(--size-small); /* 24px */
    min-width: 0;
    border-radius: var(--border-radius-medium);
  }

  /* Hover edges the group; focus edges the field */
  .fields::after,
  .cell::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid transparent;
    border-radius: inherit;
    pointer-events: none;
  }

  .fields:hover::after {
    border-color: var(--figma-color-border);
  }

  .cell {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 0;
    background-color: var(--figma-color-bg-secondary);
  }

  .cell:first-child {
    border-radius: var(--border-radius-medium) 0 0 var(--border-radius-medium);
  }

  .cell:last-child {
    border-radius: 0 var(--border-radius-medium) var(--border-radius-medium) 0;
  }

  .cell:only-child {
    border-radius: var(--border-radius-medium);
  }

  .cell:focus-within {
    z-index: 1;
  }

  .cell:focus-within::after {
    border-color: var(--figma-color-border-selected);
  }

  input {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    height: 100%;
    margin: 0;
    padding: 0 0 0 var(--size-xxsmall);
    border: 0;
    outline: none;
    background: transparent;
    color: var(--figma-color-text);
    font: inherit;
    letter-spacing: inherit;
    cursor: default;
  }

  .cell.text input {
    padding-right: var(--size-xxsmall);
    text-overflow: ellipsis;
  }

  input:focus {
    cursor: text;
  }

  input::selection {
    background-color: var(--text-highlight);
  }

  .percent {
    display: flex;
    flex: 0 0 14px;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    color: var(--figma-color-text-secondary);
    cursor: ew-resize;
    user-select: none;
    touch-action: none;
  }

  /* ── Swatches ── */

  /* Shrinks a thousand times faster than the square, so all but first */
  .library {
    display: flex;
    flex: 1 1000 auto;
    flex-direction: column;
    min-height: 76px;
    padding-top: 11px;
    border-top: 1px solid var(--figma-color-border);
  }

  .set {
    flex: none;
    margin: 0 var(--size-xsmall) var(--size-xxxsmall);
  }

  /* 24px cells, the swatch 4px in, 12px from the panel's sides */
  .swatches {
    display: grid;
    flex: 0 1 auto;
    grid-template-columns: repeat(auto-fill, var(--size-small));
    min-height: 0;
    padding: 0 12px 12px;
    overflow-y: auto;
  }

  .swatch {
    position: relative;
    width: var(--size-xsmall);
    height: var(--size-xsmall);
    margin: var(--size-xxxsmall);
    padding: 0;
    border: 0;
    border-radius: 20%;
    background-color: var(--swatch-color);
    /* Figma's eyedropper cursor, its tip at 8, 24 */
    cursor:
      url('data:image/svg+xml,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20filter%3D%22url%28%23s%29%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M17.0263%2019.5948L11.2871%2025.334C10.9187%2025.7024%2010.4443%2025.9465%209.93033%2026.0322L8.62738%2026.2493C6.93533%2026.5314%205.46839%2025.0644%205.7504%2023.3724L5.96756%2022.0694C6.05322%2021.5554%206.29733%2021.0811%206.66578%2020.7126L12.405%2014.9734C11.7005%2013.9741%2011.7952%2012.5834%2012.6893%2011.6894C13.5833%2010.7953%2014.9741%2010.7005%2015.9734%2011.4052L18.1893%209.18935C19.4654%207.91321%2021.5344%207.9132%2022.8106%209.18935C24.0867%2010.4655%2024.0867%2012.5345%2022.8106%2013.8107L20.5948%2016.0265C21.2994%2017.0259%2021.2046%2018.4166%2020.3106%2019.3107C19.4164%2020.2048%2018.0256%2020.2995%2017.0263%2019.5948Z%22%20fill%3D%22white%22%2F%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M13.3963%2014.6036L13.7926%2015L7.37288%2021.4198C7.15181%2021.6408%207.00534%2021.9254%206.95395%2022.2338L6.73679%2023.5368C6.56758%2024.552%207.44775%2025.4322%208.46298%2025.2629L9.76592%2025.0458C10.0743%2024.9944%2010.3589%2024.8479%2010.58%2024.6269L16.9997%2018.2071L17.3962%2018.6036C18.0057%2019.2131%2018.9939%2019.2131%2019.6034%2018.6036C20.2129%2017.9941%2020.213%2017.0059%2019.6035%2016.3964L19.2071%2015.9999L22.1035%2013.1036C22.9891%2012.2179%2022.9891%2010.7821%2022.1035%209.89645C21.2179%209.01083%2019.782%209.01084%2018.8964%209.89646L16%2012.7928L15.6035%2012.3964C14.994%2011.7869%2014.0058%2011.787%2013.3964%2012.3965C12.7869%2013.0059%2012.7869%2013.9941%2013.3963%2014.6036ZM14.4997%2015.7071L16.2926%2017.5L9.87288%2023.9198C9.79919%2023.9934%209.70432%2024.0423%209.60152%2024.0594L8.29858%2024.2766C7.96017%2024.333%207.66678%2024.0396%207.72318%2023.7012L7.94034%2022.3982C7.95747%2022.2954%208.00629%2022.2005%208.07998%2022.1269L14.4997%2015.7071Z%22%20fill%3D%22black%22%2F%3E%3C%2Fg%3E%3Cdefs%3E%3Cfilter%20id%3D%22s%22%20x%3D%220%22%20y%3D%220%22%20width%3D%2232%22%20height%3D%2232%22%20filterUnits%3D%22userSpaceOnUse%22%20color-interpolation-filters%3D%22sRGB%22%3E%3CfeFlood%20flood-opacity%3D%220%22%20result%3D%22bg%22%2F%3E%3CfeColorMatrix%20in%3D%22SourceAlpha%22%20type%3D%22matrix%22%20values%3D%220%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200%22%20result%3D%22a%22%2F%3E%3CfeOffset%20dy%3D%221%22%2F%3E%3CfeGaussianBlur%20stdDeviation%3D%221.5%22%2F%3E%3CfeColorMatrix%20type%3D%22matrix%22%20values%3D%220%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.35%200%22%2F%3E%3CfeBlend%20mode%3D%22normal%22%20in2%3D%22bg%22%20result%3D%22sh%22%2F%3E%3CfeBlend%20mode%3D%22normal%22%20in%3D%22SourceGraphic%22%20in2%3D%22sh%22%20result%3D%22shape%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3C%2Fsvg%3E')
        8 24,
      auto;
  }

  /* A translucent swatch: the checkerboard over its right half at 1 − alpha,
     which draws the color's real alpha there. The same light board in both
     themes, as Figma's. */
  .checker {
    position: absolute;
    top: 0;
    left: 8px;
    width: 8px;
    height: 16px;
    border-radius: 0 1px 1px 0;
    background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h3v3H0zM3 3h3v3H3z' fill='%23E1E1E1'/%3E%3Cpath d='M3 0h3v3H3zM0 3h3v3H0z' fill='white'/%3E%3C/svg%3E");
    opacity: var(--swatch-clear);
  }

  /* An edge only on a swatch close to the panel: white in light, black in dark */
  .swatch::after {
    content: '';
    position: absolute;
    inset: 0;
    display: none;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px var(--figma-color-bordertranslucent, rgba(0, 0, 0, 0.1));
  }

  .swatch.ring-light::after,
  :global(.figma-dark) .swatch.ring-dark::after {
    display: block;
  }

  :global(.figma-dark) .swatch.ring-light::after {
    display: none;
  }

  .swatch:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: 1px;
  }
</style>
