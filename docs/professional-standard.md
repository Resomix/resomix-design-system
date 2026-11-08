# The professional standard

What "professional" means for every Resomix screen: the app, the beta and resomix.com. It sits on top of [the v3 guidelines](guidelines-v3.md) and the [v3 tokens](../tokens/v3/tokens.json), and turns them into rules you can check. A screen ships when it passes [the checklist](#the-checklist) at the end.

The bar: calm and restrained, sharp type, the same components everywhere, and facts a serious buyer can trust. Studio (dark) is the only theme.

## 1. Hierarchy and clarity first

- One job per view. Name it in a sentence before designing; if it takes two sentences, it is two views.
- One primary action per view, as the only `accent` fill. Everything else is a secondary or ghost button, or a text link.
- Three levels of text weight at most in any one area: a title, its supporting line, and meta. If a fourth level appears, remove or merge one.
- Reading order matches importance: title, the one line that explains it, the primary action, then detail. Nothing above the title competes with it (no kicker labels, no badges stacked over headings).
- The 3-second test: someone glancing at the view can say what it is and what to do next. Test with a real person or a screenshot at 50% size.

## 2. Typography rules

- Helvetica Neue (`sans`) for everything people read, Fira Code (`mono`) only for numbers people compare, Benzin (`display`) only for marketing headlines. No other faces.
- Use the type styles, never ad-hoc sizes: `page-title`, `section-title`, `card-title`, `body`, `body-sm`, `label`, `caption`, `data-*`, and on marketing pages `display-xl`, `display-lg`, `marketing-h2`, `lead`. In code, the `.ds-*` classes from `tokens/v3/tokens.css`.
- Nothing below 12px (`caption`, `data-sm`).
- Sentence case for every heading, button, tab, label and menu item. Capitals only for the one `display-xl` hero headline. Never uppercase mono labels.
- Line length 45 to 75 characters: paragraphs stop at `reading-max`.
- Headings get more space above than below. Never end a heading with a single orphaned word on desktop; set `text-wrap: balance` on headings and `pretty` on paragraphs.
- Numbers in tables and stats use tabular figures (`font-variant-numeric: tabular-nums`) so columns align.

## 3. Colour discipline

- Components use semantic tokens only (`bg-*`, `text-*`, `border-*`, `accent`, `status-*`, `data-*`). Never a raw hex, never a brand primitive inside a component.
- The accent has four jobs and no others: the one primary action, the selected choice, what is playing, the current loop step. If two orange things compete in one view, one of them is wrong. No orange for decoration, headings, icons or borders that do nothing.
- Small orange text uses `text-accent`, never `accent`.
- Status colours always come with an icon and a word. Colour never carries meaning alone.
- `data-*` colours are for chart marks only.
- One ground per layer: `bg-canvas` → `bg-surface` → `bg-raised`. Never a surface on the same surface; step up or down one.
- No gradients, glows or glass on content. A gradient is allowed only in marketing art, never behind text.

## 4. Spacing and layout

- Every gap is a `space-*` token on the 4px base. No in-between values.
- The rhythm: `space-5` inside a card, `space-4` between cards, `space-8` between sections in a view, `space-14` (phone) and `space-18` (desktop) between landing sections.
- Related things sit closer than unrelated things. If two groups are as far apart inside as between them, the grouping is lost.
- One alignment per section: left-aligned text, with centred text only for a single short line such as an empty state.
- Content caps at `content-max`; paragraphs at `reading-max`. Use a 12-column grid on desktop and a single column on phones; no fixed pixel widths that break between 1024px and 1600px.
- Check at 390px, 768px, 1280px and 1920px. No horizontal scroll at any width.

## 5. Shape, depth and elevation

- Radii by role: `radius-sm` controls, `radius-md` cards and menus, `radius-lg` drawers and dialogs, `radius-xl` marketing tiles, `radius-pill` status pills and switches only. Never mix two radii on the same kind of element.
- The page is flat. Edges come from `border-default` and tonal steps, never from shadows.
- Only things that float get `shadow-overlay` on `bg-overlay`: drawers, dialogs, menus, toasts, the command bar. `shadow-lift` marks only a selected segment and a dragged row.
- No decorative borders, rules or frames that separate nothing.

## 6. Consistency over creativity

- Reuse before you build: a new screen uses the existing components with their existing variants. A new component needs a reason no existing one can meet, and then it joins the system for every surface.
- The same action has the same label, look and place everywhere (for example "Try Sonic Discovery" as the entry point on the site and in the app).
- The same thing has the same name everywhere: product names, plan names, states.
- One icon set (24px grid, 1.5px stroke, `currentColor`), one button set, one field set, one card set.
- Page-specific styling is the exception and lives next to the page; tokens, type and components never get redefined per page.

## 7. Accessibility is non-negotiable

- WCAG 2.2 AA is the floor. Text 4.5:1, large text, icons, control edges and focus 3:1, on the ground they actually sit on. Disabled text 3:1 (stricter than WCAG). `npm run check` tests every pair on every ground.
- Every control works with a keyboard alone, in a logical order, with a visible 2px `focus` ring at a 2px offset. Never remove focus styles.
- Targets are at least `target-min` (24px); main controls on a phone 44px.
- Every image has useful alt text or is marked decorative; every icon button has an accessible name that matches what it shows.
- Headings form an outline: one `h1` per page, then `h2`, `h3` in order.
- Motion respects `prefers-reduced-motion`: the `--ds-duration-*` tokens drop to 0.
- Never autoplay audio. The playing track is always visible and stoppable.

## 8. Content and writing

- Plain words, short sentences, active voice. Say what it does for the person reading, not how clever it is.
- Buttons are a verb and an object ("Find similar tracks", "Start a pilot"), never "Submit", "OK" or "Click here".
- Every claim is true and specific. No uptime, latency, security figures, catalogue sizes, customer names or results unless they are in the capability register. Decorative text that reads as fact is a claim.
- Say the limits plainly (beta, guest limits, what is not supported). Honest limits build more trust than polish.
- No terminal-style, bracketed or coded copy. No internal model names, raw IDs or error codes.
- Every state is written: loading ("Saving…"), empty (what is missing and the next step), error (what failed and what to do).

## 9. Performance and restraint

- Every element earns its place. Before shipping, try removing each decorative element; if nothing is lost, leave it out.
- One memorable moment per page at most (an animation, an illustration, a demo). Everything else stays quiet.
- Motion is short and functional: `duration-fast` for hover, `duration-base` for tabs and disclosure, `duration-slow` for drawers, always `ease-standard`.
- Fonts are self-hosted with metric-matched fallbacks; no layout shift when they load.
- Images are sized, lazy below the fold, and in modern formats. No video or canvas in the first viewport unless it is the product itself.
- Targets: Largest Contentful Paint under 2.5s, layout shift under 0.1, interaction under 200ms on a mid-range phone.

## 10. Modern 2026 expectations

- Dark-first, with `color-scheme: dark` set, themed scrollbars, text selection and caret in the system's colours.
- Fluid type and spacing that scale with the viewport, with no breakpoint jumps that move content.
- Real product in the first viewport where possible (a working search, a real result), not a picture of one.
- Native platform behaviour: real links that open in new tabs, real buttons, browser back that works, URLs that keep state.
- Skeletons, optimistic updates and toasts instead of spinners and blocking popups.
- Content readable by search engines and assistants: server-rendered text, structured data, a Markdown twin per page.

## The checklist

Before shipping any screen, answer each question. A "no" blocks the release.

| # | Question | Passes when |
|---|---|---|
| 1 | Is there a clear primary action? | Exactly one `accent` fill in the view, and it names what happens. |
| 2 | Can the user understand the hierarchy in under 3 seconds? | One title, one supporting line, one primary action, in that reading order; at most three text levels in any area. |
| 3 | Is the text readable and in sentence case? | Only type styles from the system, nothing under 12px, paragraphs within `reading-max`, no capitals outside the one hero headline. |
| 4 | Does the accent colour have a job? | Every orange element is the primary action, a selection, what is playing or the current step. Nothing orange is decoration. |
| 5 | Is spacing consistent? | Every gap is a `space-*` token, and the card, section and landing rhythms above are followed. |
| 6 | Does it meet contrast requirements? | `npm run check` passes, and any new pairing was checked on the ground it sits on. |
| 7 | Does it work with the keyboard only? | Every action reachable with Tab, Enter, Space and Esc, in a logical order, with a visible focus ring. |
| 8 | Is anything decorative that could be removed? | Removing any remaining decorative element would make the screen worse, not just plainer. |
