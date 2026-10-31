// WCAG 2.x contrast check for tokens/rx.json. Exits 1 on any failure.
// Text needs 4.5:1, control edges, focus and chart marks need 3:1 (WCAG 1.4.3, 1.4.11).
// Translucent tokens are composited over the ground they sit on.
// Run: npm run check
import { readFileSync } from 'node:fs';

const t = JSON.parse(readFileSync(new URL('../tokens/rx.json', import.meta.url), 'utf8'));
const d = Object.fromEntries(Object.entries(t.color.dark).map(([k, v]) => [k, v.value]));
const L = t.color.legacy;

const parse = (hex) => {
  let h = hex.replace('#', '');
  if (h.length <= 4) h = [...h].map((c) => c + c).join('');
  const [r, g, b, a] = [0, 2, 4, 6].map((i) => parseInt(h.slice(i, i + 2), 16));
  return { r, g, b, a: Number.isNaN(a) ? 1 : a / 255 };
};
const over = (fg, bg) => ({
  r: fg.r * fg.a + bg.r * (1 - fg.a),
  g: fg.g * fg.a + bg.g * (1 - fg.a),
  b: fg.b * fg.a + bg.b * (1 - fg.a),
  a: 1,
});
const lum = ({ r, g, b }) => {
  const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

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
