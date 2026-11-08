// Generates tokens/v2/tokens.css from tokens/v2/tokens.json (V2.1: the V2 look, resolved).
// Run: npm run build
//
// Colours become --rx-color-<name>, the names the live app already uses, plus aliases for the V2
// names that changed, so swapping this file into apps/webapp/src/index.css applies every fix.
// Spaces and sizes are emitted as var(--px-N) so they scale with the root size exactly as V2 did.
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const t = JSON.parse(readFileSync(new URL('tokens/v2/tokens.json', root), 'utf8'));
const px = (v) => {
  const m = /^(\d*\.?\d+)px$/.exec(String(v));
  return m ? `var(--px-${m[1].replace('.', '-')})` : String(v);
};
const line = (name, value) => `  --rx-${name}: ${value};`;

const colors = t.color.flatMap((g) => [`  /* ${g.group} */`, ...g.tokens.map((c) => line(`color-${c.name}`, c.value))]);
// V2 names whose meaning is unchanged but whose token was renamed or replaced.
const aliases = {
  'color-accent-text': 'color-text-accent',
  'color-on-accent': 'color-text-on-accent',
  'color-disabled': 'color-text-disabled',
  'color-error': 'color-danger',
  'color-score-fill': 'color-score-neutral',
  'color-overlay': 'color-hover',
};
const aliasLines = Object.entries(aliases).map(([o, n]) => line(o, `var(--rx-${n})`));
const families = Object.entries(t.type.families).map(([n, v]) => line(`font-${n}`, v));
const space = t.space.steps.map((s) => line(s.name, px(`${s.px}px`)));
const shape = t.shape.map((s) => line(s.name, s.name.startsWith('radius') && s.value === '999px' ? '999px' : px(s.value)));
const elev = t.elevation.map((s) => line(s.name, s.value));
const size = t.size.map((s) => line(s.name, px(s.value)));
const motion = t.motion.map((s) => line(s.name, s.value));

const cls = t.type.styles.map((s) => [
  `.rx-${s.name} {`,
  `  font-family: var(--rx-font-${s.family});`,
  `  font-size: ${px(`${s.size}px`)};`,
  `  line-height: ${px(`${s.line}px`)};`,
  `  font-weight: ${s.weight};`,
  `  letter-spacing: ${s.tracking};`,
  ...(s.case === 'upper' ? ['  text-transform: uppercase;'] : []),
  ...(s.family === 'mono' ? ['  font-variant-numeric: tabular-nums;'] : []),
  '}',
].join('\n')).join('\n\n');
const mobile = t.type.styles.filter((s) => s.mobile).map((s) =>
  `  .rx-${s.name} { font-size: ${px(`${s.mobile[0]}px`)}; line-height: ${px(`${s.mobile[1]}px`)}; }`).join('\n');

const css = `/* Generated from tokens/v2/tokens.json by scripts/build-v2.mjs. Do not edit by hand.
   Needs tokens/pixels.css (the --px-N steps) loaded first. */
:root {
  color-scheme: dark;

${colors.join('\n')}

  /* V2 names, kept so the live app picks up the fixes */
${aliasLines.join('\n')}

${[...families, '', ...space, '', ...shape, '', ...elev, '', ...size, '', ...motion].join('\n')}
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --rx-duration-fast: 0ms;
    --rx-duration-base: 0ms;
    --rx-duration-slow: 0ms;
  }
}

${cls}

@media (max-width: 1023px) {
${mobile}
}
`;
writeFileSync(new URL('tokens/v2/tokens.css', root), css);
const n = t.color.reduce((a, g) => a + g.tokens.length, 0);
console.log(`v2/tokens.css: ${n} colours, ${t.space.steps.length} spaces, ${t.type.styles.length} type styles`);
