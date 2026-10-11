import assert from 'node:assert/strict';
import { test } from 'node:test';
import { arrowStyle, placeTooltip } from './position';

// A 400 × 300 window
Object.assign(globalThis, { window: { innerWidth: 400, innerHeight: 300 } });

const box = (left: number, top: number, width: number, height: number) =>
  ({ left, top, width, height, right: left + width, bottom: top + height }) as DOMRect;
const TIP = box(0, 0, 100, 30);

test('placeTooltip: on the side asked for, 8px off the trigger', () => {
  const trigger = box(150, 100, 100, 20);
  assert.deepEqual(placeTooltip('Top', trigger, TIP), {
    top: 62,
    left: 150,
    direction: 'Top',
    arrow: 50,
  });
  assert.deepEqual(placeTooltip('Bottom', trigger, TIP), {
    top: 128,
    left: 150,
    direction: 'Bottom',
    arrow: 50,
  });
  assert.deepEqual(placeTooltip('TopLeft', trigger, TIP), {
    top: 62,
    left: 150,
    direction: 'TopLeft',
    arrow: null,
  });
  assert.equal(placeTooltip('BottomRight', trigger, TIP).left, 150);
  assert.deepEqual(placeTooltip('Left', trigger, TIP), {
    top: 95,
    left: 42,
    direction: 'Left',
    arrow: 15,
  });
  assert.equal(placeTooltip('Right', trigger, TIP).left, 258);
});

test('placeTooltip: flips to the other side when only it has room', () => {
  const nearTop = box(150, 10, 100, 20);
  assert.equal(placeTooltip('TopRight', nearTop, TIP).direction, 'BottomRight');
  const nearBottom = box(150, 270, 100, 20);
  assert.equal(placeTooltip('Bottom', nearBottom, TIP).direction, 'Top');
  assert.equal(placeTooltip('Left', box(20, 100, 20, 20), TIP).direction, 'Right');
  assert.equal(placeTooltip('Right', box(360, 100, 20, 20), TIP).direction, 'Left');
  // Below counts the gap and the margin: 2px short, so it stays on top
  assert.equal(placeTooltip('Top', box(150, 10, 100, 252), TIP).direction, 'Top');
  // No room either side: it stays, held inside the window
  const tall = box(0, 0, 100, 290);
  const stuck = placeTooltip('Top', box(150, 100, 100, 20), tall);
  assert.deepEqual([stuck.direction, stuck.top], ['Top', 8]);
});

test('placeTooltip: held off the window edge, the arrow still at the trigger', () => {
  const atEdge = box(0, 100, 20, 20);
  const placed = placeTooltip('Bottom', atEdge, TIP);
  assert.equal(placed.left, 8);
  // The trigger's center is at 10, 2px into the body: the arrow keeps clear of the corner
  assert.equal(placed.arrow, 12);
  const right = placeTooltip('Top', box(340, 100, 60, 20), TIP);
  assert.equal(right.left, 292);
  assert.equal(right.arrow, 370 - 292);
});

test('arrowStyle: along the body edge the tooltip sits on', () => {
  assert.equal(arrowStyle('Top', 40), 'left: 40px');
  assert.equal(arrowStyle('Right', 12), 'top: 12px');
  assert.equal(arrowStyle('TopLeft', null), undefined);
});
