# SPEC-P3-02: Extract Composables (EST-M05)

| Field | Value |
|-------|-------|
| **Status** | DRAFT (awaiting Jör approval via PR) |
| **Topic** | Move the business logic + Pinia store usage out of components/views and into reusable composables (EST-M05). Single topic: composable extraction — nothing else. |
| **Estimate** | 16h |
| **Branch** | `refactor/extract-composables` |
| **Proposal** | PROPOSAL-2026-007 |

## 1. Context

Right now the "thinking" (business logic and Pinia store calls) lives inside the components/views. `App.vue`, `ImageList.vue`, `InvoiceForm.vue`, and `LandingPage.vue` each reach into the stores directly and repeat similar patterns (fetch with loading/error handling, reading state, etc.). Rules like "fetch, set loading, catch, show toast, finally clear loading" get copy-pasted in several places. This makes the logic hard to reuse, hard to test in isolation, and easy to accidentally break in one view without noticing.

The goal of this step: pull that logic out into small, named, reusable "composables" (plain functions that a component calls inside its `setup`) so that:
- Views stop calling stores directly and instead ask a composable for what they need.
- Each piece of logic is written in exactly one place and tested once.
- The views become short, readable "screens" that only describe *what to show and which actions are available*.

This matches the plan already recorded in `ESTIMATIONS-AND-RESOLUTIONS.md` (EST-M05): create `useSellers()`, `useImages()`, `useInvoices()`, `useLoading()`, `useError()`, `useContest()`, with the acceptance that **views contain no direct store calls** and **each composable has unit tests**.

## 2. Topic & Scope

- **Topic:** wrap store interaction + business logic in composables under `src/composables/`, and rewire every view/App to consume them.

**In scope:**
- New folder `src/composables/` with:
  - `useLoading()` — a tiny helper: read a store's `loading` state as a reactive value
  - `useError()` — same idea for the `error` state
  - `useImages()` — images store wrapper: `images`, `fetchImages(term)`, plus loading/error
  - `useSellers()` — sellers store wrapper: `sellers`, `vote(seller)`, `resetClickable()`, plus loading/error and contest state
  - `useInvoices()` — invoices store wrapper: `submit(payload)`
  - `useContest()` — contest orchestration used by `ImageList`: winner, the enriched `sellerWithImages`, the vote handler, and the "continue to invoice" navigation
- Rewire `App.vue`, `ImageList.vue`, `InvoiceForm.vue`, `LandingPage.vue` to use the composables
- Add a unit test for each composable

**Out of scope (forbidden in this branch):**
- Any behavior/UX change (voting rules, winner math, points, styling)
- SCSS / styles / markup changes
- Route or image lazy loading (own PRs: EST-L03/L04/L05)
- Changing the stores, services, or config code
- New features (i18n, theming, etc. — own PRs)

## 3. Design in plain words

Think of a composable as a **little helper the view can hire**. The view says "give me the sellers," "go fetch these images," or "register this vote," and the composable does it — talking to the Pinia store (and from there the API) on the view's behalf. The view no longer needs to know *how* the store works; it just uses the helper.

Why break it into these particular helpers:
- **`useLoading()` / `useError()`** — two views (and App) all need the same "am I busy?" and "did it fail?" values. Reworking that once, instead of repeating it everywhere, keeps the loading/error story consistent app-wide.
- **`useImages()`** — fetching images (set loading, call store, catch, toast, clear) is nearly duplicated in `ImageList` and `App`. One helper = one place for that whole dance.
- **`useSellers()`** — the vote action, "make sellers clickable again," and the contest flags all belong to the sellers domain. Grouping them under one named helper makes the domain obvious and reusable.
- **`useInvoices()`** — invoice submission is self-contained business logic (validate, submit, warn if empty). Wrapping it means the form view only describes the form, not how invoices are saved.
- **`useContest()`** — this is the "match seller to a picture and decide the winner" job that `ImageList` currently does inline. Pulling it out lets `ImageList` just be the screen that shows whatever `useContest` hands it.

The direction of "who calls whom" stays one-way and clean:

```
View (screen)  -->  Composable (helper)  -->  Pinia store  -->  API service
```

The view never reaches past the composable. And each composable is its own file, so it can be reasoned about and tested all by itself.

## 4. The five design principles, in plain words

- **S — every file has one job.** Each composable does exactly the thing its name says. A view's only job is to draw the screen. Nobody is doing two jobs at once anymore.
- **O — easy to extend, no need to rewrite.** If we later add a new screen that also shows images, it just calls `useImages()` — the existing helper already does the job, so we don't touch the old code.
- **L — interchangeable pieces.** The composables sit behind the views and encapsulate the store. Because a view depends on the helper's behavior, not on the exact store inside, we can swap or improve the store logic without rewriting every screen.
- **I — each view gets only what it needs.** `InvoiceForm` only needs `useInvoices`; the landing page only needs `useImages`. No screen is handed a giant grab-bag of unrelated data.
- **D — views depend on the helper, not the low-level store/service.** The composable is the "middleman" that buffers the screen from the details of storing and fetching. That keeps the screens stable and simple.

## 5. Where things live and why

```
New:                                  Used by:
src/composables/useLoading.ts          all views + App (busy flag)
src/composables/useError.ts            all views + App (error message)
src/composables/useImages.ts           LandingPage, ImageList, App
src/composables/useSellers.ts          App, ImageList
src/composables/useInvoices.ts         InvoiceForm
src/composables/useContest.ts          ImageList
```

Why this layout:
- One folder for all composables keeps them discoverable and easy to scan.
- Each composable is tiny and named by the thing it owns, so "where does X happen?" has one obvious answer.
- This is the same folder name and pattern the project already uses for stores (`src/stores/`) and utilities (`src/utils/`), so it fits the existing style.

## 6. Rules going forward (so this stays fixed)

- [ ] No **new** direct store calls inside `.vue` files — a view should call a composable, not `useXStore()`
- [ ] Composable files must not contain template/markup (that's a component's job)
- [ ] Business rules (vote math, winner threshold) live in the store or a composable, not in a template
- [ ] Keep the composable naming consistent: `use<Domain>()`
- [ ] No mixing other work (lazy loading, SCSS, features) into this branch

## 7. Acceptance Criteria

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm run test:unit` exits 0 — all prior tests still pass, plus new composable tests
- [ ] No `.vue` file contains a direct `useImagesStore`, `useSellersStore`, or `useInvoicesStore` call
- [ ] Each composable has at least one unit test (loading, error, images, sellers, invoices, contest)
- [ ] Behavior identical: app boots and loads sellers/images on start; search navigates and lists images; vote adds +3; winner modal at 20 and continues to the invoice form with the winner id
- [ ] Manual smoke on `npm run dev` confirms screens still work

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Breaking loading/error behavior during the move | Medium | High | `useLoading`/`useError` keep identical values; existing store tests + manual smoke cover it |
| A view stops updating when a computed should be reactive | Medium | High | composables return reactive (`computed`) values the same way the views did; verified by tests + dev smoke |
| Missing one of the duplicate call sites | Low | Medium | grep for `useXStore` / `getLoading` / `getError` after rewiring to confirm none remain in `.vue` |
| Forgetting a composeable test | Low | Low | acceptance lists one test per composable; lint/build gate |
| Scope creep (lazy loading, SCSS, features) | Medium | Low | explicit out-of-scope above; separate PRs |

## 9. Testing Strategy

- Unit tests for each composable in `tests/unit/` (mount a small harness with a real Pinia instance to exercise the wiring)
- Existing 8 tests must stay green
- Gate: `npm run build` + `npm run lint` + `npm run test:unit`
- Manual `npm run dev` smoke: app boot, search, list, vote (+3), winner modal, invoice continue

## 10. Estimate & Dependencies

| Task | h |
|------|---|
| SPEC + branch setup | 1.0 |
| `useLoading` + `useError` + tests | 2.0 |
| `useImages` + test | 2.5 |
| `useSellers` + test | 2.5 |
| `useInvoices` + test | 2.0 |
| `useContest` (enriched cards, vote, continue) + test | 3.0 |
| Rewire App + 3 views, remove direct store calls | 1.5 |
| gate (build/lint/test) + manual smoke | 1.0 |
| Docs (spec status, CHANGELOG proposal) | 0.5 |
| **Total** | **16.0** |

**Dependencies:** EST-M04 split merged to staging ✅ (this runs on top of it). Next: EST-M06 SCSS 7-1 as its own PR.

---

## Approval

- **Jör Approved:** (pending)
- **Status:** DRAFT — await PR review on GitHub
