// Shared by NumericInput and NumericInputMulti.

// Arithmetic without eval: numbers, + - * /, parentheses and unary minus.
// Anything else is not a number.
/**
 * @param {unknown} source
 * @returns {number | null}
 */
export function evaluate(source) {
  const src = String(source ?? '')
    .replace(/,/g, '.')
    .replace(/\s+/g, '');
  if (!src) return null;
  let at = 0;
  const peek = () => src[at];
  /** @returns {number} */
  function expr() {
    let v = term();
    while (peek() === '+' || peek() === '-') v = src[at++] === '+' ? v + term() : v - term();
    return v;
  }
  /** @returns {number} */
  function term() {
    let v = factor();
    while (peek() === '*' || peek() === '/') v = src[at++] === '*' ? v * factor() : v / factor();
    return v;
  }
  /** @returns {number} */
  function factor() {
    if (peek() === '-') {
      at++;
      return -factor();
    }
    if (peek() === '+') {
      at++;
      return factor();
    }
    if (peek() === '(') {
      at++;
      const v = expr();
      if (src[at++] !== ')') throw new Error('unclosed');
      return v;
    }
    const match = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(src.slice(at));
    if (!match) throw new Error('not a number');
    at += match[0].length;
    return parseFloat(match[0]);
  }
  try {
    const v = expr();
    return at === src.length && Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

// Scrubbing, as Figma does it: a few pixels of slack first, so a click that
// jiggles is still a click, then a step per pixel, ten with Shift. Each move
// adds to the drag so far at the rate it moved at, so pressing or letting go
// of Shift mid-drag changes the rate from there instead of rescaling the
// whole drag, and a value jumps.
//
// The drag is followed on the window, not just the lead: pointer capture
// doesn't always take in a plugin's iframe, and without it the lead only hears
// moves over itself. While it lasts, the page shows the scrub cursor and
// selects no text, wherever the pointer goes.
const SLACK = 3;
const SCRUBBING = 'numeric-scrubbing';

/**
 * @template [T=number]
 * @typedef {{ id: number, x: number, start: T, offset: number, moved: boolean }} Scrub
 */

/**
 * @template T
 * @param {PointerEvent} event
 * @param {T} start
 * @returns {Scrub<T>}
 */
export function startScrub(event, start) {
  document.documentElement.classList.add(SCRUBBING);
  return { id: event.pointerId, x: event.clientX, start, offset: 0, moved: false };
}

export function endScrub() {
  document.documentElement.classList.remove(SCRUBBING);
}

/**
 * The drag's offset from its start after this move, or null for none yet.
 * @param {Scrub<unknown>} scrub
 * @param {PointerEvent} event
 * @param {number} step
 * @returns {number | null}
 */
export function scrubOffset(scrub, event, step) {
  if (event.pointerId !== scrub.id) return null;
  if (!scrub.moved) {
    if (Math.abs(event.clientX - scrub.x) < SLACK) return null;
    scrub.moved = true;
    scrub.x = event.clientX;
    return scrub.offset;
  }
  const px = Math.round(event.clientX - scrub.x);
  if (px === 0) return null;
  scrub.x += px;
  scrub.offset += px * step * (event.shiftKey ? 10 : 1);
  return scrub.offset;
}
