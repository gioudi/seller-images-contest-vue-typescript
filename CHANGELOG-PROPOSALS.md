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
PENDING

### Approval
- **Jör Approved:** (pending)

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
PENDING

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