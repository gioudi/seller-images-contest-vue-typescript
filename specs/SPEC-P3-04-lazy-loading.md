# SPEC-P3-04: Lazy Loading & Payload Reduction (EST-L03 / L04 / L05)

| Field | Value |
|-------|-------|
| **Status** | DRAFT (awaiting Jör approval via PR) |
| **Topic** | Make the app load faster by (1) lazy-loading the route screens (EST-L03), (2) lazy-loading card images (EST-L04), and (3) fetching smaller, lighter image files instead of huge originals (EST-L05). Single topic: performance / load time. Nothing else. |
| **Estimate** | 2.3h (L03: 1h, L04: 1h, L05: 0.3h) |
| **Branch** | `feature/lazy-loading` |
| **Proposal** | PROPOSAL-2026-009 |
| **ADS Reference** | Section 8.1 (Critical Performance Issues), 8.3 (Performance Recommendations) |

## 1. Context

The app currently ships everything up front:

- **All three screens load at once.** When the app starts, the code for the Landing page, the Image List (the big voting screen), and the Invoice form is all downloaded in one single bundle, even if the user only ever sees one screen. The more the app grows, the bigger that first download gets, and the longer the visitor waits before anything appears.
- **Card images are enormous originals.** Each seller card shows a small picture, but the app asks the image server for the full-size original (2000+ pixels) and then squeezes it into a ~100px box. The browser still downloads the full giant file. This is flagged as a HIGH-severity issue in the ADS (Section 8.1).
- **Every card image loads immediately.** The grid renders all cards at once, and all their images start downloading at the same time, even ones far below the visible screen.

These are all about the same thing: **pages load slower than they need to.** This step fixes that with three small, well-known web-performance improvements. The app must keep looking and behaving exactly as it does now — this only changes *when* things load and *how heavy* they are, not *what* you see. That is the acceptance bar.

## 2. Topic & Scope

- **Topic:** reduce initial load time and wasted bandwidth via lazy loading and smaller payloads. No visual or behavior change.

**In scope:**
- **EST-L03 — Route lazy loading:** make each of the three screens load its own code only when that screen is visited:
  - `src/routes/index.ts` — switch the three static imports to lazy (dynamic) imports
- **EST-L04 — Image lazy loading:** tell the browser to download each card image only when it scrolls near the visible screen:
  - `SellerCard.vue` — add `loading="lazy"` to the card `<img>`
- **EST-L05 — Smaller image URLs:** ask the image server for the *small* version of each photo instead of the full-size original:
  - `src/composables/useContest.ts` — use `image.urls.small` instead of `image.urls.full` when building each seller card
  - Update the unit test that mocks the image URLs so it keeps passing

**Out of scope (forbidden in this branch):**
- Any visual/appearance change (same pictures, same layout, same look)
- Route guards, SEO meta tags, or other routing features (own PRs: EST-L06/L07+)
- Virtual scrolling / infinite scroll for the list (flagged MEDIUM in ADS, own future work)
- Preconnect for Google Fonts (EST-L06), service worker/PWA, bundle analysis tooling (each own PR)

## 3. Design in plain words

Think of emptying a full suitcase (the one giant download) and only packing each day's clothes in a small pouch you carry **on the day you need it**.

- **Route lazy loading** = "pack each outfit separately, open it only when you go to that room." Each screen (Landing, Image List, Invoice) becomes its own small pouch. The visitor only downloads the pouch for the screen they're actually entering. This shrinks the very first load.

- **Image lazy loading** = "don't pull every photo off the shelf at once — grab the ones you can already see." The browser gets a hint (`loading="lazy"`) to hold off downloading photos that are still far below the folded part of the screen, and fetch them as the user scrolls toward them.

- **Smaller image URLs** = "ask for the wallet-size print, not the poster." Instead of requesting a full-size original for a tiny card picture, we request the small version. Same look on screen, a fraction of the download.

Together they make the first screen appear noticeably sooner and waste less data — without the visitor seeing any difference.

## 4. The five design principles, in plain words

- **S — each task one job.** Route loading lives in the router file; image hints live on the image tags; the smaller-URL choice lives where the card image is built. Each change is a single, obvious place.
- **O — easy to grow.** Adding a new screen later is just another lazy route entry; the pattern scales with the app.
- **L — interchangeable parts.** These are small, isolated edits. Any one of the three could be reverted or adjusted on its own without touching the others.
- **I — only what you need.** This is the whole point: the app and its images only pull the code/data that's actually needed for the screen in view.
- **D — clean, layered changes.** Routing depends on the view files, the card image depends on the composable that picks the URL — each depends on a clear, named layer, never tangled together.

## 4b. Technical design patterns & vocabulary

The formal names of the techniques this step applies (handy to reference in interviews). Each maps to a plain-language idea above.

- **Route-level code splitting** (also called **lazy routes**) — converting `import View from "@/views/View.vue"` to `component: () => import("@/views/View.vue")`. Vue Router + Vite/Rollup then split each screen's code into its own **chunk** (a separate JS file), loaded **on demand** when that route is matched. This is *code splitting* (splitting one bundle into many), plus *lazy loading* (fetching a chunk only when needed), and results in a smaller **initial bundle / TTI (Time to Interactive)**.
- **Dynamic import()** — the ECMAScript `import()` expression that returns a Promise and lets a bundler recognize a split point. Vite/Rollup creates the chunk boundaries from these.
- **Native browser lazy loading** — the HTML `loading="lazy"` attribute on `<img>`. The browser defers download until the image approaches the viewport; the modern native alternative to old `IntersectionObserver`-based image loading. (Also relevant: `decode`/`fetchpriority` hints, not used here.)
- **CDN image variants / responsive image sizing** — Unsplash's `urls` object offers the same photo at several sizes (`raw`, `full`, `regular`, `small`, `thumb`). Picking `small` for a small on-screen element is **content-aware sizing**: serve the smallest file that still renders sharply, cutting **megabytes of transfer** and improving **LCP (Largest Contentful Paint)** perception.
- **Initial load / TTI / LCP** — the load-performance metrics these changes improve (Time to Interactive, Largest Contentful Paint), the same vocabulary used in the ADS performance analysis.

## 5. Where things live and why

```
src/
  routes/
    index.ts                 ← lazy (dynamic) route imports for the 3 views (EST-L03)
  components/
    seller/
      SellerCard.vue         ← loading="lazy" on the card image (EST-L04)
  composables/
    useContest.ts            ← image.urls.small instead of urls.full (EST-L05)
tests/
  unit/composables/
    useContest.spec.ts       ← mock now provides urls.small so the test still passes
```

Why this shape: the router is the only place that knows about screens, so route splitting belongs there. The card image belongs to the seller card component, so the lazy attribute goes in `SellerCard.vue`. The card's image URL is assembled in the `useContest` composable (the single place that maps a seller to a photo), so the "use the smaller URL" decision goes there too — one clear spot per concern.

## 6. Rules going forward (so this stays clean)

- [ ] Any new screen added to `routes/index.ts` should also be a lazy route (same pattern)
- [ ] Any new `<img>` that shows a below-the-fold or repeated image uses `loading="lazy"`
- [ ] Card/accent images request the smallest URL that still looks sharp (`urls.small`), not `full`
- [ ] No new `setTimeout` artificial delays (already removed in earlier work; keep it that way)

## 7. Acceptance Criteria

- [ ] `npm run build` exits 0 — and produces **separate chunk files** for the three screens (visible in `dist/assets/` as multiple JS bundles, not one) — this proves code splitting worked
- [ ] `npm run lint` exits 0
- [ ] `npm run test:unit` exits 0 (including the updated `useContest.spec.ts`)
- [ ] `src/routes/index.ts` uses dynamic imports (no top-level `import ...View`)
- [ ] `SellerCard.vue` card `<img>` has `loading="lazy"`
- [ ] `useContest.ts` uses `image.urls.small` (no more `urls.full` for cards)
- [ ] Manual `npm run dev` smoke: all screens navigate and render exactly as before; cards show the same pictures; the voting + winner + invoice flow still works

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Lazy routes cause a brief blank flash on navigation | Low | Low | Vite chunks are tiny and fast; if needed, per-route loading states come later — not in this PR |
| `loading="lazy"` hides images on some browsers | Low | Low | Native lazy loading is supported in all modern browsers; no JS needed |
| `urls.small` looks blurry on the card | Low | Medium | The card image renders at ~100px; `small` (400px) is sharp on retina too; verified in manual smoke |
| A test that mocked `urls.full` breaks | Medium | Low | Update the mock/assertions in `useContest.spec.ts` to use `urls.small` |
| Scope creep into other performance work (preconnect, SEO, infinite scroll) | Medium | Low | explicit out-of-scope above; separate PRs |

## 9. Testing Strategy

- Gate: `npm run build` + `npm run lint` + `npm run test:unit`
- Verify the production build now outputs multiple chunk files (code splitting evidence) and check the main chunk shrank
- Manual `npm run dev` smoke across all screens + the full vote→winner→invoice flow, at narrow and wide viewports

## 10. Estimate & Dependencies

| Task | h |
|------|---|
| SPEC + branch setup | 0.5 |
| EST-L03 route lazy loading (dynamic imports) | 1.0 |
| EST-L04 image lazy loading (`loading="lazy"`) | 1.0 |
| EST-L05 smaller image URLs (`urls.small`) + test update | 0.3 |
| gate (build split-check / lint / test) + manual smoke | 0.5 |
| Docs (spec status, CHANGELOG proposal) | 0.2 |
| **Total** | **3.5** |

**Dependencies:** EST-M06 SCSS 7-1 merged to staging ✅. Next after this: EST-L06/L07 (font preconnect + SEO) and other L-wave items as separate PRs, then the **v1.0.2** release (staging → main + tag).

---

## Approval

- **Jör Approved:** (pending)
- **Status:** DRAFT — await PR review on GitHub
