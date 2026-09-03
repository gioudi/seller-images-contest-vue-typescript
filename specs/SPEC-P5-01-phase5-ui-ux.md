# SPEC-P5-01: Phase-5 UI/UX Overhaul — Theme, i18n, 404, Responsive, Landing/Vote Polish (EST-F04)

| Field | Value |
|-------|-------|
| **Status** | DRAFT (awaiting PR review) |
| **Topic** | A unified Phase-5 UI/UX pass: dark/light theming, ES/EN/DE language switcher (i18n), a 404 page, responsive polish, landing + results/vote redesign, removal of the landing "go back" button, and border-radius harmonization on images. |
| **Estimate** | ~14h (theme 3h, i18n 4h, 404 1h, responsive 2h, landing/vote polish 3h, docs 1h) |
| **Branch** | `feature/phase5-ui-ux` |
| **Proposal** | PROPOSAL-2026-022 |
| **ADS Reference** | Section 10 (Accessibility), Section 11 (Tooling); EST-F04, EST-F01, EST-F02 |
| **EST Reference** | EST-F04 (UI/UX enhancements), EST-F01 (i18n), EST-F02 (screen reader/a11y) |

## 1. Context

The app works but the UI/UX shows several rough edges the ADS and product review flag:
- **Visual inconsistency** — the seller/vote "cards" are a showy 3D hover gimmick (invisible text, no image radius) that clashes with the rest of the system; the product images overall lack the system's rounded-corner language.
- **No theme support** — the app is light-only; users can't switch to dark mode despite strong sentiment for it.
- **No language switching** — the app is Spanish-only; the product needs ES / EN / DE.
- **No 404 page** — unknown URLs render a blank/broken state instead of a friendly "not found".
- **A pointless "Volver" (go back) button** in the global navbar even on the landing page, where there's nowhere to go back to.
- **Responsive/placement issues** — the landing page and results page have cramped or unbalanced element placement (e.g. `grid-col-xs-11` leaves an awkward gutter, forms use dead Bootstrap classes).
- **Harmonization** — carousel and card images need a small border-radius to match the system.

This is a broad but coherent Phase-5 pass. It deliberately preserves the brand feel ("keep the vibe, polish it") rather than redesigning the product into a new aesthetic.

## 2. Topic & Scope

- **Topic:** deliver theming, i18n, 404, responsive polish, and landing/vote/result page polish in one reviewed UI/UX branch.

**In scope:**
1. **Theme (light/dark)** — CSS custom properties on `:root` + `html[data-theme="dark"]`; SCSS palette tokens forward the CSS vars so all existing usages theme automatically; a `useTheme()` composable with localStorage persistence + system-preference default; a `ThemeToggle.vue` control in the navbar; `color-scheme` for native form/scrollbar theming.
2. **i18n (ES/EN/DE)** — `vue-i18n@9` with `src/i18n/` locale files; a `LanguageSwitcher.vue` control in the navbar; all templated user-facing strings localized; `document.documentElement.lang` updated reactively; locale persisted.
3. **404 page** — `NotFound.vue` view + catch-all route.
4. **Remove the landing "go back" button** — the navbar hides the home/go-back button on the landing page (shown on other pages).
5. **Responsive polish** — correct the awkward gutter columns (`grid-col-xs-11`), give results cards a proper responsive grid (xs12/sm6/md4/lg3), make landing search form a cohesive responsive row.
6. **Landing + results/vote polish** — centered hero + search placement on landing keeping the carousel; replace the 3D-gimmick seller card with a clean rounded card (visible title, points, vote button), image gets a border-radius and `object-fit`.

**Explicitly out of scope (forbidden in this branch):**
- Changing the product's core logic, data flow, API, stores, or routes beyond adding the 404 route
- A full visual redesign into a new aesthetic (per decision: keep the current vibe)
- `vue-i18n` usage in API/backend error strings that are dynamic from the server (only templated UI strings are localized)
- Fixing pre-existing `npm audit` advisories (own topic)
- The other ADS a11y items not touched here (skip-link, focus-trap, ARIA vote-button) — separate future steps

## 3. Design in plain words

Four user-facing layers get fixed at once:

- **Dark/light theme.** We let the whole app "recolor" at runtime without touching a hundred files: we expose the color palette as CSS variables and point the existing SCSS tokens at them. Flipping a variable recolors the whole page. A small `useTheme()` remembers the choice in `localStorage` and respects the OS preference on first visit.

- **Language switcher.** We add `vue-i18n` and translate every visible string into Spanish, English and German. A dropdown in the navbar swaps languages instantly and remembers the choice; the page's `lang` attribute follows.

- **404.** Unknown addresses now land on a friendly "Page not found" screen with a button back home, instead of a blank shell.

- **Polish.** We tidy the landing (hero + prominent search, carousel beside it) and the results/vote page (clean rounded seller cards with a visible name/points/vote control, consistent image corners), fix the responsive columns, and drop the redundant landing "go back" button.

## 4. The five design principles, in plain words

- **S — one job each.** Theme owns colors; i18n owns text; the 404 owns not-found; each card owns its content. No overlap.
- **O — easy to extend.** Adding a 4th language = a JSON file; adding a new theme = a token block; a new locale/color flows through automatically.
- **L — pluggable parts.** Theme toggle and language switcher are isolated components; removing either leaves the app intact.
- **I — minimal surface.** We forward existing SCSS tokens to CSS vars rather than rewriting every selector; we localize only strings already visible in templates.
- **D — one source of truth.** Colors come from `_variables.scss` token blocks; strings come from `src/i18n/*.json`; both have a single canonical home.

## 4b. Technical patterns

- **CSS custom properties + `data-theme` attribute** — runtime theming without recompiling SCSS.
- **`prefers-color-scheme`** — OS dark-mode detection for the default theme.
- **`vue-i18n` (composition API)** — `$t` global injection + `useI18n()`; locale reactive and persisted.
- **Route catch-all `/:pathMatch(.*)*`** — vue-router pattern for an SPA 404.
- **`color-scheme`** — native scrollbar/form/control theming alongside our colors.

## 5. Where things live and why

```
src/i18n/{es,en,de}.json      ← translated messages (source of truth per language)
src/i18n/index.ts             ← createI18n, locale detection + persistence
src/composables/useTheme.ts   ← theme state + localStorage + prefers-color-scheme
src/components/ThemeToggle.vue
src/components/LanguageSwitcher.vue
src/views/NotFound.vue        ← 404 view
src/routes/index.ts           ← added catch-all NotFound route
src/styles/abstracts/_variables.scss   ← CSS custom props + token forwarding
src/styles/base/_reset.scss            ← body colors + color-scheme + img radius
src/styles/{mixins,navbar}.scss        ← surface tokens + navbar controls
src/components/seller/SellerCard.vue   ← clean rounded card (was 3D gimmick)
src/views/{LandingPage,ImageList,InvoiceForm}.vue ← polish + i18n
src/main.ts                   ← register i18n
```

Why: the SCSS 7-1 `_variables.scss` is already the single design-token entry; pointing its palette tokens at CSS vars is the lowest-touch way to add theming. `src/i18n/` mirrors the toolchain's convention of keeping multi-language data in one obvious folder. Registering i18n in `main.ts` matches how Pinia/Toast/router are already registered.

## 6. Rules going forward

- [ ] New colors must be added once as a `:root` CSS custom property and forwarded in `_variables.scss` if any SCSS selector uses them
- [ ] Any new visible English/Spanish/German string must be added to all three locale files (no hardcoded UI text on a routed page)
- [ ] The page `<h1>` remains exactly one per view; heading hierarchy (from SPEC-P4-08) must not regress
- [ ] The navbar keeps a single primary action per context (no "back" on landing)
- [ ] Image content keeps a modest border-radius to stay consistent with the system

## 7. Acceptance Criteria

- [ ] `npm run lint`, `npm run type-check`, `npm run test:unit` (23/23), `npm run build` all exit 0
- [ ] Dark theme: `html[data-theme="dark"]` recolors body/navbar/panel/cards/inputs; `useTheme` persists to `localStorage`; reflects `prefers-color-scheme` on first load; `ThemeToggle` flips it
- [ ] i18n: `LanguageSwitcher` flips ES/EN/DE; landing/results/invoice/navbar/footer/loading/winner not-found views reflect the locale; `lang` attribute updates; locale persists
- [ ] 404: visiting an unknown path renders `NotFound.vue` with a "back home" action
- [ ] Navbar: no "go back/home" button on the landing page; present on other pages
- [ ] Images: carousel slides and seller-card images have a border-radius (`$border-radius-md`/`$border-radius-sm`) and `object-fit`
- [ ] Results/vote page: card grid uses xs12/sm6/md4/lg3 columns; 3D hover gimmick removed; title/points/vote visible and readable
- [ ] Landing: hero + search + carousel are evenly placed and responsive

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| CSS-var token forwarding breaks SCSS color math | Low | High | audited: no `rgba()/lighten()/darken()` applied to palette tokens in the codebase; build green |
| i18n breaks existing unit tests (footer/loading/navbar) | Medium | Medium | added a `createTestI18n` helper and installed i18n in the 4 affected specs; 23/23 tests pass |
| Dark theme degrades panel/input contrast | Medium | Medium | introduced a `--color-surface` token used by panel/input/modal; body text color set; `color-scheme` added |
| localStorage/navigator access at module load in non-browser contexts | Low | Medium | jsdom (tests) supports both; build is static; guarded usage keeps defaults |
| Scope creep into other a11y/redesign items | Medium | Low | explicit out-of-scope list; single coherent Phase-5 theme |

## 9. Testing Strategy

- Gates: `npm run lint`, `npm run type-check`, `npm run test:unit`, `npm run build`
- Unit: 4 existing specs updated to mount i18n; no assertions changed in meaning
- Manual (via `npm run dev` in review): theme toggle, language dropdown, typing an unknown URL, landing/results layout at xs/sm/md/lg

## 10. Estimate & Dependencies

| Task | h |
|------|---|
| Theme (tokens + useTheme + toggle) | 3.0 |
| i18n (vue-i18n + locales + switcher + wiring) | 4.0 |
| 404 (view + route) | 1.0 |
| Responsive polish | 2.0 |
| Landing + results/vote polish (incl. seller card rewrite) | 3.0 |
| Docs (spec + proposal) | 1.0 |
| **Total** | **14.0** |

**Dependencies:** none confirmed. Builds on SPec-P4-08 (heading hierarchy) and the standardised `<script setup>` components (EST-M03). Branch: `feature/phase5-ui-ux`.

---

## Approval

- **Jör Approved:** (pending)
- **Status:** DRAFT — await PR review on GitHub