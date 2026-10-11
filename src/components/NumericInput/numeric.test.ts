import assert from 'node:assert/strict';
import { test } from 'node:test';
import { endScrub, evaluate, scrubOffset, startScrub } from './numeric';

test('evaluate: numbers and arithmetic, in the usual order', () => {
  assert.equal(evaluate('12'), 12);
  assert.equal(evaluate(' 1.5 '), 1.5);
  assert.equal(evaluate('1,5'), 1.5);
  assert.equal(evaluate('.5'), 0.5);
  assert.equal(evaluate('1e3'), 1000);
  assert.equal(evaluate('2+3*4'), 14);
  assert.equal(evaluate('(2+3)*4'), 20);
  assert.equal(evaluate('10-4-3'), 3);
  assert.equal(evaluate('24/2/3'), 4);
  assert.equal(evaluate('-(-2)'), 2);
  assert.equal(evaluate('+3--2'), 5);
  assert.equal(evaluate(16), 16);
});

test('evaluate: anything else is not a number', () => {
  for (const source of [
    '',
    null,
    undefined,
    'abc',
    '2(3)',
    '(1+2',
    '1+',
    '1/0',
    '3px',
    '1..2',
    '(2]',
  ])
    assert.equal(evaluate(source), null, String(source));
});

// Scrubbing touches the page's class list; a stand-in will do
const classes = new Set<string>();
Object.assign(globalThis, {
  document: {
    documentElement: {
      classList: { add: (c: string) => classes.add(c), remove: (c: string) => classes.delete(c) },
    },
  },
});
const move = (clientX: number, shiftKey = false, pointerId = 1) =>
  ({ clientX, shiftKey, pointerId }) as PointerEvent;

test('scrubbing: some slack first, then a step a pixel, ten with Shift', () => {
  const scrub = startScrub(move(100), 50);
  assert.deepEqual([...classes], ['numeric-scrubbing']);
  assert.equal(scrubOffset(scrub, move(102), 1), null);
  // Past the slack: it starts from where it is, so the value doesn't jump
  assert.equal(scrubOffset(scrub, move(97), 1), 0);
  assert.equal(scrubOffset(scrub, move(97), 1), null);
  assert.equal(scrubOffset(scrub, move(102), 1), 5);
  // Shift from here on: ten a pixel, added to the drag so far
  assert.equal(scrubOffset(scrub, move(104, true), 1), 25);
  assert.equal(scrubOffset(scrub, move(103), 0.5), 24.5);
  // Another pointer's moves aren't this drag's
  assert.equal(scrubOffset(scrub, move(300, false, 2), 1), null);
  assert.equal(scrub.start, 50);
  endScrub();
  assert.deepEqual([...classes], []);
});
