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