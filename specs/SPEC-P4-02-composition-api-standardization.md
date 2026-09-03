# SPEC-P4-02: Standardize Composition API (`<script setup>`)

| Field | Value |
|-------|-------|
| **Status** | DRAFT (awaiting PR review) |
| **Topic** | Rewrite the last four Options-API components to `<script setup lang="ts">` (single topic: uniform composition API usage) |
| **Estimate** | 3h |
| **Branch** | `feature/composition-api-standardization` |
| **Proposal** | PROPOSAL-2026-015 |
| **ADS Reference** | Section 4.2, 13.2 |
| **EST Reference** | EST-M03 |

## 1. Context

Most components already use the Composition API. Four leaf components remain on the Options API with `defineComponent` + `methods` / `props` objects, creating two competing style conventions in `src/components`:

- `src/components/NavbarFile.vue` — `methods.goHome()` (uses `this.$router`)
- `src/components/WinnerModal.vue` — `methods.proceed()` (uses `this.$emit`)
- `src/components/LoadingFile.vue` — bare `defineComponent` (state-less)
- `src/components/FooterFile.vue` — bare `defineComponent` (state-less)

EST-M03 standardizes these to `<script setup lang="ts">`, the modern, recommended SFC form. The project already runs Vue 3 + Vite + eslint-plugin-vue flat, which fully support it.

## 2. Topic & Scope

- **Topic:** convert the last Options-API files to `<script setup lang="ts">`.

**In scope:**
- `src/components/NavbarFile.vue`
- `src/components/WinnerModal.vue`
- `src/components/LoadingFile.vue`
- `src/components/FooterFile.vue`
- Existing unit tests for these components (`tests/unit/{navbar,winnermodal,loading,footer}-file.spec.ts`) as needed so `<script setup>` keeps them green.

**Out of scope (forbidden in this branch):**
- Refactoring markup/SCSS, changing labels, copying or behavior — visual output identical
- Migrating `SearchBar`/`SellerCard`/`SellerGrid` (SRP components) to `<script setup>` — they already use the Composition `setup()` form and a different convention; not part of EST-M03's listed files
- Adding a name to script-setup components (auto derives from filename)
- Any feature work, i18n, a11y, theme, CI

## 3. Design Patterns

| Pattern | Where applied | Why this pattern |
|---------|---------------|------------------|
| Composition API with setup sugar | all four `.vue` `<script setup>` blocks | `<script setup>` is Vue 3's recommended ergonomic for Composition API; removes boilerplate `defineComponent` + `setup()` return wiring in favor of top-level bindings and compiler macros |

## 4. SOLID

- **S** — Single Responsibility: each component keeps exactly one job; only the script style changes.
- **D** — Dependency Inversion: `useRouter()` and `defineEmits`/`defineProps` are injected via Composition helpers rather than the Options-API `this` proxy — dependencies come in explicitly.
- O / L / I : not newly exercised (leaf components, no new abstractions/subtypes).

## 5. Architecture & Why

```
Layer:            Files:                               Owned by:
Components        src/components/*.vue                 all Composition API (<script setup>)
Tests            tests/unit/*-file.spec.ts             align with script-setup component shape
```

Why this shape:
- Uniform script style across the component tree removes the Options-API vs Composition-API split.
- `<script setup>` accesses props (`defineProps`) and emits (`defineEmits`) as compile-time macros, so `implicit-any`-prone `this` lookups are gone.
- For the two state-less components (`LoadingFile`, `FooterFile`) the script block becomes empty `<script setup lang="ts">`, which is valid Vue 3 SFC syntax.

## 6. Future Avoid

- [x] Mixing Options API and Composition API in new components — banned
- [x] Relying on `this.$router` / `this.$emit` in components — banned; use `useRouter()` / `defineEmits`
- [x] Two competing Composition idioms (setup-function vs `<script setup>`) in the same subtree — this spec resolves the remaining Options files to `<script setup>`; the SRP files keep `setup()` by prior contract and migrate under their own topic if ever needed
- [x] Markup/SCSS/copy changes smuggled into a script-refactor PR

## 7. Acceptance Criteria

- [ ] `npm run lint` exits 0 — zero Options-API warnings in the four files
- [ ] `npm run test:unit` passes (all existing tests, incl. navbar $router mock)
- [ ] `npm run build` exits 0
- [ ] `grep "defineComponent" src/components/*.vue` matches ZERO lines
- [ ] Visual output identical: rendered DOM and classes unchanged
- [ ] Touched files: the four `.vue` components + `tests/unit/{navbar,loading,footer,winnermodal}-file.spec.ts` (as needed) + `specs/SPEC-P4-02-*.md` + `CHANGELOG-PROPOSALS.md`

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Navbar `$router` test breaks under `<script setup>` | Medium | Medium | `@vue/test-utils` `global.mocks.$router` still works for a `useRouter()`-driven component; confirm the `push` spy in `navbar-file.spec.ts` still passes; adjust only if the mock no longer applies |
| `<script setup>` auto-name differs from prior `name:` string | Low | Low | no external code references component names by string; dev-only concern |
| Empty `<script setup>` block fires no lint rule | Low | Low | eslint-plugin-vue flat supports it; verified empirically by lint |

## 9. Testing Strategy

- `npm run lint`, `npm run test:unit`, `npm run build`
- `grep -c "defineComponent" src/components/*.vue` → assert 0
- Manual smoke via `npm run dev`: nav "Volver" navigates home, WinnerModal "Continuar" emits, loading/footer render

## 10. Estimate & Dependencies

- **Estimate:** 3h (per component 0.5h ≈ 2h, test sync 0.5h, lint/test/build + docs 0.5h)
- **Dependencies:** none — merged `staging` already on Vue 3 + Vite + flat ESLint
- **Branch:** `feature/composition-api-standardization`

---

## Approval

- **Jör Approved:** (pending)
- **Status:** DRAFT — await PR review on GitHub