# SPEC-P4-05: Complete `<script setup>` Conversion

| Field | Value |
|-------|-------|
| **Status** | DRAFT (awaiting PR review) |
| **Topic** | Convert the last five `defineComponent` components to `<script setup lang="ts">`, completing Composition-API uniformity (single topic: finish the EST-M03 standardization) |
| **Estimate** | 3h |
| **Branch** | `feature/script-setup-complete` |
| **Proposal** | PROPOSAL-2026-018 |
| **ADS Reference** | Section 4.2, 13.2 |
| **EST Reference** | EST-M03 (follow-up) |

## 1. Context

EST-M03 standardized the four Options-API components. Five components remain on `defineComponent` using the internal `setup()` form (Composition API, but not the recommended `<script setup>` sugar): `CarouselFile.vue`, `ErrorFile.vue`, `SearchBar.vue`, `SellerCard.vue`, `SellerGrid.vue`. The codebase now has two Composition idioms (`<script setup>` in 4 files vs `setup()`+`defineComponent` in 5 files). This spec completes uniformity so every `.vue` component uses `<script setup lang="ts">` — the modern, concise form consistent with the rest of the project.

## 2. Topic & Scope

- **Topic:** finish `<script setup>` conversion across the remaining components.

**In scope:**
- `src/components/CarouselFile.vue` — uses runtime-object `defineProps` to preserve the custom `images` validator
- `src/components/ErrorFile.vue` — type-only `defineProps<{ message: string }>()`
- `src/components/search/SearchBar.vue` — `ref` + type-only props + emit
- `src/components/seller/SellerCard.vue` — type-only props + emit
- `src/components/seller/SellerGrid.vue` — type-only props (array) + emit
- Existing unit tests **kept as-is**: `error-file.spec.ts` and `carousel-file.spec.ts` introspect runtime `props` metadata; `<script setup>` still exposes the prop descriptors, so these tests continue to pass unchanged.

**Out of scope (forbidden in this branch):**
- Markup/SCSS/copy or behavior changes — visual output identical
- The 5 remaining `defineComponent` components in `src/components` are the only target; no other file types
- i18n, a11y, theme, UI/UX (EST-F04), any feature work
- CI pipeline changes

## 3. Design Patterns

| Pattern | Where applied | Why this pattern |
|---------|---------------|------------------|
| Composition API with `<script setup>` sugar | all five `.vue` files | Vue 3's recommended ergonomics; removes `defineComponent` + `setup()` return wiring in favor of top-level bindings and compiler macros |
| Object-form `defineProps` with validator | `CarouselFile.vue` only | the custom `images` prop validator cannot be expressed via type-only `defineProps`; runtime-object form preserves identical validation while still using `<script setup>` |

## 4. SOLID

- **S** — Single Responsibility: each component keeps exactly one job; only the script style changes.
- **D** — Dependency Inversion: components receive props/emits/refs explicitly via compiler macros and `ref()`, not via the `this` proxy or implicit instance.
- O / L / I : not newly exercised (leaf/container components, no new abstractions).

## 5. Architecture & Why

```
Layer:            Files:                                Owned by:
Components        src/components/**/*.vue               100% <script setup lang="ts">
Tests            tests/unit/error-file.spec.ts, carousel-file.spec.ts   unchanged (runtime prop metadata still exposed)
```

Why:
- One uniform composition style across the whole tree removes the last inconsistent read derivations and matches the pre-existing SearchBar/SellerCard/SellerGrid intent already on Composition API.
- `<script setup>` exposes runtime `props` metadata (including `validator`/`required`) via the compiled component, so the existing tests that inspect `.props` continue to work — no test rewrites needed.

## 6. Future Avoid

- [x] Mixing `defineComponent` + `setup()` with `<script setup>` in the component tree — banned; all components use `<script setup lang="ts">`
- [x] Re-introducing Options-API `this.$router` / `this.$emit` — banned
- [x] Behavior/markup/copy changes in a script-refactor PR — banned
- [x] Losing runtime prop validation when moving to `<script setup>` — banned; CarouselFile keeps its validator via object-form `defineProps`

## 7. Acceptance Criteria

- [ ] `grep "defineComponent" src/components/**/*.vue` → zero matches (9/9 components on `<script setup lang="ts">`)
- [ ] `npm run lint`, `npm run type-check`, `npm run test:unit` (23/23), `npm run build` all exit 0
- [ ] CarouselFile keeps its `images` prop validator (rejects missing `urls.small`)
- [ ] Existing tests unchanged where they still hold: `error-file.spec.ts`, `carousel-file.spec.ts` pass as-is
- [ ] Visual output identical
- [ ] Touched files: the 5 `.vue` components + `specs/SPEC-P4-05-*.md` + `CHANGELOG-PROPOSALS.md`

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Type-only `defineProps` drops the CarouselFile validator | Low | Medium | kept object-form `defineProps` with the validator; covered by `carousel-file.spec.ts` (still green) |
| `.props` runtime metadata not exposed under `<script setup>` breaks error/carousel tests | Low (disproved) | Medium | empirically verified both tests still pass; no test changes required |
| Long `validator` line trips prettier | Med (hit once) | Low | formatted to satisfy prettier; lint clean |

## 9. Testing Strategy

- `grep` `defineComponent` in `src/components` → 0
- Run the four CI gates locally: lint, type-check, test:unit (23/23), build — all green
- `carousel-file.spec.ts` + `error-file.spec.ts` explicitly run to confirm prop metadata/validator intact

## 10. Estimate & Dependencies

- **Estimate:** 3h (5 components ≈ 2h, validator/format handling 0.5h, spec+proposal+verify 0.5h)
- **Dependencies:** none — EST-M03 merged; CI is green and will gate the PR
- **Branch:** `feature/script-setup-complete`

---

## Approval

- **Jör Approved:** (pending)
- **Status:** DRAFT — await PR review on GitHub