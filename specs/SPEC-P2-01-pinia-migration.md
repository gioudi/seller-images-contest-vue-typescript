# SPEC-P2-01: Pinia Migration

| Field | Value |
|-------|-------|
| **Status** | IMPLEMENTED (merged to staging via PR #25, 2026-08-28) |
| **Topic** | Migrate the state layer from Vuex to Pinia (ADR-001). Single topic: the store. Nothing else. |
| **Estimate** | 14h |
| **Branch** | `refactor/pinia-migration` |
| **Proposal** | PROPOSAL-2026-004 |

## 1. Context

The store layer runs on **Vuex 4**. Vuex 4 is in maintenance-only and the Vue core team officially recommends **Pinia** as the replacement (ADR-001 already accepted). Our current store is fully working after W1 (typed actions, complete `RootState`, guard tests green) — so the swap is now *safe to do* and easy to *verify*. We migrate the store now, BEFORE the Vite build-tool migration, so each platform change is its own small, reviewable PR (RULE 3A).

## 2. Topic & Scope

- **Topic:** replace the Vuex store with Pinia stores, and nothing else.

**In scope:**
- Add `pinia` dependency, remove `vuex`
- Create `src/stores/sellersStore.ts`, `imagesStore.ts`, `invoicesStore.ts`
- Replace `src/store/index.ts` (Vuex) with a Pinia instance + `RootState` cleanup
- `src/main.ts`: `app.use(createPinia())`
- Rewire every `useStore()` / `store.getters[...]` / `store.dispatch(...)` / `store.commit(...)` in views/components/App to the matching Pinia store composable
- Update the migrated type definitions (per-store TS-first types)

**Out of scope (forbidden in this branch):**
- Vite migration (own PR, next)
- Any behavior/feature change (i18n, a11y, theme, voting rules)
- Touching `src/services/**` (except type imports if a store needs them)
- Jest/test-infra changes (Pinia is runtime-only; webpack + jest stay as-is this PR)
- Adding new store tests (own topic: `test/store` PR later)

## 3. Design Patterns

The same patterns we already use — kept and made explicit, because Pinia is built around them:

| Pattern | Where applied | Why this pattern (plain words) |
|---------|---------------|--------------------------------|
| **State Container (Flux-style)** | every Pinia store (`src/stores/*`) | All app data lives in one place per domain. Components never change data directly — they ask the store, the store changes it. |
| **Observer / reactive subscription** | Pinia + Vue reactivity, all components | Components *subscribe* to the store; when state changes, they re-render by themselves. Nobody "pokes" components. |
| **Singleton** | one `pinia` instance in `main.ts` | There is exactly ONE store for the whole app. Every component reads the same values — no duplication, no drift. |
| **Module pattern** | one file per domain: `sellersStore`, `imagesStore`, `invoicesStore` | Each domain keeps its state + actions together and swappable. Vuex forced separate folders; Pinia makes this natural. |
| **Facade** | store actions exposed to views/components | The store hides API calls and transforms behind simple methods. A component calls `imagesStore.fetchList("cute")` — it never sees axios, never touches raw responses. |
| **Command-like actions** | store actions (`fetchList`, `vote`, `createInvoice`) | UI fires a named operation ("vote"), the store does the whole job (HTTP, loading flags, error state, toast). |
| **Dependency Injection (frameworks)** | Pinia `defineStore` + Vue `provide/inject` | The store is provided by Pinia at root and injected anywhere — no global `import singleton` needed in components. |

## 4. SOLID

- **S** — Single Responsibility: each Pinia store owns exactly one domain (sellers / images / invoices). Each store file does one job.
- **O** — Open/Closed: adding a store field or action extends the store; existing views/actions keep working. Migrating to Pinia is itself done *without modifying component templates* as much as the old store shape allows.
- **L** — Liskov: n/a — no subtype hierarchies in the store layer.
- **I** — Interface Segregation: per-domain stores give small, focused interfaces. A view that only votes imports only the sellers store, not the whole app state.
- **D** — Dependency Inversion: stores depend on the abstract services (`apiService`, `apiImagesService`); components depend only on store interfaces (`useSellersStore()`), never on axios or service internals. This direction does not change — Pinia keeps our existing D-inversion intact.

## 5. Architecture & Why

```
Before (Vuex):                          After (Pinia):
View --dispatch/commit--> Vuex module   View --await storeAction()--> Pinia store
                          |                                       |
                (mutations  transforms)                (actions, no mutations/boller)
                          |                                       |
                        services                              services
RootState = 3 modules in store/index     RootState gone: each store self-typed in src/stores/*
```

Why Pinia, in your words to memorize:
- **Less boilerplate**: Vuex needs `state/mutations/actions/getters` — mutating code is (and must be) doubled between mutations and the dispatch payload. Pinia has one place: the action. Fewer files, fewer concepts. Your brain only needs ONE word: **action**.
- **Type safety by design**: Pinia stores are typed from the store definition itself. `RootState` hacks disappear.
- **Composition API native**: goes with our W2 partner migration (Vite) and future composables.
- **Official**: Vue team's recommendation — we are not betting on an unmaintained library the way Vuex 4 is heading.

Why Pinia **before** Vite (sequencing — see ADR-003):
- Pinia swap is **runtime-only**: webpack build + jest test infra stay untouched, so the guard tests we fixed in W1 still prove the app works during the swap.
- Vite is the *platform* change (build + test tooling + config). Doing both at once would double the blast radius and violate RULE 3A.
- Result: two small reviews, each verifiable on its own.

## 6. Future Avoid

- [x] `useStore()` / `store.getters[...]` patterns anywhere after this PR — banned; use Pinia composables
- [x] `RootState` shared mega-interface — banned; per-store types only
- [x] New files named `src/store/**` after this PR — banned; everything under `src/stores/**`
- [x] Keeping the vuex package in `package.json` after the swap — banned
- [x] Mixing Vite work into this branch — banned; that is the next PR
- [x] Letting vuex creep back in as an implementation detail of a helper — banned
- [ ] Store unit tests — deferred to own PR; do not write them here

## 7. Acceptance Criteria

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0 (zero errors, zero warnings in touched files)
- [ ] `npm run test:unit` exits 0 — same 8 tests, infra unchanged
- [ ] `grep -ri "vuex" src/`: zero matches (grep on `useStore`, `commit(`, `dispatch(` in views/components: zero)
- [ ] `useSellersStore` / `useImagesStore` / `useInvoicesStore` imported by every consumer
- [ ] pinia is in `dependencies`, vuex is gone from `package.json`
- [ ] Behavior identical: landing auto-fetches "cute" images; vote adds 3 points (CONTEST.VOTE_POINTS); winner modal at 20 (CONTEST.WIN_THRESHOLD); invoice create flow works — manual smoke on `npm run serve`
- [ ] PR size fits RULE 3A by justification: one migration, commits split by concern — expect > 8 files, call this out when pushing

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Behaviour drift during swap (wrong getter mapping) | Medium | High | W1 guard tests + manual smoke + mapping table in migration commit notes |
| Pinia version/compat issue with webpack build | Low | Medium | pinia ^2 is TS+bundler agnostic; build checked in-gate |
| Large diff (many components rewired) | Certain | Review burden | Commits split by domain (images, sellers, invoices, main); each commit green |
| Some component reads a getter that disappears | Low | Medium | Per-store mapping table in the first commit message; full grep sweep automated |

## 9. Testing Strategy

- `npm run build` + `npm run lint` + `npm run test:unit` as the gate
- grep-based acceptance (`vuex`, `useStore`) as listed in §7
- Manual `npm run serve` smoke: the three flows above

## 10. Estimate & Dependencies

| Task | h |
|------|---|
| Add pinia, remove vuex, `main.ts` + instance | 1.0 |
| Sellers store + rewire App/Landing/ImageList | 3.5 |
| Images store + rewire views | 3.5 |
| Invoices store + rewire InvoiceForm | 2.5 |
| type cleanup + grep sweep + gate | 1.5 |
| Manual smoke + PR notes | 0.5 |
| Buffer | 1.5 |
| **Total** | **14.0** |

**Dependencies:** W1 merged to staging (guard tests + typed actions) ✅. Services-typing PR optional, no conflict. Next dependency: this PR approved → then `refactor/vite-migration` (its own spec).

---

## Approval

- **Jör Approved:** (pending)
- **Status:** DRAFT — await PR review on GitHub