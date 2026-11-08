// WCAG 2.2 contrast check for V2.1 (tokens/v2/tokens.json). Exits 1 on any failure.
// Text 4.5:1 (disabled too, so busy labels stay readable); control edges, focus, marks, status and
// data marks 3:1 (WCAG 1.4.3, 1.4.11). Every pair is checked on every ground it can sit on.
// Also checks that danger and accent are told apart by more than hue alone would allow.
// Run: npm run check
import { readFileSync } from 'node:fs';
import { parse, ratio } from './lib/color.mjs';

const t = JSON.parse(readFileSync(new URL('../tokens/v2/tokens.json', import.meta.url), 'utf8'));
const c = Object.fromEntries(t.color.flatMap((g) => g.tokens).map((x) => [x.name, x.value]));

const GROUNDS = ['canvas', 'surface', 'surface-raised', 'sunken', 'hover', 'pressed', 'overlay', 'selected', 'playing', 'accent-soft', 'danger-soft'];
const rules = [
  { fg: ['text-primary', 'text-secondary', 'text-muted', 'text-disabled', 'text-accent', 'text-danger'], min: 4.5 },
  { fg: ['border-control', 'border-strong', 'focus', 'accent'], min: 3 },
  { fg: ['success', 'warning', 'danger', 'info'], min: 3 },
];
const checks = [];
for (const { fg, min } of rules) for (const f of fg) for (const g of GROUNDS) checks.push({ f, g, min });
for (const g of ['accent', 'accent-hover', 'accent-pressed']) checks.push({ f: 'text-on-accent', g, min: 4.5 });
checks.push({ f: 'match-tick', g: 'accent', min: 3 }, { f: 'match-tick', g: 'match-from', min: 3 });
checks.push({ f: 'accent', g: 'match-track', min: 3 }, { f: 'score-neutral', g: 'match-track', min: 3 });
// Steps of text must read as steps: each at least 1.15:1 apart.
checks.push({ f: 'text-primary', g: 'text-secondary', min: 1.15, step: true }, { f: 'text-secondary', g: 'text-muted', min: 1.15, step: true });

let failed = 0;
for (const { f, g, min, step } of checks) {
  if (!c[f] || !c[g]) { failed++; console.log(`✕ missing token: ${c[f] ? g : f}`); continue; }
  const r = ratio(parse(c[f]), parse(c[g]));
  if (r < min) { failed++; console.log(`✕ ${f} ${step ? 'vs' : 'on'} ${g}: ${r.toFixed(2)} (needs ${min})`); }
}
// Danger vs accent: hue apart by at least 15 degrees (V2's error was 4 degrees from the accent).
const hue = (hex) => {
  const { r: R, g: G, b: B } = parse(hex); const [r, g, b] = [R, G, B].map((v) => v / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (!d) return 0;
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
};
const dh = Math.abs(hue(c.danger) - hue(c.accent));
const hueGap = Math.min(dh, 360 - dh);
if (hueGap < 15) { failed++; console.log(`✕ danger is ${hueGap.toFixed(0)}° from accent (needs 15°)`); }
console.log(failed ? `\nv2.1: ${failed} checks fail.` : `✓ v2.1: all ${checks.length + 1} checks pass (danger ${hueGap.toFixed(0)}° from accent).`);
process.exit(failed ? 1 : 0);
