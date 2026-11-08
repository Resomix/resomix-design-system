Calm, clear, and built around one loop: **start from a track, decide, save, and keep going.** This system replaces the brutal v2 look for every Resomix surface: the app (Today, Discover, Sessions, Library, Track Intelligence), the beta and the marketing site.

Studio (dark) is the only theme. Every screen also passes [the professional standard](professional-standard.md), which turns these guidelines into rules and a pre-ship checklist. Tokens: [`tokens/v3/tokens.json`](../tokens/v3/tokens.json), generated as [`tokens/v3/tokens.css`](../tokens/v3/tokens.css) (`--ds-*` custom properties and `.ds-*` type classes).

## Principles

1. **Decisions before data.** Every view answers "what should I do next?" above the fold, with at most three choices and one primary action. Data supports a decision; it is never decoration.
2. **One loop, no dead ends.** Reference → Listen → Decide → Save → Continue. Every finished state offers the next round ("Continue digging" from kept tracks). Show progress with `LoopTracker`.
3. **Keep my place.** Work opens in `WorkbenchTabs`: previews don't pile up, kept tabs come back when the user returns, closing a tab returns to where they were. Filters, open sections and the playing track are saved per tab.
4. **Calm by default.** Neutral surfaces, one accent, quiet borders, generous space. Nothing blinks, nothing is uppercase, nothing competes with the primary action.
5. **Show depth on request.** Summary first, details behind `Disclosure`, `Drawer` or a tab. Technical values exist, but only for those who open them.
6. **Accessible is the baseline.** WCAG 2.2 AA on every ground, colour never the only signal, every action reachable by keyboard.
7. **Only what's live.** Never design a number, feature or claim the product doesn't have. Missing data shows "—".

## The product frame

- **App shell.** `AppShell`: sidebar with Home, Tools (Sonic Discovery, Track Intelligence), Your work (Sessions, Library), Pricing and Account; each tool opens the workspace described in "The tool workspace". `CommandBar` (⌘K) and `WorkbenchTabs` are optional layers on top once the slice ships. Marketing pages use `SiteShell`.
- **Home** (formerly "Today") for signed-in users: a greeting, up to three `NextStepCard`s (Continue → Decide → Start), recent `SessionCard`s, and at most three `StatTile`s. A first visit shows only Start plus an `EmptyState` that explains the loop.
- **Discover** starts with one large field (paste a link, upload, or pick from the library) and the search mode as three `ChoiceCard`s: Sound alike, Sound alike same genre, Blend. Results are `TrackRow`s with `MatchScore` and `TriageControl`; the open track lives in a `Drawer`.
- **Sessions** are saved Crate Sessions. A session view shows `LoopTracker`, a `SegmentedControl` filter (All / Kept / Maybe / Not decided) and the result list.
- **Library** lists uploaded tracks one per row (one track per action, no bulk select). Bulk upload (up to 500 files) uses `UploadQueue`.
- **Track Intelligence** is a report in a tab: summary at the top, then `Disclosure` sections Overview, For DJs, For catalogues, Technical.
- **The website** (resomix.com) works like the product's home, not a brochure. `SiteShell` gives every page the same left sidebar of tools (each with its `ToolCard` icon tile) and solutions. The home page runs: `Composer` hero (paste a link or drop a file, mode chips, one orange send button) → tool grid of `ToolCard`s → carousels of `MediaCard`s with sonic covers ("Try a discovery mode", "Start from an example", "Built for") → plans (`PricingCard`) → a one-line footer. Time-bound offers go in one `AnnouncementBar`; labels like "New" use `Badge`. Long landing pages (Track Intelligence, About, Trust) keep `MarketingHero` and sections with `marketing-h2` + `lead`, but are cut to what a visitor needs to decide.
- **Tool identity.** Sonic Discovery `data-3`, Track Intelligence `data-2`, Crate Sessions `data-5`, Library and catalogues `data-4`, Bulk tagging `data-1`, glyphs in `tool-ink`. Use the same tile in the site sidebar, the app sidebar and tool cards. Tool colours never replace `accent`.
- **Sonic covers.** Where a picture is needed, draw the sound: a radial fingerprint from the track's analysis in one `data-*` colour on `bg-raised`. No stock photos of DJs, headphones or crowds.

## The tool workspace (v3.2)

Every tool opens the same full-page workspace around one track, so finding, analysing and acting never leave the page.

- **Frame**: `AppShell` sidebar (Home · Tools: Sonic Discovery, Track Intelligence · Your work: Sessions, Library) → `SessionHeader` → `ReferenceStrip` (sticky) → the tool's content → `PlayerBar` docked at the bottom.
- **Input**: one `TrackInput` everywhere (search, link, file or Library pick). The tool is chosen in the sidebar, not with cards above the input.
- **Sonic Discovery content**: `FilterBar` (decision filter, hide passed, honest count) → `ResultsList` (rank first, a match bar relative to the returned set, Keep/Maybe/Pass per row) → one gated row for guests.
- **Track Intelligence content**: `AnalysisSummary` (interpretation, facts with confidence, notes, provenance) → `StructureBar` over the detail `Waveform` → `Disclosure` sections For DJs, For catalogues, Technical (`Spectrogram` lives in Technical).
- **Actions**: `TrackActions` on every track: decide, then Use as new reference, Analyse, Add to playlist, Open in Apple Music, Copy link. One track per action.
- **Audio**: one player store drives every play button; waveforms and spectrograms draw precomputed server data, never audio decoded in the browser.

## Brand layer: the universe, used sparingly

The brutal "Resomix universe" is the brand's signature, and it belongs where people arrive, not where they work.

- **Use it on**: marketing heroes and closing banners (Benzin display, uppercase allowed only here and only for the headline), the hairline frame lines on landing pages, the "Join the Resomix universe" footer band, and empty states in the app (one display line).
- **Never inside**: result lists, controls, tables, the player, analysis values, or any text people scan.
- **Never as claims**: terminal-style footer lines must not state uptime, latency, encryption standards, data locations or system versions unless the capability register approves them. Decorative text that reads as fact is a claim.

## Colour

One theme, **Studio** (dark), for the app, the beta and the marketing site alike. Components only use semantic tokens, never raw values or brand primitives.

- Grounds: `bg-canvas` for the page, `bg-surface` for cards, rows and the sidebar, `bg-raised` for a block inside a card, `bg-sunken` for inputs and the tab strip, `bg-overlay` for anything floating. Hover is `bg-hover`. Never stack a ground on itself; step up or down one.
- Text: `text-primary` for titles and values, `text-secondary` for supporting copy, `text-muted` for meta and hints. All three read at 4.5:1 or more on every `bg-` token (checked by `npm run check`). Small orange text is `text-accent`, never `accent`.
- Edges: `border-default` around cards (decorative), `border-subtle` between rows, `border-control` around anything you can operate (3:1), `border-strong` on hover.
- **Accent** (`accent`, the brand's neon orange `#EE4A26`) means exactly four things: the one primary action, the selected choice, what's playing, the current loop step. Text on it is `text-on-accent` (brand black). If two orange things compete in one view, one of them is wrong.
- Status: `status-success` (Keep, Ready — teal), `status-warning` (Maybe, Queued — amber), `status-danger` (errors, destructive — red), `status-info` (Analysing — blue). Always paired with an icon and a word. Success is teal, not green, so it can't be confused with red. Pass is neutral, not red: it's a choice, not an error.
- Data: `data-1`…`data-5` for chart marks only (3:1 or more), labelled in `text-` colours. Match bars use `text-secondary`, never a status colour.
- Brand primitives `brand-orange`, `brand-black`, `brand-gray`, `brand-white` are the guideline colours; use them for the logo and marketing art, not in components.

## Type

- **Helvetica Neue** (`sans`) for everything people read: `page-title`, `section-title`, `card-title`, `body`, `body-sm`, `label`, `caption`. Sentence case everywhere. Nothing below 12px.
- **Fira Code** (`mono`) only for numbers that people compare: BPM, key, duration, match score, counts in stat tiles, keyboard hints (`data-lg`, `data`, `data-sm`). Never for labels, buttons or headings, and never uppercase.
- **Benzin** (`display`) only for marketing headlines: `display-xl` in a hero, `display-lg` once more per page at most. Never inside the app. `display-xl` is the only style that may be set in capitals; everything else, `display-lg` included, is sentence case.
- Under 1024px the marketing styles step down (the `mobile` sizes in the tokens): `display-xl` 40px, `display-lg` 32px, `marketing-h2` 26px, `lead` 17px. Product styles keep their size.
- Marketing section headings use `marketing-h2` (sans) with a `lead` paragraph. Paragraphs stop at `reading-max`.

## Space, shape and depth

- Spacing steps `space-1` to `space-18` on a 4px base. Inside a card `space-5`; between cards `space-4`; between sections `space-8`; landing sections `space-18`.
- Radii: `radius-sm` controls, `radius-md` cards and menus, `radius-lg` drawers and dialogs, `radius-xl` marketing tiles (the brand's rounded-square tile), `radius-pill` pills and switches only.
- Depth: the page is flat. Only floating things (`Drawer`, `Dialog`, menus, `Toast`, the open command bar) get `shadow-overlay` on `bg-overlay`. `shadow-lift` marks the selected segment and a dragged row.
- Sizes: controls `control-sm` / `control-md` / `control-lg`; pointer targets never under `target-min`; sidebar `sidebar-width`; drawers `drawer-width`; content capped at `content-max`.

## States

Every interactive element has rest, hover, focus-visible, pressed and disabled; toggles add selected.

- **Focus** is a 2px `focus` ring with a 2px offset on everything. Never remove it.
- **Hover** lightens the fill (`bg-hover`, `accent-hover`) and strengthens the edge (`border-strong`).
- **Selected** adds a 2px `accent` edge plus an icon or word (check, "Selected", "Playing"). Colour never carries the state alone.
- **Disabled** uses `bg-sunken` and `text-disabled`. Prefer `aria-disabled` with a reason ("Add a reference track first") over a silent disabled control.
- **Loading** uses `Skeleton` in the shape of the content plus one line with a realistic time: catalogue searches "usually 1–2 seconds", uploads "10–15 seconds".
- **Empty** uses `EmptyState`: what will be here, how to get it, one action.
- **Errors** say what happened and what to do, next to where it happened (`Field` error, `Toast` with Retry).
- **Motion** uses `duration-fast` for hover, `duration-base` for tabs and disclosure, `duration-slow` for drawers, always `ease-standard`. With reduced motion everything is instant and the skeleton shimmer stops.

## Writing

- Sentence case for every title, button, tab and label. No all-caps, no bracketed `[labels]`, no terminal-style copy.
- Buttons are a verb + object: "Find similar tracks", "Continue session", "Save to crate", "Delete session". Never "Submit", "OK", "Click here".
- The same action has the same label everywhere: the site and the app both say **Try Sonic Discovery** for the entry point, not "Try Resomix" on one page and "Explore" on another.
- Speak to the user ("your crate", "you stopped at track 16"); Resomix is "we".
- Numbers are real and specific ("4 maybes to decide", "About 5 minutes"). If there's nothing true to say, drop the line.
- Before → after from the live site: "START WITH A TRACK." → "Start with a track"; "PRICING" → "Pricing"; "Back to Home" → "Back to home".
- Claims: describe what PYXIS-1 does for the user (finds tracks that sound alike, blends several similarity views). Don't say "model", "deep learning" or "training", and don't publish catalogue size, uptime, latency or security figures unless they are in the capability register.

## Accessibility

- Contrast: text 4.5:1, large text, icons, control edges and focus 3:1 on the ground they sit on. `npm run check` tests every text, edge, status and data colour on every `bg-` token, and disabled text at 3:1.
- Keyboard: ⌘K / Ctrl K opens search from anywhere; Space plays or pauses the focused track; K / M / P keep, maybe, pass; Esc closes the top overlay and returns focus; arrows move inside tab lists, radio groups and menus.
- Semantics: `tablist`/`tab` for workbench tabs, `radiogroup`/`radio` for choice cards, `switch` for switches, `aria-current` for the current page and loop step, `aria-pressed` for triage and play, `role="status"`/`alert` for toasts, `aria-busy` while loading.
- Targets are at least `target-min` (24px); main controls use `control-md` or larger.
- Never autoplay audio on page load. The playing track is always visible and stoppable.

## Iconography

Thin line icons on a 24px grid, 1.5px stroke, round caps and joins, drawn in `currentColor` at 20px (16px inside small controls and pills). The brand guidelines show a thin-line circular icon set, but its files were not available, so the previews use simple stand-in glyphs in the same style. **Replace them with the brand set when the files are supplied**; keep the same names (home, compass, layers, library, wave, crate, search, upload, play, pause, check, clock, x, alert, info, loop, pin, more, chev, up). No emoji, no filled icons, no icons without a label except in icon buttons that carry an `aria-label`.

## Logo

Use the files in **Logos**: the wordmark on headers and footers, the signet "R" where space is tight (favicon, app icon, collapsed sidebar). White on `bg-canvas`. Minimum width 50px for the wordmark, 25px for the signet. Don't stretch, recolour, outline, add effects, or rebuild it in type.

## Moving from v2 (brutal)

- v2 tokens and the `rx-btn-*` / `rx-panel` classes were never merged, so nothing in production needs reverting. Hold the v2 patches; build from this system.
- Map old names when touching a screen: `--rx-color-canvas` → `bg-canvas`; `--rx-color-surface` → `bg-surface`; `--rx-color-surface-raised` → `bg-raised`; `--rx-color-text-*` → `text-*`; `--rx-color-border-default` → `border-default` (cards) or `border-control` (controls); `--rx-color-focus` → `focus`; `--rx-color-selected` → `bg-selected`.
- Square corners and notches become `radius-sm` / `radius-md`; hard shelves become `shadow-overlay` on overlays only; mono uppercase labels become `label` or `caption` in sentence case.
- Order of work: tokens + `AppShell` + `WorkbenchTabs` → Discover and Sessions → Library and Track Intelligence → marketing templates.
