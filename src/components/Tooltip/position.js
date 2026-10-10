// Places a tooltip against its trigger. Shared by Tooltip and LinkTooltip.

const GAP = 8; // trigger to tooltip body; the 6px arrow sits in it
const MARGIN = 8; // kept clear of the window edge
const ARROW_INSET = 12; // an arrow's center stays this far from the body's corners

/** @type {(n: number, min: number, max: number) => number} */
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

/**
 * @param {string} direction Top | TopLeft | TopRight | Bottom | BottomLeft | BottomRight | Left | Right
 * @param {DOMRect} trigger
 * @param {DOMRect} tip the tooltip's own box
 * @returns {{ top: number, left: number, direction: string, arrow: number | null }}
 *   `direction` is the side actually used: it flips when the asked-for side has no
 *   room and the other does. `arrow` is the arrow center along the body's edge, set
 *   for the centered directions so the arrow still points at the trigger when the
 *   body is pushed off-center by the window edge; null otherwise.
 */
export function placeTooltip(direction, trigger, tip) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const roomAbove = trigger.top - GAP - tip.height >= MARGIN;
  const roomBelow = trigger.bottom + GAP + tip.height <= vh - MARGIN;
  const roomLeft = trigger.left - GAP - tip.width >= MARGIN;
  const roomRight = trigger.right + GAP + tip.width <= vw - MARGIN;

  let dir = direction;
  if (dir.startsWith('Top') && !roomAbove && roomBelow) dir = dir.replace('Top', 'Bottom');
  else if (dir.startsWith('Bottom') && !roomBelow && roomAbove) dir = dir.replace('Bottom', 'Top');
  else if (dir === 'Left' && !roomLeft && roomRight) dir = 'Right';
  else if (dir === 'Right' && !roomRight && roomLeft) dir = 'Left';

  const centreX = trigger.left + trigger.width / 2;
  const centreY = trigger.top + trigger.height / 2;
  let top = 0;
  let left = 0;

  if (dir.startsWith('Top')) top = trigger.top - GAP - tip.height;
  if (dir.startsWith('Bottom')) top = trigger.bottom + GAP;
  if (dir === 'Top' || dir === 'Bottom') left = centreX - tip.width / 2;
  if (dir === 'TopLeft' || dir === 'BottomLeft') left = trigger.left;
  if (dir === 'TopRight' || dir === 'BottomRight') left = trigger.right - tip.width;
  if (dir === 'Left' || dir === 'Right') {
    top = centreY - tip.height / 2;
    left = dir === 'Left' ? trigger.left - GAP - tip.width : trigger.right + GAP;
  }

  left = clamp(left, MARGIN, Math.max(MARGIN, vw - MARGIN - tip.width));
  top = clamp(top, MARGIN, Math.max(MARGIN, vh - MARGIN - tip.height));

  let arrow = null;
  if (dir === 'Top' || dir === 'Bottom') {
    arrow = clamp(centreX - left, ARROW_INSET, tip.width - ARROW_INSET);
  } else if (dir === 'Left' || dir === 'Right') {
    arrow = clamp(centreY - top, ARROW_INSET, tip.height - ARROW_INSET);
  }

  return { top, left, direction: dir, arrow };
}

/**
 * Inline style for the arrow element, from `placeTooltip`'s result.
 * @param {string} direction
 * @param {number | null} arrow
 */
export function arrowStyle(direction, arrow) {
  if (arrow == null) return undefined;
  return direction === 'Left' || direction === 'Right' ? `top: ${arrow}px` : `left: ${arrow}px`;
}
