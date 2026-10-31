// Colour helpers shared by the contrast check and the overview image.

export const parse = (hex) => {
  let h = hex.replace('#', '');
  if (h.length <= 4) h = [...h].map((c) => c + c).join('');
  const [r, g, b, a] = [0, 2, 4, 6].map((i) => parseInt(h.slice(i, i + 2), 16));
  return { r, g, b, a: Number.isNaN(a) ? 1 : a / 255 };
};

// Composites a translucent colour over an opaque ground.
export const over = (fg, bg) => ({
  r: fg.r * fg.a + bg.r * (1 - fg.a),
  g: fg.g * fg.a + bg.g * (1 - fg.a),
  b: fg.b * fg.a + bg.b * (1 - fg.a),
  a: 1,
});

const lum = ({ r, g, b }) => {
  const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

export const toHex = ({ r, g, b }) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
