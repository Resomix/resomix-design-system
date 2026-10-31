// Draws docs/overview.svg, the picture of the system shown on the README, from tokens/rx.json.
// Run: npm run build
import { readFileSync, writeFileSync } from 'node:fs';
import { parse, over, ratio, toHex } from './lib/color.mjs';

const root = new URL('../', import.meta.url);
const t = JSON.parse(readFileSync(new URL('tokens/rx.json', root), 'utf8'));
const d = Object.fromEntries(Object.entries(t.color.dark).map(([k, v]) => [k, v.value]));

const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'Fira Code', ui-monospace, Menlo, Consolas, monospace";
const DISPLAY = "Benzin, 'Arial Black', Arial, sans-serif";

const canvas = parse(d['rx-color-canvas']);
const surface = over(parse(d['rx-color-surface']), canvas);
// A token as an opaque colour on the ground it sits on.
const on = (name, ground = surface) => toHex(over(parse(d[name]), ground));
const fmt = (n) => `${n.toFixed(2)}:1`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const text = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" font-family="${o.font ?? SANS}" font-size="${o.size ?? 14}"` +
  ` font-weight="${o.weight ?? 400}" fill="${o.fill ?? on('rx-color-text-primary', canvas)}"` +
  (o.anchor ? ` text-anchor="${o.anchor}"` : '') +
  (o.ls ? ` letter-spacing="${o.ls}"` : '') + `>${o.raw ? s : esc(s)}</text>`;
const rect = (x, y, w, h, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.fill ?? 'none'}"` +
  (o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 1}"` : '') +
  (o.rx ? ` rx="${o.rx}"` : '') + '/>';
// Rectangle with the top-right corner cut, the live app's notch.
const notched = (x, y, w, h, n, o = {}) =>
  `<path d="M${x} ${y}H${x + w - n}L${x + w} ${y + n}V${y + h}H${x}Z" fill="${o.fill ?? 'none'}"` +
  (o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 1}"` : '') + '/>';

const W = 1600;
const P = 64;
const INNER = W - 2 * P;
const panelEdge = on('rx-color-border-default', canvas);
const panel = (x, y, w, h) => rect(x + 0.5, y + 0.5, w - 1, h - 1, { fill: toHex(surface), stroke: panelEdge });
const muted = on('rx-color-text-muted');
const label = (x, y, s) =>
  rect(x, y - 22, 16, 2, { fill: d['rx-color-accent'] }) +
  text(x, y, s.toUpperCase(), { font: MONO, size: 12, fill: on('rx-color-text-muted', canvas), ls: 1.5 });

const out = [];

// Header
out.push(text(P, 96, 'RESOMIX DESIGN SYSTEM', { size: 40, weight: 300, ls: 1 }));
out.push(text(P, 130, 'The tokens of the live app, checked against WCAG AA contrast on every push.', {
  size: 16, weight: 300, fill: on('rx-color-text-secondary', canvas),
}));
const badge = '✓ CONTRAST CHECKED IN CI';
const bw = badge.length * 7.6 + 32;
out.push(rect(W - P - bw + 0.5, 72.5, bw - 1, 31, { stroke: d['rx-color-success'], rx: 2 }));
out.push(text(W - P - bw / 2, 93, badge, { font: MONO, size: 12, fill: d['rx-color-success'], anchor: 'middle', ls: 1 }));

// Surfaces
let y = 200;
out.push(label(P, y, 'Surfaces'));
const grounds = [
  ['rx-color-canvas', canvas],
  ['rx-color-surface', surface],
  ['rx-color-surface-raised', over(parse(d['rx-color-surface-raised']), canvas)],
  ['rx-color-overlay', over(parse(d['rx-color-overlay']), surface), 'on surface'],
  ['rx-color-selected', over(parse(d['rx-color-selected']), surface), 'on surface'],
  ['rx-color-playing', over(parse(d['rx-color-playing']), surface), 'on surface'],
];
const sw = (INNER - 5 * 16) / 6;
grounds.forEach(([name, c, note], i) => {
  const x = P + i * (sw + 16);
  out.push(rect(x + 0.5, y + 20.5, sw - 1, 109, { fill: toHex(c), stroke: panelEdge }));
  out.push(text(x, y + 156, `--${name}`, { font: MONO, size: 13 }));
  out.push(text(x, y + 176, `${d[name]}${note ? ` · ${note}` : ''}`, { font: MONO, size: 12, fill: on('rx-color-text-muted', canvas) }));
});

// Text and accent, with each ratio measured on the surface
y = 440;
const half = (INNER - 24) / 2;
const rows = (x, title, items) => {
  out.push(label(x, y, title));
  out.push(panel(x, y + 20, half, 280));
  out.push(text(x + half - 24, y + 48, 'CONTRAST ON SURFACE', { font: MONO, size: 12, fill: muted, anchor: 'end', ls: 1 }));
  items.forEach(([name, sample, draw], i) => {
    const by = y + 92 + i * 56;
    if (draw) out.push(draw(x + 24, by));
    else out.push(text(x + 24, by, sample, { size: 18, weight: 300, fill: on(name) }));
    out.push(text(x + 24, by + 22, `--${name}`, { font: MONO, size: 12, fill: muted }));
    const fg = name === 'rx-color-on-accent' ? parse(d[name]) : parse(on(name));
    const bg = name === 'rx-color-on-accent' ? parse(d['rx-color-accent']) : surface;
    out.push(text(x + half - 24, by + 8,
      `<tspan fill="${d['rx-color-success']}">✓</tspan> ${fmt(ratio(fg, bg))}`,
      { font: MONO, size: 14, anchor: 'end', raw: true }));
  });
};
rows(P, 'Text', [
  ['rx-color-text-primary', 'Titles and main text'],
  ['rx-color-text-secondary', 'Supporting text'],
  ['rx-color-text-muted', 'Labels and hints'],
  ['rx-color-disabled', 'Searching…'],
]);
rows(P + half + 24, 'Accent and state', [
  ['rx-color-accent-text', 'Selected · Playing'],
  ['rx-color-error', 'Couldn’t load your playlists'],
  ['rx-color-success', 'Saved to your crate'],
  ['rx-color-on-accent', '', (x, by) =>
    notched(x, by - 20, 150, 28, 6, { fill: d['rx-color-accent'] }) +
    text(x + 75, by - 1, 'PRIMARY ACTION', { font: MONO, size: 12, weight: 500, fill: d['rx-color-on-accent'], anchor: 'middle', ls: 0.5 })],
]);

// Lines and controls
y = 816;
out.push(label(P, y, 'Lines and controls'));
out.push(panel(P, y + 20, INNER, 160));
const edges = [
  ['rx-color-border-subtle', 'decorative'],
  ['rx-color-border-default', 'decorative'],
  ['rx-color-border-control', 'controls'],
  ['rx-color-border-strong', 'hover'],
];
edges.forEach(([name, note], i) => {
  const x = P + 24 + i * 184;
  out.push(rect(x + 0.5, y + 48.5, 151, 55, { stroke: on(name) }));
  out.push(text(x, y + 128, `--${name.replace('rx-color-', '')}`, { font: MONO, size: 12 }));
  out.push(text(x, y + 148, `${note} · ${fmt(ratio(parse(on(name)), surface))}`, { font: MONO, size: 12, fill: muted }));
});
const bx = P + 24 + 4 * 184 + 32;
const by = y + 54;
out.push(notched(bx, by, 236, 44, 10, { fill: d['rx-color-accent'] }));
out.push(text(bx + 118, by + 27, 'FIND SIMILAR TRACKS', { font: MONO, size: 13, weight: 500, fill: d['rx-color-on-accent'], anchor: 'middle', ls: 0.8 }));
out.push(rect(bx + 256.5, by + 0.5, 171, 43, { stroke: on('rx-color-border-control'), rx: 2 }));
out.push(text(bx + 342, by + 27, 'LOAD 25 MORE', { font: MONO, size: 13, fill: on('rx-color-text-primary'), anchor: 'middle', ls: 0.8 }));
out.push(rect(bx + 448.5, by + 0.5, 131, 43, { stroke: on('rx-color-border-strong'), rx: 2 }));
out.push(rect(bx + 445, by - 3, 138, 50, { stroke: d['rx-color-focus'], sw: 2, rx: 4 }));
out.push(text(bx + 514, by + 27, 'FOCUSED', { font: MONO, size: 13, fill: on('rx-color-text-primary'), anchor: 'middle', ls: 0.8 }));
out.push(text(bx, by + 74, 'primary · secondary · keyboard focus', { font: MONO, size: 12, fill: muted }));

// Type, spacing, shape
y = 1044;
const third = (INNER - 724 - 48) / 2;
out.push(label(P, y, 'Type'));
out.push(panel(P, y + 20, 724, 224));
const type = [
  ['NIGHT SIGNAL', { size: 30, weight: 300 }, 'font-helvetica · titles, reading'],
  ['124 BPM · 8A · 6:42', { font: MONO, size: 20 }, 'font-fira · labels, buttons, numbers'],
  ['RESOMIX', { font: DISPLAY, size: 30, weight: 700 }, 'font-benzin · display, landing site'],
];
type.forEach(([s, o, meta], i) => {
  const ty = y + 82 + i * 64;
  out.push(text(P + 24, ty, s, { fill: on('rx-color-text-primary'), ...o }));
  out.push(text(P + 700, ty, meta, { font: MONO, size: 12, fill: muted, anchor: 'end' }));
});

const sx = P + 724 + 24;
out.push(label(sx, y, 'Spacing'));
out.push(panel(sx, y + 20, third, 224));
[4, 8, 12, 16, 24, 32, 48, 64].forEach((n, i) => {
  const ry = y + 44 + i * 24;
  out.push(text(sx + 24, ry + 13, `--px-${n}`, { font: MONO, size: 12, fill: muted }));
  out.push(rect(sx + 100, ry + 2, n * 3, 14, { fill: on('rx-color-score-fill') }));
});

const hx = sx + third + 24;
out.push(label(hx, y, 'Shape'));
out.push(panel(hx, y + 20, third, 224));
const shapes = [
  ['panel 0', (x, sy) => rect(x + 0.5, sy + 0.5, 55, 55, { stroke: on('rx-color-border-control') })],
  ['control 2', (x, sy) => rect(x + 0.5, sy + 0.5, 55, 55, { stroke: on('rx-color-border-control'), rx: 2 })],
  ['notch 6', (x, sy) => notched(x, sy, 56, 56, 6, { fill: d['rx-color-accent'] })],
  ['notch 10', (x, sy) => notched(x, sy, 56, 56, 10, { fill: d['rx-color-accent'] })],
];
shapes.forEach(([name, draw], i) => {
  const x = hx + 24 + i * 76;
  out.push(draw(x, y + 52));
  out.push(text(x, y + 132, name, { font: MONO, size: 12, fill: muted }));
});
out.push(text(hx + 24, y + 176, 'Square panels. The cut corner marks', { size: 14, weight: 300, fill: on('rx-color-text-secondary') }));
out.push(text(hx + 24, y + 198, 'the primary action and the selected card.', { size: 14, weight: 300, fill: on('rx-color-text-secondary') }));

// Footer
const H = y + 300;
out.push(text(P, H - 32, 'Generated from tokens/rx.json by scripts/overview.mjs', { font: MONO, size: 12, fill: on('rx-color-text-muted', canvas) }));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Resomix design system overview: surfaces, text and accent colours with contrast ratios, lines and controls, type, spacing and shape">
<rect width="${W}" height="${H}" fill="${toHex(canvas)}"/>
${out.join('\n')}
</svg>
`;
writeFileSync(new URL('docs/overview.svg', root), svg);
console.log('docs/overview.svg written');
