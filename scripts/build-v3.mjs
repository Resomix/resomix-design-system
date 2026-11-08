// Generates tokens/v3/tokens.css from tokens/v3/tokens.json (Studio, the only theme).
// Run: npm run build
//
// Every token becomes a custom property prefixed --ds- so it never collides with the live --rx-*
// and --color-* layers while screens move over. Lengths are emitted in rem (N / 16), the same unit
// as the apps' --px-N steps, so the system scales with the root font size like everything else.
// Type styles also become classes (.ds-<style>), with their mobile sizes under 1024px.
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const t = JSON.parse(readFileSync(new URL('tokens/v3/tokens.json', root), 'utf8'));
const header = '/* Generated from tokens/v3/tokens.json by scripts/build-v3.mjs. Do not edit by hand. */\n';

const rem = (v) => {
  const m = /^(-?\d*\.?\d+)px$/.exec(String(v));
  return m ? `${+(Number(m[1]) / 16).toFixed(6)}rem` : String(v);
};
const line = (name, value) => `  --ds-${name}: ${value};`;

const colors = t.color.tokens.map((c) => line(c.name, c.value));
const families = Object.entries(t.type.families).map(([n, v]) => line(`font-${n}`, v));
const spacing = t.spacing.tokens.map((s) => line(s.name, rem(s.value)));
const radius = t.radius.tokens.map((r) => line(r.name, r.value === '999px' ? '999px' : rem(r.value)));
const shadow = t.shadow.tokens.map((s) => line(s.name, s.value));
const size = t.size.tokens.map((s) => line(s.name, rem(s.value)));
const timing = t.timing.tokens.map((s) => line(s.name, s.value));

const styles = t.type.groups.flatMap((g) => g.styles.map((s) => ({ ...s, family: s.family ?? g.family })));
const familyOf = (f) => `var(--ds-font-${f === 'sans' || f === 'mono' || f === 'display' ? f : 'sans'})`;
const decl = (s) => [
  `  font-family: ${familyOf(s.family)};`,
  `  font-size: ${rem(s.fontSize)};`,
  `  line-height: ${rem(s.lineHeight)};`,
  `  font-weight: ${s.fontWeight};`,
  ...(s.letterSpacing ? [`  letter-spacing: ${s.letterSpacing};`] : []),
].join('\n');
const typeClasses = styles.map((s) => `.ds-${s.name} {\n${decl(s)}\n}`).join('\n\n');
const mobile = styles
  .filter((s) => s.mobile)
  .map((s) => `  .ds-${s.name} {\n    font-size: ${rem(s.mobile.fontSize)};\n    line-height: ${rem(s.mobile.lineHeight)};\n  }`)
  .join('\n\n');

const css = `${header}
:root {
  color-scheme: dark;

${[...colors, '', ...families, '', ...spacing, '', ...radius, '', ...shadow, '', ...size, '', ...timing].join('\n')}
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --ds-duration-fast: 0ms;
    --ds-duration-base: 0ms;
    --ds-duration-slow: 0ms;
  }
}

${typeClasses}

@media (max-width: 1023px) {
${mobile}
}
`;

writeFileSync(new URL('tokens/v3/tokens.css', root), css);
console.log(`v3/tokens.css: ${colors.length} colours, ${spacing.length} spaces, ${radius.length} radii, ${styles.length} type styles`);
