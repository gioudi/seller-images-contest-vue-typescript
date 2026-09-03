# Estimations & Resolution Plan

## Seller Images Contest - Vue TypeScript

**Version:** 1.0  
**Date:** 2026-08-28  
**Reference:** ADS-DOCUMENT.md  
**Prepared by:** Broker (Architecture Consultant)  
**Prepared for:** Jör (Project Owner)  

---

## Table of Contents

1. [Estimation Methodology](#1-estimation-methodology)
2. [Priority Classification](#2-priority-classification)
3. [Critical Findings - Estimations](#3-critical-findings---estimations)
4. [High Findings - Estimations](#4-high-findings---estimations)
5. [Medium Findings - Estimations](#5-medium-findings---estimations)
6. [Low Findings - Estimations](#6-low-findings---estimations)
7. [New Feature Estimations](#7-new-feature-estimations)
8. [Phase-by-Phase Execution Plan](#8-phase-by-phase-execution-plan)
9. [Total Project Estimation](#9-total-project-estimation)
10. [Risk Register](#10-risk-register)

---

## 1. Estimation Methodology

- **Time unit:** Ideal development days (8h/day), assuming focused work without context-switching
- **Complexity scale:** XS (<2h), S (2-4h), M (4-8h), L (1-2d), XL (2-3d), XXL (3-5d)
- **Each task requires:** branch creation, implementation, testing, PR, review, and merge to staging
- **Buffer:** 20% added to all estimates for code review cycles and unforeseen issues

---

## 2. Priority Classification

| Priority | Label | Definition |
|----------|-------|------------|
| P0 | BLOCKER | App is broken or has security exposure. Must fix before any other work. |
| P1 | CRITICAL | Severe bugs or architecture debt that blocks professional deployment. |
| P2 | HIGH | Quality issues that significantly impact maintainability and performance. |
| P3 | MEDIUM | Improvements for best practices, DX, and polish. |
| P4 | LOW | Nice-to-haves, cosmetic, or speculative improvements. |

---

## 3. Critical Findings - Estimations

### EST-C01: Rotate & Secure Unsplash API Key
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 12.1 |
| **Priority** | P0 BLOCKER |
| **Complexity** | XS |
| **Estimated Time** | 1 hour |
| **Branch** | `fix/secure-unsplash-api-key` |
| **Resolution** | 1) Generate new key on Unsplash. 2) Revoke old key. 3) Create `.env` with `VUE_APP_UNSPLASH_ACCESS_KEY`. 4) Update `apiImagesService.ts` to read from `process.env.VUE_APP_UNSPLASH_ACCESS_KEY`. 5) Add `.env` verification to `.gitignore`. 6) Create `.env.example`. |
| **Acceptance Criteria** | No API key in source code. App uses env variable. `.env` in `.gitignore`. `.env.example` exists with placeholder. |
| **Dependencies** | None |

### EST-C02: Fix Broken Alegra Auth Header
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 12.1 |
| **Priority** | P0 BLOCKER |
| **Complexity** | XS |
| **Estimated Time** | 30 minutes |
| **Branch** | `fix/alegra-auth-header` |
| **Resolution** | Remove extra `}` from template literal in `apiService.ts:11`. Move API key to `.env` as `VUE_APP_ALEGRA_API_KEY`. |
| **Acceptance Criteria** | Auth header is `Basic ${API_KEY}` (no trailing brace). API key from env variable. |
| **Dependencies** | None |

### EST-C03: Fix ErrorFile.vue Syntax Error
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 13.1, Bug #1 |
| **Priority** | P0 BLOCKER |
| **Complexity** | XS |
| **Estimated Time** | 10 minutes |
| **Branch** | `fix/error-file-syntax` |
| **Resolution** | Remove stray `s` character at line 11 between `</template>` and `<script>`. |
| **Acceptance Criteria** | File compiles without errors. Component renders correctly. |
| **Dependencies** | None |

### EST-C04: Remove All Artificial Delays
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 8.1 |
| **Priority** | P0 BLOCKER |
| **Complexity** | XS |
| **Estimated Time** | 30 minutes |
| **Branch** | `fix/remove-artificial-delays` |
| **Resolution** | Remove `await new Promise((resolve) => setTimeout(resolve, 5000))` from `App.vue:27`. Remove both `await new Promise((resolve) => setTimeout(resolve, 3000))` from `ImageList.vue:100,123`. |
| **Acceptance Criteria** | No `setTimeout` or `new Promise` delays in any source file. Loading states work via actual API response timing. |
| **Dependencies** | None |

### EST-C05: Fix Invoice Double JSON Parse
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 13.1, Bug #3 |
| **Priority** | P1 CRITICAL |
| **Complexity** | XS |
| **Estimated Time** | 20 minutes |
| **Branch** | `fix/invoice-json-parse` |
| **Resolution** | In `invoices/actions.ts:8`, remove `await response.json()` since `apiService.createInvoice` already returns parsed data from Axios. Use `response` directly. |
| **Acceptance Criteria** | Invoice creation works end-to-end. No runtime error on submit. |
| **Dependencies** | EST-C02 (auth header must work first) |

---

## 4. High Findings - Estimations

### EST-H01: Fix Test File Referencing Non-Existent Component
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 13.1, Bug #2 |
| **Priority** | P1 CRITICAL |
| **Complexity** | S |
| **Estimated Time** | 3 hours |
| **Branch** | `fix/unit-test-helloworld` |
| **Resolution** | Replace `HelloWorld` test with tests for actual components: `NavbarFile`, `FooterFile`, `LoadingFile`. Test rendering with `shallowMount`, verify expected DOM output. |
| **Acceptance Criteria** | `npm run test:unit` passes. Tests cover at least 3 existing components. |
| **Dependencies** | None |

### EST-H02: Remove console.log from Production Code
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 12.2 |
| **Priority** | P1 CRITICAL |
| **Complexity** | XS |
| **Estimated Time** | 10 minutes |
| **Branch** | `fix/remove-console-log` |
| **Resolution** | Remove `console.log(payload)` from `apiService.ts:30`. |
| **Acceptance Criteria** | No `console.log` in any service file. ESLint rule `no-console` set to `error` in production. |
| **Dependencies** | None |

### EST-H03: Type All Vuex Action Contexts
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 5 (LSP violation) |
| **Priority** | P2 HIGH |
| **Complexity** | M |
| **Estimated Time** | 5 hours |
| **Branch** | `fix/type-vuex-actions` |
| **Resolution** | Replace `{ commit }: any` with `{ commit }: ActionContext<SellersState, RootState>` in all action files. Type all error catches as `unknown` with proper narrowing. |
| **Acceptance Criteria** | `vue-tsc --noEmit` passes with zero errors. No `any` in action files. |
| **Dependencies** | EST-H06 (complete RootState first) |

### EST-H04: Complete RootState Interface
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 5 (ISP violation), Section 13.1, Bug #6 |
| **Priority** | P2 HIGH |
| **Complexity** | S |
| **Estimated Time** | 2 hours |
| **Branch** | `fix/complete-root-state` |
| **Resolution** | Add `images: ImagesState` and `invoices: InvoicesState` to `RootState` in `store/index.ts`. Import the types. Populate `store/types/index.ts` with shared types. |
| **Acceptance Criteria** | `RootState` has all 3 module states. TypeScript compiles without errors. |
| **Dependencies** | None |

### EST-H05: Fix Type Mismatch in handleAddSeller
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 13.1, Bug #4 |
| **Priority** | P2 HIGH |
| **Complexity** | XS |
| **Estimated Time** | 30 minutes |
| **Branch** | `fix/seller-type-mismatch` |
| **Resolution** | Change `const seller: any = []` to proper `Seller` type object, or remove unused action entirely. |
| **Acceptance Criteria** | Action uses correct type. No `any` cast needed. |
| **Dependencies** | EST-H03 |

### EST-H06: Fix Wrong Loading State in LandingPage
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 13.1, Bug #10 |
| **Priority** | P2 HIGH |
| **Complexity** | XS |
| **Estimated Time** | 20 minutes |
| **Branch** | `fix/landing-loading-state` |
| **Resolution** | Change `store.getters["sellers/getLoading"]` to `store.getters["images/getLoading"]` in `LandingPage.vue:61`. |
| **Acceptance Criteria** | Loading state reflects image fetching, not seller fetching. |
| **Dependencies** | None |

### EST-H07: Fix Fragile Image-to-Seller Mapping
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 13.1, Bug #11 |
| **Priority** | P2 HIGH |
| **Complexity** | S |
| **Estimated Time** | 3 hours |
| **Branch** | `fix/seller-image-mapping` |
| **Resolution** | Instead of `index === seller.id`, use a deterministic mapping (e.g., `seller.id % images.length`) or assign images randomly but consistently using seller ID as seed. Add null-safe fallback. |
| **Acceptance Criteria** | Images display correctly for any seller ID. No blank images. Mapping survives API response order changes. |
| **Dependencies** | None |

### EST-H08: Fix vue-carousel Type Declaration
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 13.1, Bug #7 |
| **Priority** | P2 HIGH |
| **Complexity** | XS |
| **Estimated Time** | 15 minutes |
| **Branch** | `fix/carousel-type-declaration` |
| **Resolution** | Rename module declaration from `vue-carousel` to `vue3-carousel` in `vue-carousel.d.ts`, or delete file and install `@types/vue3-carousel` if available. |
| **Acceptance Criteria** | No TypeScript errors related to carousel imports. |
| **Dependencies** | None |

---

## 5. Medium Findings - Estimations

### EST-M01: Migrate Vuex to Pinia
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 2, 14.1 |
| **Priority** | P2 HIGH |
| **Complexity** | XL |
| **Estimated Time** | 3 days (24 hours) |
| **Branch** | `feature/migrate-to-pinia` |
| **Resolution** | 1) Install Pinia, remove Vuex. 2) Create Pinia stores for sellers, images, invoices. 3) Migrate state, getters, actions. 4) Remove mutation pattern (Pinia uses direct state modification). 5) Update all components to use new store. 6) Remove namespaced module syntax. |
| **Acceptance Criteria** | All store functionality works. Zero references to Vuex. `npm run lint` passes. All views render correctly. |
| **Dependencies** | EST-H03, EST-H04 |

### EST-M02: Migrate Vue CLI to Vite
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 11.1 |
| **Priority** | P2 HIGH |
| **Complexity** | L |
| **Estimated Time** | 2 days (16 hours) |
| **Branch** | `feature/migrate-to-vite` |
| **Resolution** | 1) Install Vite, `@vitejs/plugin-vue`. 2) Create `vite.config.ts`. 3) Move `index.html` to root. 4) Update path aliases. 5) Replace `process.env.VUE_APP_*` with `import.meta.env.VITE_*`. 6) Remove Vue CLI dependencies. 7) Update scripts in `package.json`. 8) Test build and dev server. |
| **Acceptance Criteria** | `npm run dev` starts Vite dev server. `npm run build` produces working dist. All env variables load correctly. |
| **Dependencies** | EST-C01, EST-C02 (env vars must be migrated) |

### EST-M03: Standardize on Composition API + `<script setup>`
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 4.2, 13.2 |
| **Priority** | P3 MEDIUM |
| **Complexity** | M |
| **Estimated Time** | 6 hours |
| **Branch** | `feature/standardize-composition-api` |
| **Resolution** | Rewrite `NavbarFile.vue`, `WinnerModal.vue`, `LoadingFile.vue`, `FooterFile.vue` from Options API to `<script setup lang="ts">`. |
| **Acceptance Criteria** | Zero Options API usage. All components use `<script setup>`. |
| **Dependencies** | None |

### EST-M04: Extract ImageList.vue into Sub-Components (SRP)
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 5 (SRP), 14.2 |
| **Priority** | P3 MEDIUM |
| **Complexity** | L |
| **Estimated Time** | 2 days (16 hours) |
| **Branch** | `feature/split-image-list` |
| **Resolution** | Split into: `SearchBar.vue`, `SellerCard.vue`, `SellerGrid.vue`, `VoteButton.vue`, `WinnerOverlay.vue`. Each with single responsibility. Parent orchestrates via composables. |
| **Acceptance Criteria** | Each component < 100 lines. Each has single responsibility. All functionality preserved. |
| **Dependencies** | EST-M03 |

### EST-M05: Extract Composables
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 4.2, 14.1 |
| **Priority** | P3 MEDIUM |
| **Complexity** | L |
| **Estimated Time** | 2 days (16 hours) |
| **Branch** | `feature/extract-composables` |
| **Resolution** | Create: `useSellers()`, `useImages()`, `useInvoices()`, `useLoading()`, `useError()`, `useContest()`. Each composable encapsulates store interaction + business logic. |
| **Acceptance Criteria** | Views contain no direct store calls. All logic in composables. Unit tests for each composable. |
| **Dependencies** | EST-M01 (Pinia migration) |

### EST-M06: Implement SCSS 7-1 Architecture
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 7.3 |
| **Priority** | P3 MEDIUM |
| **Complexity** | L |
| **Estimated Time** | 2 days (16 hours) |
| **Branch** | `feature/scss-7-1-architecture` |
| **Resolution** | Restructure `src/styles/` into: base/, abstracts/, components/, layout/, pages/, utilities/, vendors/. Remove duplicate mixins. Remove unused utility classes. Add CSS reset. Remove global element selectors. |
| **Acceptance Criteria** | No duplicate styles. No global element selectors. All existing styles preserved. No visual regressions. |
| **Dependencies** | None |

### EST-M07: Add Axios Interceptors (Middleware Pattern)
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 4.2, 12.2 |
| **Priority** | P3 MEDIUM |
| **Complexity** | M |
| **Estimated Time** | 5 hours |
| **Branch** | `feature/axios-interceptors` |
| **Resolution** | Add request interceptor for auth header injection. Add response interceptor for error normalization. Centralize toast error display. Remove duplicate error handling from services. |
| **Acceptance Criteria** | Auth header applied via interceptor. Errors normalized to standard format. No duplicate error handling in individual API calls. |
| **Dependencies** | EST-C01, EST-C02 |

### EST-M08: Create Config/Constants Module
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 4.3, 15 (Magic Numbers) |
| **Priority** | P3 MEDIUM |
| **Complexity** | S |
| **Estimated Time** | 2 hours |
| **Branch** | `feature/config-constants` |
| **Resolution** | Create `src/config/index.ts` with: `WIN_THRESHOLD`, `VOTE_POINTS`, `API_TIMEOUT`, `TOAST_DURATION`. Import in all locations using magic numbers. |
| **Acceptance Criteria** | Zero magic numbers in source. All constants in config module. TypeScript const assertions used. |
| **Dependencies** | None |

### EST-M09: Remove Unused Dependencies
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 8.2, 11.1 |
| **Priority** | P3 MEDIUM |
| **Complexity** | XS |
| **Estimated Time** | 30 minutes |
| **Branch** | `fix/remove-unused-deps` |
| **Resolution** | `npm uninstall node-sass vue-class-component dotenv`. Verify build still works. |
| **Acceptance Criteria** | `npm ls` shows no removed packages. `npm run build` succeeds. `npm run lint` passes. |
| **Dependencies** | None |

### EST-M10: Add Environment Documentation
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 11.1 |
| **Priority** | P3 MEDIUM |
| **Complexity** | XS |
| **Estimated Time** | 30 minutes |
| **Branch** | `docs/env-variables` |
| **Resolution** | Create `.env.example` with all required variables and comments. Add setup instructions to README. |
| **Acceptance Criteria** | `.env.example` exists with `VUE_APP_ALEGRA_API_KEY`, `VUE_APP_UNSPLASH_ACCESS_KEY`. README has setup section. |
| **Dependencies** | EST-C01 |

---

## 6. Low Findings - Estimations

### EST-L01: Add Husky + lint-staged
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 11.1 |
| **Priority** | P3 MEDIUM |
| **Complexity** | S |
| **Estimated Time** | 2 hours |
| **Branch** | `feature/husky-lint-staged` |

### EST-L02: Add GitHub Actions CI Pipeline
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 11.2 |
| **Priority** | P3 MEDIUM |
| **Complexity** | M |
| **Estimated Time** | 5 hours |
| **Branch** | `feature/ci-pipeline` |

### EST-L03: Add Route Lazy Loading
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 8.1 |
| **Priority** | P3 MEDIUM |
| **Complexity** | XS |
| **Estimated Time** | 1 hour |
| **Branch** | `feature/lazy-routes` |

### EST-L04: Add Image Lazy Loading
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 8.1 |
| **Priority** | P3 MEDIUM |
| **Complexity** | XS |
| **Estimated Time** | 1 hour |
| **Branch** | `feature/image-lazy-loading` |

### EST-L05: Use Smaller Image URLs
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 8.1 |
| **Priority** | P3 MEDIUM |
| **Complexity** | XS |
| **Estimated Time** | 20 minutes |
| **Branch** | `fix/use-small-image-urls` |

### EST-L06: Add Preconnect for Google Fonts
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 9.1 |
| **Priority** | P4 LOW |
| **Complexity** | XS |
| **Estimated Time** | 10 minutes |
| **Branch** | `fix/font-preconnect` |

### EST-L07: Add SEO Meta Tags
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 9.1 |
| **Priority** | P3 MEDIUM |
| **Complexity** | M |
| **Estimated Time** | 4 hours |
| **Branch** | `feature/seo-meta-tags` |

### EST-L08: Add Open Graph & Twitter Cards
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 9.1 |
| **Priority** | P4 LOW |
| **Complexity** | S |
| **Estimated Time** | 2 hours |
| **Branch** | `feature/opengraph-tags` |

### EST-L09: Fix Heading Hierarchy
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 10.1 |
| **Priority** | P4 LOW |
| **Complexity** | XS |
| **Estimated Time** | 20 minutes |
| **Branch** | `fix/heading-hierarchy` |

### EST-L10: Upgrade TypeScript to 5.x
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 2 |
| **Priority** | P3 MEDIUM |
| **Complexity** | M |
| **Estimated Time** | 4 hours |
| **Branch** | `feature/upgrade-typescript` |
| **Status** | **MET** — already satisfied: project on TypeScript ^5.9.3 (merged via SPEC-P3-06) |

### EST-L11: Upgrade ESLint + Prettier
| Field | Value |
|-------|-------|
| **ADS Reference** | Section 11.1 |
| **Priority** | P3 MEDIUM |
| **Complexity** | M |
| **Estimated Time** | 4 hours |
| **Branch** | `feature/upgrade-linting` |
| **Status** | **MET** — already satisfied: project on ESLint ^9 (flat config) + Prettier ^3 (merged via SPEC-P3-07) |

---

## 7. New Feature Estimations

### EST-F01: I18n - Internationalization (es / en / de)

| Field | Value |
|-------|-------|
| **ADS Reference** | New Feature |
| **Priority** | P2 HIGH |
| **Complexity** | XXL |
| **Estimated Time** | 5 days (40 hours) |
| **Branch** | `feature/i18n-internationalization` |
| **Dependencies** | Should be done after EST-M03 (Composition API standardization) and EST-M01 (Pinia) |

#### Sub-tasks

| # | Task | Time | Branch |
|---|------|------|--------|
| F01-a | Install `vue-i18n`, configure plugin in `main.ts` | 2h | (same branch) |
| F01-b | Create locale file structure: `locales/es.json`, `locales/en.json`, `locales/de.json` | 3h | (same branch) |
| F01-c | Extract ALL existing Spanish text from templates into locale keys | 8h | (same branch) |
| F01-d | Rewrite all messages professionally (see F01-e) | 8h | (same branch) |
| F01-e | **Professional Message Rewrite** - Rewrite every user-facing string in 3 languages with professional, brand-consistent copywriting | 10h | (same branch) |
| F01-f | Create `LanguageSwitcher.vue` component with flag icons | 3h | (same branch) |
| F01-g | Implement locale persistence (localStorage) via composable `useLocale()` | 2h | (same branch) |
| F01-h | Update `<html lang>` attribute reactively based on selected locale | 1h | (same branch) |
| F01-i | Wire all components to use `$t()` or `t()` translation function | 3h | (same branch) |
| F01-j | Test all 3 languages render correctly, no overflow/truncation | 2h | `feature/i18n-testing` |

#### I18n Message Categories (requiring professional rewrite)

| Category | Count (est.) | Examples |
|----------|-------------|----------|
| Navigation | 5 | "Volver", "Inicio", menu items |
| Form Labels | 15 | "Fecha", "Id Cliente", "Total", placeholders |
| Buttons | 8 | "Buscar", "Votar", "Crear factura", "Continuar" |
| Validation Messages | 6 | "Todos los campos son necesarios!", input validation |
| Error Messages | 8 | API errors, network errors |
| Loading States | 3 | "Procesando su solicitud..." |
| Success Messages | 4 | "Felicitationes!", invoice created |
| Page Headings | 6 | "Descubre Imágenes que Inspiran" |
| Tooltip/Hint Text | 4 | Help text, descriptions |
| **Total** | **~59 strings** | Across 3 languages = ~177 translations |

---

### EST-F02: Screen Reader / Accessibility Reader

| Field | Value |
|-------|-------|
| **ADS Reference** | New Feature |
| **Priority** | P2 HIGH |
| **Complexity** | XL |
| **Estimated Time** | 4 days (32 hours) |
| **Branch** | `feature/accessibility-reader` |
| **Dependencies** | Should be done after EST-H01 (tests), EST-M06 (SCSS architecture) |

#### Sub-tasks

| # | Task | Time | Branch |
|---|------|------|--------|
| F02-a | Add ARIA labels to ALL interactive elements (buttons, inputs, links) | 4h | (same branch) |
| F02-b | Implement `role="dialog"`, `aria-modal="true"`, focus trap in `WinnerModal.vue` | 4h | (same branch) |
| F02-c | Add skip-to-content link (`SkipToContent.vue`) | 2h | (same branch) |
| F02-d | Add `aria-live="polite"` regions for dynamic content (loading, errors, results) | 3h | (same branch) |
| F02-e | Implement visible focus indicators (global CSS) | 3h | (same branch) |
| F02-f | Fix color contrast to meet WCAG AA (4.5:1 ratio) for all text | 4h | (same branch) |
| F02-g | Fix form accessibility: `aria-describedby`, `aria-required`, error association | 3h | (same branch) |
| F02-h | Fix heading hierarchy across all views (h1 > h2 > h3, no skips) | 1h | (same branch) |
| F02-i | Add screen reader announcement composable `useAnnouncer()` | 3h | (same branch) |
| F02-j | Add keyboard navigation support (arrow keys for carousel, Enter/Space for buttons) | 3h | (same branch) |
| F02-k | Run Lighthouse accessibility audit, fix all remaining issues | 2h | `feature/accessibility-audit` |

#### WCAG 2.1 AA Compliance Checklist

| Criterion | Target | Status |
|-----------|--------|--------|
| 1.1.1 Non-text Content | All images have descriptive alt | Pending |
| 1.3.1 Info and Relationships | Proper label associations | Pending |
| 1.4.3 Contrast Minimum | 4.5:1 for normal text | Pending |
| 1.4.11 Non-text Contrast | 3:1 for UI components | Pending |
| 2.1.1 Keyboard | All functionality keyboard accessible | Pending |
| 2.4.1 Bypass Blocks | Skip navigation link | Pending |
| 2.4.3 Focus Order | Logical tab order | Pending |
| 2.4.7 Focus Visible | Visible focus indicators | Pending |
| 2.5.5 Target Size | 44x44px minimum touch targets | Pending |
| 3.3.1 Error Identification | Errors described in text | Pending |
| 4.1.2 Name, Role, Value | ARIA for custom components | Pending |

---

### EST-F03: Dark/Light Theme Toggle

| Field | Value |
|-------|-------|
| **ADS Reference** | New Feature |
| **Priority** | P2 HIGH |
| **Complexity** | L |
| **Estimated Time** | 3 days (24 hours) |
| **Branch** | `feature/theme-toggle` |
| **Dependencies** | Should be done after EST-M06 (SCSS architecture) |

#### Sub-tasks

| # | Task | Time | Branch |
|---|------|------|--------|
| F03-a | Define CSS custom properties (design tokens) for both themes in `_variables.scss` | 3h | (same branch) |
| F03-b | Create `useTheme()` composable: toggle, persist (localStorage), detect system preference | 3h | (same branch) |
| F03-c | Create `ThemeToggle.vue` component with accessible toggle button (sun/moon icons) | 3h | (same branch) |
| F03-d | Refactor all hardcoded colors in SCSS to use CSS custom properties | 6h | (same branch) |
| F03-e | Update all component scoped styles to respect theme variables | 4h | (same branch) |
| F03-f | Add theme transition animation (smooth color switch) | 1h | (same branch) |
| F03-g | Integrate into `NavbarFile.vue` | 1h | (same branch) |
| F03-h | Test all views in both themes, fix contrast/visibility issues | 3h | (same branch) |

#### Theme Token Map

| Token | Light Value | Dark Value |
|-------|-------------|------------|
| `--color-bg-primary` | `#f4f4f4` | `#1a1a2e` |
| `--color-bg-secondary` | `#ffffff` | `#16213e` |
| `--color-bg-card` | `#ffffff` | `#0f3460` |
| `--color-text-primary` | `#333333` | `#e8e8e8` |
| `--color-text-secondary` | `#666666` | `#b0b0b0` |
| `--color-accent` | `#00b19d` | `#00d4aa` |
| `--color-border` | `#d4f2f1` | `#2a2a4a` |
| `--shadow-card` | `0 6px 14px rgba(18,25,84,0.07)` | `0 6px 14px rgba(0,0,0,0.3)` |

---

### EST-F04: UI/UX Design Enhancement

| Field | Value |
|-------|-------|
| **ADS Reference** | New Feature |
| **Priority** | P3 MEDIUM |
| **Complexity** | XL |
| **Estimated Time** | 28 hours |
| **Branch** | `feature/ui-ux-enhancement` |
| **Summary** | Enhance the visual design and user experience across all screens — modernized landing, refined search/list card interactions, clearer contest/voting affordances, and a polished invoice flow. Goal is a more professional, marketable look for the live demo. |
| **Dependencies** | Should be scheduled after Phase 4 (CI, EST-L02) and logically after the color/theme work lands so enhancements build on the token system (EST-F03). |

#### Sub-tasks

| # | Task | Time | Branch |
|---|------|------|--------|
| F04-a | Visual audit: capture current screens, list UX gaps and inconsistent styling | 3h | `feature/ui-ux-enhancement` |
| F04-b | Design-token pass: ensure colors/spacing/typography use tokens; tighten contrast (AA) | 4h | (same branch) |
| F04-c | Redesign landing view (hero, search CTA, empty/loading/error states) | 5h | (same branch) |
| F04-d | Refine seller cards + voting interactions (hover, selected/voted feedback, transitions) | 5h | (same branch) |
| F04-e | Polish the invoice form + confirmation/winner flows and their states | 4h | (same branch) |
| F04-f | Component state polish: consistent buttons, focus styles, spacing rhythm across views | 4h | (same branch) |
| F04-g | Cross-view QA: desktop/tablet/mobile, no regressions vs current behavior | 3h | `feature/ui-ux-qa` |

**Out of scope:** new feature logic (i18n, theme toggle, a11y reader already tracked as EST-F01/F02/F03), backend changes, behavior changes to contest/invoice rules.

---

## 8. Phase-by-Phase Execution Plan

### Phase 0: Emergency Fixes (Day 1)
**Goal:** App works, no security exposure.

| Est. | Task | Hours |
|------|------|-------|
| EST-C01 | Rotate & secure Unsplash API key | 1.0 |
| EST-C02 | Fix Alegra auth header | 0.5 |
| EST-C03 | Fix ErrorFile.vue syntax | 0.2 |
| EST-C04 | Remove artificial delays | 0.5 |
| EST-C05 | Fix invoice double JSON parse | 0.3 |
| EST-H02 | Remove console.log | 0.2 |
| EST-M10 | Create .env.example | 0.5 |
| **Phase Total** | | **3.2 hours** |

### Phase 1: Foundation (Days 2-4)
**Goal:** TypeScript compiles, tests pass, types are correct.

| Est. | Task | Hours |
|------|------|-------|
| EST-H01 | Fix unit tests | 3.0 |
| EST-H04 | Complete RootState | 2.0 |
| EST-H03 | Type Vuex actions | 5.0 |
| EST-H05 | Fix type mismatch | 0.5 |
| EST-H06 | Fix LandingPage loading | 0.3 |
| EST-H07 | Fix image-seller mapping | 3.0 |
| EST-H08 | Fix carousel type declaration | 0.3 |
| EST-M08 | Create config/constants module | 2.0 |
| **Phase Total** | | **16.1 hours** |

### Phase 2: Architecture Migration (Days 5-9)
**Goal:** Modern stack (Vite + Pinia + Composition API).

| Est. | Task | Hours |
|------|------|-------|
| EST-M09 | Remove unused deps | 0.5 |
| EST-M03 | Standardize Composition API | 6.0 |
| EST-M01 | Migrate Vuex to Pinia | 24.0 |
| EST-M02 | Migrate Vue CLI to Vite | 16.0 |
| EST-M07 | Add Axios interceptors | 5.0 |
| **Phase Total** | | **51.5 hours** |

### Phase 3: Component Architecture (Days 10-14)
**Goal:** SRP-compliant components, extracted composables.

| Est. | Task | Hours |
|------|------|-------|
| EST-M04 | Split ImageList.vue | 16.0 |
| EST-M05 | Extract composables | 16.0 |
| EST-M06 | SCSS 7-1 architecture | 16.0 |
| EST-L03 | Route lazy loading | 1.0 |
| EST-L04 | Image lazy loading | 1.0 |
| EST-L05 | Use smaller image URLs | 0.3 |
| **Phase Total** | | **50.3 hours** |

### Phase 4: Tooling & Quality (Days 15-17)
**Goal:** CI/CD, linting, developer experience.

| Est. | Task | Hours |
|------|------|-------|
| EST-L10 | Upgrade TypeScript 5.x | 4.0 |
| EST-L11 | Upgrade ESLint + Prettier | 4.0 |
| EST-L01 | Add Husky + lint-staged | 2.0 |
| EST-L02 | Add GitHub Actions CI | 5.0 |
| EST-L06 | Font preconnect | 0.2 |
| **Phase Total** | | **15.2 hours** |

### Phase 5: New Features (Days 18-28)
**Goal:** I18n, Accessibility, Theme Toggle, UI/UX Enhancement.

| Est. | Task | Hours |
|------|------|-------|
| EST-F01 | I18n (3 languages) | 40.0 |
| EST-F02 | Accessibility reader | 32.0 |
| EST-F03 | Theme toggle | 24.0 |
| EST-F04 | UI/UX enhancement | 28.0 |
| **Phase Total** | | **124.0 hours** |

### Phase 6: SEO & Polish (Days 29-31)
**Goal:** Production-ready with SEO and documentation.

| Est. | Task | Hours |
|------|------|-------|
| EST-L07 | SEO meta tags | 4.0 |
| EST-L08 | Open Graph tags | 2.0 |
| EST-L09 | Fix heading hierarchy | 0.3 |
| README | Professional README rewrite | 4.0 |
| **Phase Total** | | **10.3 hours** |

---

## 9. Total Project Estimation

| Phase | Name | Hours | Days (est.) |
|-------|------|-------|-------------|
| 0 | Emergency Fixes | 3.2 | 0.5 |
| 1 | Foundation | 16.1 | 2.0 |
| 2 | Architecture Migration | 51.5 | 6.5 |
| 3 | Component Architecture | 50.3 | 6.5 |
| 4 | Tooling & Quality | 15.2 | 2.0 |
| 5 | New Features | 96.0 | 12.0 |
| 6 | SEO & Polish | 10.3 | 1.5 |
| | **Subtotal** | **242.6 hours** | **31.0 days** |
| | Buffer (20%) | 48.5 hours | 6.0 days |
| | **GRAND TOTAL** | **291.1 hours** | **~37 working days** |

> **Calendar estimate:** ~7.5 weeks (assuming 5 working days/week)

---

## 10. Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Unsplash API key rotation breaks existing deployments | HIGH | HIGH | Coordinate key rotation with deployment. Test in staging first. |
| Pinia migration introduces regressions | MEDIUM | HIGH | Write comprehensive tests BEFORE migration. Migrate module by module. |
| Vite migration breaks environment variables | MEDIUM | HIGH | Document all env vars. Test each env var in staging after migration. |
| I18n strings overflow UI containers (especially German) | HIGH | MEDIUM | Use flexible layouts. Test with longest translations. Add CSS overflow handling. |
| Theme toggle breaks accessibility contrast ratios | MEDIUM | HIGH | Test both themes with Lighthouse. Use automated contrast checking. |
| Scope creep on professional message rewrite | HIGH | MEDIUM | Define exact message count upfront. Lock scope after estimation. |
| Merge conflicts during long-running feature branches | MEDIUM | MEDIUM | Keep branches short-lived. Merge to staging frequently. Rebase often. |

---

*This estimation document is a living artifact. Times will be adjusted as actual development progresses and new complexities are discovered.*
