# Contrast audit, 2026-10-31

> **Superseded by v3.** These fixes were made to the pre-v3 tokens, now in `tokens/legacy/`. v3 replaces them: solid colours per theme, `text-accent` for small orange text, `border-control` for operable edges and a real Daylight theme, all checked by `npm run check`. Kept for history.

Measured on `staging-frontend.resomix.com/lab/design` against WCAG 2.x. Each ratio is the worst case across the canvas, surface, raised, input and overlay grounds and the selected, playing and accent-soft tints, with translucent tokens composited over the surface. `npm run check` reproduces these numbers.

## Fixed

| Where | Token | Before | After | Ratio before → after |
|---|---|---|---|---|
| Selected tag, accent rank numbers, `//` separators | new `--rx-color-accent-text` | `#ee4a26` (70% for `//`) | `#ff7a5c` | 4.09 / 2.97 → 5.93 |
| Inputs, secondary buttons, unselected task cards | new `--rx-color-border-control` | `--rx-color-border-default` `#ffffff29` | `#ffffff66` | 1.48 → 3.61 |
| Hover edge | `--rx-color-border-strong` | `#ffffff3d` | `#ffffff99` | 1.99 → 6.33 |
| Busy and disabled labels ("Searching…") | `--rx-color-disabled` | `#ffffff6b` | `#ffffff80` | 3.83 → 4.86 |
| Light theme page ground | `--color-primary-background` (`.light`) | `#000000` | `#f6f6f4` | 1.00 → 19.4 |
| Light theme raised ground | `--color-secondary-background` (`.light`) | `#111111` | `#f0f0ee` | 1.11 → 18.4 |

`--rx-color-on-accent` (`#050505`) is new as a name only: it records the colour buttons already use on the orange (5.48:1, 6.59:1 on hover).

## Already passing

Text primary 14.1, secondary 10.2, muted 8.5, error 5.8, success 8.1, focus ring 6.8, score fill 5.1.

## Still to change in the webapp

The token values above are only half the fix. These places need to use the new tokens:

- `packages/ui/src/Content/pageChrome.ts`: page fields and secondary page buttons → `border-color: var(--rx-color-border-control)`, hover → `var(--rx-color-border-strong)`.
- `apps/webapp/src/sections/desktop/Workspace/workspacePanelStyles.ts`: workspace field and secondary button, same as above.
- `apps/webapp/src/sections/desktop/Workspace/TaskCard.tsx`: unselected card edge → `border-control`; the "Selected" tag text → `var(--rx-color-accent-text)`; replace `text-[rgba(238,74,38,.7)]` with `text-[var(--rx-color-accent-text)]`.
- `apps/webapp/src/sections/desktop/Playlist/PlaylistTable.tsx`: the accent rank number → `accent-text`.
- Light theme: check the screens that use `.light` after the ground change, since nothing there could have been readable before.

## Not a colour issue, but flagged

Table headers and some kickers are Fira Code at `--px-9` (9px at 1280 wide, 7.2px at 1024). The colours pass, but text that small stays hard to read. Raise them to `--px-11` or `--px-12`.
