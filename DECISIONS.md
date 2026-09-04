# Architecture Decision Records (DECISIONS.md)

Log of architectural decisions made during the project, per Rule 7 of the governance contract. Each decision follows the ADR (Architecture Decision Record) format.

## ADR Format

```
## ADR-{NNN}: {Short Title}

**Status:** [ PROPOSED | ACCEPTED | REJECTED | SUPERSEDED ]

### Context
{What problem or situation led to this decision}

### Decision
{What was decided}

### Options Considered
1. **Option A** - {pros/cons}
2. **Option B** - {pros/cons}

### Rationale
{Why this option was chosen}

### Consequences
{Positive and negative implications}

### Decided By
{Who decided, when}
```

---

## Decision Log

### ADR-001: Migrate state management from Vuex to Pinia

**Status:** ACCEPTED

### Context
The application uses Vuex 4, which is in maintenance mode. All store actions type their context as `{ commit }: any`, defeating TypeScript safety. The `RootState` interface is incomplete, and mutations/namespacing add boilerplate.

### Decision
Migrate to Pinia (official Vue 3 state management library).

### Options Considered
1. **Migrate to Pinia** - Official recommendation, first-class TypeScript, simpler API, no mutation/namespace boilerplate. 3-day estimated migration.
2. **Stay on Vuex 4** - No migration cost, but maintenance mode and persistent type-safety debt.

### Rationale
Jör accepted the migration. Pinia is the officially recommended state management for Vue 3 and eliminates the `any`-type and RootState debt structurally.

### Consequences
- 3-day migration effort (branch `feature/migrate-to-pinia`)
- All store modules rewritten; components updated to Pinia store syntax
- Signature improvement for the type system (gain)

### Decided By
Jör, 2026-08-28 (accepted via direct response to PD-001)

---

### ADR-002: Migrate build tool from Vue CLI to Vite

**Status:** ACCEPTED

### Context
The project uses Vue CLI 5, which is officially in maintenance mode. The Vite ecosystem is the de facto standard for Vue 3.

### Decision
Migrate from Vue CLI to Vite.

### Options Considered
1. **Migrate to Vite** - ~10x faster dev server, ~3x faster production builds, native ESM, aligns with modern tooling ecosystem. 2-day estimated migration.
2. **Stay on Vue CLI** - Works today, but diminishing support and incompatible with new tooling.

### Rationale
Jör accepted the migration. Vue CLI is actively being phased out.

### Consequences
- 2-day migration effort (branch `feature/migrate-to-vite`)
- Env variable format changes: `process.env.VUE_APP_*` -> `import.meta.env.VITE_*`
- Existing `.env` variables must be renamed (VITE_ prefix required by Vite)
- vue.config.js replaced by vite.config.ts

### Decided By
Jör, 2026-08-28 (accepted via direct response to PD-002)

---

## Pending Decisions (awaiting Jör's input)

> PD-001 and PD-002 have been resolved (see ADR-001, ADR-002 above).

### PD-003: SEO Strategy - SPA vs SSR/SSG
| Field | Value |
|-------|-------|
| **Proposed By** | Broker |
| **Date** | 2026-08-28 |
| **Linked** | EST-L07 |

**Options:**

1. **SPA + meta tags (vue-meta/useHead)** (RECOMMENDED)
   - Cheap, keeps current architecture
   - Good enough for app that's behind auth or internal
2. **Migrate to Nuxt 3**
   - True SSR/SSG, best SEO
   - Major rewrite, weeks of work
   - Overkill unless SEO is a core requirement

### PD-004: Forms - Native HTML vs Validation Library
| Field | Value |
|-------|-------|
| **Proposed By** | Broker |
| **Date** | 2026-08-28 |

**Options:**

1. **VeeValidate + Yup** (RECOMMENDED)
   - Schema-based, type-safe, i18n-friendly
   - Well-maintained, works with Composition API
2. **Zod + custom composable**
   - Zod is excellent but needs manual wiring
3. **Keep native validation**
   - Zero deps, but no async validation, no i18n error messages

### ADR-003: Sequencing - Pinia before Vite

**Status:** ACCEPTED

**Context:**
W2 contains two platform migrations approved separately: ADR-001 (Vuex → Pinia) and ADR-002 (Vue CLI → Vite). Both are large. RULE 3A (small PRs) requires one-platform-change-per-PR.

**Options considered:**
1. **Pinia first** (RECOMMENDED)
   - Pinia swap is runtime-only: the webpack build and the jest test infra we fixed in W1 stay untouched, so behavior is proven by the same 8 guard tests.
   - Review surface: store + rewired components only. Verifiable on its own.
2. **Vite first**
   - Touches build tooling + test infrastructure (config, index.html, scripts, test runner) at the same time the store still needs swapping — two big unknowns in one PR.
3. **Both in one PR**
   - Violates RULE 3A; impossible to bisect a regression.

**Decision:** Pinia first (`refactor/pinia-migration`), then Vite (`refactor/vite-migration`) as its own spec + PR.

**Rationale:** "one platform change per PR". Pinia keeps the current proven toolchain; Vite is the riskier platform change and lands after the store is already green on Pinia.

**Consequences:**
- Two sequential reviews instead of one big one (slower wall-clock, better review quality).
- On the Pinia PR, `jest.config.js` and build tooling must NOT be touched (enforced by SPEC-P2-01 out-of-scope).

---

### ADR-004: Mock Alegra invoice creation instead of calling the real endpoint

**Status:** ACCEPTED

### Context
The Alegra account behind this project is a free/trial plan. `POST /invoices` is not available on that plan, so every invoice submission at the end of the contest flow fails with an auth/plan error, and the flow dead-ends (there was also no success UI even in a hypothetical working case — a separate pre-existing gap). Jör confirmed this project will remain on the free plan indefinitely (portfolio/practice use, not a paying account), so the endpoint will never succeed as-is.

### Decision
Stop calling `POST /invoices`. `apiService.createInvoice()` generates a realistic-looking fake invoice (id + formatted number) client-side and returns it in the same shape as a real response. A new `InvoiceSuccessModal.vue` confirms it to the user. The behavior is gated by `VITE_ALEGRA_MOCK_INVOICES` (default `true`) so the real call is one env-var flip away if the plan is ever upgraded. No mock invoice is persisted anywhere.

### Options Considered
1. **Hard mock, no toggle** - Simplest; always fabricate success. No path back to the real endpoint without a code change.
2. **Env-gated mock** (CHOSEN) - Same UX today; flipping `VITE_ALEGRA_MOCK_INVOICES=false` restores the real call with no other code change, at effectively zero extra cost.
3. **Honest fallback (no mock)** - Catch the plan error and tell the user invoicing isn't available on this plan, without implying success. Most transparent, but doesn't give the "it works" feeling Jör wants for a portfolio demo.
4. **Upgrade the Alegra plan** - Removes the problem at the root, but is a recurring cost Jör has ruled out; not a code decision.

### Rationale
Jör chose the mock approach (option 2, effectively option 1 with a free toggle added) explicitly because this project will never be a paying Alegra account: "I won't ever pay [for the] pro plan, it's just for my portfolio and practicing." The env flag costs nothing extra to add and keeps a clean exit path if that ever changes.

### Consequences
- A real client would see a "success" confirmation for an invoice that does not exist in Alegra. Accepted: this is a demo/practice app, not a live billing system, and Jör was told this trade-off directly before approving.
- `GET /sellers` is unaffected — that endpoint already works on the free plan.
- Any future work that needs a *real* invoice again only requires flipping the existing env flag — no re-implementation.

### Decided By
Jör, 2026-09-04 (approved in chat: "do it")

<!--
Template for new ADRs - to be copied by Broker:

## ADR-001: {Short Title}

**Status:** PROPOSED

### Context
...

### Decision
...

### Options Considered
...

### Rationale
...

### Consequences
...

### Decided By
...
-->