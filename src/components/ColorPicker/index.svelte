<!--
  ColorPicker: Figma's color picker (its Custom tab) — the saturation and
  brightness square, hue and opacity sliders, the eyedropper, a format dropdown
  with its fields, and swatches.

  - It floats by `anchorElement` while `isOpen`, below it or else above, and
    closes on X, Escape or a click outside. `position="bottom"` docks it along
    the window's bottom edge, full width, as a bottom Modal; so does a window
    too narrow for it. `inline` draws it in the flow.
  - Dragging calls `oninput`; letting go, a field, a swatch, the eyedropper or a
    key calls `onchange`. Both get `{ value, opacity }`; `value` is always
    `#RRGGBB`.
  - `swatches` takes colors — '#RRGGBB', '#RRGGBBAA', any CSS color, or
    `{ color, opacity?, label? }` — or groups of them, `{ label, colors }`,
    which a dropdown switches between, as Figma's "On this page".
  - The eyedropper is the browser's EyeDropper, left out where there is none.
  - `opacity={null}` leaves out the opacity slider and field.
  - `compact` makes the square 144px tall, the least it shrinks to in a short
    window, for a plugin with little room.
-->
<script lang="ts">
  import { onDestroy, tick, untrack } from 'svelte';
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
  } from './color';

  type Format = 'hex' | 'rgb' | 'css' | 'hsl' | 'hsb';
  /** A color: '#RRGGBB', '#RRGGBBAA' or any CSS color, or one with an opacity and a name */
  type Swatch = string | { color: string; opacity?: number; label?: string | null };
  type SwatchGroup = { label?: string | null; colors: Swatch[] };
  type Detail = { value: string; opacity: number | null };

  interface Props {
    /** Always `#RRGGBB` once the picker sets it */
    value?: string;
    /** 0–100; null leaves out the opacity slider and field */
    opacity?: number | null;
    isOpen?: boolean;
    /** What the picker floats by */
    anchorElement?: HTMLElement | null;
    /** true: drawn in the flow, always open */
    inline?: boolean;
    /** By `anchorElement`, or along the window's bottom, full width */
    position?: 'anchor' | 'bottom';
    format?: Format;
    /** Colors, or `{ label, colors }` groups */
    swatches?: Swatch[] | SwatchGroup[];
    title?: string;
    /** true: the square 144px tall instead of 208px */
    compact?: boolean;
    class?: string;
    /** While dragging, after `value` and `opacity` update */
    oninput?: (detail: Detail) => void;
    /** When the color settles, after `value` and `opacity` update */
    onchange?: (detail: Detail) => void;
    /** X, Escape or a click outside, after `isOpen` turns false */
    onclose?: () => void;
  }

  let {
    value = $bindable(),
    opacity = $bindable(),
    isOpen = $bindable(),
    anchorElement = null,
    inline = false,
    position = 'anchor',
    format = $bindable(),
    swatches = [],
    title = 'Color picker',
    compact = false,
    class: className = '',
    oninput,
    onchange,
    onclose,
  }: Props = $props();

  const titleId = `color-picker-${Math.random().toString(36).slice(2, 9)}-title`;

  const FORMATS: { label: string; value: Format }[] = [
    { label: 'Hex', value: 'hex' },
    { label: 'RGB', value: 'rgb' },
    { label: 'CSS', value: 'css' },
    { label: 'HSL', value: 'hsl' },
    { label: 'HSB', value: 'hsb' },
  ];
  type Field = { key: string; label: string; text?: boolean; max?: number };
  const FIELDS: Record<Format, Field[]> = {
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
  const OPACITY_FIELD: Field = { key: 'opacity', label: 'Opacity', max: 100 };
  // Dropdown marks its items selected, so each picker has its own
  const formatItems = FORMATS.map((f) => ({ ...f }));

  // HSV, so a gray keeps its hue and black its saturation
  let h = $state(0);
  let s = $state(0);
  let v = $state(0);
  let a = $state(1);
  let synced: string | null = null;

  // Unset, opacity is 100; null leaves it out
  let hasAlpha = $derived(opacity !== null);
  const detail = (): Detail => ({
    value: value ?? hex,
    opacity: opacity === undefined ? 100 : opacity,
  });
  $effect.pre(() => {
    const val = value;
    const op = opacity === undefined ? 100 : opacity;
    untrack(() => sync(val, op));
  });
  let rgb = $derived(hsvToRgb({ h, s, v }));
  let hex = $derived(rgbToHex(rgb));
  let hueHex = $derived(rgbToHex(hsvToRgb({ h, s: 1, v: 1 })));
  let rgbChannels = $derived([rgb.r, rgb.g, rgb.b].map(Math.round).join(' '));
  let texts = $derived(channels(h, s, v, a));
  let fields = $derived(FIELDS[format ?? 'hex'] ?? FIELDS.hex);
  let opacityCell = $derived(hasAlpha && format !== 'css');
  let columns = $derived([...fields.map(() => '1fr'), ...(opacityCell ? ['54px'] : [])].join(' '));
  let formatItem = $derived(formatItems.find((f) => f.value === format) ?? formatItems[0]);

  // Takes value and opacity from outside unless they're what the picker last
  // set: a hex can't hold the reticle's exact spot, or a gray's hue.
  function sync(val: string | undefined, op: number | null) {
    const parsed = parseHex(val);
    if (!parsed) return;
    const key = `${parsed.hex}/${op}`;
    if (key === synced) return;
    synced = key;
    if (op != null) a = clamp(op, 0, 100) / 100;
    if (parsed.hex !== rgbToHex(hsvToRgb({ h, s, v }))) set(keep(rgbToHsv(hexToRgb(parsed.hex))));
  }

  /** an HSV from a color, keeping the current hue for a gray and saturation for black */
  function keep(next: { h: number; s: number; v: number }) {
    return {
      h: next.s > 0 && next.v > 0 ? next.h : h,
      s: next.v > 0 ? next.s : s,
      v: next.v,
    };
  }

  type Move = { h?: number; s?: number; v?: number; a?: number };

  /** Moves the picker; `event` names the callback to call, if any */
  function set(next: Move, event: 'input' | 'change' | null = null) {
    if (next.h != null) h = clamp(next.h, 0, 360);
    if (next.s != null) s = clamp(next.s, 0, 1);
    if (next.v != null) v = clamp(next.v, 0, 1);
    if (next.a != null && hasAlpha) a = clamp(next.a, 0, 1);
    value = rgbToHex(hsvToRgb({ h, s, v }));
    if (hasAlpha) opacity = Math.round(a * 100);
    synced = `${value}/${opacity}`;
    if (event === 'input') oninput?.(detail());
    else if (event === 'change') onchange?.(detail());
  }

  /** set, firing `change` only if the color or opacity moved */
  function apply(next: Move) {
    const before = JSON.stringify(detail());
    set(next);
    if (JSON.stringify(detail()) !== before) onchange?.(detail());
  }

  function channels(h: number, s: number, v: number, a: number): Record<string, string> {
    const c = hsvToRgb({ h, s, v });
    const [r, g, b] = [c.r, c.g, c.b].map(Math.round);
    const hsl = hsvToHsl({ h, s, v });
    const pct = (n: number) => String(Math.round(n * 100));
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

  let stopDrag: (() => void) | null = null;

  // Window listeners, not pointer capture, which the plugin iframe can drop
  function track(event: PointerEvent, read: (e: PointerEvent) => Move) {
    if (event.button !== 0) return;
    event.preventDefault();
    stopDrag?.();
    const move = (e: PointerEvent) => set(read(e), 'input');
    const up = () => {
      stopDrag?.();
      onchange?.(detail());
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

  function drag(
    event: PointerEvent & { currentTarget: EventTarget & HTMLElement },
    read: (e: PointerEvent, r: DOMRect) => Move
  ) {
    if (event.button !== 0) return;
    const element = event.currentTarget;
    element.focus();
    track(event, (e) => read(e, element.getBoundingClientRect()));
  }

  // The % beside the opacity scrubs it, 1% a pixel, as in Figma
  function scrub(event: PointerEvent) {
    if (event.button !== 0) return;
    if (editing) (document.activeElement as HTMLElement | null)?.blur();
    const x = event.clientX;
    const start = a * 100;
    track(event, (e) => ({ a: Math.round(start + e.clientX - x) / 100 }));
  }

  onDestroy(() => stopDrag?.());

  const readSpectrum = (e: PointerEvent, r: DOMRect) => ({
    s: clamp((e.clientX - r.left) / r.width, 0, 1),
    v: 1 - clamp((e.clientY - r.top) / r.height, 0, 1),
  });
  // A thumb's center runs from 8px in at one end of the track to 8px in at the other
  const along = (e: PointerEvent, r: DOMRect) =>
    clamp((e.clientX - r.left - 8) / (r.width - 16), 0, 1);
  const readHue = (e: PointerEvent, r: DOMRect) => ({ h: along(e, r) * 360 });
  const readAlpha = (e: PointerEvent, r: DOMRect) => ({ a: along(e, r) });

  // ── Keys ──────────────────────────────────────────────────────────────

  function spectrumKey(event: KeyboardEvent) {
    const d = event.shiftKey ? 0.1 : 0.01;
    const next = (
      {
        ArrowLeft: { s: s - d },
        ArrowRight: { s: s + d },
        ArrowUp: { v: v + d },
        ArrowDown: { v: v - d },
      } as Record<string, Move>
    )[event.key];
    if (!next) return;
    event.preventDefault();
    apply(next);
  }

  function sliderKey(
    event: KeyboardEvent,
    current: number,
    max: number,
    toColor: (n: number) => Move
  ) {
    const d = event.shiftKey ? 10 : 1;
    const next = (
      {
        ArrowLeft: current - d,
        ArrowDown: current - d,
        ArrowRight: current + d,
        ArrowUp: current + d,
        Home: 0,
        End: max,
      } as Record<string, number>
    )[event.key];
    if (next == null) return;
    event.preventDefault();
    apply(toColor(clamp(Math.round(next), 0, max)));
  }

  // ── Fields ────────────────────────────────────────────────────────────

  let editing: string | null = $state(null);
  let draft = $state('');

  function commit(key: string, text: string) {
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
    const [space, channel] = key.split('.') as [Format, string];
    const field = FIELDS[space].find((f) => f.key === key);
    const amount = clamp(Math.round(n), 0, field?.max ?? 0);
    if (space === 'hsb') {
      apply({ [channel === 'b' ? 'v' : channel]: channel === 'h' ? amount : amount / 100 });
    } else if (space === 'hsl') {
      const hsl = hsvToHsl({ h, s, v });
      hsl[channel as 'h' | 's' | 'l'] = channel === 'h' ? amount : amount / 100;
      const next = hslToHsv(hsl);
      // The typed hue holds even for a gray
      apply({ h: hsl.h, s: next.v > 0 ? next.s : s, v: next.v });
    } else {
      const next = hsvToRgb({ h, s, v });
      next[channel as 'r' | 'g' | 'b'] = amount;
      apply(keep(rgbToHsv(next)));
    }
  }

  function startEdit(event: FocusEvent & { currentTarget: HTMLInputElement }, key: string) {
    editing = key;
    draft = texts[key];
    event.currentTarget.select();
  }

  function endEdit(key: string) {
    if (editing !== key) return;
    commit(key, draft);
    editing = null;
  }

  async function fieldKey(
    event: KeyboardEvent & { currentTarget: HTMLInputElement },
    field: Field
  ) {
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
      // EyeDropper is Chromium-only and not in every DOM lib
      const EyeDropper = (
        window as unknown as { EyeDropper: new () => { open(): Promise<{ sRGBHex: string }> } }
      ).EyeDropper;
      const { sRGBHex } = await new EyeDropper().open();
      const parsed = parseHex(sRGBHex) ?? parseCss(sRGBHex);
      if (parsed) apply(keep(rgbToHsv(hexToRgb(parsed.hex))));
    } catch {
      // Escape cancels the eyedropper; nothing to do
    }
  }

  // ── Swatches ──────────────────────────────────────────────────────────

  let groupIndex = $state(0);

  let groups = $derived(toGroups(swatches));
  $effect.pre(() => {
    if (groupIndex >= groups.length) groupIndex = 0;
  });
  let groupItems = $derived(
    groups.map((g, i) => ({ label: g.label ?? `Swatches ${i + 1}`, value: i }))
  );
  let groupLabels = $derived(groups.some((g) => g.label));

  type Chip = { hex: string; opacity: number; label: string | null; lightness: number };

  function toGroups(list: Swatch[] | SwatchGroup[]) {
    if (!Array.isArray(list) || !list.length) return [];
    const grouped = list.every(
      (g) => g && typeof g === 'object' && Array.isArray((g as SwatchGroup).colors)
    );
    return (grouped ? (list as SwatchGroup[]) : [{ label: null, colors: list as Swatch[] }])
      .map((g) => ({
        label: g.label ?? null,
        colors: g.colors.map(toSwatch).filter((c): c is Chip => c !== null),
      }))
      .filter((g) => g.colors.length);
  }

  function toSwatch(item: Swatch): Chip | null {
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

  function swatchName(swatch: Chip) {
    const name = swatch.label ?? swatch.hex.slice(1).toUpperCase();
    return swatch.opacity < 100 ? `${name}, ${swatch.opacity}%` : name;
  }

  function pickSwatch(swatch: Chip) {
    apply({ ...keep(rgbToHsv(hexToRgb(swatch.hex))), a: swatch.opacity / 100 });
  }

  // ── Floating ──────────────────────────────────────────────────────────

  let panel: HTMLDivElement | undefined = $state();
  let top = $state(0);
  let left = $state(0);
  let placed = $state(false);
  let docked = $state(false);
  let wasOpen = false;
  // Where focus was when the picker opened
  let opener: HTMLElement | null = null;

  $effect.pre(() => {
    if (!inline) {
      const open = !!isOpen;
      untrack(() => toggle(open));
    }
  });

  async function toggle(open: boolean) {
    if (open === wasOpen) return;
    wasOpen = open;
    placed = false;
    if (!open) return;
    opener = document.activeElement as HTMLElement | null;
    await reposition();
    panel?.focus({ preventScroll: true });
  }

  // Docked when asked, or when the window can't fit the picker's 240px and its margins
  async function reposition() {
    docked = position === 'bottom' || window.innerWidth < 240 + 16;
    await tick();
    place();
  }

  // Below the anchor, or above it, or as low as fits; inside the window either way
  function place() {
    if (!panel || inline) return;
    if (docked) {
      placed = true;
      return;
    }
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
      onclose?.();
      return;
    }
    const hadFocus = panel?.contains(document.activeElement);
    isOpen = false;
    onclose?.();
    if (hadFocus && opener?.isConnected) opener.focus();
  }

  function handleOutside(event: PointerEvent) {
    if (inline || !isOpen || !panel) return;
    const target = event.target as Node | null;
    if (panel.contains(target) || anchorElement?.contains(target)) return;
    close();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    // Stops here, so a modal the picker opened from stays open
    event.preventDefault();
    event.stopPropagation();
    close();
  }
</script>

<svelte:window onpointerdowncapture={handleOutside} onresize={() => isOpen && reposition()} />

{#if inline || isOpen}
  <div
    bind:this={panel}
    class="color-picker {className}"
    class:floating={!inline}
    class:placed
    class:docked
    class:compact
    role="dialog"
    aria-labelledby={titleId}
    tabindex="-1"
    style:top={inline || docked ? null : `${top}px`}
    style:left={inline || docked ? null : `${left}px`}
    style:--picker-hue={hueHex}
    style:--picker-color={hex}
    style:--picker-rgb={rgbChannels}
    onkeydown={handleKeydown}
  >
    <ModalHeader {title} {titleId} variant="tabs" tabs={['Custom']} onclose={close} />

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
          onpointerdown={(e) => drag(e, readSpectrum)}
          onkeydown={spectrumKey}
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
            <IconButton iconName={IconEyedropper} ariaLabel="Sample color" onclick={sample} />
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
              onpointerdown={(e) => drag(e, readHue)}
              onkeydown={(e) => sliderKey(e, h, 360, (n) => ({ h: n }))}
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
                onpointerdown={(e) => drag(e, readAlpha)}
                onkeydown={(e) => sliderKey(e, a * 100, 100, (n) => ({ a: n / 100 }))}
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
            onchange={(item) => (format = item.value)}
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
                  onfocus={(e) => startEdit(e, field.key)}
                  oninput={(e) => (draft = e.currentTarget.value)}
                  onblur={() => endEdit(field.key)}
                  onkeydown={(e) => fieldKey(e, field)}
                />
                {#if field === OPACITY_FIELD}
                  <span class="percent" aria-hidden="true" onpointerdown={scrub}>%</span>
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
                onchange={(item) => (groupIndex = item.value)}
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
                onclick={() => pickSwatch(swatch)}
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

  /* As a bottom Modal: the window's width, 8px in from its sides and bottom */
  .floating.docked {
    right: 8px;
    bottom: 8px;
    left: 8px;
    width: auto;
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

  /* Red sits under the thumb's center at either end */
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
