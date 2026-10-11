import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  hexToRgb,
  hslToHsv,
  hsvToHsl,
  hsvToRgb,
  parseCss,
  parseHex,
  rgbToHex,
  rgbToHsv,
} from './color';

test('parseHex: short, long and with alpha, with or without #', () => {
  assert.deepEqual(parseHex('#ABC'), { hex: '#aabbcc', alpha: null });
  assert.deepEqual(parseHex(' 0d99ff '), { hex: '#0d99ff', alpha: null });
  assert.deepEqual(parseHex('#0D99FF80'), { hex: '#0d99ff', alpha: 128 / 255 });
  for (const input of ['', '#ab', '#abcd', '#12345', 'red', null, '#gggggg'])
    assert.equal(parseHex(input), null, String(input));
});

test('hex and RGB both ways, rounded and held to a channel', () => {
  assert.deepEqual(hexToRgb('#0d99ff'), { r: 13, g: 153, b: 255 });
  assert.equal(rgbToHex({ r: 13, g: 153, b: 255 }), '#0d99ff');
  assert.equal(rgbToHex({ r: 12.6, g: -4, b: 300 }), '#0d00ff');
});

const near = (a: Record<string, number>, b: Record<string, number>) => {
  for (const k of Object.keys(b))
    assert.ok(Math.abs(a[k] - b[k]) < 1e-9, `${k}: ${a[k]} ≠ ${b[k]}`);
};

test('HSV and RGB both ways', () => {
  near(hsvToRgb({ h: 0, s: 1, v: 1 }), { r: 255, g: 0, b: 0 });
  near(hsvToRgb({ h: 120, s: 1, v: 0.5 }), { r: 0, g: 127.5, b: 0 });
  near(hsvToRgb({ h: 240, s: 0.5, v: 1 }), { r: 127.5, g: 127.5, b: 255 });
  near(rgbToHsv({ r: 0, g: 0, b: 255 }), { h: 240, s: 1, v: 1 });
  near(rgbToHsv({ r: 255, g: 0, b: 128 }), { h: 360 - (128 / 255) * 60, s: 1, v: 1 });
  near(rgbToHsv({ r: 255, g: 255, b: 0 }), { h: 60, s: 1, v: 1 });
  near(rgbToHsv({ r: 0, g: 255, b: 255 }), { h: 180, s: 1, v: 1 });
  // Gray and black have no hue or saturation
  near(rgbToHsv({ r: 128, g: 128, b: 128 }), { h: 0, s: 0, v: 128 / 255 });
  near(rgbToHsv({ r: 0, g: 0, b: 0 }), { h: 0, s: 0, v: 0 });
  for (const hex of ['#0d99ff', '#ff00ff', '#7f3a12', '#ffffff'])
    assert.equal(rgbToHex(hsvToRgb(rgbToHsv(hexToRgb(hex)))), hex);
});

test('HSV and HSL both ways, the hue kept', () => {
  near(hsvToHsl({ h: 200, s: 1, v: 1 }), { h: 200, s: 1, l: 0.5 });
  near(hsvToHsl({ h: 30, s: 0.5, v: 0.8 }), { h: 30, s: 0.5, l: 0.6 });
  near(hsvToHsl({ h: 10, s: 0, v: 1 }), { h: 10, s: 0, l: 1 });
  near(hsvToHsl({ h: 10, s: 1, v: 0 }), { h: 10, s: 0, l: 0 });
  near(hslToHsv({ h: 30, s: 0.5, l: 0.6 }), { h: 30, s: 0.5, v: 0.8 });
  near(hslToHsv({ h: 90, s: 1, l: 0 }), { h: 90, s: 0, v: 0 });
});

test('parseCss: nothing without a page to parse it', () => {
  assert.equal(parseCss('red'), null);
});
