# Where each part lives in the webapp

| Part | File |
|---|---|
| Colour, accent, focus and motion tokens | `apps/webapp/src/index.css` (`--rx-*`, `--color-*`) |
| Size tokens | `apps/webapp/src/styles/pixels.css` (`--px-N`) |
| Fonts | `apps/webapp/src/styles/fonts.css` |
| Panels, page buttons, fields, kickers | `packages/ui/src/Content/pageChrome.ts` |
| Workspace buttons, badges, fields, focus ring | `apps/webapp/src/sections/desktop/Workspace/workspacePanelStyles.ts` |
| Task cards | `apps/webapp/src/sections/desktop/Workspace/TaskCard.tsx` |
| Reference chip | `apps/webapp/src/sections/desktop/Workspace/ReferenceChip.tsx` |
| Results table and its rows | `apps/webapp/src/sections/desktop/Playlist/PlaylistTable.tsx` |
| Row states and the reveal of row actions | `apps/webapp/src/index.css` (`.pl-row`) |
| Match bar | `apps/webapp/src/components/Playlist/MatchBar.tsx` |
| Toasts | `packages/hooks/src/Toast/toast.ts` |
| Dialogs | `packages/ui/src/Modals/` (`Dialog`, `ConfirmDialog`, `PromptDialog`) |
| House UX and copy rules | `.claude/skills/resomix-ux/SKILL.md` and `instructions.md` §7 |

The live reference page is `/lab/design` in the webapp.
