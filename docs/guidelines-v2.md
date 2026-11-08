# Resomix V2.1: the V2 look, resolved

V2 "brutal" stays the look. V2.1 keeps every part of its character and fixes what kept it from meeting WCAG 2.2 AA and from being a complete system. Nothing in V2.1 comes from v3.

- Tokens: [`tokens/v2/tokens.json`](../tokens/v2/tokens.json), generated as [`tokens/v2/tokens.css`](../tokens/v2/tokens.css) (`npm run build`).
- Components: [`tokens/v2/components.css`](../tokens/v2/components.css), the `rx-*` classes with every state.
- Contrast: `npm run check` tests 164 pairs, including the danger/accent hue gap.
- Load order: `tokens/pixels.css`, then `tokens/v2/tokens.css`, then `tokens/v2/components.css`.

## What V2 is (kept)

| Trait | What it looks like | Why it stays |
|---|---|---|
| Instrument panel | Square panels on a near-black `#050505` canvas, solid `#111` surfaces, 1px hairline edges, no shadows on the page | Reads like hardware: a mixer or a rack unit. It is what makes Resomix look like a tool for people who work with sound. |
| The mark | A short accent bar on a panel's top edge. Thin (2px) means it presents; thick (4px) means you can press it; none means it sits inside another panel | A label you read before the words. It encodes something true, so it is not decoration. |
| The cut corner | The primary button and a selected card are cut at the top right (6, 10 or 16px) | The one shape only Resomix has. Rounded corners never appear. |
| Two voices | Helvetica for what people read; Fira Code uppercase with wide tracking for the machine readout: labels, buttons, headers, numbers | Human and instrument side by side. `OUTPUT // RANKED SIMILARITY PLAYLIST` is the system speaking. |
| Light display | Page titles in Helvetica 300 uppercase; Benzin 700 for the brand on marketing | Calm weight at large sizes, the contrast with heavy mono labels. |
| One neon accent | `#ee4a26` for the primary action, selected, playing, the marks and the match bar, nothing else | Orange always means "this one" or "go". |
| Row markers and match bars | A 3px inset marker on a row (playing, paused); a gradient bar with a white end tick and the score in mono | Results read like levels on a meter. |

## What changed and why

| # | V2 problem | V2.1 fix |
|---|---|---|
| 1 | Text colours were translucent white (`#fffffff5`, `#ffffffcc`, `#ffffffb8`), so contrast changed with every ground and could not be tested reliably | Opaque values with the same look on `#111`: `#f5f5f5`, `#cfcfcf`, and muted darkened to `#a3a3a3` so the three steps are actually distinct. Each passes 4.5:1 on all 11 grounds (lowest: muted 6.05:1 on the playing tint) |
| 2 | Tints and hover were alpha washes (`#ee4a260f`, `#ffffff0a`) | Opaque grounds: `selected`, `playing`, `accent-soft`, `hover`, `pressed`, plus new `sunken`, `overlay`, `danger-soft`, so every text-on-ground pair is checked |
| 3 | Error `#ff7660` was 4° of hue from the accent, so an error looked like a highlight | `danger` `#ff6b7d`, 18° away and pinker; errors always carry an icon and a word |
| 4 | No warning or info colour | `warning` `#f5b94a`, `info` `#7cb7ff`, each with an icon and a word |
| 5 | Table headers and some kickers at 9px (7.2px at 1024px wide) | 11px floor (`label-sm`); nothing smaller anywhere |
| 6 | Body copy in Helvetica 300 at 13–15px: thin strokes break up on black even when the colour passes | 300 only at 18px and up (lead, page titles). Body text is 400. **Assumption, confirm.** |
| 7 | Uppercase labels were real capitals in the markup | Labels and buttons are written in sentence case and uppercased by CSS, so screen readers read words. Uppercase is limited to 5 words or fewer |
| 8 | Back button drawn with the accent border | Back is a secondary button with an arrow. Orange stays for the primary action and selection |
| 9 | Two unrelated button sizes (44 workspace, 36 page) and many one-off heights | One control scale: 32 / 36 / 44 / 52; phones use 44 for main controls |
| 10 | Hundreds of ad-hoc `--px-N` steps (8.889, 117.8, 9137…) | 12 space tokens on a 4px grid, 11 size tokens; the `--px-N` steps stay only as the unit. New code uses the tokens |
| 11 | Disabled shown by opacity; busy, blocked, error and read-only states undefined | Every component has default, hover, active, focus, selected, disabled, busy (`aria-busy`), blocked (`aria-disabled`, still focusable), error (`aria-invalid`) and read-only where relevant |
| 12 | The notch was a clip-path on the button, which also clipped the focus ring | The fill is a layer under the label; the ring is never clipped |
| 13 | Icons: 83 files, many duplicated as `_white` / `_black`, filled and stroked mixed | One set: 20px grid, 1.5px stroke, square caps and mitred joins (they echo the cut corner), `currentColor` only. Sizes 16, 20, 24 |
| 14 | Easing `ease`, no slow step | `cubic-bezier(0.2, 0, 0, 1)`; 120 / 160 / 240ms; all 0 with reduced motion |

## Colour

| Group | Tokens |
|---|---|
| Grounds | `canvas` #050505 · `surface` #111111 · `surface-raised` #171717 · `sunken` #0a0a0a · `hover` #1c1c1c · `pressed` #222222 · `overlay` #161616 · `selected` #1e1412 · `playing` #3d1c15 · `accent-soft` #301914 · `danger-soft` #2a1216 · `scrim` rgba(0,0,0,.72) |
| Text | `text-primary` #f5f5f5 (17.3:1 on surface) · `text-secondary` #cfcfcf (12.1) · `text-muted` #a3a3a3 (7.5) · `text-disabled` #8f8f8f (5.8) · `text-accent` #ff7a5c (7.4) · `text-danger` #ff6b7d (6.9) · `text-on-accent` #050505 (5.5 on accent) |
| Lines | `border-subtle` #1f1f1f and `border-default` #2e2e2e (decorative only) · `border-control` #757575 (4.1 on surface, 3.3 minimum) · `border-strong` #a3a3a3 |
| Accent | `accent` #ee4a26 · `accent-hover` #f46545 · `accent-pressed` #e2431f · `focus` #ff8f74 (8.5) |
| Status | `success` #63d28f · `warning` #f5b94a · `danger` #ff6b7d · `info` #7cb7ff, each 5.5:1 or more on every ground |
| Data | `match-track` #262626 · `match-from` #5a2216 · `match-tick` #f5f5f5 · `score-neutral` #8f8f8f |

Rules:
- One accent fill per view: the primary button. Selected and playing use the accent as an edge, marker or tint, never a second fill.
- Small orange text uses `text-accent`, never `accent`.
- Status is never colour alone: an icon and a word always come with it.
- `border-subtle` and `border-default` never form the only edge of something people operate; that is `border-control`.

## Type

Two voices and a brand face. Nothing is set under 11px.

| Style | Spec | Use |
|---|---|---|
| `display-xl` | Benzin 700, 64/64 (phone 40/44), caps | Marketing hero, once per page |
| `display-lg` | Benzin 700, 40/44 (phone 32/36), caps | Marketing section opener, closing call to action |
| `title-lg` | Helvetica 300, 32/38 (phone 26/32), caps, 5 words or fewer | App page title |
| `title` | Helvetica 500, 20/26 | Headings in content, dialog titles |
| `card-title` | Helvetica 700, 16/22, caps, 4 words or fewer | Task cards and pressable panels |
| `lead` | Helvetica 300, 18/28 | The sentence under a title |
| `body` | Helvetica 400, 15/24 | Paragraphs and messages |
| `body-sm` | Helvetica 400, 13/20 | Help text, toast body, artist |
| `track-title` | Helvetica 400, 14/20, caps | Track titles in rows |
| `caption` | Helvetica 400, 12/16 | Fine print |
| `kicker` | Fira Code 600, 13/16, caps, 0.18em, after a 40px accent rule | Section kicker |
| `button` | Fira Code 600, 13/16, caps, 0.12em | Button labels, 3 words or fewer |
| `label` | Fira Code 500, 12/16, caps, 0.12em | Field labels, badges, `OUTPUT //` lines |
| `label-sm` | Fira Code 500, 11/14, caps, 0.1em | Table headers, dense meta |
| `data` / `data-sm` | Fira Code 400, 13/16 and 12/16, tabular | BPM, key, time, score |

Each style is a class (`.rx-title-lg`) and its sizes use `--px-N`, so the type scales with the root size as V2 did.

## Space, shape, size, motion

- **Space** (`--rx-space-N` = N×4px): 0-5 (2), 1 (4), 2 (8), 3 (12), 4 (16), 5 (20), 6 (24), 8 (32), 10 (40), 12 (48), 16 (64), 20 (80). Panels pad 32 (24 on phones); app sections are 48 apart, marketing sections 64/80.
- **Shape**: `radius-panel` 0 for every panel, card, table, dialog and toast; `radius-control` 2px for buttons, inputs, badges, checkboxes and switches; `radius-round` only for radios and status dots. Notches 6 / 10 / 16. Marks 24px long, 2px thin, 4px thick; row marker 3px; kicker rule 40px.
- **Elevation**: the page is flat. Depth comes from the ground steps (canvas → surface → raised) and hairlines. Only floating things (dialogs, menus, toasts, drawers) get `shadow-overlay` with a `border-strong` edge.
- **Focus**: `ring` = 1px canvas gap, then a 2px `focus` ring, on every focusable thing, never removed. Rows use a 2px inset ring.
- **Size**: controls 32 / 36 / 44 / 52; icons 16 / 20 / 24; target minimum 24 (WCAG 2.5.8), 44 for main controls on phones; content 78rem; reading 680px.
- **Motion**: fades and colour changes only. 120ms (rows), 160ms (buttons, cards), 240ms (a panel or toast arriving); 0 with reduced motion.

## Components and their states

| Component | Class | States |
|---|---|---|
| Primary button | `rx-btn rx-btn--primary` (+ `--sm`, `--lg`, `--xl`) | default accent fill with cut corner · hover `accent-hover` · active `accent-pressed` · focus ring · busy (`aria-busy`, label "Searching…") and disabled: `surface-raised` fill, `border-default` edge, `text-disabled`, cut kept · blocked (`aria-disabled`): looks disabled, stays focusable, pressing it shows an info toast saying why |
| Secondary | `rx-btn--secondary` | `border-control` edge · hover `hover` fill + `border-strong` · active `pressed` · focus · disabled/busy/blocked |
| Danger | `rx-btn--danger` | `danger` edge, `text-danger` label · hover `danger-soft` · active · focus · disabled. Always confirms first, naming the exact thing |
| Ghost | `rx-btn--ghost` | `text-secondary` · hover `text-primary` + `hover` fill · active · focus · disabled |
| Back | `rx-btn--secondary` with ← | as secondary; never orange |
| Icon button | `rx-icon-btn` (+ `--lg`) | edge · hover · active · pressed/playing (`aria-pressed`: `playing` fill, accent edge) · focus · disabled. Always has an `aria-label` |
| Text link | `rx-link`, `rx-link--inline` | underline `border-control` · hover underline `text-primary` · focus |
| Field | `rx-field`, `rx-field__label`, `rx-input` (+ `--lg`), `rx-field__help`, `rx-field__error` | default `sunken` with `border-control` · hover `border-strong` · focus `focus` edge + ring · filled · error (`aria-invalid`, `danger` edge, message with icon saying what to do) · disabled (`canvas`, `border-default`, `text-disabled`) · read-only (dashed `border-default`) |
| Checkbox, radio | `rx-check` in `rx-choice` | default · hover · checked (accent fill and on-accent tick; radio: accent dot) · focus · error · disabled · disabled checked |
| Switch | `rx-switch` (`role="switch"`) | off (square thumb, `text-secondary`) · hover · on (accent track, dark thumb) · focus · disabled |
| Panel that presents | `rx-panel` | thin mark; no hover |
| Panel you press | `rx-panel rx-panel--press` | thick mark, `border-control` edge · hover `hover` + `border-strong` · active · focus · selected (`aria-checked`/`aria-selected`: accent edge, `selected` tint, cut corner, Selected badge) · disabled (`border-default`, grey mark) |
| Sub-panel, inset row | `rx-panel--plain`, `rx-panel--inset` | no mark |
| Readout | `rx-readout`, `rx-readout__sep` | `OUTPUT // …` with the `//` in `text-accent` |
| Badge | `rx-badge` (+ `--accent`, `--success`, `--warning`, `--danger`, `--info`) | neutral edge; accent on `accent-soft`; status badges carry a dot and a word |
| Nav link, tab | `rx-nav-link`, `rx-tab` in `rx-tabs` | `text-secondary` · hover `text-primary` · current (`aria-current`/`aria-selected`): `text-primary` + thin accent mark under · focus · tab blocked |
| Results table | `rx-table`, `rx-thead`, `rx-row` | at rest · alternate (`surface-raised`) · hover/focus-within (actions replace the match bar; focus adds an inset ring) · selected (accent marker, `selected` tint) · playing (accent marker, `playing` tint, pause button pressed) · paused (`border-strong` marker) · failed (`danger` marker) · unavailable (`text-disabled`, play disabled) |
| Match bar | `rx-match` with `--score` | gradient fill to the score, white tick, score in `data-sm`, TOP in `text-accent` on rank 1 |
| Toast | `rx-toast` (+ `--success`, `--warning`, `--danger`, `--loading`) | `overlay` + `border-strong` + shadow, 3px tone marker, icon, title, body; loading then updates in place. Top right from tablet up, full width on phones, 4s, up to five |
| Inline alert | `rx-alert` (+ tones) | in-page version, no shadow; danger on `danger-soft` |
| Dialog | `rx-dialog`, `rx-dialog__actions` | square, `overlay`, `border-strong`, shadow, on `scrim`. Escape closes; focus returns to the opener |
| Skeleton | `rx-skeleton` | shaped like the content, in `role="status"` with a line of text; still with reduced motion |
| Empty state | `rx-empty` | dashed `border-default`, what is missing, one next step |
| Progress | `rx-progress` with `--value` | accent fill on `match-track` |

## Icons

One outline set on a 20px grid: 1.5px stroke, square line caps, mitred joins, no fills except play/pause and status dots, drawn in `currentColor`. Sizes `icon-sm` 16, `icon-md` 20, `icon-lg` 24. An icon never stands alone as a button without an `aria-label`, and status icons always sit next to a word. The `_white` / `_black` duplicates in `assets/icons/` retire once the app colours icons with `currentColor`.

## Assumptions to confirm

1. **Name and version**: "V2.1", tokens kept on the `--rx-*` names so the live app picks up the fixes by swapping one file.
2. **Body weight**: Helvetica 400 below 18px, 300 only from 18px up. V2 used 300 for body.
3. **Muted text** darkened from `#bcbcbc` (V2's alpha on #111) to `#a3a3a3`, so primary, secondary and muted read as three steps.
4. **Danger** moves from orange-red `#ff7660` to pink-red `#ff6b7d`.
5. **Warning and info** colours are new: amber `#f5b94a`, blue `#7cb7ff`.
6. **Control sizes** keep V2's 36 and 44 and add 32 and 52.
7. **Switch** is square, like everything else; only radios and status dots are round.
8. **Icon style**: 1.5px stroke, square caps, mitred joins.
9. **Dark only**: the legacy `.light` tokens stay in `tokens/rx.json` untouched; V2.1 defines no light theme.
10. **Marketing**: Benzin display styles stay uppercase; the home page now on v3 classes would move back to these tokens once you approve.
