# F1nsight Agent Guide

## Project Direction

- Preserve legacy pages unless the user explicitly asks to replace or delete them.
- Build redesigned pages in `src/pages/2026/` and roll them out one route at a time.
- Route new 2026 pages from `App.js` by swapping imports, not by overwriting legacy page files.
- Keep the 2026 design system scoped to `DesignSystem2026` and `design-system-2026.scss`.
- Put reusable 2026 page primitives in `src/pages/2026/components/` before adding page-specific markup.

## 2026 Design System

- Wrap redesigned pages with `DesignSystem2026`.
- Scope component and page styles under `.design-system-2026` or page-specific `ds-2026-*` classes.
- Use existing 2026 CSS tokens before adding one-off values:
  - `--ds-2026-bg`
  - `--ds-2026-paper`
  - `--ds-2026-paper-text`
  - `--ds-2026-surface`
  - `--ds-2026-surface-strong`
  - `--ds-2026-border`
  - `--ds-2026-text`
  - `--ds-2026-text-muted`
  - `--ds-2026-accent`
  - `--ds-2026-accent-cool`
- Treat `--ds-2026-accent` as the active team color; fall back to F1nsight plum when team color is unavailable.
- Use `body.bg-gradient-2026` only for route-level background treatment.

## Data and Page Architecture

- Prefer shared hooks for data and transformation logic when redesigning legacy pages.
- `useTeammatesComparison` owns teammate comparison fetches, URL state, team color fallback, driver selection, and head-to-head calculation.
- 2026 pages may reuse legacy chart components, but should wrap them in 2026 layout primitives such as `ChartPanel2026`.
- Use `src/utils/teamColors.json` for team colors instead of fetching color data from the API.

## API Guidance

- Prefer the F1nsight custom API as the frontend target when possible.
- Do not expose private OpenF1 API keys in frontend code or React env vars.
- Keep browser-facing API responses predictable; components should receive arrays where arrays are expected.

## Verification

- After substantive edits, run focused lint checks on touched files.
- Run `npm run build` after route, import, or shared styling changes.
- Existing repo-wide warnings may remain, but avoid adding new warnings in touched files.
