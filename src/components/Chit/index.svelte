<!--
  Chit: UI3's color swatch (`_Chit 24` in the UI3 file) — a 24px cell holding a
  14px square or a 16px circle, so it lines up with icons.

  - A solid color gets a translucent 1px edge, so white still reads.
  - A translucent color splits like Figma's: opaque on the left, the real alpha
    over the checkerboard on the right. Alpha comes from the color (#RRGGBBAA,
    rgba()) and/or `opacity` (0–100).
  - A CSS gradient fills the square as is; `image` fills it over the checkerboard.
  - Several colors draw as equal slices, left to right — a variable's modes,
    when which one renders is not known. No color draws an empty, dashed chit.
-->
<script lang="ts">
  interface Props {
    /** Any CSS color or gradient, or several colors */
    color?: string | string[] | null;
    /** 0–100, multiplied with any alpha in `color` */
    opacity?: number;
    /** Image URL, for image fills */
    image?: string | null;
    shape?: 'square' | 'circle';
    /** Set when the color is information and not decoration */
    ariaLabel?: string | null;
    class?: string;
  }

  let {
    color = null,
    opacity = 100,
    image = null,
    shape = 'square',
    ariaLabel = null,
    class: className = '',
  }: Props = $props();

  let colors = $derived(color == null ? [] : Array.isArray(color) ? color : [color]);
  let gradient = $derived(colors.length === 1 && /gradient\(/.test(colors[0]));
  let parsed = $derived(colors.length === 1 && !gradient ? split(colors[0]) : null);
  let alpha = $derived((parsed ? parsed.alpha : 1) * Math.min(1, Math.max(0, opacity / 100)));
  let kind = $derived(
    image
      ? 'image'
      : colors.length === 0
        ? 'empty'
        : colors.length > 1
          ? 'modes'
          : gradient
            ? 'gradient'
            : alpha < 1
              ? 'alpha'
              : 'fill'
  );
  // Hard stops, so each mode is a slice and not a blend.
  let slices = $derived(
    colors
      .map((c, i) => `${c} ${(i / colors.length) * 100}% ${((i + 1) / colors.length) * 100}%`)
      .join(', ')
  );

  // The opaque color and its alpha, for hex and rgb()/rgba(). Anything else
  // (a name, a var()) is taken as opaque.
  function split(value: string): { solid: string; alpha: number } {
    const hex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(value.trim());
    if (hex) {
      let h = hex[1];
      if (h.length <= 4) h = [...h].map((c) => c + c).join('');
      const a = h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1;
      return { solid: `#${h.slice(0, 6)}`, alpha: a };
    }
    const rgb =
      /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i.exec(
        value.trim()
      );
    if (rgb) {
      const raw = rgb[4];
      const a = raw == null ? 1 : raw.endsWith('%') ? parseFloat(raw) / 100 : parseFloat(raw);
      return { solid: `rgb(${rgb[1]}, ${rgb[2]}, ${rgb[3]})`, alpha: a };
    }
    return { solid: value, alpha: 1 };
  }
</script>

<span
  class="chit {className}"
  role={ariaLabel ? 'img' : undefined}
  aria-label={ariaLabel || undefined}
  aria-hidden={ariaLabel ? undefined : 'true'}
>
  <span
    class="swatch {kind}"
    class:circle={shape === 'circle'}
    style:--chit-solid={parsed ? parsed.solid : null}
    style:--chit-alpha={alpha}
    style:--chit-fill={kind === 'gradient'
      ? colors[0]
      : kind === 'modes'
        ? `linear-gradient(to right, ${slices})`
        : null}
    style:--chit-image={image ? `url("${image}")` : null}
  >
    {#if kind === 'alpha'}
      <span class="half solid"></span>
      <span class="half translucent"></span>
    {/if}
  </span>
</span>

<style>
  .chit {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: var(--size-small); /* 24px, the icon cell */
    height: var(--size-small);
  }

  .swatch {
    --chit-checkerboard: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVR42mN4iAH+YwCGIasIUwhT25BVBABMTZUQNDC5rAAAAABJRU5ErkJggg==');
    position: relative;
    display: flex;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    overflow: hidden;
    border-radius: var(--border-radius-small); /* 2px */
    background-color: var(--figma-color-bg);
  }

  .swatch.circle {
    width: var(--size-xsmall); /* 16px */
    height: var(--size-xsmall);
    border-radius: 50%;
  }

  /* The translucent edge, drawn over the color so it fills the whole square. */
  .swatch.fill::after,
  .swatch.image::after,
  .swatch.modes::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid var(--figma-color-bordertranslucent, rgba(0, 0, 0, 0.1));
    border-radius: inherit;
  }

  .swatch.circle::after {
    display: none;
  }

  .fill {
    background-color: var(--chit-solid);
  }

  .gradient,
  .modes {
    background-image: var(--chit-fill);
  }

  .image {
    background:
      var(--chit-image) center / cover no-repeat,
      var(--chit-checkerboard) top left / 9.36px 9.36px;
  }

  .alpha {
    background: var(--chit-checkerboard) top left / 9.36px 9.36px;
  }

  .half {
    flex: 1 1 50%;
    background-color: var(--chit-solid);
  }

  .half.translucent {
    opacity: var(--chit-alpha);
  }

  /* A circle has no room for the split; it shows the alpha whole. */
  .circle .half.solid {
    display: none;
  }

  .empty {
    background: none;
    border: 1px dashed var(--figma-color-border-strong, var(--figma-color-border));
  }
</style>
