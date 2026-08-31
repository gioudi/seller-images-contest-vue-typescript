# SPEC-P3-03: SCSS 7-1 Architecture + BEM + Mobile-First (EST-M06)

| Field | Value |
|-------|-------|
| **Status** | DRAFT (awaiting Jör approval via PR) |
| **Topic** | Restructure the app's styles into the "7-1" SCSS pattern, use BEM naming for component classes, and keep the whole app responsive with a mobile-first mindset (EST-M06). Single topic: styles architecture — nothing else. |
| **Estimate** | 16h |
| **Branch** | `feature/scss-7-1-architecture` |
| **Proposal** | PROPOSAL-2026-008 |

## 1. Context

The app's styles currently live in a small set of loose files inside `src/styles/`: one big global file (`_styles.scss`, ~590 lines) that mixes fonts, colors, the loader, and mixin usage all together, plus two mixin files that duplicate each other, a container/grid, and a handful of utility classes. As the app grows, "where does this style live?" becomes hard to answer, styles get repeated, and a change in one area can quietly break another.

The fix — which was already planned in `ESTIMATIONS-AND-RESOLUTIONS.md` (EST-M06) — is to organize styles into the well-known **"7-1" SCSS pattern**: 7 folders that each hold one kind of style, plus 1 main file that imports them all in order. This makes the styles predictable and easy to extend.

The user (Jör) also asked for two extra ways of working that we'll bake in here:
- **BEM naming** for component classes (Block, Element, Modifier — readable, consistent class names).
- **Mobile-first responsiveness** (design for the smallest screen first, then add bigger-screen rules with `min-width`), so the app is reliably responsive.

Everything must keep looking and behaving exactly as it does now — this step is about organizing and cleaning up the styles, not changing how the app looks. That is the acceptance bar.

## 2. Topic & Scope

- **Topic:** reorganize `src/styles/` into the 7-1 pattern, apply BEM conventions, and normalize mobile-first media queries. No visual changes.

**In scope:**
- Create the 7-1 structure under `src/styles/`:
  - `abstracts/` — design tokens (colors, fonts, spacing), mixins, functions (recipes that ARE used elsewhere, not printed on their own)
  - `base/` — defaults every page needs: a CSS reset, typography sizes, container, grid, form-element base
  - `components/` — styles for the app's own building blocks (navbar, footer, modal, panel, loading animation)
  - `layout/` — page-level layout helpers (e.g., page scaffolding)
  - `pages/` — styles that only a single page needs (kept minimal; each page is a file)
  - `utilities/` — one-purpose helper classes (`.d-flex`, spacing, colors, text sizes)
  - `vendors/` — third-party bits (the Google font import)
  - `main.scss` — the single entry file that imports all folders in order
- Merge the two duplicate mixin files into one set under `abstracts/`
- Remove duplicate/unused utility classes
- Add a CSS reset in `base/`
- Move bare element styling (`nav`, `footer`) onto the app's real class names (`alegra-navbar`, `footer`) so no style depends on a bare HTML tag
- Keep every existing class name that templates and tests rely on, so nothing breaks

**Out of scope (forbidden in this branch):**
- Any visual/appearance change (no new look, no redesign)
- Renaming classes that templates already use
- New features (theme toggle, i18n, etc. — own PRs, and this structure makes them easier later)
- Component/markup changes (that's other work)

## 3. Design in plain words

Think of the styles folder as a **library with labeled shelves**. Right now everything is dumped on one messy shelf. The 7-1 pattern gives each shelf a clear label and a rule for what belongs on it:

- **abstracts** — the "materials and recipes": colors, fonts, spacing numbers, and mixins. Nothing printed here; other files dip into it.
- **base** — the "house defaults": reset, standard text sizes, the container and grid.
- **components** — the "furniture": navbar, footer, modal, panel, loading spinner.
- **layout** — the "room layout": how blocks sit on the page.
- **pages** — special rules for one specific page only.
- **utilities** — the "one-tool gadgets": small helper classes you drop onto anything.
- **vendors** — "imported goods": third-party stuff like the Google font.

`main.scss` is just the front door that opens each shelf in order: abstracts first (so everything else can use them), then base, components, layout, pages, utilities, and vendors last.

**BEM naming** is simply a clear, consistent way to name component classes: `block__element--modifier`. For example `alegra-modal` is the block, `alegra-modal__content` is an element inside it, and a style variant would be `alegra-modal--large`. You can tell at a glance what a class belongs to and what role it plays.

**Mobile-first** means we write the layout for a small phone first and only add extra rules when the screen gets wider (using `min-width` media queries). The existing grid already works this way, so we keep that spirit and make it consistent app-wide.

## 4. The five design principles, in plain words

- **S — every file has one job.** Fonts live in base, the navbar lives in components, spacing numbers live in abstracts. One question — "where is the navbar styled?" — has one clear answer.
- **O — easy to grow, nothing to rewrite.** Want a new theme or a new component later? Drop a new file in the right shelf and import it. The old stuff stays untouched.
- **L — interchangeable parts.** Because the entry file controls the order and each shelf is independent, we can add, remove, or swap a style file without touching the others.
- **I — files get only what they need.** Utilities are separate from components, so a page doesn't load whole component styles it never uses; each import pulls exactly the layer it needs.
- **D — the structure is clear end to end.** Components depend on the abstract "materials" (tokens/mixins), never the other way around — so changing a color token updates everything that uses it, predictably.

## 5. Where things live and why

```
src/styles/
  main.scss              ← the one file that imports everything, in order
  abstracts/
    _variables.scss      colors, fonts, sizes, shadows (design tokens)
    _mixins.scss         reusable recipes (button, input, panel, media queries)
    _functions.scss      small helpers (breakpoints)
  base/
    _reset.scss          clean slate: box-sizing, margins, default element sizes
    _typography.scss     h1–h6 + `.alegra-h*` size classes
    _container.scss      `.container`, `.container-sm`, `.container-md`
    _grid.scss           `.grid` + `.grid-col-*` responsive columns (mobile-first)
    _elements.scss       base styles for inputs, buttons, lists
  components/
    _navbar.scss         `.alegra-navbar` block + elements
    _footer.scss         `.footer`
    _modal.scss          `.alegra-modal` + `.alegra-modal-content`
    _panel.scss          `.alegra-panel`
    _loading.scss        `.alegra-loading` + circles animation
  layout/
    _app.scss            app shell scaffolding (the surrounding panel area)
  utilities/
    _flex.scss           `.d-flex`
    _spacing.scss        `.p-*`, `.m-*` helpers
    _color.scss          `.alegra-color-*`, `.alegra-bg-*`
    _text.scss           `.normal`, `.small`
  vendors/
    _fonts.scss          Google Font import
```

Why this shape: it follows the accepted 7-1 convention, matches what the ESTIMATION already promised (`EST-M06` lists exactly these folders: base, abstracts, components, layout, pages, utilities, vendors), and it keeps every style in a place whose name says what it is.

## 6. Rules going forward (so this stays clean)

- [ ] New styles go in the right shelf — no dumping random CSS into `main.scss`
- [ ] Component classes use BEM: `block__element--modifier`
- [ ] Media queries use `min-width` (mobile-first) — avoid `max-width` for layout
- [ ] No new global bare-element selectors (avoid styling bare `div`, `span`, etc.)
- [ ] Design tokens (colors/type/spacing) come from `abstracts/_variables.scss`
- [ ] No duplicate mixins or styles

## 7. Acceptance Criteria

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm run test:unit` exits 0 (existing tests still pass — visual selectors unchanged)
- [ ] `src/styles/` is organized into the 7 folders + `main.scss`
- [ ] Only one mixin definition for each recipe (no duplicates)
- [ ] A CSS reset exists in `base/`
- [ ] No duplicated utility classes
- [ ] Component classes that templates use are untouched (no renames that break rendering)
- [ ] Manual `npm run dev` smoke: landing page, search, list, cards, loader, navbar, footer all render as before, and the layout still stacks nicely on a narrow (mobile) viewport and expands on wider screens

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Moving styles breaks the look of a screen | Medium | High | keep every exported class name identical; build + manual visual smoke on all screens |
| `@import` order changes cascade behavior | Medium | Medium | keep a strict public order in `main.scss` (abstracts → base → components → …); verify output |
| Dropping a utility class that templates still use | Medium | Medium | grep for each class before removing; only remove ones with no usages |
| Removing global element styles changes forms | Medium | High | keep input/button/list base styling in `base/_elements.scss`; only drop bare `nav`/`footer` dual selectors, replacing them with the app's real classes |
| Scope creep into redesign/features | Medium | Low | explicit out-of-scope above; separate PRs |

## 9. Testing Strategy

- Gate: `npm run build` + `npm run lint` + `npm run test:unit`
- Manual `npm run dev` smoke across every screen and at narrow + wide viewports
- Verify the compiled stylesheet still contains every class the templates depend on

## 10. Estimate & Dependencies

| Task | h |
|------|---|
| SPEC + branch setup | 1.0 |
| Design the target file map + class audit (grep every used class) | 2.0 |
| Create abstracts (variables, mixins merged+deduped, functions) | 3.0 |
| Create base (reset, typography, container, grid, elements) | 3.0 |
| Create components (navbar, footer, modal, panel, loading) | 3.0 |
| Create layout, pages, utilities, vendors | 1.5 |
| Rewrite `main.scss` import order + point existing imports at new paths | 1.0 |
| gate (build/lint/test) + manual/mobile smoke | 1.0 |
| Docs (spec status, CHANGELOG proposal) | 0.5 |
| **Total** | **16.0** |

**Dependencies:** EST-M05 composables merged to staging ✅ (this runs on top of it). Next: EST-L03/L04/L05 lazy-loading as separate PRs, then the v1.0.2 release.

---

## Approval

- **Jör Approved:** (pending)
- **Status:** DRAFT — await PR review on GitHub
