# SPEC-P0-02: Fix Heading Hierarchy Across Views (EST-L09)

| Field | Value |
|-------|-------|
| **Status** | DRAFT (awaiting Jör approval via PR) |
| **Topic** | Give every view exactly one page-level `<h1>` and order the rest of the headings `h1 → h2 → h3` with no skips (EST-L09). |
| **Estimate** | 0.5h (EST-L09: 0.3h, docs: 0.2h) |
| **Branch** | `fix/heading-hierarchy` |
| **ADS Reference** | Section 2.4.6 (Heading hierarchy jumps h3 → h5 → h4 across views) |
| **Proposal** | PROPOSAL-2026-011 |

## 1. Context

Screen readers, search engines and keyboard navigation all rely on headings to understand a page's outline. Right now our pages have the opposite of a proper outline:

- No view has a page-level `<h1>` — the single most important heading of a page. The landing page starts at `<h3>`, and the image list and invoice pages start at `<h5>`.
- Loading and error states use `<h4>` headings even though they are status messages, not section titles — and they render *instead of* the page content, so they leave the page with no `<h1>` at all.
- Seller card names are `<h4>`, sitting under a page that peaks at `<h5>` — a level skip.

The ADS flags this as Section 2.4.6, Heading hierarchy jumps across views (Priority LOW). This step fixes the outline semantics only: each view gets one `<h1>`, headings are ordered with no skips, and status messages stop pretending to be headings. The app must keep looking exactly as it does now — this is a semantic change, not a visual one.

## 2. Topic & Scope

- **Topic:** correct the heading-outline of every view so it reads h1 → h2 → h3 with no skips and no heading-less pages.

**In scope:**
- `src/views/LandingPage.vue` — page title `<h3>` → `<h1 class="h3">` (same visual size)
- `src/views/ImageList.vue` — page title `<h5>` → `<h1 class="h5">` (same visual size)
- `src/views/InvoiceForm.vue` — page title `<h5>` → `<h1 class="h5">` (same visual size)
- `src/components/seller/SellerCard.vue` — card title `<h4>` → `<h2>` (now under the ImageList `<h1>`; class already sets its own font-size)
- `src/components/LoadingFile.vue` — status message `<h4>` → `<p class="h4">` (not a heading)
- `src/components/ErrorFile.vue` — status message `<h4>` → `<p class="h4">` (not a heading)
- `src/components/WinnerModal.vue` — keep `<h2>` as-is (correct level; it is a dialog on top of the ImageList `<h1>`)
- `specs/SPEC-P0-02-heading-hierarchy.md` and `CHANGELOG-PROPOSALS.md`

**Out of scope (forbidden in this branch):**
- Any visual/appearance change
- Changing text content, wording or translations
- ARIA labels, focus management, skip links (EST-F02, own PR)
- Color contrast, focus indicators or any other accessibility item (EST-F02, own PR)
- Any `.js`/`.ts` logic changes

## 3. Design Patterns

| Pattern | Where applied | Why this pattern |
|---------|---------------|------------------|
| Headings + style classes (element semantics with `.hX` size utilities) | all changed `.vue` templates | decouples the semantic level (h1/h2) from the visual size (.h3/.h5), so the outline is fixed without resizing anything |
| Template pattern (shared outline shape) | each view | every view follows the same shape: one `<h1>` page title, then `<h2>` sub-blocks, then `<h3>` — easy to keep consistent |

## 4. SOLID

- **S** — Single Responsibility: each view owns exactly one page-level `<h1>`; each component (SellerCard, LoadingFile, ErrorFile) owns one clear heading semantic.
- **O** — Open/Closed: fixing semantics in place means future views copy the same outline; no component interface changes.
- **L** — Liskov: n/a — no subtype hierarchies involved.
- **I** — Interface Segregation: n/a — no interfaces added or changed.
- **D** — Dependency Inversion: n/a — no dependency changes.

## 5. Architecture & Why

```
View (route)            Page heading    Nested headings
LandingPage  (/)        h1 "Descubre…"   (none)
ImageList    (/ImageList) h1 "Lista…"    h2 (winner dialog, seller card titles)
InvoiceForm  (/InvoiceForm) h1 "Crear…"  (none)
Shared state components (replace page content while loading/error): use <p>, not headings
```

Why this shape: a screen reader builds its navigation from the first `<h1>` down. One `<h1>` per view gives every page a clear entry point; `h2` blocks (cards, dialogs) sit directly under it without skipping levels; transient status messages don't masquerade as structure. The `.hX` utility classes keep the visual size untouched while the element name carries the meaning.

## 6. Future Avoid

- [ ] Pages with no `<h1>` — banned; every view must open with a single `<h1>`
- [ ] Heading level skips (h1 → h3, h3 → h5) — banned
- [ ] Status/loading/error messages rendered as `<h2>` or higher headings — banned
- [ ] Using a heading only for "big text" without semantic meaning — banned
- [ ] Mixing other a11y changes into a heading-hierarchy branch — banned

## 7. Acceptance Criteria

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm run test:unit` exits 0 (unchanged behavior — tests unaffected)
- [ ] Every view renders exactly one `<h1>`
- [ ] No view renders heading levels that skip (outline is h1 → h2 → h3 with no gaps)
- [ ] LoadingFile and ErrorFile no longer emit heading tags
- [ ] Manual `npm run dev` smoke: pages look identical to before (no font-size or spacing changes)

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Changing a tag changes font size visually | Medium | Low | use `.hX` size utility classes so element semantics change without visual change |
| A test asserts on a specific heading tag | Low | Low | checked `tests/unit/*.spec.ts` — assertions target text/classes, not heading tags |
| Scope creep into other a11y work | Medium | Low | explicit out-of-scope list; separate EST-F02 PR |

## 9. Testing Strategy

- Gate: `npm run build` + `npm run lint` + `npm run test:unit`
- Manual: run the dev server, inspect the rendered outline (browser accessibility tree / DOM) for each route: LandingPage, ImageList, InvoiceForm, plus the loading and error states
- Confirm visual appearance is identical on all routes

## 10. Estimate & Dependencies

| Task | h |
|------|---|
| EST-L09 heading tag fixes | 0.3 |
| Docs (spec + CHANGELOG) | 0.2 |
| **Total** | **0.5** |

**Dependencies:** SPEC-P3-05 SEO merged to staging ✅. Next after this: EST-L10 TypeScript 5.x upgrade and EST-L11 ESLint/Prettier upgrade as separate PRs, then the **v1.0.2** release.

---

## Approval

- **Jör Approved:** (pending)
- **Status:** DRAFT — await PR review on GitHub