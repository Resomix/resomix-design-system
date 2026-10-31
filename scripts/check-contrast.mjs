// WCAG 2.x contrast check for the v3 tokens in both themes, plus a check that every
// alias in tokens/compat.json points at a token that exists. Exits 1 on any failure.
// Text needs 4.5:1; control edges, focus and chart marks need 3:1 (WCAG 1.4.3, 1.4.11).
// Run: npm run check
import { readFileSync } from 'node:fs';
import { parse, ratio } from './lib/color.mjs';

const read = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const v3 = read('tokens/v3/tokens.json');
const compat = read('tokens/compat.json');
const value = (name, theme) => v3.color.tokens.find((t) => t.name === name).value[theme];

const grounds = ['bg-canvas', 'bg-surface', 'bg-raised', 'bg-sunken', 'bg-overlay', 'bg-hover', 'bg-selected'];
const content = ['bg-canvas', 'bg-surface', 'bg-raised'];
const rules = [
  ...['text-primary', 'text-secondary', 'text-muted', 'text-accent'].map((fg) => [fg, grounds, 4.5]),
  ...['border-control', 'focus'].map((fg) => [fg, grounds, 3]),
  ...['status-success', 'status-warning', 'status-danger', 'status-info'].map((fg) => [fg, content, 4.5]),
  ...[1, 2, 3, 4, 5].map((i) => [`data-${i}`, ['bg-surface'], 3]),
  ['text-on-accent', ['accent', 'accent-hover'], 4.5],
  ['tool-ink', [1, 2, 3, 4, 5].map((i) => `data-${i}`), 4.5],
];

let total = 0;
const failures = [];
for (const theme of ['dark', 'light']) {
  for (const [fg, bgs, min] of rules) {
    for (const bg of bgs) {
      total++;
      const r = ratio(parse(value(fg, theme)), parse(value(bg, theme)));
      if (r < min) failures.push(`✕ ${theme === 'dark' ? 'Studio' : 'Daylight'}: ${fg} on ${bg} is ${r.toFixed(2)} (needs ${min})`);
    }
  }
}

const known = new Set([
  ...v3.color.tokens, ...v3.spacing.tokens, ...v3.radius.tokens, ...v3.shadow.tokens, ...v3.size.tokens, ...v3.timing.tokens,
].map((t) => t.name));
for (const [name, a] of Object.entries(compat.aliases)) {
  for (const [, ref] of a.to.matchAll(/var\(--([\w-]+)\)/g)) {
    total++;
    if (!known.has(ref)) failures.push(`✕ alias --${name} points at --${ref}, which v3 does not define`);
  }
}

console.log(failures.length ? `${failures.join('\n')}\n\n${failures.length} of ${total} checks fail.` : `✓ All ${total} checks pass.`);
process.exit(failures.length ? 1 : 0);
