# Resomix design system

One place for the Resomix design tokens, the rules for using them, and a contrast check that keeps them accessible.

The repo has two layers:

| Layer | What it is | Files |
|---|---|---|
| **Live app (`--rx-*`)** | The tokens the webapp runs today, read from `apps/webapp/src/index.css` and `styles/pixels.css`, with the contrast fixes from the 2026-10-31 audit applied | `tokens/rx.json` (source), `tokens/rx.css`, `tokens/pixels.css` |
| **v3 "calm"** | The direction the app is moving to: semantic tokens in two themes (Studio and Daylight), plus the written guidelines | `tokens/v3/tokens.json`, `docs/guidelines-v3.md` |

## Use it

```bash
npm run build   # regenerate tokens/rx.css and tokens/pixels.css from tokens/rx.json
npm run check   # WCAG contrast check on every text, edge and theme pair
npm test        # both, and fails if the generated CSS is out of date
```

To change a token, edit `tokens/rx.json`, run `npm test`, and commit the JSON and the generated CSS together. CI runs the same check on every push and pull request.

In the webapp, swap the `--rx-*` and `--color-*` block in `apps/webapp/src/index.css` for `tokens/rx.css`, and the `--px-*` block in `styles/pixels.css` for `tokens/pixels.css`.

## Contrast rules

- Text: 4.5:1 on every ground it can sit on, including the selected and playing tints.
- Edges of things people operate (inputs, secondary buttons, cards that act as buttons), the focus ring and chart marks: 3:1.
- `--rx-color-accent` is for fills, bars and markers. Small orange text uses `--rx-color-accent-text`.
- `--rx-color-border-subtle`, `--rx-color-border-default` and the playlist dividers are decorative. Never use them as the only edge of a control; use `--rx-color-border-control`.

What changed and why: [docs/contrast-audit.md](docs/contrast-audit.md). Where each part lives in the webapp: [docs/source-map.md](docs/source-map.md).

## Not in this repo

- **Font files.** Helvetica Neue, Benzin and Auger Mono are licensed (Auger Mono is loaded as trial files), so they stay in the webapp's `/fonts`. Only the families and fallbacks are recorded here.
- **Component code.** Panels, buttons, task cards, the results table and toasts still live in the webapp and `packages/ui`. See the source map.
