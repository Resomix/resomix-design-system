// WCAG 2.2 contrast check for the v3 Studio tokens (tokens/v3/tokens.json). Exits 1 on any failure.
// Text 4.5:1; disabled text 3:1 (stricter than WCAG, which exempts it); control edges, focus,
// status colours, chart marks and the accent fill 3:1 (WCAG 1.4.3, 1.4.11). Every pair is checked
// on every ground a thing can sit on.
// Run: npm run check
import { readFileSync } from 'node:fs';
import { parse, ratio } from './lib/color.mjs';

const t = JSON.parse(readFileSync(new URL('../tokens/v3/tokens.json', import.meta.url), 'utf8'));
const c = Object.fromEntries(t.color.tokens.map((x) => [x.name, x.value]));

// Grounds text and controls can sit on. bg-scrim is a dimming layer, never a ground for content.
const GROUNDS = ['bg-canvas', 'bg-surface', 'bg-raised', 'bg-sunken', 'bg-overlay', 'bg-hover', 'bg-selected'];

const rules = [
  { fg: ['text-primary', 'text-secondary', 'text-muted', 'text-accent'], min: 4.5 },
  { fg: ['text-disabled'], min: 3 },
  { fg: ['border-control', 'border-strong', 'focus', 'accent'], min: 3 },
  { fg: ['status-success', 'status-warning', 'status-danger', 'status-info'], min: 3 },
  { fg: ['data-1', 'data-2', 'data-3', 'data-4', 'data-5'], min: 3 },
];

const checks = [];
for (const { fg, min } of rules) {
  for (const f of fg) for (const g of GROUNDS) checks.push({ f, g, min });
}
// Text on the accent fills, and tool glyphs on their data tiles.
for (const g of ['accent', 'accent-hover']) checks.push({ f: 'text-on-accent', g, min: 4.5 });
for (const g of ['data-1', 'data-2', 'data-3', 'data-4', 'data-5']) checks.push({ f: 'tool-ink', g, min: 4.5 });

let failed = 0;
for (const { f, g, min } of checks) {
  if (!c[f] || !c[g]) {
    failed++;
    console.log(`✕ missing token: ${c[f] ? g : f}`);
    continue;
  }
  const r = ratio(parse(c[f]), parse(c[g]));
  if (r < min) {
    failed++;
    console.log(`✕ ${f} on ${g}: ${r.toFixed(2)} (needs ${min})`);
  }
}
console.log(failed ? `\nv3: ${failed} of ${checks.length} pairs fail.` : `✓ v3: all ${checks.length} pairs pass.`);
process.exit(failed ? 1 : 0);
