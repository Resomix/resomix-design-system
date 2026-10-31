// Draws docs/overview.svg, the picture of the v3 system shown on the README, from tokens/v3/tokens.json.
// Run: npm run build
import { readFileSync, writeFileSync } from 'node:fs';
import { parse, ratio } from './lib/color.mjs';

const root = new URL('../', import.meta.url);
const v3 = JSON.parse(readFileSync(new URL('tokens/v3/tokens.json', root), 'utf8'));
const tok = (group, name) => v3[group].tokens.find((t) => t.name === name).value;
const px = (group, name) => parseFloat(tok(group, name));

const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'Fira Code', ui-monospace, Menlo, Consolas, monospace";
const DISPLAY = "Benzin, 'Arial Black', Arial, sans-serif";

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const text = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" font-family="${o.font ?? SANS}" font-size="${o.size ?? 15}" font-weight="${o.weight ?? 400}"` +
  ` fill="${o.fill}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${esc(s)}</text>`;
const rect = (x, y, w, h, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.fill ?? 'none'}"` +
  (o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 1}"` : '') + (o.rx ? ` rx="${o.rx}"` : '') + '/>';
// Line icons on a 24px grid, drawn at `size` px.
const ICONS = { check: 'M5 12l5 5 9-10', clock: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 7v5l3 2', info: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 11v6M12 7.5v.5', alert: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 7v6M12 16v.5' };
const icon = (name, x, y, size, color) =>
  `<g transform="translate(${x} ${y}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="${1.5 * 24 / size}" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[name]}"/></g>`;

const W = 1600;
const P = 64;
const INNER = W - 2 * P;
const studio = (n) => tok('color', n).dark;
const out = [];

// Header, on the Studio canvas
out.push(text(P, 100, 'Resomix design system', { size: 40, weight: 600, fill: studio('text-primary'), ls: -0.4 }));
out.push(text(P, 136, 'v3, calm. One set of names, two themes, every pair checked against WCAG AA.', { size: 18, fill: studio('text-secondary') }));
const badge = 'WCAG AA in both themes';
const bw = badge.length * 7.4 + 52;
out.push(rect(W - P - bw + 0.5, 78.5, bw - 1, 31, { stroke: studio('status-success'), rx: 999 }));
out.push(icon('check', W - P - bw + 14, 86, 16, studio('status-success')));
out.push(text(W - P - bw + 36, 99, badge, { size: 13, weight: 500, fill: studio('status-success') }));

// One panel per theme
const half = (INNER - 24) / 2;
const theme = (x, y, th, title, sub) => {
  const c = (n) => tok('color', n)[th];
  const rLg = px('radius', 'radius-lg');
  const rMd = px('radius', 'radius-md');
  const rSm = px('radius', 'radius-sm');
  const inner = half - 48;
  out.push(rect(x + 0.5, y + 0.5, half - 1, 640 - 1, { fill: c('bg-canvas'), stroke: c('border-default'), rx: rLg }));
  out.push(text(x + 24, y + 44, title, { size: 20, weight: 600, fill: c('text-primary') }));
  out.push(text(x + half - 24, y + 44, sub, { size: 13, fill: c('text-muted'), anchor: 'end' }));

  // Grounds
  const names = ['bg-canvas', 'bg-surface', 'bg-raised', 'bg-sunken', 'bg-overlay', 'bg-selected'];
  const sw = (inner - 5 * 8) / 6;
  names.forEach((n, i) => {
    const sx = x + 24 + i * (sw + 8);
    out.push(rect(sx + 0.5, y + 68.5, sw - 1, 47, { fill: c(n), stroke: c('border-default'), rx: rSm }));
    out.push(text(sx, y + 134, n.replace('bg-', ''), { size: 12, fill: c('text-muted') }));
    out.push(text(sx, y + 150, c(n).startsWith('#') ? c(n) : '', { font: MONO, size: 12, fill: c('text-muted') }));
  });

  // Text on a card, with contrast on the surface
  const cy = y + 172;
  out.push(rect(x + 24.5, cy + 0.5, inner - 1, 196, { fill: c('bg-surface'), stroke: c('border-default'), rx: rMd }));
  const rows = [
    ['text-primary', 'Pick up where you left off', 20, 600],
    ['text-secondary', 'Start from a track you love. We find tracks that sound like it.', 15, 400],
    ['text-muted', 'Opened 2 hours ago', 12, 400],
    ['text-accent', 'Playing · Late-night techno', 13, 500],
  ];
  rows.forEach(([n, s, size, weight], i) => {
    const ty = cy + 40 + i * 44;
    out.push(text(x + 44, ty, s, { size, weight, fill: c(n) }));
    out.push(text(x + 24 + inner - 20, ty, `${ratio(parse(c(n)), parse(c('bg-surface'))).toFixed(1)}:1`, { font: MONO, size: 12, fill: c('text-muted'), anchor: 'end' }));
  });

  // Status: always an icon and a word
  const statuses = [['status-success', 'check', 'Keep'], ['status-warning', 'clock', 'Maybe'], ['status-info', 'info', 'Analysing'], ['status-danger', 'alert', 'Failed']];
  let px0 = x + 24;
  const sy = y + 392;
  for (const [n, ic, word] of statuses) {
    const w = word.length * 7.6 + 46;
    out.push(rect(px0 + 0.5, sy + 0.5, w - 1, 27, { stroke: c(n), rx: 999 }));
    out.push(icon(ic, px0 + 10, sy + 7, 14, c(n)));
    out.push(text(px0 + 30, sy + 19, word, { size: 13, weight: 500, fill: c(n) }));
    px0 += w + 8;
  }
  out.push(rect(px0 + 0.5, sy + 0.5, 63, 27, { stroke: c('border-control'), rx: 999 }));
  out.push(text(px0 + 32, sy + 19, 'Pass', { size: 13, weight: 500, fill: c('text-secondary'), anchor: 'middle' }));

  // Controls
  const by = y + 444;
  out.push(rect(x + 24, by, 196, 48, { fill: c('accent'), rx: rSm }));
  out.push(text(x + 122, by + 30, 'Find similar tracks', { size: 15, weight: 600, fill: c('text-on-accent'), anchor: 'middle' }));
  out.push(rect(x + 236.5, by + 4.5, 143, 39, { stroke: c('border-control'), rx: rSm }));
  out.push(text(x + 308, by + 29, 'Save to crate', { size: 15, weight: 500, fill: c('text-primary'), anchor: 'middle' }));
  out.push(rect(x + 400.5, by + 4.5, 127, 39, { stroke: c('border-strong'), rx: rSm }));
  out.push(rect(x + 397, by + 1, 134, 46, { stroke: c('focus'), sw: 2, rx: rSm + 3 }));
  out.push(text(x + 464, by + 29, 'Focused', { size: 15, weight: 500, fill: c('text-primary'), anchor: 'middle' }));

  // A selected choice card: accent edge plus a check and a word
  const ky = y + 516;
  out.push(rect(x + 25, ky + 1, inner - 2, 94, { fill: c('bg-selected'), stroke: c('accent'), sw: 2, rx: rMd }));
  out.push(text(x + 44, ky + 36, 'Sound alike', { size: 16, weight: 600, fill: c('text-primary') }));
  out.push(text(x + 44, ky + 62, 'Tracks that sound like your reference.', { size: 13, fill: c('text-secondary') }));
  out.push(icon('check', x + 24 + inner - 90, ky + 23, 16, c('text-accent')));
  out.push(text(x + 24 + inner - 20, ky + 36, 'Selected', { size: 13, weight: 500, fill: c('text-accent'), anchor: 'end' }));
};
theme(P, 180, 'dark', 'Studio', 'Dark · default for the app');
theme(P + half + 24, 180, 'light', 'Daylight', 'Light · marketing, documents, print');

// Type, spacing, radius on the Studio canvas
const y = 868;
const colW = (INNER - 48) / 3;
const label = (x, s) => text(x, y, s, { size: 13, weight: 500, fill: studio('text-secondary') });
const card = (x, h) => rect(x + 0.5, y + 16.5, colW - 1, h - 1, { fill: studio('bg-surface'), stroke: studio('border-default'), rx: px('radius', 'radius-md') });

out.push(label(P, 'Type'));
out.push(card(P, 300));
const styles = v3.type.groups.flatMap((g) => g.styles.map((s) => ({ ...s, family: s.family ?? g.family })));
const pick = ['display-lg', 'page-title', 'section-title', 'card-title', 'body', 'label', 'caption', 'data'];
let ty = y + 24;
pick.map((n) => styles.find((s) => s.name === n)).forEach((s) => {
  const font = s.family === 'mono' ? MONO : s.family === 'display' ? DISPLAY : SANS;
  const size = Math.min(parseFloat(s.fontSize), 36);
  ty += size + 12;
  const short = { 'display-lg': 'Built for diggers', body: 'Start from a track you love.' };
  out.push(text(P + 20, ty, short[s.name] ?? s.sample, { font, size, weight: s.fontWeight, fill: studio('text-primary') }));
  out.push(text(P + colW - 20, ty, s.name, { font: MONO, size: 12, fill: studio('text-muted'), anchor: 'end' }));
});

const sx = P + colW + 24;
out.push(label(sx, 'Spacing · 4px base'));
out.push(card(sx, 300));
v3.spacing.tokens.forEach((t, i) => {
  const ry = y + 44 + i * 26;
  out.push(text(sx + 20, ry + 12, t.name, { font: MONO, size: 12, fill: studio('text-muted') }));
  out.push(rect(sx + 110, ry + 1, parseFloat(t.value) * 3, 14, { fill: studio('text-secondary'), rx: 2 }));
  out.push(text(sx + colW - 20, ry + 12, t.value, { font: MONO, size: 12, fill: studio('text-muted'), anchor: 'end' }));
});

const rx0 = sx + colW + 24;
out.push(label(rx0, 'Radius'));
out.push(card(rx0, 300));
v3.radius.tokens.forEach((t, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const bx = rx0 + 20 + col * ((colW - 40) / 3);
  const by = y + 44 + row * 128;
  const r = Math.min(parseFloat(t.value), 32);
  out.push(rect(bx + 0.5, by + 0.5, 79, t.name === 'radius-pill' ? 31 : 63, { fill: studio('bg-raised'), stroke: studio('border-control'), rx: r }));
  out.push(text(bx, by + 88, t.name.replace('radius-', ''), { size: 13, fill: studio('text-primary') }));
  out.push(text(bx, by + 106, t.value, { font: MONO, size: 12, fill: studio('text-muted') }));
});

const H = y + 380;
out.push(text(P, H - 30, 'Generated from tokens/v3/tokens.json by scripts/overview.mjs', { size: 12, fill: studio('text-muted') }));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Resomix design system v3: Studio and Daylight themes with grounds, text contrast, status, controls and a selected card, plus type, spacing and radius">
<rect width="${W}" height="${H}" fill="${studio('bg-canvas')}"/>
${out.join('\n')}
</svg>
`;
writeFileSync(new URL('docs/overview.svg', root), svg);
console.log('docs/overview.svg written');
