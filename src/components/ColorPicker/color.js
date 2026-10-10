// Color math for ColorPicker. The picker holds HSV (h 0–360, s and v 0–1) so
// the hue survives a trip through gray or black; RGB channels are 0–255.

/** @typedef {{ r: number, g: number, b: number }} Rgb */
/** @typedef {{ h: number, s: number, v: number }} Hsv */
/** @typedef {{ h: number, s: number, l: number }} Hsl */

/** @type {(n: number, lo: number, hi: number) => number} */
export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

/**
 * 'RGB', '#RRGGBB', 'RRGGBBAA'… → { hex: '#rrggbb', alpha: 0–1 | null }
 * @param {unknown} input
 * @returns {{ hex: string, alpha: number | null } | null}
 */
export function parseHex(input) {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(String(input ?? '').trim());
  if (!match) return null;
  let digits = match[1].toLowerCase();
  if (digits.length === 3) digits = [...digits].map((c) => c + c).join('');
  const alpha = digits.length === 8 ? parseInt(digits.slice(6), 16) / 255 : null;
  return { hex: `#${digits.slice(0, 6)}`, alpha };
}

/**
 * @param {string} hex
 * @returns {Rgb}
 */
export function hexToRgb(hex) {
  const n = parseInt(hex.slice(1, 7), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** @param {Rgb} rgb */
export function rgbToHex({ r, g, b }) {
  return (
    '#' + [r, g, b].map((c) => clamp(Math.round(c), 0, 255).toString(16).padStart(2, '0')).join('')
  );
}

/**
 * @param {Hsv} hsv
 * @returns {Rgb}
 */
export function hsvToRgb({ h, s, v }) {
  /** @param {number} n */
  const f = (n) => {
    const k = (n + h / 60) % 6;
    return (v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255;
  };
  return { r: f(5), g: f(3), b: f(1) };
}

/**
 * @param {Rgb} rgb
 * @returns {Hsv}
 */
export function rgbToHsv({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s: max ? d / max : 0, v: max };
}

/**
 * HSV → HSL, both with s, v and l 0–1
 * @param {Hsv} hsv
 * @returns {Hsl}
 */
export function hsvToHsl({ h, s, v }) {
  const l = v * (1 - s / 2);
  return { h, s: l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l), l };
}

/**
 * @param {Hsl} hsl
 * @returns {Hsv}
 */
export function hslToHsv({ h, s, l }) {
  const v = l + s * Math.min(l, 1 - l);
  return { h, s: v === 0 ? 0 : 2 * (1 - l / v), v };
}

/** @type {CanvasRenderingContext2D | null} */
let context = null;

/**
 * Any CSS color the browser knows (names, hsl(), rgb(), hex…) → { hex, alpha 0–1 },
 * or null. The canvas parses it: a color it can't read leaves fillStyle as it was.
 * @param {unknown} input
 * @returns {{ hex: string, alpha: number } | null}
 */
export function parseCss(input) {
  const text = String(input ?? '').trim();
  if (!text || typeof document === 'undefined') return null;
  if (!context) context = document.createElement('canvas').getContext('2d');
  if (!context) return null;
  context.fillStyle = '#000';
  context.fillStyle = text;
  const first = String(context.fillStyle);
  context.fillStyle = '#fff';
  context.fillStyle = text;
  if (String(context.fillStyle) !== first) return null;
  if (first.startsWith('#')) return { hex: first, alpha: 1 };
  const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(first);
  if (!m) return null;
  return {
    hex: rgbToHex({ r: +m[1], g: +m[2], b: +m[3] }),
    alpha: m[4] == null ? 1 : +m[4],
  };
}
