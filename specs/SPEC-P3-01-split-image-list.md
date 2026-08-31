# SPEC-P3-01: Split ImageList.vue (SRP)

| Field | Value |
|-------|-------|
| **Status** | DRAFT (awaiting Jör approval via PR) |
| **Topic** | Refactor the `ImageList.vue` God Component into single-responsibility sub-components (EST-M04). Single topic: component decomposition — nothing else. |
| **Estimate** | 16h |
| **Branch** | `refactor/split-image-list` |
| **Proposal** | PROPOSAL-2026-006 |

## 1. Context

`src/views/ImageList.vue` is a 267-line God Component and the largest view in the app. It simultaneously owns: the search form, the seller-vs-image mapping, the 3D seller card markup + its ~85 lines of scoped SCSS, the vote handler, the winner-modal trigger, and the loading/error branching. This violates the **Single Responsibility Principle** and makes the view hard to read, test, and change independently (flagged across the ADS, ESTIMATIONS, and the ADR review). The Pinia (SPEC-P2-01) and Vite (SPEC-P2-02) migrations are done, so a clean component split can now be layered on top without fighting the build tooling.

## 2. Topic & Scope

- **Topic:** decompose `ImageList.vue` into thin, single-purpose components. Behavior must be identical.

**In scope:**
- Create `src/components/search/SearchBar.vue` — the search form (label + input + submit), emits `search(term)`
- Create `src/components/seller/SellerCard.vue` — one 3D seller card: title, image, vote/clickable state; owns the card's scoped SCSS (moved from ImageList)
- Create `src/components/seller/SellerGrid.vue` — renders the responsive column grid of `SellerCard`s from a `sellers` prop
- Slim down `src/views/ImageList.vue` to orchestration only: store reads, mapping, handlers, state branching, WinnerModal
- Move the card's scoped styles out of `ImageList.vue` into `SellerCard.vue`

**Out of scope (forbidden in this branch):**
- Behavior/UX change (voting rules, points, winner logic, styling)
- Extracting composables (own PR: EST-M05)
- SCSS 7-1 architecture rework (own PR: EST-M06)
- Route/image lazy loading (own PRs: EST-L03/L04/L05)
- Changing store/service/config code
- Upgrading TS/ESLint (own PRs)

## 3. Design Patterns

| Pattern | Where applied | Why this pattern |
|---------|---------------|------------------|
| **Composite** | `SellerGrid` → many `SellerCard` | grid composes a uniform list of leaf cards; parent only passes data |
| **Template Method / Controller-View** | `ImageList.vue` orchestrates, sub-components render | the view stays the "controller", children are dumb presenters |
| **Props Down, Events Up** | `SellerCard` / `SearchBar` emit; `ImageList` handles | children never touch stores directly — they receive props and emit intents |
| **Facade** | sub-components wrap presentational markup | each child isolates its template/SCCS; the store stays behind the view |

## 4. SOLID

- **S** — Single Responsibility: `SearchBar` (search UI), `SellerCard` (one card + its styles), `SellerGrid` (list layout), `ImageList` (orchestration). Each does exactly one job.
- **O** — Open/Closed: adding a new card treatment edits `SellerCard.vue` only; adding a grid layout edit `SellerGrid.vue` only; no consumer changes needed.
- **L** — Liskov: n/a — no subtype hierarchy.
- **I** — Interface Segregation: each child exposes small, focused prop/event interfaces (`seller`, `clickable`; `search`, `vote`); no child depends on the whole app/store state.
- **D** — Dependency Inversion: children depend on a `Seller` DTO (props), not on the store; `ImageList` is the only place importing Pinia stores for this concern.

## 5. Architecture & Why

```
Before:                            After:
ImageList.vue (267 lines)          ImageList.vue (orchestration only)
  - search form                      L-> SearchBar.vue   (form, emits search)
  - seller mapping                   L-> SellerGrid.vue  (grid layout)
  - card markup + 85 lines scss          L-> SellerCard.vue (1 card + scss)
  - vote handler
  - winner modal                     (LoadingFile/ErrorFile/WinnerModal stay as-is)
```

Why this shape:
- **Single responsibility** — each concern is isolated and independently readable/testable.
- **Reuse** — `SellerCard` can show anywhere; `SearchBar` is standalone.
- **Small diff of behavior** — only markup moves; store logic stays in the view, so the 8 Vitest tests + build gate still prove correctness.
- Consistency with the Pinia/Vite pattern: one refactor per PR, small reviewable surface.

## 6. Future Avoid

- [ ] God Components >100 lines in `src/views` — banned; decompose via sub-components
- [ ] Child components importing Pinia stores directly — banned in this repr; children stay presentational (prop/emit)
- [ ] Duplicating card SCSS in more than one file — banned; card styles live only in `SellerCard.vue`
- [ ] Mixing EST-M05 (composables) or EST-M06 (SCSS 7-1) into this branch — banned
- [ ] Changing voting rules/points/winner logic during a pure split — banned

## 7. Acceptance Criteria

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm run test:unit` exits 0 — 8/8 (unchanged behavior)
- [ ] `ImageList.vue` < 120 lines and contains no card search-input markup / no card 3D SCSS
- [ ] `SearchBar.vue`, `SellerCard.vue`, `SellerGrid.vue` each < 100 lines, each with a single purpose
- [ ] Card SCSS appears in `SellerCard.vue` only
- [ ] Behavior identical: search filters images, vote +3, winner modal at 20 — manual smoke on `npm run dev`
- [ ] No store imports inside child components

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Card styles break when moved | Medium | High | move the exact scoped `<style>` block verbatim into SellerCard; visual smoke check |
| Prop/emit wiring mistake | Medium | Medium | children are dumb presenters; build + tests + manual smoke gate |
| Mapping logic accidentally changed | Low | Medium | keep `sellerWithImages` computed in the view unchanged |
| Scope creep into composables/SCSS | Medium | Low | explicit out-of-scope in spec; separate PRs |

## 9. Testing Strategy

- `npm run build` + `npm run lint` + `npm run test:unit` as the gate
- Manual `npm run dev` smoke: search, vote (+3), winner modal, invoice continue
- Visual check that the 3D card renders identically after the SCSS move

## 10. Estimate & Dependencies

| Task | h |
|------|---|
| SPEC + branch setup | 1.0 |
| Extract SearchBar.vue | 2.0 |
| Extract SellerCard.vue + move SCSS | 4.0 |
| Extract SellerGrid.vue | 2.0 |
| Rewire ImageList.vue orchestration | 3.0 |
| gate (build/lint/test) + manual smoke | 2.0 |
| Docs (SPEC status, CHANGELOG proposal) | 1.0 |
| Buffer | 1.0 |
| **Total** | **16.0** |

**Dependencies:** SPEC-P2-02 Vite migration merged to staging ✅ (this runs on top of it). Next: EST-M05 composables and EST-M06 SCSS 7-1 as separate PRs.

---

## Approval

- **Jör Approved:** (pending)
- **Status:** DRAFT — await PR review on GitHub
