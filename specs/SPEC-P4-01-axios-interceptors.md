# SPEC-P4-01: Axios Interceptors & Timeout

| Field | Value |
|-------|-------|
| **Status** | APPROVED (Jör, 2026-09-02) |
| **Topic** | Centralize Alegra HTTP error handling and add a timeout (single topic: service-layer resilience for the Alegra API) |
| **Estimate** | 3h |
| **Branch** | `feature/axios-interceptors` |
| **Proposal** | PROPOSAL-2026-014 |
| **ADS Reference** | Section 4.2, 12.2 |

## 1. Context

The Alegra Axios client in `src/services/apiService.ts` has no timeout, so a slow or hung request keeps the UI in a loading state indefinitely with no feedback to the user. Error handling is duplicated across layers: `apiService` shows a toast and re-throws, and the `sellersStore` catch shows a *second* toast — a visible double-toast on any sellers failure. `apiImagesService` (Unsplash) handles its own errors correctly and must keep doing so.

## 2. Topic & Scope

- **Topic:** make the Alegra HTTP layer resilient (timeout + single-point error normalization). Nothing else.

**In scope:**
- `src/services/axiosClient.ts` (new): one shared Axios instance with a `timeout` and a response interceptor that normalizes errors and shows a single toast.
- `src/services/apiService.ts`: consume `axiosClient`, drop per-call toast/error duplication.
- `src/stores/sellersStore.ts`: remove the now-redundant toast (interceptor handles it) — fixes the double-toast.
- `src/utils/getErrorMessage.ts`: add a friendly timeout message.
- `src/config/index.ts`: add `API.TIMEOUT_MS`.

**Out of scope (forbidden in this branch):**
- Image/Unsplash fetch flow — already resilient via Fallback URL; the unsplash-js SDK is not an Axios client and is untouched.
- Invoice success/failure state transitions; contest logic; any feature work.
- CI, a11y, i18n, theme.
- Mocking HTTP in tests (own topic).

## 3. Design Patterns

| Pattern | Where applied | Why this pattern |
|---------|---------------|------------------|
| Interceptor (Middleware) | `axiosClient.ts` response interceptor | single choke point to normalize every Alegra error, centralizing toast display (EST-M07 requires centralizing error handling) |
| Repository / Facade | `apiService.ts` exposes `getSellers`/`createInvoice` over the shared client | keeps data access isolated and call sites unchanged |
| Magic-number constant | `API.TIMEOUT_MS` in `src/config/index.ts` | removes the timeout magic number (ADS Section 15) |

## 4. SOLID

- **S** — Single Responsibility: `axiosClient` owns client creation + error normalization; `apiService` only maps endpoints; stores own their own state.
- **O** — Open/Closed: adding endpoints later means adding a method to `apiService`, not modifying the client or interceptor.
- **D** — Dependency Inversion: stores depend on the service boundary / shared client, not on raw axios error shapes; the interceptor converts any axios error into a normalized `Error`.
- O / L / I : Liskov (no subtype hierarchy) and Interface Segregation (services already expose narrow method signatures) are already satisfied; not new exercise here.

## 5. Architecture & Why

```
Layer:            Files:                          Owned by:
Config            src/config/index.ts             constants only, never imports other layers
Services          src/services/axiosClient.ts     client + error interceptor (only HTTP knowledge)
Services          src/services/apiService.ts      endpoint mapping, no error logic
Store (Pinia)     src/stores/sellersStore.ts      state + resets, receives normalized Error
Utils             src/utils/getErrorMessage.ts    error → friendly message
```

Why this shape:
- A single `axiosClient` means the timeout and auth header are configured once and reused by every endpoint; error normalization happens exactly once, so there is no per-call duplication and no double-toast.
- The interceptor rejects with `new Error(message)`, so store catches receive a plain `Error` whose `.message` is already the user-friendly text — `getErrorMessage` still narrows correctly (its `instanceof Error` branch returns the same message).

## 6. Future Avoid

- [x] Per-call try/catch that both toasts and translates — banned; the interceptor is the single place
- [x] Duplicate toasts for the same failure — banned
- [x] Timeout as a magic number in services — banned; use `API.TIMEOUT_MS`
- [x] Mixing Unsplash (unsplash-js) into the Alegra axios client — banned; two distinct HTTP stacks by design
- [x] Adding unrelated topics (i18n, themes, CI) to this branch

## 7. Acceptance Criteria

- [ ] `npm run lint` exits 0 (zero warnings/errors)
- [ ] `npm run test:unit` passes (23/23)
- [ ] `npm run build` exits 0
- [ ] One failure on `getSellers`/`createInvoice` produces exactly one toast (no double-toast)
- [ ] A request that exceeds 10s aborts with: friendly message "La solicitud tardó demasiado. Inténtalo de nuevo." and `loading` returns to `false`
- [ ] Unsplash image fetch behavior unchanged (still falls back to `IMAGES.FALLBACK_URL`)
- [ ] Touched files: `src/services/axiosClient.ts`, `src/services/apiService.ts`, `src/stores/sellersStore.ts`, `src/utils/getErrorMessage.ts`, `src/config/index.ts`, `specs/SPEC-P4-01-*.md`, `CHANGELOG-PROPOSALS.md`

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Synonym timeout message differs from existing UX tone | Low | Low | reuses the Spanish static-UI style already present; can be reworded later as its own string topic |
| Interceptor rejects a non-Error → store handles fallback text | Low | Low | `getErrorMessage` narrows `instanceof Error`; fallback text preserved |
| Double-toast removal changes visible behavior | Medium (was a real bug) | Low | intended fix; verified by the acceptance criterion for a single toast |
| Long timeout (10s) still leaves a gap | Medium | Low | timeout is a deliberate trade-off (Alegra can be slow); documented; value lives in `config` for tuning |

## 9. Testing Strategy

- `npm run lint`, `npm run test:unit`, `npm run build`
- Manual: trigger a failing request (bad key / unreachable base URL) and confirm exactly one toast + `loading` resets; rely on the 10s client timeout for the timeout path
- No new unit tests: services would require HTTP mocking — explicitly out of scope (own topic)

## 10. Estimate & Dependencies

- **Estimate:** 3h (client+interceptor 1.5h, service/store rewire 0.5h, message+config 0.5h, verify+docs 0.5h)
- **Dependencies:** EST-M07 is the last P2-quality item; no upstream dependency besides the already-merged modern stack (ESLint 9 type-aware rules active on merged `staging`)
- **Branch:** `feature/axios-interceptors`

---

## Approval

- **Jör Approved:** 2026-09-02, approved verbally in review
- **Status:** APPROVED → implementation underway on `feature/axios-interceptors`