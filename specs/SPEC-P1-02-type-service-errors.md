# SPEC-P1-02: Type Service Error Handling

| Field | Value |
|-------|-------|
| **Status** | IMPLEMENTED (merged to staging via PR #23, 2026-08-28) |
| **Topic** | Remove `any` from service-layer error handlers (single topic: finish the W1 type-safety goal in the services layer) |
| **Estimate** | 0.5h |
| **Branch** | `refactor/type-service-errors` |
| **Proposal** | PROPOSAL-2026-003 |

## 1. Context

W1 (EST-H03) eliminated `any` from the store actions. Three `catch (error: any)` blocks remain in the services layer and are the last three `npm run lint` warnings in the codebase (`@typescript-eslint/no-explicit-any`). They use the same pattern the store actions had: reaching into `error.response?.data?.message`. This spec types them the same way, making lint clean.

## 2. Topic & Scope

- **Topic:** type the service-layer error handlers. Nothing else.

**In scope:**
- `src/services/apiService.ts`: `getSellers` catch + `createInvoice` catch
- `src/services/apiImagesService.ts`: `getImagesList` catch

**Out of scope (forbidden in this branch):**
- Changing error *behavior* (messages, re-throws, toast calls stay exactly as-is)
- Touching store actions, views, or components
- CI, Vite, Pinia, or any feature work
- Adding tests for services (would require mocking HTTP layer — own topic)

## 3. Design Patterns

| Pattern | Where applied | Why this pattern |
|---------|---------------|------------------|
| Type narrowing | `catch (error)` + `instanceof AxiosError` / `instanceof Error` | the only type-safe way to read fields from an `unknown` error; same pattern already proven in W1 store actions |

## 4. SOLID

- **S** — Single Responsibility: each catch does exactly one job (narrow, pick message, toast, re-throw). No behavior added.
- **D** — Dependency Inversion: unchanged — services still own error translation; nothing new depends on axios error shape beyond the existing narrowing.
- O / L / I : not exercised by a type-only change.

## 5. Architecture & Why

- Services keep owning their error handling (Repository layer responsibility). Store actions already re-commit their own failure state from the re-thrown `Error`.
- `unknown` + narrowing instead of `any` because `any` silently disables type-checking on the error object and hides undefined-access bugs; the narrowing only compiles to runtime `instanceof` checks — TS 4.5 + axios 1.x support it (already used in `src/store/modules/*/actions.ts`).

## 6. Future Avoid

- [x] `any` in catch handlers — banned; must be `unknown` + narrowing
- [x] Silent `// eslint-disable` comments to mask warnings — banned
- [x] Behavior changes smuggled into a type-only PR (double toast, new messages) — banned
- [x] Addressing the double-toast behavior (service toast + store toast) on this branch — deferred to its own topic

## 7. Acceptance Criteria

- [ ] `npm run lint` shows zero warnings in `src/services/**` (grep `error: any` in `src/services/`: 0 matches). Full-repo-zero lint is achieved once W1 merges (store actions carried by `refactor/w1-foundation`)
- [ ] `npm run build` exits 0
- [ ] Runtime behavior identical: same error messages, same re-throw, same toast calls
- [ ] Touched files: exactly `src/services/apiService.ts`, `src/services/apiImagesService.ts`, `specs/SPEC-P1-02-*.md`, `CHANGELOG-PROPOSALS.md`
- [ ] 1 task = 1 PR ≤ 8 files (satisfies RULE 3A)

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Non-Axios, non-Error throwables produce fallback message | Very low | Low | fallback string identical to current behavior; only shape changes |
| `error.response?.data?.message` is `any` → warning resurfaces | Low | Low | none: it is *implicit* any from axios typing, not an explicit annotation; verified pre-existing store pattern lints clean |

## 9. Testing Strategy

- `npm run lint` (+ targeted `Select-String` greps for `: any` in `src/services/`)
- `npm run build`
- Manual: `npm run serve` smoke check unchanged behavior

## 10. Estimate & Dependencies

- **Estimate:** 0.5h
- **Dependencies:** W1 merged or not — this branch does not conflict with `refactor/w1-foundation` (services files untouched there); safe to review in parallel.
- **Branch:** `refactor/type-service-errors`

---

## Approval

- **Jör Approved:** (pending)
- **Status:** DRAFT — await PR review on GitHub