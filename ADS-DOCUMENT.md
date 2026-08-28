# Architecture Design Specification (ADS) Document

## Seller Images Contest - Vue TypeScript

**Version:** 1.0  
**Date:** 2026-08-28  
**Repository:** https://github.com/gioudi/seller-images-contest-vue-typescript  
**Author of Review:** Automated Architecture Review  

---

## Table of Contents

1. [Project Purpose & Summary](#1-project-purpose--summary)
2. [Technology Stack](#2-technology-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Design Patterns Analysis](#4-design-patterns-analysis)
5. [SOLID Principles Compliance](#5-solid-principles-compliance)
6. [DRY Principle Compliance](#6-dry-principle-compliance)
7. [CSS Architecture](#7-css-architecture)
8. [Performance Analysis](#8-performance-analysis)
9. [SEO Analysis](#9-seo-analysis)
10. [Accessibility (WCAG) Compliance](#10-accessibility-wcag-compliance)
11. [Workflow & Tooling](#11-workflow--tooling)
12. [Security Audit](#12-security-audit)
13. [Findings & Bugs](#13-findings--bugs)
14. [Recommendations - Patterns to Adopt](#14-recommendations---patterns-to-adopt)
15. [Recommendations - Patterns to Avoid](#15-recommendations---patterns-to-avoid)
16. [Roadmap for Professional-Grade Project](#16-roadmap-for-professional-grade-project)

---

## 1. Project Purpose & Summary

### Purpose
The **Seller Images Contest** is a gamified internal tool where sellers compete by receiving votes from users. The application:

1. **Displays sellers** fetched from the Alegra CRM API
2. **Searches for images** via the Unsplash API based on user-entered keywords
3. **Associates images with sellers** and allows users to vote for their favorites
4. **Implements a contest mechanic**: when a seller accumulates 20 points (each vote = 3 points), they win
5. **Creates invoices** for the winning seller via the Alegra API

### Summary
A Vue 3 + TypeScript SPA that combines external API integrations (Alegra + Unsplash) with a voting gamification system. It serves as a proof-of-concept for seller engagement through image-based contests.

---

## 2. Technology Stack

| Layer | Technology | Version | Status |
|-------|-----------|---------|--------|
| Framework | Vue | 3.2.13 | Current (but outdated minor) |
| Language | TypeScript | 4.5.5 | **Outdated** (current: 5.x) |
| State Management | Vuex | 4.0.2 | **Deprecated** (use Pinia) |
| Router | Vue Router | 4.3.3 | Current |
| Build Tool | Vue CLI | 5.0.0 | **Maintenance mode** (use Vite) |
| CSS Preprocessor | SCSS (Sass) | 1.77.5 | Current |
| HTTP Client | Axios | 1.7.2 | Current |
| Image API | unsplash-js | 7.0.19 | Current |
| Testing | Jest | 27.0.5 | **Outdated** |
| Linting | ESLint | 7.32.0 | **Outdated** |
| Formatting | Prettier | 2.4.1 | **Outdated** |

---

## 3. Architecture Overview

### 3.1 Current Directory Structure

```
src/
  assets/              # Static assets (logo)
  components/          # Reusable UI components (6 files)
  routes/              # Vue Router configuration
  services/            # API service layer (2 files)
  store/               # Vuex state management
    modules/
      sellers/         # Sellers module (state, mutations, actions, getters, types)
      images/          # Images module (state, mutations, actions, getters, types)
      invoices/        # Invoices module (state, mutations, actions, types)
  styles/              # SCSS stylesheets
    base/              # Grid, container, mixins
  utils/               # Utility services (toast)
  views/               # Route-level components (3 views)
  App.vue              # Root component
  main.ts              # Entry point
```

### 3.2 Architectural Pattern: Modular Vuex + Service Layer

The application follows a **modular store pattern** with a separate service layer for API communication:

```
View -> Vuex Action -> Service -> External API
                |
            Vuex Mutation -> State Update -> View Reactivity
```

### 3.3 Data Flow

```
[Unsplash API] <---> apiImagesService.ts <---> images Vuex module
[Alegra API]   <---> apiService.ts        <---> sellers Vuex module
                                                invoices Vuex module
```

---

## 4. Design Patterns Analysis

### 4.1 Patterns Currently Used

| Pattern | Where | Assessment |
|---------|-------|------------|
| **Module Pattern** | Vuex store modules | Well-structured separation of concerns |
| **Service Layer** | `apiService.ts`, `apiImagesService.ts` | Good abstraction of API calls |
| **Observer Pattern** | Vue reactivity system | Inherent to Vue |
| **Singleton** | Service instances, store instance | Appropriate for this use case |
| **Factory** | Vuex `createStore`, `createRouter` | Standard Vue 3 approach |

### 4.2 Patterns Missing (Should Be Adopted)

| Pattern | Purpose | Priority |
|---------|---------|----------|
| **Composable Pattern** | Extract reusable logic from components | HIGH |
| **Container/Presentational** | Separate data logic from UI rendering | MEDIUM |
| **Repository Pattern** | Abstract data access behind interfaces | MEDIUM |
| **Strategy Pattern** | Different voting/loading strategies | LOW |
| **Middleware Pattern** | Axios interceptors for auth, error handling | HIGH |
| **Composition API exclusively** | Some components still use Options API | HIGH |

### 4.3 Anti-Patterns Found

| Anti-Pattern | Location | Issue |
|-------------|----------|-------|
| **God Component** | `ImageList.vue` (269 lines) | Handles search, display, voting, navigation |
| **Fat Action** | `sellers/actions.ts` | Actions contain redundant loading commits |
| **Leaky Abstraction** | Views directly commit mutations | Views should dispatch actions only |
| **Magic Numbers** | Multiple files | `20` (win threshold), `3` (points per vote), `5000`/`3000` (delays) |

---

## 5. SOLID Principles Compliance

### S - Single Responsibility Principle

| Component | Violation | Severity |
|-----------|-----------|----------|
| `ImageList.vue` | Handles search, image display, seller display, voting, winner detection, and navigation | HIGH |
| `App.vue` | Handles initial data fetching with artificial delay | MEDIUM |
| `apiService.ts` | Contains both seller and invoice API calls | MEDIUM |
| `toastService.ts` | Creates toast instances at module level (side effect on import) | LOW |

### O - Open/Closed Principle

| Area | Violation | Severity |
|------|-----------|----------|
| Store mutations | Hardcoded win threshold (`20`) in mutation | MEDIUM |
| Vote point value | Hardcoded `3` in component | MEDIUM |
| Error handling | Identical error patterns copied across all actions | LOW |

### L - Liskov Substitution Principle

| Area | Violation | Severity |
|------|-----------|----------|
| Action context typing | `{ commit }: any` used in all actions | HIGH |
| Error types | `catch (error: any)` everywhere | MEDIUM |
| API response types | `response.json()` called on already-parsed data | HIGH |

### I - Interface Segregation Principle

| Area | Violation | Severity |
|------|-----------|----------|
| `RootState` interface | Only defines `sellers`, missing `images` and `invoices` | HIGH |
| `InvoicePayload` | Contains all fields but form only needs subset | MEDIUM |
| Service interfaces | No TypeScript interfaces for service contracts | MEDIUM |

### D - Dependency Inversion Principle

| Area | Violation | Severity |
|------|-----------|----------|
| Views directly use `useStore()` | No abstraction layer between views and store | MEDIUM |
| Services directly instantiate Axios | No dependency injection | LOW |
| `useToast()` called at module level | Global side effect, not injectable | MEDIUM |

---

## 6. DRY Principle Compliance

### Violations Found

| Violation | Locations | Lines Affected |
|-----------|-----------|----------------|
| **Loading/Error template pattern** | `LandingPage.vue`, `ImageList.vue`, `InvoiceForm.vue` | ~30 lines duplicated 3x |
| **Store loading/failure mutations** | `sellers/mutations.ts`, `images/mutations.ts`, `invoices/mutations.ts` | ~10 lines duplicated 3x |
| **setTimeout artificial delays** | `App.vue:27`, `ImageList.vue:100`, `ImageList.vue:123` | 3 locations |
| **Toast options object** | `main.ts:10-22`, `toastService.ts:7-18,22-33` | 3 identical config objects |
| **API error handling pattern** | `apiService.ts:20-26,33-39`, `apiImagesService.ts:18-24` | 3 identical blocks |
| **Store action loading pattern** | All 3 action files | Identical try/catch/finally structure |

---

## 7. CSS Architecture

### 7.1 Current Approach

The project uses a **custom SCSS framework** with:
- Custom 12-column grid system (flex + CSS Grid progressive enhancement)
- Custom utility classes (colors, spacing, typography)
- BEM naming convention (partially applied)
- Component-scoped styles via Vue's `scoped` attribute

### 7.2 CSS Architecture Issues

| Issue | Severity | Description |
|-------|----------|-------------|
| **Duplicate mixin files** | HIGH | `styles/_mixin.scss` and `styles/base/_mixin.scss` both define mixins |
| **Massive utility classes** | HIGH | ~588 lines of mostly unused responsive utility classes |
| **Inconsistent naming** | HIGH | Mix of BEM (`alegra-card__title`), Bootstrap-like (`d-flex`, `mb-3`, `form-control`), and custom (`container-greet`) |
| **No CSS reset** | MEDIUM | No normalize.css or modern CSS reset |
| **Hardcoded rem/px mix** | MEDIUM | Inconsistent unit usage across files |
| **Global element selectors** | HIGH | `_mixin.scss` applies styles to bare `input`, `button`, `ul` elements globally |
| **Unused CSS classes** | MEDIUM | Hundreds of generated utility classes never used in templates |
| **Multiple `<style>` blocks** | LOW | `ImageList.vue` has 2 `<style>` blocks, one unscoped |
| **Google Fonts external load** | MEDIUM | No `font-display: swap`, no preconnect hints |
| **Negative margins in grid** | LOW | `margin-right: -15px; margin-left: -15px` is a hack |

### 7.3 Recommended CSS Architecture

```
styles/
  base/
    _reset.scss          # CSS reset/normalize
    _typography.scss     # Font definitions
    _variables.scss      # Design tokens
  abstracts/
    _mixins.scss         # Reusable mixins
    _functions.scss      # SCSS functions
    _breakpoints.scss    # Media query definitions
  components/
    _navbar.scss
    _card.scss
    _modal.scss
    _form.scss
    _carousel.scss
  layout/
    _grid.scss
    _container.scss
  pages/
    _landing.scss
    _image-list.scss
    _invoice-form.scss
  utilities/
    _spacing.scss        # Only generated utilities actually used
    _colors.scss
  index.scss             # Master import file
```

**Follow the 7-1 SCSS architecture pattern** (or ITCSS - Inverted Triangle CSS).

---

## 8. Performance Analysis

### 8.1 Critical Performance Issues

| Issue | Location | Impact | Severity |
|-------|----------|--------|----------|
| **5-second artificial delay** | `App.vue:27` | Users wait 5 seconds before any content loads | CRITICAL |
| **3-second artificial delays** | `ImageList.vue:100,123` | Each search/additional search adds 3 seconds | CRITICAL |
| **No route lazy loading** | `routes/index.ts` | All views bundled in main chunk | HIGH |
| **Full-size image loading** | `ImageList.vue:158` | Uses `image.urls.full` (2000+ px) for cards | HIGH |
| **No image lazy loading** | `ImageList.vue`, `CarouselFile.vue` | All images load simultaneously | HIGH |
| **No virtual scrolling** | `ImageList.vue` | Renders all sellers at once | MEDIUM |
| **No code splitting** | `main.ts` | Single bundle for entire app | MEDIUM |
| **No service worker/PWA** | Missing | No offline capability | LOW |

### 8.2 Bundle Size Concerns

| Package | Concern |
|---------|---------|
| `node-sass` + `sass` | Both listed as dependencies (redundant, `node-sass` is deprecated) |
| `core-js` | Large polyfill bundle |
| `vuex` + `vue-class-component` | `vue-class-component` listed but not used |
| Custom CSS grid | 492 lines of grid CSS when a lightweight alternative would suffice |

### 8.3 Performance Recommendations

1. **Remove ALL artificial `setTimeout` delays** immediately
2. **Lazy-load routes**: `component: () => import('@/views/ImageList.vue')`
3. **Use `image.urls.small` or `image.urls.thumb`** instead of `urls.full` for card images
4. **Add `loading="lazy"`** to all `<img>` tags
5. **Replace Vue CLI with Vite** for faster builds and HMR
6. **Add bundle analysis**: `npm run build -- --report`
7. **Implement infinite scroll** or pagination for image lists
8. **Use `v-memo`** or `computed` caching for expensive computations

---

## 9. SEO Analysis

### 9.1 Current SEO State: POOR

| Element | Status | Issue |
|---------|--------|-------|
| `<html lang="">` | MISSING | Empty lang attribute; should be `lang="es"` |
| `<title>` | DEFAULT | Uses Webpack default title, not configured |
| `<meta description>` | MISSING | No meta description tag |
| Open Graph tags | MISSING | No og:title, og:description, og:image |
| Twitter Cards | MISSING | No twitter:card meta tags |
| Canonical URL | MISSING | No canonical link |
| Sitemap | MISSING | No sitemap.xml |
| robots.txt | MISSING | No robots.txt |
| Structured Data | MISSING | No JSON-LD |
| Semantic HTML | PARTIAL | Uses `<article>`, `<section>`, `<nav>`, `<footer>` (good) but `<article>` misused for wrapper divs |
| Server-Side Rendering | MISSING | SPA-only, not indexable by all crawlers |
| Preconnect hints | MISSING | No preconnect for fonts.googleapis.com |

### 9.2 SEO Recommendations

1. Add `<html lang="es">` (content is in Spanish)
2. Configure proper `<title>` and `<meta description>` per route using `vue-meta` or `@vueuse/head`
3. Add Open Graph and Twitter Card meta tags
4. Implement route-based meta tags
5. Add `robots.txt` and `sitemap.xml`
6. Consider Nuxt 3 for SSR/SSG if SEO is important
7. Add preconnect: `<link rel="preconnect" href="https://fonts.googleapis.com">`

---

## 10. Accessibility (WCAG) Compliance

### 10.1 WCAG 2.1 Level A Violations

| Criterion | Violation | Location | Severity |
|-----------|-----------|----------|----------|
| **1.1.1 Non-text Content** | Images in carousel lack meaningful alt text (uses `slug`) | `CarouselFile.vue:8` | HIGH |
| **1.3.1 Info and Relationships** | Form inputs use `<label>` with `for` but no proper association guarantee | `InvoiceForm.vue`, `LandingPage.vue` | MEDIUM |
| **1.4.3 Contrast Minimum** | Light colors (`$color-primary-5: #ebfafb`) on white backgrounds | Global styles | HIGH |
| **2.1.1 Keyboard** | Modal lacks keyboard trap and ESC handling | `WinnerModal.vue` | HIGH |
| **2.4.1 Bypass Blocks** | No skip navigation link | `App.vue` | MEDIUM |
| **2.4.3 Focus Order** | No custom focus indicators defined | Global | MEDIUM |
| **2.4.6 Headings** | Heading hierarchy jumps (h3 -> h5 -> h4) across views | Multiple views | LOW |
| **3.3.1 Error Identification** | Form validation errors not announced to screen readers | `InvoiceForm.vue` | MEDIUM |
| **3.3.2 Labels or Instructions** | Form fields lack visible hints/required indicators | `InvoiceForm.vue` | MEDIUM |
| **4.1.2 Name, Role, Value** | Voting button lacks ARIA attributes | `ImageList.vue:38-44` | HIGH |

### 10.2 WCAG 2.1 Level AA Violations

| Criterion | Violation | Severity |
|-----------|-----------|----------|
| **1.4.4 Resize Text** | Font sizes in px/rem may not scale properly | MEDIUM |
| **1.4.10 Reflow** | Fixed-width card containers (`12rem`) may cause horizontal scroll | MEDIUM |
| **2.4.7 Focus Visible** | No visible focus ring styles | HIGH |
| **2.5.5 Target Size** | Vote buttons may be too small for touch targets | MEDIUM |

### 10.3 Accessibility Recommendations

1. Add `aria-label` to all interactive elements
2. Implement focus trap in `WinnerModal.vue`
3. Add `role="dialog"` and `aria-modal="true"` to modal
4. Add skip-to-content link
5. Ensure all color combinations meet WCAG AA contrast ratio (4.5:1)
6. Add `aria-live="polite"` region for loading/error states
7. Add visible focus indicators for keyboard navigation
8. Ensure form error messages are associated with inputs via `aria-describedby`
9. Use semantic heading hierarchy (h1 -> h2 -> h3, no skips)

---

## 11. Workflow & Tooling

### 11.1 Current Tooling

| Tool | Status | Issue |
|------|--------|-------|
| Vue CLI 5 | Maintenance mode | Migrate to Vite |
| Jest 27 | Outdated | Upgrade to Vitest or Jest 29 |
| ESLint 7 | Outdated | Upgrade to ESLint 8+ with flat config |
| Prettier 2 | Outdated | Upgrade to Prettier 3 |
| TypeScript 4.5 | Outdated | Upgrade to TypeScript 5.x |
| `node-sass` | **Deprecated** | Remove (already have `sass`) |
| `vue-class-component` | Listed but unused | Remove from dependencies |
| `dotenv` | Runtime dependency | Should be devDependency or removed (Vue CLI handles .env) |
| No Husky/lint-staged | Missing | No pre-commit quality gates |
| No CI/CD pipeline | Missing | No automated testing/builds |
| No .env.example | Missing | No documentation of required env vars |

### 11.2 Recommended Workflow Improvements

1. **Migrate to Vite**: Vue CLI is officially in maintenance mode
2. **Add Husky + lint-staged**: Pre-commit linting and formatting
3. **Add GitHub Actions**: CI pipeline for lint, test, build
4. **Create `.env.example`**: Document all required environment variables
5. **Add commitlint**: Enforce conventional commits
6. **Add Dependabot/Renovate**: Automated dependency updates
7. **Add Storybook**: Component documentation and visual testing
8. **Configure path aliases properly**: `@/` alias works but should be verified in all configs

---

## 12. Security Audit

### 12.1 CRITICAL Security Issues

| Issue | Location | Severity | Description |
|-------|----------|----------|-------------|
| **HARDCODED API KEY** | `apiImagesService.ts:7` | **CRITICAL** | Unsplash API access key is hardcoded directly in source code: `"Zau8FoWGR7ZuRehy_4mq7atvzL-tsEPmbMRuPWDEzbg"` |
| **Trailing brace in auth header** | `apiService.ts:11` | **HIGH** | `` Authorization: `Basic ${API_KEY}}` `` has an extra `}`, causing all Alegra API calls to fail authentication |
| **API key in git history** | Commit history | **HIGH** | Even if removed now, key remains in git history and should be rotated |

### 12.2 Other Security Concerns

| Issue | Severity | Description |
|-------|----------|-------------|
| No CSRF protection | MEDIUM | No CSRF token handling for API calls |
| No rate limiting | LOW | Client-side has no request throttling |
| No input sanitization | MEDIUM | Form inputs not sanitized before API submission |
| `.env` file handling | LOW | No `.env` file present; unclear which vars are needed |
| Console.log in production | LOW | `apiService.ts:30` logs payload to console |
| Error messages exposed | LOW | Raw error messages shown to users via toast |

### 12.3 Immediate Actions Required

1. **ROTATE the Unsplash API key immediately** - it is compromised
2. **Move ALL API keys to environment variables** via `.env` files
3. **Fix the trailing brace** in `apiService.ts` Authorization header
4. **Add `.env` to `.gitignore`** (verify it is there)
5. **Remove `console.log` statements** from production code
6. **Implement request/response interceptors** in Axios for error sanitization

---

## 13. Findings & Bugs

### 13.1 Confirmed Bugs

| # | Bug | Location | Severity | Description |
|---|-----|----------|----------|-------------|
| 1 | **Syntax error in template** | `ErrorFile.vue:11` | CRITICAL | Stray `s` character outside `<template>` tag: `</template>\ns\n<script>` |
| 2 | **Test references non-existent component** | `tests/unit/example.spec.ts:2` | HIGH | Imports `HelloWorld.vue` which does not exist in the project |
| 3 | **Double JSON parse** | `invoices/actions.ts:8` | HIGH | `await response.json()` called on data already parsed by Axios |
| 4 | **Type mismatch** | `sellers/actions.ts:29` | HIGH | `handleAddSeller` creates `seller` as `[]` (array) but commits as `Seller` |
| 5 | **Unused action** | `sellers/actions.ts:32-36` | MEDIUM | `handleUpdateSellerPoints` commits with hardcoded `0` payload |
| 6 | **Incomplete RootState** | `store/index.ts:7-9` | MEDIUM | `RootState` only defines `sellers` interface, missing `images` and `invoices` |
| 7 | **Wrong type declaration** | `vue-carousel.d.ts` | LOW | Declares `vue-carousel` module but project uses `vue3-carousel` |
| 8 | **Auth header broken** | `apiService.ts:11` | CRITICAL | Extra `}` in template literal breaks all Alegra API calls |
| 9 | **API key exposed** | `apiImagesService.ts:7` | CRITICAL | Hardcoded Unsplash API key in source code |
| 10 | **Loading uses wrong module** | `LandingPage.vue:61` | MEDIUM | `loading` computed uses `sellers/getLoading` instead of a dedicated images loading state |
| 11 | **Image mapping fragile** | `ImageList.vue:153` | MEDIUM | Maps seller ID to image by array index (`index === seller.id`), which breaks if IDs don't match array positions |
| 12 | **No error handling in invoice success path** | `invoices/actions.ts:7-9` | MEDIUM | Success case tries to parse response that's already parsed |

### 13.2 Code Quality Issues

| # | Issue | Location | Description |
|---|-------|----------|-------------|
| 1 | Mixed API styles | `NavbarFile.vue`, `WinnerModal.vue` vs others | Options API used alongside Composition API |
| 2 | Inconsistent routing | `NavbarFile.vue:15` vs `LandingPage.vue:65` | `this.$router.push` vs `useRouter().push` |
| 3 | `any` type abuse | All action files | `{ commit }: any` loses all type safety |
| 4 | Unused imports | `App.vue:11` | `onMounted` imported but `useStore` result not typed |
| 5 | Missing error type | All catch blocks | `error: any` used instead of `unknown` with type narrowing |
| 6 | Inconsistent error messages | Multiple services | Same error caught and re-thrown with different messages |
| 7 | Empty store types | `store/types/index.ts` | File is completely empty |
| 8 | Comment artifacts | `ErrorFile.vue:11`, `sellers/actions.ts:28` | Stray characters and dead comments |

---

## 14. Recommendations - Patterns to Adopt

### 14.1 Architecture Patterns

| Pattern | Implementation | Benefit |
|---------|---------------|---------|
| **Composables** | Extract `useLoading`, `useError`, `useApiCall` | Eliminates DRY violations, testable |
| **Repository Pattern** | Create `SellerRepository`, `ImageRepository`, `InvoiceRepository` | Abstracts data access, testable |
| **Middleware/Interceptor Pattern** | Axios interceptors for auth, logging, error handling | Centralized cross-cutting concerns |
| **Pinia Store** | Replace Vuex with Pinia | Better TypeScript support, simpler API, official Vue recommendation |
| **VueUse** | Use `@vueuse/core` for reactive utilities | Reduces custom code for common patterns |
| **Zod/Yup validation** | Schema-based form validation | Type-safe validation, better DX |

### 14.2 SOLID Implementation

| Principle | How to Apply |
|-----------|-------------|
| **SRP** | Split `ImageList.vue` into `SearchBar.vue`, `SellerGrid.vue`, `VoteButton.vue`, `WinnerOverlay.vue` |
| **OCP** | Use configuration objects for thresholds (win points, vote value) instead of magic numbers |
| **LSP** | Properly type all action contexts: `ActionContext<SellersState, RootState>` |
| **ISP** | Create separate interfaces: `ISellerRepository`, `IImageRepository`, `IInvoiceRepository` |
| **DIP** | Inject services via composables rather than direct imports |

### 14.3 Testing Patterns

| Pattern | Implementation |
|---------|---------------|
| **Unit Tests** | Test each composable, each store action, each getter in isolation |
| **Component Tests** | Test components with `@vue/test-utils` using mounted props and emitted events |
| **Integration Tests** | Test view + store + service integration with mocked APIs |
| **E2E Tests** | Add Cypress or Playwright for critical user flows |

---

## 15. Recommendations - Patterns to Avoid

| Pattern/Anti-Pattern | Why Avoid | Alternative |
|---------------------|-----------|-------------|
| **Magic Numbers** | `20`, `3`, `5000`, `3000` scattered across codebase | Extract to constants file or config module |
| **`any` type** | Defeats purpose of TypeScript | Use `unknown` + type narrowing, or proper Vuex types |
| **Global element selectors** | `_mixin.scss` styles bare `input`, `button`, `ul` | Use scoped styles or BEM-named classes |
| **Artificial delays** | `setTimeout` mimics loading, terrible UX | Remove entirely; if needed for UX, use skeleton screens |
| **Options API mixed with Composition API** | Inconsistent codebase, harder to maintain | Standardize on Composition API with `<script setup>` |
| **Direct mutation from views** | Views calling `store.commit()` directly | Always dispatch actions from views |
| **Hardcoded secrets** | API keys in source code | Environment variables only |
| **Custom grid system** | 492 lines of grid CSS | Use a lightweight CSS framework or modern CSS Grid/Flexbox directly |
| **Over-engineered utility classes** | Hundreds of unused generated classes | Only generate classes that are actually used |
| **`node-sass`** | Deprecated, C++ dependency, slow | Already have `sass` (Dart Sass), remove `node-sass` |

---

## 16. Roadmap for Professional-Grade Project

### Phase 1: Critical Fixes (Immediate)

- [ ] Rotate Unsplash API key and move to `.env`
- [ ] Fix broken Alegra API auth header (trailing brace)
- [ ] Remove all `setTimeout` artificial delays
- [ ] Fix `ErrorFile.vue` syntax error (stray `s`)
- [ ] Fix `invoices/actions.ts` double JSON parse
- [ ] Remove `console.log` from production code
- [ ] Fix test file to reference existing component
- [ ] Type all Vuex action contexts properly

### Phase 2: Architecture (Week 1-2)

- [ ] Migrate Vuex to Pinia
- [ ] Migrate to Vite from Vue CLI
- [ ] Extract composables: `useSellers`, `useImages`, `useInvoices`
- [ ] Split `ImageList.vue` into smaller components
- [ ] Implement Repository pattern for API services
- [ ] Add Axios interceptors for auth and error handling
- [ ] Add proper TypeScript interfaces for all service contracts
- [ ] Complete `RootState` interface

### Phase 3: Quality & DX (Week 2-3)

- [ ] Upgrade TypeScript to 5.x
- [ ] Upgrade ESLint to 8+ with strict TypeScript rules
- [ ] Add `@typescript-eslint/strict-type-checked` config
- [ ] Add Husky + lint-staged for pre-commit hooks
- [ ] Add GitHub Actions CI pipeline
- [ ] Write unit tests for all store modules
- [ ] Write component tests for all views
- [ ] Add `.env.example` with all required variables

### Phase 4: UX & Performance (Week 3-4)

- [ ] Remove unused dependencies (`node-sass`, `vue-class-component`, `dotenv`)
- [ ] Implement route lazy loading
- [ ] Add image lazy loading (`loading="lazy"`)
- [ ] Use `urls.small` or `urls.thumb` instead of `urls.full`
- [ ] Implement skeleton screens instead of spinner
- [ ] Add PWA support with service worker
- [ ] Optimize SCSS: adopt 7-1 architecture, remove unused utilities
- [ ] Add `preconnect` for Google Fonts

### Phase 5: Professional Polish (Week 4-5)

- [ ] Add WCAG 2.1 AA compliance
- [ ] Add proper meta tags with `@vueuse/head`
- [ ] Add Open Graph and Twitter Card tags
- [ ] Add `robots.txt` and `sitemap.xml`
- [ ] Add Storybook for component documentation
- [ ] Add E2E tests with Cypress/Playwright
- [ ] Add i18n support (content is in Spanish, should be configurable)
- [ ] Add error boundaries
- [ ] Standardize on `<script setup>` syntax

### Phase 6: DevOps & Monitoring

- [ ] Add Docker configuration
- [ ] Configure automated deployments
- [ ] Add error monitoring (Sentry)
- [ ] Add performance monitoring (Web Vitals)
- [ ] Add logging service
- [ ] Set up Dependabot for dependency updates

---

## Appendix A: File-by-File Issue Index

| File | Issues |
|------|--------|
| `src/main.ts` | Uses `process.env`, large toast config object |
| `src/App.vue` | 5-second setTimeout, mixes loading concern from sellers into root |
| `src/routes/index.ts` | No lazy loading, no route guards, no meta tags |
| `src/store/index.ts` | Incomplete RootState interface |
| `src/store/types/index.ts` | Empty file |
| `src/store/modules/sellers/actions.ts` | `any` types, unused actions, duplicated loading commits |
| `src/store/modules/sellers/mutations.ts` | Hardcoded win threshold (20) |
| `src/store/modules/images/actions.ts` | `any` types |
| `src/store/modules/invoices/actions.ts` | Double JSON.parse, `any` types |
| `src/services/apiService.ts` | Broken auth header, console.log, hardcoded URL |
| `src/services/apiImagesService.ts` | **CRITICAL: Hardcoded API key** |
| `src/utils/toastService.ts` | Module-level side effect, duplicated config |
| `src/views/LandingPage.vue` | Uses wrong loading getter |
| `src/views/ImageList.vue` | God component, magic numbers, fragile image mapping, multiple style blocks |
| `src/views/InvoiceForm.vue` | No validation feedback, no success handling |
| `src/components/ErrorFile.vue` | Syntax error (stray `s`) |
| `src/components/NavbarFile.vue` | Uses Options API, `this.$router` |
| `src/components/WinnerModal.vue` | No accessibility, uses Options API |
| `src/components/CarouselFile.vue` | Uses `image.slug` for alt text |
| `src/styles/_styles.scss` | 588 lines of mostly unused utilities |
| `src/styles/_mixin.scss` | Global element selectors |
| `src/styles/base/_grid.scss` | 492 lines of custom grid |
| `tests/unit/example.spec.ts` | References non-existent `HelloWorld.vue` |
| `vue-carousel.d.ts` | Wrong module declaration |
| `package.json` | Outdated deps, unused deps, redundant sass packages |

---

## Appendix B: Dependency Cleanup

### Remove (unused/deprecated)

```bash
npm uninstall node-sass vue-class-component dotenv
```

### Upgrade

```bash
npm install typescript@latest eslint@latest prettier@latest
npm install -D vitest @vue/test-utils@latest
```

### Replace

```bash
npm uninstall vuex
npm install pinia
```

---

*This document was generated through comprehensive static analysis of all source files in the repository. Every finding has been verified against the actual codebase.*
