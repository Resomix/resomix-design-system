// WCAG 2.x contrast check for tokens/rx.json. Exits 1 on any failure.
// Text needs 4.5:1, control edges, focus and chart marks need 3:1 (WCAG 1.4.3, 1.4.11).
// Translucent tokens are composited over the ground they sit on.
// Run: npm run check
import { readFileSync } from 'node:fs';
import { parse, over, ratio } from './lib/color.mjs';

const t = JSON.parse(readFileSync(new URL('../tokens/rx.json', import.meta.url), 'utf8'));
const d = Object.fromEntries(Object.entries(t.color.dark).map(([k, v]) => [k, v.value]));
const L = t.color.legacy;

const canvas = parse(d['rx-color-canvas']);
const surface = over(parse(d['rx-color-surface']), canvas);
const grounds = {
  canvas,
  surface,
  raised: over(parse(d['rx-color-surface-raised']), canvas),
  'overlay/surface': over(parse(d['rx-color-overlay']), surface),
  'selected/surface': over(parse(d['rx-color-selected']), surface),
  'playing/surface': over(parse(d['rx-color-playing']), surface),
  'accent-soft/surface': over(parse(d['rx-color-accent-soft']), surface),
};

const checks = [];
const add = (fg, bg, min, label) => checks.push({ fg, bg, min, label });

for (const fg of ['rx-color-text-primary', 'rx-color-text-secondary', 'rx-color-text-muted',
  'rx-color-accent-text', 'rx-color-error', 'rx-color-success', 'rx-color-disabled']) {
  for (const [g, bg] of Object.entries(grounds)) add(fg, bg, 4.5, g);
}
for (const fg of ['rx-color-border-control', 'rx-color-border-strong', 'rx-color-focus',
  'rx-color-score-fill', 'rx-color-accent']) {
  for (const [g, bg] of Object.entries(grounds)) add(fg, bg, 3, g);
}
for (const bg of ['rx-color-accent', 'rx-color-accent-hover']) {
  add('rx-color-on-accent', parse(d[bg]), 4.5, bg);
}
for (const theme of ['dark', 'light']) {
  const c = (n) => parse(L[n][theme]);
  const pairs = [
    ['color-primary', 'color-primary-background'],
    ['color-primary', 'color-secondary-background'],
    ['color-text-primary', 'color-primary'],
    ['color-text-secondary', 'color-secondary'],
    ['color-text-secondary', 'color-secondary-background'],
  ];
  for (const [fg, bg] of pairs) checks.push({ fg: `${fg} (${theme})`, color: c(fg), bg: c(bg), min: 4.5, label: `${bg} (${theme})` });
}

let failed = 0;
for (const ch of checks) {
  const fg = ch.color ?? parse(d[ch.fg]);
  const r = ratio(over(fg, ch.bg), ch.bg);
  if (r < ch.min) {
    failed++;
    console.log(`✕ ${ch.fg} on ${ch.label}: ${r.toFixed(2)} (needs ${ch.min})`);
  }
}
console.log(failed ? `\n${failed} of ${checks.length} pairs fail.` : `✓ All ${checks.length} pairs pass.`);
process.exit(failed ? 1 : 0);
