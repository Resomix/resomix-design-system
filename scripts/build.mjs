// Generates tokens/rx.css and tokens/pixels.css from tokens/rx.json.
// Run: npm run build
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const t = JSON.parse(readFileSync(new URL('tokens/rx.json', root), 'utf8'));
const header = '/* Generated from tokens/rx.json by scripts/build.mjs. Do not edit by hand. */\n';

const line = (name, value, note) => `  --${name}: ${value};${note ? ` /* ${note} */` : ''}`;

const dark = Object.entries(t.color.dark).map(([n, v]) =>
  line(n, v.value, v.new ? 'new' : v.was ? `was ${v.was}` : ''));
const legacyDark = Object.entries(t.color.legacy).map(([n, v]) => line(n, v.dark));
const legacyLight = Object.entries(t.color.legacy)
  .filter(([, v]) => v.light !== v.dark)
  .map(([n, v]) => line(n, v.light, v.was?.light ? `was ${v.was.light}` : ''));
const rest = [...Object.entries(t.shape), ...Object.entries(t.motion)].map(([n, v]) => line(n, v));

const css = `${header}
:root {
${[...dark, '', ...legacyDark, '', ...rest].join('\n')}
}

.light {
${legacyLight.join('\n')}
}
`;
writeFileSync(new URL('tokens/rx.css', root), css);

// --px-N = N/16 rem; html font-size scales with the viewport, so every step does too.
const steps = t.px.split(/\s+/).map(Number);
const name = (n) => String(n).replace('.', '-');
const rem = (n) => `${+(n / 16).toFixed(6)}rem`;
const sizes = Object.entries(t.layout.rootFontSize);
const pixels = `${header}
html { font-size: ${sizes[0][1]}; }
@media (max-width: 1023px) { html { font-size: ${sizes[1][1]}; } }

:root {
${steps.map((n) => `  --px-${name(n)}: ${rem(n)};`).join('\n')}
}
`;
writeFileSync(new URL('tokens/pixels.css', root), pixels);

console.log(`rx.css: ${dark.length + legacyDark.length + rest.length} tokens · pixels.css: ${steps.length} steps`);
