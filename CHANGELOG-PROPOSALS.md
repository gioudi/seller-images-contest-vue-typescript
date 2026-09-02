# Change Proposals Log

Log of all change proposals submitted by Broker for Owner approval, per Rule 4 of the governance contract.

## Proposal Format

```
## PROPOSAL-{YYYY}-{NNN}

| Field | Value |
|-------|-------|
| **Date** | YYYY-MM-DD |
| **Branch** | `type/ticket-id-description` |
| **Spec** | SPEC-XXX-YY |
| **Estimate** | Xh / Xd |
| **Submitted By** | Broker |

### Description
{Short description}

### Status
[ PENDING | APPROVED | REJECTED | IMPLEMENTED | CLOSED ]

### Approval
- **Jör Approved:** {date, method: written/verbal}
- **Notes:** {any conditions}
```

---

## Proposal Log

### PROPOSAL-2026-001: Phase 0 Emergency Fixes

| Field | Value |
|-------|-------|
| **Date** | 2026-08-28 |
| **Branch** | `fix/phase0-emergency-fixes` |
| **Spec** | SPEC-P0-01 |
| **Estimate** | 3.2h |
| **Submitted By** | Broker |

### Description
Apply the Phase 0 emergency stabilization fixes from ESTIMATIONS-AND-RESOLUTIONS.md:
- EST-C01: Remove hardcoded Unsplash API key, move to env variable
- EST-C02: Fix broken Alegra auth header (trailing brace), move key to env
- EST-C03: Fix ErrorFile.vue syntax error (stray `s`)
- EST-C04: Remove artificial setTimeout delays (App.vue, ImageList.vue)
- EST-C05: Fix double JSON parse in invoice creation
- EST-H02: Remove console.log from production code
- EST-M10: Create .env.example

### Status
APPROVED - IMPLEMENTED (merged to staging 2026-08-28, awaiting main release + tag)

### Approval
- **Jör Approved:** 2026-08-28, written ("Start with phase 0")
- **Notes:** New Unsplash API key to be rotated by Jör and placed in local `.env`

---

## PROPOSAL-2026-002

| Field | Value |
|-------|-------|
| **Date** | 2026-08-28 |
| **Branch** | `refactor/w1-foundation` (proposed) |
| **Spec** | SPEC-P1-01 |
| **Estimate** | 16.1h |
| **Submitted By** | Broker |

### Description
Foundation & type-safety wave (W1):
- EST-H01 replace broken `HelloWorld` test with real component tests (3h)
- EST-H04 complete `RootState` interface with `images` + `invoices` (2h)
- EST-H03 type all Vuex action contexts, remove `any` (5h)
- EST-H05 fix type mismatch in `handleAddSeller` (0.5h)
- EST-H06 fix `LandingPage` using wrong loading getter (0.3h)
- EST-H07 fix fragile image-to-seller mapping (3h)
- EST-H08 fix carousel type declaration (0.3h)
- EST-M08 create `src/config/index.ts` constants module (2h)

### Status
IMPLEMENTED (merged to staging via PR #21 on 2026-08-28; services follow-up separate PR)

### Approval
- **Jör Approved:** 2026-08-28, via PR review + merge (#21)
- **Notes:** Reworked on SPEC-TEMPLATE (10 sections) before implementation

---

## PROPOSAL-2026-003

| Field | Value |
|-------|-------|
| **Date** | 2026-08-28 |
| **Branch** | `refactor/type-service-errors` |
| **Spec** | SPEC-P1-02 |
| **Estimate** | 0.5h |
| **Submitted By** | Broker |

### Description
Type the service-layer error handlers, the last three lint `any` warnings:
- `src/services/apiService.ts`: `getSellers` + `createInvoice` catches
- `src/services/apiImagesService.ts`: `getImagesList` catch
`any` → `unknown` + `instanceof` narrowing. Behavior unchanged.

### Status
APPROVED - IMPLEMENTED (merged to staging via PR #23 on 2026-08-28; included in #25 staging merge)

### Approval
- **Jör Approved:** 2026-08-28, via PR review + merge (#23)
- **Notes:** No behavior change; last three `no-explicit-any` warnings removed. Verified via `npm run lint` clean.

---

## PROPOSAL-2026-004

| Field | Value |
|-------|-------|
| **Date** | 2026-08-28 |
| **Branch** | `refactor/pinia-migration` |
| **Spec** | SPEC-P2-01 |
| **Estimate** | 14h |
| **Submitted By** | Broker |

### Description
Migrate the state layer from Vuex to Pinia (ADR-001):
- Add `pinia`, remove `vuex`
- Create `src/stores/{sellers,images,invoices}Store.ts`
- Replace `src/store/index.ts` + `RootState` with a Pinia instance + per-store types
- Rewire all `useStore()`/`getters`/`dispatch`/`commit` in views/components/App to Pinia composables
- Only the store. Vite migration is the next, separate PR (allows one-platform-change-per-PR under RULE 3A)

### Status
APPROVED - IMPLEMENTED (merged to staging via PR #25 on 2026-08-28, awaiting main release + v1.0.0 tag)

### Approval
- **Jör Approved:** 2026-08-28, via PR review + merge (#25)
- **Notes:** Zero `vuex`/`useStore`/`dispatch`/`commit` references remain in `src`. Verified via `npm run test:unit` (8/8), `npm run lint` clean, `npm run build` success.

---

## PROPOSAL-2026-005: Vite Migration

| Field | Value |
|-------|-------|
| **Date** | 2026-08-31 |
| **Branch** | `refactor/vite-migration` |
| **Spec** | SPEC-P2-02 |
| **Estimate** | 16h |
| **Submitted By** | Broker |

### Description
Migrate the build tool from Vue CLI (webpack) to Vite (ADR-002):
- Add `vite` + `@vitejs/plugin-vue`, remove all `@vue/cli-*` / webpack / babel / jest deps
- Add `vite.config.ts` (@ alias), `vitest.config.ts`, root `index.html`, `src/env.d.ts`
- Migrate env vars `VUE_APP_*` → `VITE_*`; `process.env` → `import.meta.env`
- Port the 8 Jest unit tests to Vitest (`@vue/test-utils` + jsdom)
- Remove `vue.config.js`, `babel.config.js`, `jest.config.js`
- Rename `.eslintrc.js` → `.eslintrc.cjs` for ES module project

### Status
APPROVED - IMPLEMENTED (merged to staging via PR #27 on 2026-08-31, awaiting main release + tag)

### Approval
- **Jör Approved:** 2026-08-31, via PR review + merge (#27)

---

## PROPOSAL-2026-006: Split ImageList.vue (SRP)

| Field | Value |
|-------|-------|
| **Date** | 2026-08-31 |
| **Branch** | `refactor/split-image-list` |
| **Spec** | SPEC-P3-01 |
| **Estimate** | 16h |
| **Submitted By** | Broker |

### Description
Decompose the `ImageList.vue` God Component into single-responsibility sub-components (EST-M04), single topic — component decomposition only:
- `src/components/search/SearchBar.vue` — the search form, emits `search(term)`
- `src/components/seller/SellerCard.vue` — one 3D seller card + its scoped SCSS (moved out of the view); emits `vote(seller)`
- `src/components/seller/SellerGrid.vue` — responsive column grid of `SellerCard`s; re-emits `vote(seller)`
- Slim `ImageList.vue` down to orchestration only (store reads, mapping, handlers, state branching, WinnerModal)
- Behavior identical: search, vote +3, winner modal. No composables (EST-M05) or SCSS 7-1 (EST-M06) in this PR.

### Status
APPROVED - IMPLEMENTED (merged to staging via PR #28 on 2026-08-31, awaiting main release + tag)

### Approval
- **Jör Approved:** 2026-08-31, via PR review + merge (#28)

---

## PROPOSAL-2026-007: Extract Composables

| Field | Value |
|-------|-------|
| **Date** | 2026-08-31 |
| **Branch** | `refactor/extract-composables` |
| **Spec** | SPEC-P3-02 |
| **Estimate** | 16h |
| **Submitted By** | Broker |

### Description
Move business logic + Pinia store usage out of components/views and into reusable composables (EST-M05), single topic — composable extraction only:
- Add `src/composables/`: `useLoading`, `useError`, `useImages`, `useSellers`, `useInvoices`, `useContest`
- Add the missing `getLoading`/`getError` getters to the invoices store so all stores share the same shape
- Rewire `App.vue`, `ImageList.vue`, `InvoiceForm.vue`, `LandingPage.vue` to consume composables — no direct store calls in `.vue` files
- Add unit tests for each composable
- Behavior identical: search, vote +3, winner modal, invoice submit. Note: an invalid invoice form now keeps `loading` untouched (previously a brief flicker) — visible behavior unchanged.
- Also encodes GOVERNANCE RULE 1B (plain-language specs) in the contract and refreshes the README per Jör's direction, grouped into this branch.

### Status
APPROVED - IMPLEMENTED (merged to staging via PR #29 on 2026-08-31, awaiting main release + tag)

### Approval
- **Jör Approved:** 2026-08-31, via PR review + merge (#29)

---

## PROPOSAL-2026-008: SCSS 7-1 Architecture

| Field | Value |
|-------|-------|
| **Date** | 2026-08-31 |
| **Branch** | `feature/scss-7-1-architecture` |
| **Spec** | SPEC-P3-03 |
| **Estimate** | 16h |
| **Submitted By** | Broker |

### Description
Reorganize the global styles into the classic SCSS 7-1 architecture (EST-M06), single topic — styles organization only:
- Create `src/styles/` subfolders: `abstracts/`, `base/`, `components/`, `layout/`, `pages/`, `utilities/`, `vendors/`
- Split the monolith `index.scss` + `_styles.scss` + `_mixin.scss` + `_variables.scss` into single-purpose files per folder
- Remove dependency on bare element selectors for layout (`nav`, `footer`, `input`, `button`, `ul`) where templates actually use classes — restyle to the real root classes (`.alegra-navbar`, `.footer`, etc.) so components keep their look without global element overrides
- Move the `.app` shell height rule out of App.vue's scoped block into `layout/_app.scss` (mobile-first)
- Deduplicate: remove the double `.alegra-color-white`/`.alegra-bg-white` pair present in the old file
- Single entry `main.scss` imported by `main.ts`; update the two component `@import` paths and drop the empty/vestigial style block in `CarouselFile.vue`
- Behavior identical. CSS output slightly smaller (~35.74kB → 35.56kB) thanks to the dedup.

### Status
APPROVED - IMPLEMENTED (merged to staging via PR #30 on 2026-08-31, awaiting main release + tag)

### Approval
- **Jör Approved:** 2026-08-31, via PR review + merge (#30)

---

## PROPOSAL-2026-009: Lazy Loading & Payload Reduction

| Field | Value |
|-------|-------|
| **Date** | 2026-08-31 |
| **Branch** | `feature/lazy-loading` |
| **Spec** | SPEC-P3-04 |
| **Estimate** | 3.5h |
| **Submitted By** | Broker |

### Description
Reduce initial load time and wasted bandwidth — single topic: performance / load time (ADS 8.1/8.3):
- **EST-L03 Route lazy loading:** `src/routes/index.ts` uses dynamic imports, so each screen (Landing, ImageList, InvoiceForm, ErrorFile) compiles into its own chunk loaded on demand → main entry dropped from 189 kB to ~17 kB, with per-route chunks
- **EST-L04 Image lazy loading:** `SellerCard.vue` card `<img>` gets native `loading="lazy"` so below-the-fold card images are fetched as the user scrolls
- **EST-L05 Smaller image URLs:** `src/composables/useContest.ts` maps each card to `image.urls.small` instead of `urls.full` (2000+px originals), plus test update
- Behavior identical. Verified: build splits into per-route chunks, lint clean, 23/23 tests.

### Status
APPROVED - IMPLEMENTED (merged to staging via PR #31 on 2026-08-31)

### Approval
- **Jör Approved:** 2026-08-31, via PR review + merge (#31)

---

## PROPOSAL-2026-011: Fix Heading Hierarchy (EST-L09)

| Field | Value |
|-------|-------|
| **Date** | 2026-09-01 |
| **Branch** | `fix/heading-hierarchy` |
| **Spec** | SPEC-P0-02 |
| **Estimate** | 0.5h |
| **Submitted By** | Broker |

### Description
Fix the page outline so every view has exactly one `<h1>` and headings read h1 → h2 → h3 with no skips (ADS 2.4.6):
- **Page titles:** LandingPage `h3` → `h1`, ImageList `h5` → `h1`, InvoiceForm `h5` → `h1` — each keeps its current visual size via `.h3`/`.h5` utility classes
- **Card titles:** SellerCard `h4` → `h2` (now correctly nested under the ImageList `h1`)
- **Status messages:** LoadingFile and ErrorFile `h4` → `<p>` (they are status text, not headings, and previously left pages heading-less)
- WinnerModal stays `h2` (correct level for a dialog over the ImageList `h1`)
- Behavior and appearance identical. Verified: build green, lint clean, 23/23 tests.

### Status
APPROVED - IMPLEMENTED (merged to staging via PR #33 on 2026-09-01)

### Approval
- **Jör Approved:** 2026-09-01, via PR review + merge (#33)

---

## PROPOSAL-2026-012: Upgrade TypeScript to 5.x (EST-L10)

| Field | Value |
|-------|-------|
| **Date** | 2026-09-01 |
| **Branch** | `feature/upgrade-typescript` |
| **Spec** | SPEC-P3-06 |
| **Estimate** | 4h |
| **Submitted By** | Broker |

### Description
Refresh the TypeScript compiler from `~4.5.5` (Vue CLI era, four majors behind) to `^5.9.3` — the last old tool now that Vite, Pinia, SCSS 7-1 and lazy-loading are done (ADS Phase-3 Quality & DX checklist):
- `package.json` `typescript` devDependency `~4.5.5` → `^5.9.3`, lockfile regenerated; the only installed package change
- No source or config change: the app doesn't type-check at build (esbuild), lint is syntax-only (`@typescript-eslint` 5.62 without type-aware rules), `skipLibCheck` is on
- Empirically verified: lint green, 23/23 tests, build green; `tsc --noEmit` adds zero new errors (the same 4 pre-existing test/config type errors remain — a separate concern)
- Establishes the version baseline EST-L11 (ESLint + Prettier upgrade) needs for TS-5-compatible linting

### Status
APPROVED - IMPLEMENTED (merged to staging via PR #34 on 2026-09-01)

### Approval
- **Jör Approved:** 2026-09-01, via PR review + merge (#34)

---

## PROPOSAL-2026-013: Upgrade ESLint + Prettier (EST-L11)

| Field | Value |
|-------|-------|
| **Date** | 2026-09-01 |
| **Branch** | `feature/upgrade-linting` |
| **Spec** | SPEC-P3-07 |
| **Estimate** | 4h |
| **Submitted By** | Broker |

### Description
Rebuild the lint layer on the modern toolchain and turn on type-aware rules (ADS Phase-3 checklist):
- **Toolchain swap:** ESLint 7.32 → `^9.39.5` (flat config), `@typescript-eslint/*` 5.62 → `typescript-eslint` `^8.69.0`, `eslint-plugin-vue` 8 → `^10.10.0`, `vue-eslint-parser` → 10.4.1, Prettier 2 → `^3.9.6`, `eslint-config-prettier` → 10, `eslint-plugin-prettier` → latest flat build, added `globals`; removed all 2021-era legacy packages
- **Config:** `.eslintrc.cjs` → `eslint.config.js` (flat config, ESM); `.prettierrc.json` pins `trailingComma: "es5"` so Prettier 3's changed default doesn't reformat the repo; `lint` script now `eslint src tests` (ESLint 9 drops `--ext`)
- **Type-aware rules ON:** `@typescript-eslint/strict-type-checked` for `.ts`/`.tsx` (chosen per the spec's empirical gate — `recommendedTypeChecked` passed clean, `strictTypeChecked` surfaced only 3 small real issues, all fixed: a void-return arrow shorthand in `useSellers.ts`, an unguarded `Authorization` template literal in `apiService.ts` (`?? ""`), and a `globalThis`-cast for the `ResizeObserver` polyfill guard in `tests/unit/setup.ts`); `.vue` SFCs keep non-type-aware `vue3-recommended` + prettier
- **Real issues fixed (no suppressions, no `eslint-disable`):** typed API contracts (`getSellers(): Promise<Seller[]>`, `createInvoice(): Promise<InvoiceResponse>`), `getErrorMessage` reused in both services, `void router.push` for a floating promise, `vi.hoisted` mocks replacing unbound `vi.mocked(method)` passes, typed `globalThis.ResizeObserver`
- Verified: `npm run lint` clean, 23/23 tests, build green (128 modules)

### Status
APPROVED - IMPLEMENTED (merged to staging via PR #35 on 2026-09-01)

### Approval
- **Jör Approved:** 2026-09-01, via PR review + merge (#35)

---

## PROPOSAL-2026-014: Axios Interceptors & Timeout (EST-M07)

| Field | Value |
|-------|-------|
| **Date** | 2026-09-02 |
| **Branch** | `feature/axios-interceptors` |
| **Spec** | SPEC-P4-01 |
| **Estimate** | 3h |
| **Submitted By** | Broker |

### Description
Centralize Alegra HTTP error handling and add a timeout. Establishes a shared Axios client with a 10s `timeout` and a response interceptor that normalizes every Alegra error and shows a single toast (EST-M07):
- `src/services/axiosClient.ts` (new) — one Axios instance, `timeout: API.TIMEOUT_MS`, response interceptor rejects with a normalized `Error` + single toast
- `src/services/apiService.ts` — consumes `axiosClient`, drops per-call toast/error duplication
- `src/stores/sellersStore.ts` — removes its redundant toast, fixing the existing double-toast on sellers failures
- `src/utils/getErrorMessage.ts` — friendly message for timeouts
- `src/config/index.ts` — `API.TIMEOUT_MS = 10000` (removes magic number)
- Unsplash flow intentionally untouched (unsplash-js is a separate HTTP stack, already resilient via `IMAGES.FALLBACK_URL`)

### Status
APPROVED - IMPLEMENTED (merged to staging via PR #37 on 2026-09-02)

### Approval
- **Jör Approved:** 2026-09-02, verbal + via PR merge (#37)
- **Notes:** no spec existed before; SPEC-P4-01 created and approved.

---

## PROPOSAL-2026-015: Standardize Composition API (EST-M03)

| Field | Value |
|-------|-------|
| **Date** | 2026-09-02 |
| **Branch** | `feature/composition-api-standardization` |
| **Spec** | SPEC-P4-02 |
| **Estimate** | 3h |
| **Submitted By** | Broker |

### Description
Rewrite the last four Options-API components to `<script setup lang="ts">` (EST-M03), removing the Options-API vs Composition-API split:
- `NavbarFile.vue` — `methods.goHome()` → `useRouter()` (`this.$router` gone)
- `WinnerModal.vue` — `methods.proceed()` → `defineEmits` + `defineProps` (`this.$emit` gone)
- `LoadingFile.vue` — state-less `defineComponent` → empty `<script setup lang="ts">`
- `FooterFile.vue` — state-less `defineComponent` → empty `<script setup lang="ts">`
- Existing unit tests kept green (`navbar-file.spec.ts` `$router` mock verified)
- Visual output identical; no markup/SCSS/copy changes

### Status
PENDING (awaiting Jör approval via PR)

### Approval
- **Jör Approved:** (pending)

---

## PROPOSAL-2026-016: GitHub Actions CI Pipeline (EST-L02)

| Field | Value |
|-------|-------|
| **Date** | 2026-09-02 |
| **Branch** | `feature/ci-pipeline` |
| **Spec** | SPEC-P4-03 |
| **Estimate** | 3h |
| **Submitted By** | Broker |

### Description
Add a GitHub Actions CI pipeline that automatically runs the repo's own checks on every push/PR to `staging`/`main` (EST-L02):
- `.github/workflows/ci.yml` — single `ci` job: `npm ci` → lint → type-check → unit tests → build
- `package.json` — add `type-check` script (`tsc --noEmit`) so CI and devs share one command
- Companion fix: `tests/unit/composables/useContest.spec.ts` had 2 pre-existing type errors that `vite build` (esbuild) did not surface; added a typed `makeImage()` fixture so the new `type-check` step starts green (CI would otherwise be red on day one)
- No deploy/secret handling in this workflow (Netlify deploy stays separate)

### Status
PENDING (awaiting Jör approval via PR)

### Approval
- **Jör Approved:** (pending)

---

## PROPOSAL-2026-017: Remove Unused Dependencies (EST-M09)

| Field | Value |
|-------|-------|
| **Date** | 2026-09-02 |
| **Branch** | `feature/remove-unused-deps` |
| **Spec** | SPEC-P4-04 |
| **Estimate** | 0.5h |
| **Submitted By** | Broker |

### Description
Remove Vue-CLI-era dependencies that are dead after the Vite + `<script setup>` migration (EST-M09):
- `core-js` — Babel polyfill helper, unused under esbuild/Vite
- `dotenv` — Vite reads env via `import.meta.env` natively; `dotenv` never referenced
- `vue-class-component` — only used by Options-API class-style components, eliminated in EST-M03
- Verified via grep across `src`, `tests`, and configs: zero import sites for all three
- `node-sass` already absent from `package.json` (SCSS uses `sass` under Vite) — no action needed there
- Behavior unchanged; all CI gates (lint, type-check, 23/23 tests, build) re-verified green after removal

### Status
PENDING (awaiting Jör approval via PR)

### Approval
- **Jör Approved:** (pending)

---

## PROPOSAL-2026-018: Complete `<script setup>` Conversion (EST-M03 follow-up)

| Field | Value |
|-------|-------|
| **Date** | 2026-09-02 |
| **Branch** | `feature/script-setup-complete` |
| **Spec** | SPEC-P4-05 |
| **Estimate** | 3h |
| **Submitted By** | Broker |

### Description
Convert the last five `defineComponent` components to `<script setup lang="ts">`, finishing Composition-API uniformity started in EST-M03:
- `CarouselFile.vue` — object-form `defineProps` keeps the custom `images` validator
- `ErrorFile.vue` — type-only `defineProps<{ message: string }>()`
- `search/SearchBar.vue` — `ref` + type-only props + emit
- `seller/SellerCard.vue` — type-only props + emit
- `seller/SellerGrid.vue` — type-only array props + emit
- Existing `error-file.spec.ts` / `carousel-file.spec.ts` still pass unchanged — `<script setup>` exposes runtime `props` metadata (required/validator), so no test rewrites required
- After this, all 9 components use `<script setup lang="ts">` (zero `defineComponent`); visual output identical

### Status
PENDING (awaiting Jör approval via PR)

### Approval
- **Jör Approved:** (pending)

---

## PROPOSAL-2026-019: Husky + lint-staged Pre-Commit Hooks (EST-L01)

| Field | Value |
|-------|-------|
| **Date** | 2026-09-02 |
| **Branch** | `feature/husky-lint-staged` |
| **Spec** | SPEC-P4-06 |
| **Estimate** | 2h |
| **Submitted By** | Broker |

### Description
Add local pre-commit hooks that lint staged source files, complementing the remote CI (EST-L02):
- Add `husky` (^9.1.7) + `lint-staged` (^17.4.1) as devDependencies
- `package.json` — `prepare: "husky"` script (auto-installs hooks on `npm install`) + `lint-staged` config: `*.{ts,tsx,vue,js}` → `eslint --fix`
- `.husky/pre-commit` hook (runs `npx lint-staged`); the husky-managed `_` internal dir is git-ignored
- Verified manually: a staged `.ts` file with `any` blocks the commit (lint-staged errors + reverts staging); exit 1
- All CI gates (lint, type-check, 23/23 tests, build) re-verified green

### Status
PENDING (awaiting Jör approval via PR)

### Approval
- **Jör Approved:** (pending)

---

<!--
Template for new proposals - to be copied when Broker submits:

## PROPOSAL-2026-001

| Field | Value |
|-------|-------|
| **Date** | YYYY-MM-DD |
| **Branch** | `fix/example` |
| **Spec** | SPEC-P0-01 |
| **Estimate** | 3h |
| **Submitted By** | Broker |

### Description
Fix X, Y, Z.

### Status
PENDING

### Approval
- **Jör Approved:** (pending)
-->