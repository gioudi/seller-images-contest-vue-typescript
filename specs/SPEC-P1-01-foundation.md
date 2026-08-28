# SPEC-P1-01: W1 Foundation & Type-Safety

| Field | Value |
|-------|-------|
| **Status** | DRAFT (awaiting Jör approval via PR on `refactor/w1-foundation`) |
| **Topic** | Foundation & type-safety (single topic: making the codebase safe to refactor) |
| **Estimate** | 16.1h |
| **Branch** | `refactor/w1-foundation` |
| **Proposal** | PROPOSAL-2026-002 |

## 1. Context

The project builds and lint-cleans after Phase 0, but the store layer is not type-safe: every Vuex action uses `{ commit }: any`, `RootState` is incomplete (missing `images`/`invoices`), the unit test fails importing a component that does not exist, `LandingPage` reads the wrong loading getter, and image-to-seller mapping is fragile and produces blank images. The W2 migrations (Vite + Pinia) will rewrite much of this code — if it is not type-safe and covered by tests first, those migrations cannot be verified. This wave exists to give refactoring safety before anything is migrated.

## 2. Topic & Scope

- **Topic:** foundation and type-safety across store, config, tests, and two buggy views — nothing else.

**In scope:**
- EST-H01 unit tests for real components (NavbarFile, FooterFile, LoadingFile, ErrorFile, CarouselFile)
- EST-H04 complete `RootState` (add `images`, `invoices`)
- EST-H03 type all Vuex action contexts, eliminate `any`
- EST-H05 fix type mismatch in `handleAddSeller`
- EST-H06 fix `LandingPage` wrong loading getter
- EST-H07 deterministic image-to-seller mapping
- EST-H08 correct carousel type declaration
- EST-M08 `src/config/index.ts` constants module + remove magic numbers

**Out of scope (forbidden in this branch):**
- CI/CD pipeline (deferred to W2 — would be rewritten after Vite changes build commands)
- Pinia / Vite migrations (W2)
- Any feature work (i18n, a11y, theme)
- Retrofitting SPEC-P0-01 / F01 / F02 / F03 to the template (own topic)
- Refactoring services or views beyond the exact items above

## 3. Design Patterns

| Pattern | Where applied | Why this pattern |
|---------|---------------|------------------|
| Module pattern | `src/store/modules/*` (each slice: state, actions, mutations, getters) | standard Vuex structure; keeps each slice self-contained and swappable for W2 Pinia |
| Repository | `src/services/*Service.ts` | all external HTTP/API access isolated from the store and views; W2 Pinia migration then only touches store layer |
| DTO / typed domain objects | `src/store/types/`, `src/services/*.ts` | typed contracts between layers; replaces anonymous `any` payloads |
| Dependency injection (via framework) | Vuex `ActionContext`, Vue `props/emit` | dependencies flow in from the framework, no singleton global state |

## 4. SOLID

- **S** — Single Responsibility: `src/config/index.ts` owns constants only and imports nothing; each store action in `src/store/modules/*/actions.ts` does exactly one job (fetch → commit | transform → commit).
- **O** — Open/Closed: constants live in config so future threshold/vote changes are config edits, not edits to existing mutations/views.
- **L** — Liskov: n/a at this stage (no polymorphic hierarchies introduced).
- **I** — Interface Segregation: type definitions (`IMagesState`, `ISellersState`, `IInvoicesState`, contexts) are small and per-module; no shared mega-interface.
- **D** — Dependency Inversion: store actions depend on abstract services (`apiService`, `apiImagesService`), never on concrete HTTP internals; components depend on Vuex interfaces (`useStore`, typed getters), never on service implementations.

## 5. Architecture & Why

```
Layer:            Files:                                    Owned by:
Config            src/config/index.ts                       constants & env only, no imports
Services          src/services/apiService.ts                the only code touching HTTP (Alegra)
                  src/services/apiImagesService.ts          the only code touching Unsplash
Store (Vuex)      src/store/index.ts, src/store/types        typed state machine; actions thin
                  src/store/modules/{sellers,images,invoices}
Views             src/views/*.vue                            presentation only, map via getters
Components        src/components/*.vue                       props in / events out
Tests             tests/unit/*.spec.ts                       guard tests for migrations
Types             src/vue-carousel.d.ts                      ambient module declarations
```

Why this shape:
- Store actions open back to HTTP (calling `apiService` directly) instead of going through a dispatcher: with only two services this layering keeps the data flow obvious and short. The Repository pattern still holds — store never contains HTTP code.
- `RootState` gets a flat, complete shape (all 3 modules) so W2's Pinia store map is a near-mechanical rename.
- Constants are centralized now because W2 moves to Vite; config imported once, pointed at env providers, survives the migration untouched.
- Carousel type is *ambient declared* (`vue-carousel.d.ts`) rather than patched per-component because the real npm package `vue3-carousel` lacks complete types; one declaration file covers every import site.

## 6. Future Avoid

- [x] `any` in Vuex action signatures — banned; must use `ActionContext<T, RootState>`
- [x] Magic numbers in source — banned; must live in `src/config/index.ts`
- [x] Fragile `index === seller.id` identity matching — banned; deterministic position-based mapping with null-safe fallback only
- [x] Unrelated work on this branch — banned; out-of-scope list in §2
- [x] Re-building navigation/components already present — use `NavbarFile`/`FooterFile`/etc.
- [x] Silent re-introduction of `HelloWorld` or dead demo files — banned
- [ ] CI to be added only AFTER the W2 Vite migration (avoids writing the pipeline twice)

## 7. Acceptance Criteria

- [ ] `npm run test:unit` exits 0 (currently fails: test imports non-existent `@/components/HelloWorld.vue`)
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0 with zero errors and zero warnings in every touched file
- [ ] Zero occurrences of `: any` in `src/store/modules/**/actions.ts` (grep `commit: any|state any` empty)
- [ ] `RootState` includes `sellers`, `images`, `invoices`
- [ ] `LandingPage.vue` reads `images/getLoading`, not `sellers`
- [ ] No blank images: every rendered image card receives a URL (deterministic mapping + fallback)
- [ ] Carousel import resolves without type/lint errors (`vue3-carousel` declared)
- [ ] Magic numbers gone: grep for `20`, `3` threshold/vote literals in business logic empty; values in `src/config/index.ts`
- [ ] Each commit message references its EST-id

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Typing actions breaks build behavior | Medium | Medium | Typed contexts are compile-time only; runtime shape unchanged |
| `handleAddSeller` is dead code | Medium | Low | Spec allows removing dead code; will confirm at implementation and note in PR |
| `vue3-carousel` types diverge from actual API | Medium | Low | Ambient declaration types only what we consume; carousel visual behavior manual-verified |
| Image mapping change alters image order | Low | Low | Deterministic modulo keeps order stable; fallback guarantees non-empty |

## 9. Testing Strategy

- Unit tests (EST-H01): `NavbarFile`, `FooterFile`, `LoadingFile`, `ErrorFile`, `CarouselFile` render props, emit events (mounted via `@vue/test-utils`)
- `npm run build` + `npm run lint` + `npm run test:unit` as the gate
- Manual check: `/` route renders sellers with images (no blanks); `LandingPage` spinner reflects `images` loading

## 10. Estimate & Dependencies

| EST-id | Item | h |
|--------|------|---|
| EST-H01 | Replace `HelloWorld` test with real component tests | 3.0 |
| EST-H04 | Complete `RootState` | 2.0 |
| EST-H03 | Type all Vuex action contexts | 5.0 |
| EST-H05 | Fix `handleAddSeller` type mismatch | 0.5 |
| EST-H06 | Fix `LandingPage` loading getter | 0.3 |
| EST-H07 | Deterministic image→seller mapping | 3.0 |
| EST-H08 | Carousel type declaration | 0.3 |
| EST-M08 | `src/config/index.ts` constants | 2.0 |
| **Total** | | **16.1** |

**Dependencies:** Phase 0 merged (it set `.gitattributes` LF + env pattern this branch builds on). No other branch.

---

## Approval

- **Jör Approved:** (pending)
- **Status:** DRAFT — await PR review on GitHub