# Resomix design system

**v3, calm.** Calm, clear, and built around one loop: start from a track, decide, save, and keep going. One system for the app (Home, Discover, Sessions, Library, Track Intelligence), the beta and the marketing site, in two themes from one set of names.

![Resomix design system v3: Studio and Daylight themes, text contrast, status, controls, type, spacing and radius](docs/overview.svg)

v3 replaces the brutal look the app runs today. The app before v3 is documented section by section in [docs/lab-design](docs/lab-design/README.md), and [the migration guide](docs/migration-v3.md) lists what moves where.

## Contents

1. [Use it](#use-it)
2. [Principles](#principles)
3. [Tokens](#tokens)
4. [Colour](#colour)
5. [Type](#type-1)
6. [Space, shape and depth](#space-shape-and-depth)
7. [States](#states)
8. [Writing](#writing)
9. [Accessibility](#accessibility)
10. [Icons and logo](#icons-and-logo)
11. [The product frame](#the-product-frame)
12. [Brand layer](#brand-layer-the-universe-used-sparingly)
13. [Moving the app to v3](#moving-the-app-to-v3)
14. [Tooling](#tooling)

## Use it

```css
@import "@resomix/design-system/resomix.css";  /* v3 tokens, both themes, type styles, aliases for today's names */
@import "@resomix/design-system/pixels.css";   /* the --px-N size steps */
```

- **Studio** (dark) is the default. **Daylight** applies under `.light` or `[data-theme="light"]`.
- New code uses the v3 names: `var(--bg-surface)`, `var(--text-secondary)`, `var(--space-5)`, `var(--radius-md)`.
- Type styles are classes: `.type-page-title`, `.type-body`, `.type-data`, and the rest in [Type](#type-1).
- The names the app uses today (`--rx-*`, `--color-*`, `--playlist-*`) still work and resolve to v3. See [the token map](docs/migration-v3.md#token-map).

## Principles

1. **Decisions before data.** Every view answers "what should I do next?" above the fold, with at most three choices and one primary action. Data supports a decision; it is never decoration.
2. **One loop, no dead ends.** Reference → Listen → Decide → Save → Continue. Every finished state offers the next round ("Continue digging" from kept tracks). Show progress with `LoopTracker`.
3. **Keep my place.** Work opens in `WorkbenchTabs`: previews don't pile up, kept tabs come back, closing a tab returns to where the user was. Filters, open sections and the playing track are saved per tab.
4. **Calm by default.** Neutral surfaces, one accent, quiet borders, generous space. Nothing blinks, nothing is uppercase, nothing competes with the primary action.
5. **Show depth on request.** Summary first, details behind `Disclosure`, `Drawer` or a tab. Technical values exist, but only for those who open them.
6. **Accessible is the baseline.** WCAG 2.2 AA in both themes, colour never the only signal, every action reachable by keyboard.
7. **Only what's live.** Never design a number, feature or claim the product doesn't have. Missing data shows "—".

## Tokens

All values, generated from [`tokens/v3/tokens.json`](tokens/v3/tokens.json). Every text, edge and status pair is checked for contrast in both themes on every push.

<!-- generated:tokens -->
### Colour

**Grounds**

| Token | Studio | Daylight | Use |
|---|---|---|---|
| `--bg-canvas` | `#101010` | `#f6f6f4` | Page background behind everything. App shell main area and marketing pages. |
| `--bg-surface` | `#17171a` | `#ffffff` | Cards, panels, table rows, sidebar, open workbench tab. The default ground for content. |
| `--bg-raised` | `#1f1f23` | `#f0f0ee` | A block inside a surface: a selected segment, a nested group, artwork placeholders. |
| `--bg-sunken` | `#0b0b0c` | `#ebebe8` | Inputs, the command bar, tab strip, segmented-control track. |
| `--bg-overlay` | `#242428` | `#ffffff` | Drawers, dialogs, menus, toasts. Always with shadow-overlay. |
| `--bg-hover` | `#232327` | `#ebebe9` | Hover fill for rows, ghost buttons, menu items and tabs. |
| `--bg-selected` | `#351e1c` | `#fdede9` | Fill for a selected choice card, the playing row and the current tab marker area. Pair with a border or icon, never on its own. |
| `--bg-scrim` | `rgba(0, 0, 0, 0.6)` | `rgba(16, 16, 16, 0.4)` | Behind dialogs and the mobile drawer. |

**Text**

| Token | Studio | Daylight | Use |
|---|---|---|---|
| `--text-primary` | `#f2f2f0` | `#141414` | Titles, body copy, values. Reads on every bg- token. |
| `--text-secondary` | `#b9b9b9` | `#45454a` | Supporting copy, artist names, descriptions. Reads on every bg- token. |
| `--text-muted` | `#8e8e96` | `#65656b` | Hints, timestamps, captions, placeholder-like meta. Reads on every bg- token. |
| `--text-disabled` | `#5f5f66` | `#a3a3a8` | Disabled labels only (exempt from contrast). Always paired with a disabled cursor or a reason. |
| `--text-accent` | `#ff7a5c` | `#b8361a` | Small orange text: the active nav label, inline links in product copy. Reads on every bg- token. |
| `--text-on-accent` | `#101010` | `#101010` | Text and icons on accent and accent-hover fills (5.5:1 and 6.2:1). |

**Edges**

| Token | Studio | Daylight | Use |
|---|---|---|---|
| `--border-subtle` | `#26262b` | `#e6e6e3` | Dividers between rows inside one card. Decorative only. |
| `--border-default` | `#34343a` | `#d3d3d0` | Card and panel edges, section dividers. Decorative: the content inside identifies the card. |
| `--border-control` | `#6e6e76` | `#85858c` | Edges of things you can operate: inputs, secondary buttons, switches, choice cards, checkboxes. 3:1 or more on every bg- token. |
| `--border-strong` | `#a3a3aa` | `#5e5e64` | Hover edge of a control or card. |

**Accent and focus**

| Token | Studio | Daylight | Use |
|---|---|---|---|
| `--accent` | `#ee4a26` | `#ee4a26` | The one primary action per view, the selected choice edge, the playing indicator, the current loop step. Nothing else. |
| `--accent-hover` | `#ff5c38` | `#ff5c38` | Hover fill of the primary button. The change is a lighter fill plus the pointer; never the only signal of state. |
| `--focus` | `#ff8f74` | `#c2391a` | Focus ring: 2px solid, 2px offset, on every focusable element. 3:1 or more on every bg- token in both themes. |

**Status**

| Token | Studio | Daylight | Use |
|---|---|---|---|
| `--status-success` | `#2ec4b6` | `#0b6f7a` | Keep, Ready, Saved. Teal, off the red-green axis, always with a check icon and a word. |
| `--status-warning` | `#f5b94a` | `#8a5a00` | Maybe, Queued, limits close. Always with a clock icon and a word. |
| `--status-danger` | `#ff6e6e` | `#c42b2b` | Failed, errors, destructive actions. Always with an alert icon and a word. Never used for Pass. |
| `--status-info` | `#7ab0ff` | `#2c63c9` | Analysing, processing, neutral notices. Always with a word. |

**Data and tools**

| Token | Studio | Daylight | Use |
|---|---|---|---|
| `--tool-ink` | `#101010` | `#ffffff` | Glyph colour inside a tool icon tile (data-1 to data-5 fills). Brand black on Studio, white on Daylight; 4.5:1 or more on every data colour in its theme. |
| `--data-1` | `#ff8c42` | `#b84e0c` | Series 1: energy, the reference track in comparisons. Chart marks only (3:1 or more on bg-surface); label values with text- tokens, never in this colour. |
| `--data-2` | `#6f9bff` | `#2f5fc4` | Series 2: the candidate track, tempo. Chart marks only (3:1 or more on bg-surface); label values with text- tokens, never in this colour. |
| `--data-3` | `#4fd1e0` | `#0e7c8a` | Series 3: key, harmonic content. Chart marks only (3:1 or more on bg-surface); label values with text- tokens, never in this colour. |
| `--data-4` | `#b48cff` | `#7a4fd1` | Series 4: mood or texture. Chart marks only (3:1 or more on bg-surface); label values with text- tokens, never in this colour. |
| `--data-5` | `#f5c451` | `#7a5e00` | Series 5: everything else. Chart marks only (3:1 or more on bg-surface); label values with text- tokens, never in this colour. |

**Brand**

| Token | Studio | Daylight | Use |
|---|---|---|---|
| `--brand-orange` | `#ee4a26` | `#ee4a26` | Neon orange from the brand guidelines. The source for accent. Fills and large marks only; small orange text uses text-accent. |
| `--brand-black` | `#101010` | `#101010` | Space black from the brand guidelines. The Studio canvas, logo ink on light grounds, text on accent fills. |
| `--brand-gray` | `#b9b9b9` | `#b9b9b9` | Light gray from the brand guidelines. Studio text-secondary. |
| `--brand-white` | `#ffffff` | `#ffffff` | White from the brand guidelines. Logo ink on dark grounds, Daylight surface. |

### Type

| Family | Stack |
|---|---|
| `--font-sans` | `"Helvetica_Neue", "Helvetica Neue", Helvetica, Arial, sans-serif` |
| `--font-mono` | `"Fira Code", ui-monospace, Menlo, Consolas, monospace` |
| `--font-display` | `Benzin, "Helvetica_Neue", "Helvetica Neue", Helvetica, Arial, sans-serif` |

| Class | Family | Size / line | Weight | Use |
|---|---|---|---|---|
| `.type-page-title` | sans | 28px / 34px | 600 | One per view: the page or tab title. |
| `.type-section-title` | sans | 20px / 28px | 600 | Section headings inside a view. |
| `.type-card-title` | sans | 16px / 22px | 600 | Card, drawer and dialog titles; track titles in rows. |
| `.type-body` | sans | 15px / 22px | 400 | Default reading text. |
| `.type-body-sm` | sans | 13px / 18px | 400 | Secondary lines, artist names, descriptions in dense lists. |
| `.type-label` | sans | 13px / 16px | 500 | Field labels, button text in small buttons, tab labels. |
| `.type-caption` | sans | 12px / 16px | 400 | The smallest text in the product. Timestamps and hints. Nothing smaller. |
| `.type-data-lg` | mono | 24px / 28px | 500 | The number in a stat tile. |
| `.type-data` | mono | 13px / 18px | 400 | BPM, key, duration, match score in rows. Numbers only, sentence case units. |
| `.type-data-sm` | mono | 12px / 16px | 400 | Keyboard hints and file sizes. |
| `.type-display-xl` | display | 72px / 72px | 700 | Landing hero headline only, one per page. Benzin. |
| `.type-display-lg` | display | 48px / 52px | 700 | Closing banner or one feature headline per page. Benzin. |
| `.type-marketing-h2` | sans | 32px / 38px | 600 | Section headings on landing pages, in sentence case. |
| `.type-lead` | sans | 18px / 28px | 400 | The paragraph under a hero or section heading. Max 2 lines. |

### Spacing

| Token | Value | Use |
|---|---|---|
| `--space-1` | `4px` | Icon to label gap inside small controls. |
| `--space-2` | `8px` | Gap between related controls; icon to text in buttons. |
| `--space-3` | `12px` | Inner padding of small cards, row cell gaps. |
| `--space-4` | `16px` | Card padding on mobile, gap between cards in a grid. |
| `--space-5` | `20px` | Card padding on desktop. |
| `--space-6` | `24px` | Gap between groups inside a view. |
| `--space-8` | `32px` | Gap between sections in a view; page side padding on desktop. |
| `--space-10` | `40px` | Top padding of a view under the tab strip. |
| `--space-14` | `56px` | Gap between landing page sections on mobile. |
| `--space-18` | `72px` | Gap between landing page sections on desktop. |

### Radius

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | `4px` | Keyboard hints, small tags, checkbox. |
| `--radius-sm` | `6px` | Buttons, inputs, tabs, segmented control items, artwork thumbnails in rows. |
| `--radius-md` | `10px` | Cards, choice cards, menus, the command bar, toasts. |
| `--radius-lg` | `14px` | Drawers, dialogs, large panels. |
| `--radius-xl` | `20px` | Marketing tiles and product frames (the brand's rounded-square tile). |
| `--radius-pill` | `999px` | Status pills and switch tracks only. |

### Depth

| Token | Studio | Daylight | Use |
|---|---|---|---|
| `--shadow-overlay` | `0 16px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px #34343a` | `0 12px 32px rgba(16, 16, 16, 0.14), 0 0 0 1px #d3d3d0` | Drawers, dialogs, menus, toasts, the open command bar. Nothing on the page itself has a shadow. |
| `--shadow-lift` | `0 2px 6px rgba(0, 0, 0, 0.4)` | `0 1px 3px rgba(16, 16, 16, 0.12)` | The selected item in a segmented control and a dragged row. |

### Sizes

| Token | Value | Use |
|---|---|---|
| `--control-sm` | `32px` | Small buttons, row actions, triage buttons in dense lists. |
| `--control-md` | `40px` | Default height of buttons, inputs, tabs. |
| `--control-lg` | `48px` | The primary action of a view and the main search field. |
| `--target-min` | `24px` | Smallest pointer target (WCAG 2.2 2.5.8). Icon buttons pad up to it. |
| `--sidebar-width` | `240px` | App sidebar, expanded. Collapsed: 64px. |
| `--drawer-width` | `420px` | Track and crate drawers on desktop. Full width under 720px. |
| `--content-max` | `1200px` | Max width of view content and landing sections. |
| `--reading-max` | `680px` | Max width of paragraphs. |

### Motion

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | `120ms` | Hover, press, colour changes. |
| `--duration-base` | `200ms` | Tabs, segmented control, disclosure open. |
| `--duration-slow` | `320ms` | Drawers and dialogs entering. |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Every transition. With prefers-reduced-motion, durations go to 0. |
<!-- /generated:tokens -->

## Colour

Two themes from one set of names: **Studio** (dark, default for the app) and **Daylight** (light, default for marketing body sections, documents and print). Components only use semantic tokens.

- **Grounds.** `bg-canvas` for the page, `bg-surface` for cards, rows and the sidebar, `bg-raised` for a block inside a card, `bg-sunken` for inputs and the tab strip, `bg-overlay` for anything floating. Hover is `bg-hover`. Never stack a ground on itself; step up or down one.
- **Text.** `text-primary` for titles and values, `text-secondary` for supporting copy, `text-muted` for meta and hints. All three read at 4.5:1 or more on every `bg-` token in both themes. Small orange text is `text-accent`, never `accent`.
- **Edges.** `border-default` around cards (decorative), `border-subtle` between rows, `border-control` around anything you can operate (3:1), `border-strong` on hover.
- **Accent** (`accent`, the brand's neon orange `#EE4A26`) means exactly four things: the one primary action, the selected choice, what's playing, the current loop step. Text on it is `text-on-accent` (brand black). If two orange things compete in one view, one of them is wrong.
- **Status.** `status-success` (Keep, Ready: teal), `status-warning` (Maybe, Queued: amber), `status-danger` (errors, destructive: red), `status-info` (Analysing: blue). Always paired with an icon and a word. Success is teal, not green, so it can't be confused with red. Pass is neutral, not red: it's a choice, not an error.
- **Data.** `data-1` to `data-5` for chart marks only (3:1 or more), labelled in `text-` colours. Match bars use `text-secondary`, never a status colour.
- **Tool identity.** Sonic Discovery `data-3`, Track Intelligence `data-2`, Crate Sessions `data-5`, Library and catalogues `data-4`, Bulk tagging `data-1`, glyphs in `tool-ink`. The same tile in the site sidebar, the app sidebar and tool cards. Tool colours never replace `accent`.
- **Brand primitives** `brand-orange`, `brand-black`, `brand-gray`, `brand-white` are the guideline colours, for the logo and marketing art, not components.

## Type

- **Helvetica Neue** (`--font-sans`) for everything people read: `page-title`, `section-title`, `card-title`, `body`, `body-sm`, `label`, `caption`. Sentence case everywhere. Nothing below 12px.
- **Fira Code** (`--font-mono`) only for numbers people compare: BPM, key, duration, match score, counts in stat tiles, keyboard hints (`data-lg`, `data`, `data-sm`). Never for labels, buttons or headings, and never uppercase.
- **Benzin** (`--font-display`) only for marketing headlines: `display-xl` in a hero, `display-lg` once more per page at most. Never inside the app.
- Marketing section headings use `marketing-h2` with a `lead` paragraph. Paragraphs stop at `reading-max` (680px).

## Space, shape and depth

- **Spacing** on a 4px base, `space-1` to `space-18`. Inside a card `space-5`; between cards `space-4`; between sections `space-8`; landing sections `space-18`.
- **Radii.** `radius-sm` controls, `radius-md` cards and menus, `radius-lg` drawers and dialogs, `radius-xl` marketing tiles (the brand's rounded-square tile), `radius-pill` pills and switches only.
- **Depth.** The page is flat. Only floating things (`Drawer`, `Dialog`, menus, `Toast`, the open command bar) get `shadow-overlay` on `bg-overlay`. `shadow-lift` marks the selected segment and a dragged row.
- **Sizes.** Controls `control-sm` (32) / `control-md` (40) / `control-lg` (48); pointer targets never under `target-min` (24); sidebar `sidebar-width`; drawers `drawer-width`; content capped at `content-max`.
- **Motion.** `duration-fast` for hover, `duration-base` for tabs and disclosure, `duration-slow` for drawers, always `ease-standard`. With reduced motion everything is instant and the skeleton shimmer stops.

## States

Every interactive element has rest, hover, focus-visible, pressed and disabled; toggles add selected.

- **Focus** is a 2px `focus` ring with a 2px offset on everything, in both themes. Never remove it.
- **Hover** lightens the fill (`bg-hover`, `accent-hover`) and strengthens the edge (`border-strong`).
- **Selected** adds a 2px `accent` edge plus an icon or word (check, "Selected", "Playing"). Colour never carries the state alone.
- **Disabled** uses `bg-sunken` and `text-disabled`. Prefer `aria-disabled` with a reason ("Add a reference track first") over a silent disabled control. A busy control ("Searching…") is not disabled: keep its label readable and set `aria-busy`.
- **Loading** uses `Skeleton` in the shape of the content plus one line with a realistic time: catalogue searches "usually 1–2 seconds", uploads "10–15 seconds".
- **Empty** uses `EmptyState`: what will be here, how to get it, one action.
- **Errors** say what happened and what to do, next to where it happened (`Field` error, `Toast` with Retry).

## Writing

- Sentence case for every title, button, tab and label. No all-caps, no bracketed `[labels]`, no terminal-style copy.
- Buttons are a verb plus an object: "Find similar tracks", "Continue session", "Save to crate", "Delete session". Never "Submit", "OK", "Click here".
- The same action has the same label everywhere: the site and the app both say **Try Sonic Discovery** for the entry point.
- Speak to the user ("your crate", "you stopped at track 16"); Resomix is "we".
- Numbers are real and specific ("4 maybes to decide", "About 5 minutes"). If there's nothing true to say, drop the line.
- Before and after, from the live site: "START WITH A TRACK." → "Start with a track"; "PRICING" → "Pricing"; "Back to Home" → "Back to home".
- Describe what PYXIS-1 does for the user (finds tracks that sound alike, blends several similarity views). Don't say "model", "deep learning" or "training", and don't publish catalogue size, uptime, latency or security figures unless they are in the capability register.

## Accessibility

- **Contrast.** Text 4.5:1; large text, icons, control edges and focus 3:1, on the ground they sit on, in both themes. `npm run check` proves it for every token pair.
- **Keyboard.** ⌘K / Ctrl K opens search from anywhere; Space plays or pauses the focused track; K / M / P keep, maybe, pass; Esc closes the top overlay and returns focus; arrows move inside tab lists, radio groups and menus.
- **Semantics.** `tablist`/`tab` for workbench tabs, `radiogroup`/`radio` for choice cards, `switch` for switches, `aria-current` for the current page and loop step, `aria-pressed` for triage and play, `role="status"`/`alert` for toasts, `aria-busy` while loading.
- **Targets** are at least `target-min` (24px); main controls use `control-md` or larger.
- Never autoplay audio on page load. The playing track is always visible and stoppable.

## Icons and logo

- **Icons.** Thin line icons on a 24px grid, 1.5px stroke, round caps and joins, drawn in `currentColor` at 20px (16px inside small controls and pills). No emoji, no filled icons, no icon without a label except icon buttons with an `aria-label`. Names: home, compass, layers, library, wave, crate, search, upload, play, pause, check, clock, x, alert, info, loop, pin, more, chev, up.
- The app's current 83 icon files are in [`assets/icons/`](assets/icons) for reference. They mix styles and colours and are to be replaced by the brand line set; see [the migration guide](docs/migration-v3.md#clean-up-found-during-the-audit).
- **Logo.** The wordmark on headers and footers, the signet "R" where space is tight (favicon, app icon, collapsed sidebar). White on `bg-canvas` in Studio, brand black on Daylight. Minimum width 50px for the wordmark, 25px for the signet. Don't stretch, recolour, outline, add effects, or rebuild it in type.

## The product frame

- **App shell.** `AppShell`: sidebar with Home, Tools (Sonic Discovery, Track Intelligence), Your work (Sessions, Library), Pricing and Account. `CommandBar` (⌘K) and `WorkbenchTabs` layer on top. Marketing pages use `SiteShell`.
- **Home** for signed-in users: a greeting, up to three `NextStepCard`s (Continue → Decide → Start), recent `SessionCard`s, and at most three `StatTile`s. A first visit shows only Start plus an `EmptyState` that explains the loop.
- **Discover** starts with one large field (paste a link, upload, or pick from the library) and the search mode as three `ChoiceCard`s: Sound alike, Sound alike same genre, Blend. Results are `TrackRow`s with `MatchScore` and `TriageControl`; the open track lives in a `Drawer`.
- **Sessions** are saved Crate Sessions: `LoopTracker`, a `SegmentedControl` filter (All / Kept / Maybe / Not decided) and the result list.
- **Library** lists uploaded tracks one per row (one track per action, no bulk select). Bulk upload (up to 500 files) uses `UploadQueue`.
- **Track Intelligence** is a report in a tab: summary at the top, then `Disclosure` sections Overview, For DJs, For catalogues, Technical.
- **The tool workspace.** Every tool opens the same page around one track: `AppShell` → `SessionHeader` → sticky `ReferenceStrip` → the tool's content → `PlayerBar` docked at the bottom. One `TrackInput` everywhere; `TrackActions` on every track (decide, then Use as new reference, Analyse, Add to playlist, Open in Apple Music, Copy link). One player store drives every play button; waveforms and spectrograms draw precomputed server data.
- **The website** (resomix.com) works like the product's home, not a brochure: `Composer` hero → tool grid of `ToolCard`s → carousels of `MediaCard`s with sonic covers → plans (`PricingCard`) → a one-line footer.
- **Sonic covers.** Where a picture is needed, draw the sound: a radial fingerprint from the track's analysis in one `data-*` colour on `bg-raised`. No stock photos of DJs, headphones or crowds.

## Brand layer: the universe, used sparingly

The brutal "Resomix universe" is the brand's signature, and it belongs where people arrive, not where they work.

- **Use it on** marketing heroes and closing banners (Benzin display; uppercase allowed only here and only for the headline), the hairline frame lines on landing pages, the "Join the Resomix universe" footer band, and empty states in the app (one display line).
- **Never inside** result lists, controls, tables, the player, analysis values, or any text people scan.
- **Never as claims.** Terminal-style lines must not state uptime, latency, encryption standards, data locations or system versions unless the capability register approves them. Decorative text that reads as fact is a claim.

## Moving the app to v3

Swapping in `tokens/resomix.css` restyles every screen at once: v3 colours in both themes, rounded corners instead of cut ones, the 2px focus ring, teal success and the new warning and info colours. The rest (sentence case, labels in Helvetica, nothing under 12px, the accent rule) is component work, listed file by file in [docs/migration-v3.md](docs/migration-v3.md).

| Before (today's app) | After (v3) |
|---|---|
| Uppercase mono labels, 9px table headers | Sentence case, `label` 13px and `caption` 12px in Helvetica |
| Body in Helvetica Light (300) | `body` at regular weight (400) |
| Square panels, cut-corner buttons | `radius-md` panels, `radius-sm` controls |
| Accent on corner marks, kickers and separators | Accent on four things only |
| Translucent whites (`#ffffffb8`) | Solid colours per theme, checked on every ground |
| Success green, no warning or info | Teal success, amber warning, blue info |
| Light theme with black page ground | Daylight |
| 322 `--px-N` steps | `space-1` to `space-18` for new work (`--px-N` kept for existing layouts) |

## Tooling

```bash
npm run build    # tokens/resomix.css, tokens/pixels.css, docs/overview.svg and the generated tables
npm run check    # contrast for every token pair in both themes, and every alias points at a real token
npm test         # both, and fails if a generated file is out of date
npm run capture  # retake the docs/lab-design screenshots and assets/icons from /lab/design (needs Chrome)
```

To change a token, edit [`tokens/v3/tokens.json`](tokens/v3/tokens.json) (or [`tokens/compat.json`](tokens/compat.json) for an alias), run `npm test`, and commit the source with the generated files. CI runs the same check on every push and pull request.

| Path | What it is |
|---|---|
| `tokens/v3/tokens.json` | The source: v3 colours in both themes, type, spacing, radius, depth, sizes, motion |
| `tokens/compat.json` | Today's names mapped to v3, the font stacks, the `--px-N` steps |
| `tokens/resomix.css` | Generated: everything the app needs in one stylesheet |
| `tokens/pixels.css` | Generated: the `--px-N` size steps |
| `tokens/legacy/` | The pre-v3 tokens, with the 2026-10-31 contrast fixes, kept for reference |
| `docs/guidelines-v3.md` | The v3 guidelines as written in the design system |
| `docs/migration-v3.md` | The token map and the component changes, by file |
| `docs/lab-design/` | The app before v3: every section of `/lab/design` with screenshots |
| `docs/contrast-audit.md` | The 2026-10-31 contrast audit of the pre-v3 tokens |
| `docs/source-map.md` | Where each part lives in the webapp |
| `assets/icons/` | The app's current icon files |

**Not in this repo.** Font files: Helvetica Neue and Benzin are licensed and served from the webapp's `/fonts` (Auger Mono is loaded there as trial files). Component code: it lives in the webapp and `packages/ui`.
