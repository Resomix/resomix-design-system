# Moving the app to v3 "calm"

v3 replaces the brutal look on every Resomix surface. The move has two parts:

1. **Swap the tokens (one change, restyles every screen).** `tokens/resomix.css` defines the v3 tokens and points every name the app uses today at them, so existing components pick up v3 colours, corners, focus ring and motion without being renamed.
2. **Update the components (screen by screen).** Some of v3 lives in markup and component styles, not tokens: sentence case, which font a label uses, text sizes, and what the accent is allowed to mark. That work is listed below by file.

## 1. Swap the tokens

In `apps/webapp/src/index.css`, replace the `:root` block of `--rx-*`, `--color-*` and `--playlist-*` values, and the `.light` block, with:

```css
@import "@resomix/design-system/resomix.css"; /* or a copy of tokens/resomix.css */
```

In `apps/webapp/src/styles/pixels.css`, the `--px-N` steps are unchanged; `tokens/pixels.css` is the same list.

What changes on screen straight away:

- Grounds, text and edges take the v3 values in both themes. **The light theme (`.light`) becomes v3 Daylight**; before, its page ground was black under black text.
- Panels get 10px corners, controls 6px, tags 4px. The cut corner on the primary button and the selected card goes away (`--rx-notch-*` is 0).
- The focus ring becomes 2px with a 2px offset.
- Success turns teal, errors use v3 danger red, and warning and info colours exist for the first time (`--rx-color-warning`, `--rx-color-info`).
- The playing row and the selected card share `bg-selected`; the word or icon tells them apart.
- Hover and tab changes move to 120ms and 200ms with v3 easing, and to 0 with reduced motion.
- The fonts load as before. `--font-sans` lists `Helvetica_Neue` first, the family name the app's `@font-face` rules use.

### Token map

Every name the app uses today, and what it resolves to now. Generated from `tokens/compat.json`.

<!-- generated:map -->
| Name the app uses today | Now resolves to | Note |
|---|---|---|
| `--rx-color-canvas` | `var(--bg-canvas)` |  |
| `--rx-color-surface` | `var(--bg-surface)` |  |
| `--rx-color-surface-raised` | `var(--bg-raised)` |  |
| `--rx-color-overlay` | `var(--bg-hover)` | The light wash was used as a hover and inset fill |
| `--rx-color-text-primary` | `var(--text-primary)` |  |
| `--rx-color-text-secondary` | `var(--text-secondary)` |  |
| `--rx-color-text-muted` | `var(--text-muted)` |  |
| `--rx-color-disabled` | `var(--text-disabled)` | Disabled only. Busy labels (Searching…) move to text-secondary with aria-busy |
| `--rx-color-border-subtle` | `var(--border-subtle)` |  |
| `--rx-color-border-default` | `var(--border-default)` |  |
| `--rx-color-border-control` | `var(--border-control)` |  |
| `--rx-color-border-strong` | `var(--border-strong)` |  |
| `--rx-color-accent` | `var(--accent)` |  |
| `--rx-color-accent-hover` | `var(--accent-hover)` |  |
| `--rx-color-accent-text` | `var(--text-accent)` |  |
| `--rx-color-accent-soft` | `var(--bg-selected)` |  |
| `--rx-color-on-accent` | `var(--text-on-accent)` |  |
| `--rx-color-focus` | `var(--focus)` |  |
| `--rx-color-selected` | `var(--bg-selected)` |  |
| `--rx-color-playing` | `var(--bg-selected)` | v3 uses one selected fill for the selected card and the playing row; the word or icon tells them apart |
| `--rx-color-score-fill` | `var(--text-secondary)` | Match bars use text-secondary, never a status colour |
| `--rx-color-error` | `var(--status-danger)` |  |
| `--rx-color-success` | `var(--status-success)` | Teal instead of green, so it can't be confused with red |
| `--rx-color-warning` | `var(--status-warning)` | New: Maybe, Queued |
| `--rx-color-info` | `var(--status-info)` | New: Analysing |
| `--playlist-divider` | `var(--border-subtle)` |  |
| `--playlist-divider-strong` | `var(--border-default)` |  |
| `--rx-radius-panel` | `var(--radius-md)` | Square panels become 10px |
| `--rx-radius-control` | `var(--radius-sm)` | 2px becomes 6px |
| `--rx-radius-tag` | `var(--radius-xs)` |  |
| `--rx-notch-sm` | `0px` | v3 drops cut corners; the clip-path collapses to a plain corner |
| `--rx-notch-md` | `0px` | As above |
| `--rx-ring` | `0 0 0 2px var(--bg-canvas), 0 0 0 4px var(--focus)` | 2px focus ring with a 2px offset |
| `--rx-duration-fast` | `var(--duration-fast)` |  |
| `--rx-duration-base` | `var(--duration-base)` | 160ms becomes 200ms |
| `--rx-duration-slow` | `var(--duration-slow)` | New: drawers and dialogs |
| `--rx-ease-standard` | `var(--ease-standard)` |  |
| `--color-primary` | `var(--text-primary)` | Main foreground |
| `--color-secondary` | `var(--bg-canvas)` | Main background |
| `--color-primary-background` | `var(--bg-canvas)` |  |
| `--color-secondary-background` | `var(--bg-surface)` |  |
| `--color-noise-background` | `var(--bg-canvas)` |  |
| `--color-primary-hover` | `var(--text-secondary)` |  |
| `--color-text-primary` | `var(--bg-canvas)` | Text on the foreground colour |
| `--color-text-secondary` | `var(--text-primary)` | Text on the background colour |
| `--color-light-theme` | `var(--brand-gray)` |  |
| `--color-neon-orange` | `var(--accent)` |  |
<!-- /generated:map -->

## 2. Update the components

Work in this order: tokens and the app shell first, then Discover and Sessions, then Library and Track Intelligence, then the marketing templates. The files are the ones listed in [the source map](source-map.md).

### Everywhere

- **Sentence case.** Remove `uppercase` and wide letter spacing from titles, buttons, tabs, labels and table headers. "FIND SIMILAR TRACKS" becomes "Find similar tracks".
- **Fira Code only for numbers people compare**: BPM, key, length, match score, counts, keyboard hints. Labels, buttons and headings move to Helvetica Neue (`.type-label`, `.type-card-title`, …).
- **Nothing below 12px.** Text set with `--px-9`, `--px-10` or `--px-11` moves to `.type-caption` (12px) or `.type-label` (13px). The root size still scales with the screen, so check sizes at 1024px wide.
- **Regular weight for reading.** Body copy moves from light (300) to `.type-body` (400). Light stays for nothing in the app.
- **The accent marks four things only**: the one primary action, the selected choice, what's playing and the current loop step. Remove it from panel corner marks, section kickers, `//` separators and rank numbers.
- **No terminal-style copy.** Drop `OUTPUT //`, bracketed labels and decorative lines that read as system facts.

### By file

| File | Change |
|---|---|
| `packages/ui/src/Content/pageChrome.ts` | Panels: drop the accent corner mark; identify a block by its title. Page buttons move from 36px to `--control-md` (40px), labels in `.type-label`. Kickers and sub-labels become `.type-section-title` or `.type-caption` in sentence case. Fields: `--border-control` edge, `--bg-sunken` fill. |
| `apps/webapp/src/sections/desktop/Workspace/workspacePanelStyles.ts` | Primary button `--control-lg` (48px), secondary `--control-md` (40px). Remove the notch clip-path (it is already 0). Badges become status pills: `--radius-pill`, an icon and a word. |
| `apps/webapp/src/sections/desktop/Workspace/TaskCard.tsx` | Becomes the v3 choice card: `radiogroup`, selected = 2px accent edge plus a check and "Selected" in `--text-accent`. Remove the "Output //" line. |
| `apps/webapp/src/sections/desktop/Workspace/ReferenceChip.tsx` | "Reference selected" in sentence case; title in `.type-card-title`, meta in `.type-body-sm` with numbers in `.type-data`. |
| `apps/webapp/src/sections/desktop/Playlist/PlaylistTable.tsx` | Headers in `.type-caption` sentence case (no 9px mono). Track titles `.type-card-title` in sentence case, artist `.type-body-sm`. BPM, key, length and score in `.type-data`. Triage per row: Keep (teal, check), Maybe (amber, clock), Pass (neutral). |
| `apps/webapp/src/index.css` (`.pl-row`) | Playing row: `--bg-selected` plus a "Playing" word or icon, not the tint alone. Paused row: `--border-strong` marker. |
| `apps/webapp/src/components/Playlist/MatchBar.tsx` | Bar fill already resolves to `--text-secondary`; score in `.type-data`; "Top" in `.type-caption`. |
| `packages/hooks/src/Toast/toast.ts` | `--bg-overlay` with `--shadow-overlay`, `--radius-md`; each kind with its status icon and word. |
| `packages/ui/src/Modals/` | `--bg-overlay`, `--radius-lg`, `--shadow-overlay`, `--bg-scrim` behind; titles `.type-card-title`. |
| Busy buttons ("Searching…") | Keep the label in `--text-secondary` with `aria-busy="true"`, not the disabled colour: a busy control is not disabled. |

### Clean-up found during the audit

- **Icons.** `assets/icons/` holds 83 files in mixed styles (outline, filled, dashed), with separate `_white` and `_black` copies of the same glyph and several unused. v3 wants one set of 1.5px line icons on a 24px grid drawn in `currentColor`. Merge the colour pairs, drop the unused ones, and replace the rest with the brand set when it arrives.
- **Fonts.** Staging loads Auger Mono from TEST (trial) files. Remove it, or license it before production.
- **Page title.** `/lab/design` has the browser title "Page not found | Resomix".
- **Lab page.** Rebuild `/lab/design` on v3 once the components move, then run `npm run capture` to refresh [the snapshot](lab-design/README.md).
