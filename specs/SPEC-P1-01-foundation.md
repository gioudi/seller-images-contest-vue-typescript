# SPEC-P1-01: Foundation & Type-Safety

## Status: DRAFT (awaiting Jör approval)

## Purpose
Establish a solid, typed foundation before the W2 platform migrations (Vite + Pinia). This phase makes the codebase safe to refactor: type-safe store actions, correct state typing, passing unit tests, correct image mapping, and a centralized constants module. These guard the riskier migrations in W2.

## Scope

### Included
- EST-H01: Fix broken unit test (references non-existent `HelloWorld.vue`); add tests for real components
- EST-H04: Complete `RootState` interface (add `images`, `invoices`)
- EST-H03: Type all Vuex action contexts (replace `{ commit }: any`)
- EST-H05: Fix type mismatch in `sellers/actions.ts` `handleAddSeller`
- EST-H06: Fix `LandingPage.vue` using wrong loading getter (`sellers` vs `images`)
- EST-H07: Fix fragile image-to-seller mapping (`index === seller.id`)
- EST-H08: Fix carousel type declaration (`vue-carousel` -> `vue3-carousel`)
- EST-M08: Create `src/config/index.ts` constants module (win threshold, vote points, toast duration)

### Excluded
- CI/CD pipeline (deferred to W2 - would be rewritten after Vite migration changes build commands)
- Pinia / Vite migrations (W2)
- Composition API standardization (W2)
- Any feature work

## Acceptance Criteria
- [ ] `npm run test:unit` passes (currently fails on `HelloWorld` import)
- [ ] `npm run build` passes
- [ ] `npm run lint` passes with zero errors and zero warnings in touched files
- [ ] Zero `any` types in store action signatures (`ActionContext` used)
- [ ] `RootState` interface includes all 3 module states
- [ ] `LandingPage` loading state reflects image loading, not seller loading
- [ ] Images map to sellers deterministically, no blank images
- [ ] Carousel imports resolve without type errors
- [ ] No magic numbers in source (config module exports win threshold, vote points)

## Technical Approach

### EST-H01 - Fix unit tests (3h)
Replace `tests/unit/example.spec.ts` reference to `HelloWorld.vue` with real tests:
- `NavbarFile` renders title + button, triggers navigation on click
- `FooterFile` renders copyright text
- `LoadingFile` renders loading message
- `ErrorFile` renders prop message
- `CarouselFile` receives images prop and validates

### EST-H04 - Complete RootState (2h)
```ts
export interface RootState {
  sellers: SellersState;
  images: ImagesState;
  invoices: InvoicesState;
}
```
Add to `store/index.ts`, populate empty `store/types/index.ts`.

### EST-H03 - Type Vuex actions (5h)
Replace `{ commit }: any` with `ActionContext<SellersState, RootState>`:
```ts
import { ActionContext } from "vuex";
async handleFetchSellers({ commit }: ActionContext<SellersState, RootState>) { ... }
```
Type error handlers: `catch (error: unknown)` with narrowing.

### EST-H05 - Fix handleAddSeller (0.5h)
Replace `const seller: any = []` with a typed `Seller` object, or drop the dead action.

### EST-H06 - LandingPage loading (0.3h)
Change `store.getters["sellers/getLoading"]` -> `store.getters["images/getLoading"]`.

### EST-H07 - Deterministic image mapping (3h)
Replace fragile `images.find((img, index) => index === seller.id)` with a consistent assignment (e.g., `images[seller.id % images.length]`) with null-safe fallback.

### EST-H08 - Carousel types (0.3h)
`vue-carousel.d.ts`: declare module `vue3-carousel` (or remove + rely on package types if present).

### EST-M08 - Constants module (2h)
```ts
export const CONTEST = { WIN_THRESHOLD: 20, VOTE_POINTS: 3 } as const;
export const TOAST = { DEFAULT_DURATION: 3000, ERROR_DURATION: 5000 } as const;
```
Replace magic numbers in `sellers/mutations.ts`, `ImageList.vue`, `main.ts`, `toastService.ts`.

## Testing Strategy
- Unit tests for components (EST-H01) act as guard tests for W2 migrations
- `npm run build`, `npm run lint`, `npm run test:unit` all green
- File set: `tests/unit/*`, `store/**`, `config/**` (new), `routes` types, `LandingPage`, `ImageList`, carousel d.ts

## Estimated Time
16.1 hours (~2 work days)

## Dependencies
- Phase 0 must be merged (its `.gitattributes`/LF fixes make the diff clean on Windows)

## Approval
- **Broker:** Pending
- **Jör:** Pending (PROPOSAL-2026-002)