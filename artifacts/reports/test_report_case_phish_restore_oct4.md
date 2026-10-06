# Test report: restore InnoPhish case to Oct 4 version

## Diagnosis

| Check | Result |
| --- | --- |
| Branch `Фиш` HEAD | `7118708` — already yesterday's tip (hero-full lightbox crop) |
| `myportfolio/master` | `333bd28` (merge PR #6) — contains `7118708` |
| Local `master` before fix | `e6cdf71` — **behind 3**, old case-phish content |
| Working tree case files | clean (no dirty reverts); only untracked `.tmp-*` / `ref_case/` |
| Uncommitted newer case edits | none to preserve |

**Root cause:** local `master` was stale at pre-PR#6 commit `e6cdf71`. Checkout `Фиш` already had the new page; the “old version” risk was viewing/serving from outdated local `master` (or a dead preview before Vite was up).

## Fix

- Fast-forwarded local `master` `e6cdf71` → `333bd28` (`git merge --ff-only myportfolio/master`).
- Returned to branch `Фиш` (`7118708`, up to date with `myportfolio/Фиш`).
- No product file edits required — content/assets already matched Oct 4 merge.

## Preview

- Vite: `http://localhost:5173` (`npm run portfolio:dev`)
- Case URL: `http://localhost:5173/portfolio/case-phish.html`

## Browser smoke

- Title **InnoPhish**, segments Полностью/Кратко, hero dashboard with Атаки/Реакции/Обучение.
- Sidebar nav: Контекст → … → Результаты (**no** «Контакты»).
- Hero `data-full-src` → `/ds-showcase/assets/images/case-phish-hero-full.png`.
- Lightbox opens (`body.is-case-lightbox-open`) with full dashboard hi-res.

## Automated tests

```
node tests/test_portfolio_case_phish.mjs
→ 6/6 pass
```

## Confirmation

Served page matches yesterday’s new InnoPhish case (PR #6 / `7118708` / `333bd28`): Figma content, hi-res lightbox, segments, JTBD markers in contentMap, no Contacts in case sidebar.

No commit / push performed.
