# SPEC-P4-09: Mock Alegra Invoice Creation (Free-Plan Workaround)

| Field | Value |
|-------|-------|
| **Status** | IMPLEMENTED locally (lint + type-check verified; test/build pending Jör's local run — see §7) |
| **Topic** | Alegra's free/trial plan does not include access to `POST /invoices`, so the last step of the contest flow (winner → invoice) fails with an auth/plan error. Stop calling that endpoint and simulate a successful invoice client-side instead, with a confirmation popup. |
| **Estimate** | 2h (mock generator + service branch 0.5h, success modal + wiring 0.75h, i18n 0.25h, tests + docs 0.5h) |
| **Branch** | `fix/mock-invoice-creation` |
| **Proposal** | PROPOSAL-2026-023 |
| **ADS Reference** | Section on `InvoiceForm.vue` findings: "No success handling" (pre-existing gap, line ~607) — no prior ADS section anticipated the Alegra plan limitation; this is a newly discovered operational constraint, not a documented risk. |

## 1. Context

Once a winner is chosen, the app routes the user to `InvoiceForm.vue`. On submit, `useInvoices().submit()` → `invoicesStore.handleCreateInvoice()` → `apiService.createInvoice()` sends a real `POST /invoices` to Alegra with the account's API key.

The Alegra account behind this project is a free/trial plan, and that plan does not include the invoices endpoint. Every submission comes back as an auth/plan error, which the shared axios interceptor (`SPEC-P4-01`) correctly surfaces as a toast — but the flow simply dead-ends there. Jör has confirmed this project will stay on the free plan indefinitely (it's a portfolio/practice app, not a paying account), so this is not a transient bug to retry — the endpoint will never succeed under the current plan.

Separately, the ADS already flagged that `InvoiceForm.vue` has **no success handling at all** — even a hypothetical successful Alegra response produces no confirmation UI today. Both problems are fixed together here since they're the same user-facing moment (submit → some kind of outcome).

## 2. Topic & Scope

- **Topic:** stop calling the unavailable Alegra `/invoices` endpoint; simulate a successful invoice locally and confirm it to the user with a popup.

**In scope:**
- `src/services/apiService.ts` — `createInvoice()` returns a locally generated invoice instead of calling `axiosClient` when mocking is enabled.
- `src/utils/generateMockInvoice.ts` (new) — pure function that builds a fake `InvoiceResponse` (id + human-readable invoice number) from the form payload.
- `src/stores/invoices/types/index.ts` — `InvoiceResponse` gains a `number: string` field (the display-friendly invoice number).
- `src/composables/useInvoices.ts` — `submit()` returns the created invoice (or `null` on failure) so the view can show it.
- `src/components/InvoiceSuccessModal.vue` (new) — confirmation popup: invoice number, date, total; a "back to home" action.
- `src/views/InvoiceForm.vue` — show the modal on success; route back to `LandingPage` when the user continues.
- `src/config/index.ts` — `ALEGRA.MOCK_INVOICE_PREFIX` constant (no magic strings).
- `.env.example` / `.env` — `VITE_ALEGRA_MOCK_INVOICES` (defaults to `true`; set to `false` to restore the real Alegra call, e.g. if the plan is ever upgraded).
- `src/i18n/{es,en,de}.json` — new `invoice.success*` strings.

**Explicitly out of scope (forbidden in this branch):**
- Persisting mock invoices anywhere (no localStorage log, no backend) — the popup is the only record, by Jör's decision.
- Touching `GET /sellers` — that endpoint works today on the free plan and is untouched.
- Any other Alegra endpoint, auth flow, or the axios client/interceptor itself (`SPEC-P4-01` stays as-is).
- Redesigning the invoice form fields or validation.
- Re-adding a real invoice path — that only happens if/when the plan changes, via the existing env flag, not in this branch.

## 3. Design in plain words

Right now, clicking "create invoice" sends a real request to an outside service (Alegra) that this project's free account isn't allowed to use, so it always comes back as an error — the user just sees a failure message and nothing else happens.

Instead of asking that outside service for an invoice, the app now makes up a realistic-looking one itself: a made-up invoice number, today's date, and the total from the form. Nothing leaves the browser. The user then sees a clear "your invoice was created" popup with those details, and a button to go back to the start — the same feeling of success as if a real invoice had been created, without depending on a plan feature this account will never have.

This is controlled by a single on/off switch (an environment variable). If the Alegra plan is ever upgraded, flipping that one switch is enough to make the app call the real endpoint again — nothing else has to change.

## 4. The five design principles, in plain words

- **S — one job each.** `generateMockInvoice.ts` only builds a fake invoice; `apiService` only decides mock-vs-real and shapes the endpoint call; `InvoiceSuccessModal.vue` only displays the result. None of them do each other's job.
- **O — easy to extend.** Turning mocking off is a single environment variable, not a code change. Adding a real invoice-detail field later (e.g. a tax breakdown) means extending the generator, not rewriting the flow.
- **L — interchangeable.** Whether `createInvoice()` runs the mock path or the real Alegra call, it returns the same `InvoiceResponse` shape — nothing downstream (the store, the modal) needs to know which one ran.
- **I — minimal surface.** The modal only receives the three fields it displays (number, date, total) — not the whole payload or store internals.
- **D — one source of truth.** The mock/real switch and the invoice-number format both live in one place (`.env` and `config/index.ts`), not scattered across files.

## 4b. Technical patterns

- **Strategy-by-flag** — `apiService.createInvoice()` picks between two interchangeable implementations (mock vs. real HTTP call) behind one boolean, without the caller knowing which ran.
- **Pure function** — `generateMockInvoice()` takes inputs, returns a value, touches nothing external; trivially unit-testable and safe to call from anywhere.
- **Modal pattern** (already established by `WinnerModal.vue`) — `InvoiceSuccessModal.vue` reuses the same `alegra-modal` / `alegra-modal-content` structure and `role="dialog"` accessibility markup, so this introduces no new modal pattern.

## 5. Where things live and why

```
src/utils/generateMockInvoice.ts     ← NEW: pure fake-invoice builder (id, number)
src/services/apiService.ts           ← createInvoice(): mock branch guarded by env flag
src/stores/invoices/types/index.ts   ← InvoiceResponse gains `number: string`
src/composables/useInvoices.ts       ← submit() now returns the created invoice (or null)
src/components/InvoiceSuccessModal.vue ← NEW: confirmation popup (mirrors WinnerModal.vue)
src/views/InvoiceForm.vue            ← shows the modal on success, routes home on continue
src/config/index.ts                  ← ALEGRA.MOCK_INVOICE_PREFIX (no magic strings)
.env.example                          ← VITE_ALEGRA_MOCK_INVOICES=true (documented)
src/i18n/{es,en,de}.json             ← invoice.success* strings
```

Why here: this follows the same layering already used for the axios/error work (`SPEC-P4-01`) — services stay the only place that knows about HTTP vs. not, config stays the only place with tunable constants, and the modal reuses `WinnerModal.vue`'s established shape rather than inventing a new one.

## 6. Rules going forward

- [ ] The real Alegra `/invoices` call is never deleted — only bypassed behind `VITE_ALEGRA_MOCK_INVOICES`. Removing the real path entirely requires its own proposal.
- [ ] No mock invoice is ever persisted (no localStorage, no backend write) unless a future proposal explicitly asks for it.
- [ ] Any new visible string for the success popup goes into all three locale files — no hardcoded UI text.
- [ ] `InvoiceResponse`'s shape stays identical whether it came from the mock or the real endpoint — callers must never branch on which one ran.

## 7. Acceptance Criteria

- [x] Submitting the invoice form never calls Alegra's `/invoices` endpoint while `VITE_ALEGRA_MOCK_INVOICES=true` (default) — covered by `apiService.spec.ts`
- [x] `GET /sellers` still calls the real Alegra endpoint, unchanged — covered by `apiService.spec.ts`
- [x] On submit, a popup appears showing a generated invoice number, the date, and the total — `InvoiceSuccessModal.vue` wired into `InvoiceForm.vue`
- [x] "Back to home" on the popup returns the user to `LandingPage` — `handleSuccessContinue` in `InvoiceForm.vue`
- [ ] Setting `VITE_ALEGRA_MOCK_INVOICES=false` restores the real `POST /invoices` call — not yet manually verified
- [x] `npm run lint` exits 0 (verified in this session)
- [x] `npm run type-check` exits 0 (verified in this session)
- [ ] `npm run test:unit` exits 0 — **could not be verified in this session**: the sandboxed device shell used to run these commands hit a 403 from a network proxy fetching `@rolldown/binding-linux-x64-gnu` (a native dependency of `vitest`/`vite` 8), reproducible on a clean `staging` checkout before any of these changes — not caused by this branch. Needs a run in Jör's own terminal.
- [ ] `npm run build` exits 0 — same blocker as above, unverified in this session
- [x] Touched files: `src/utils/generateMockInvoice.ts`, `src/services/apiService.ts`, `src/stores/invoices/types/index.ts`, `src/composables/useInvoices.ts`, `src/components/InvoiceSuccessModal.vue`, `src/views/InvoiceForm.vue`, `src/config/index.ts`, `.env.example`, `.env`, `src/i18n/{es,en,de}.json`, `tests/unit/utils/generateMockInvoice.spec.ts`, `tests/unit/services/apiService.spec.ts`, `specs/SPEC-P4-09-*.md`, `CHANGELOG-PROPOSALS.md`, `DECISIONS.md`

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| A real client believes a genuine Alegra invoice was issued | Medium | Medium | Accepted by Jör: this is a portfolio/practice project on a free plan that will never be upgraded, not a live billing system |
| Someone flips `VITE_ALEGRA_MOCK_INVOICES=false` without an active paid plan and reintroduces the original error | Low | Low | Documented in `.env.example`; default stays `true` |
| Generated invoice number collides or looks fake to a reviewer | Low | Low | Number derives from a timestamp, unique per submission, formatted like a real invoice ID |
| Modal styling diverges from `WinnerModal.vue` | Low | Low | Reuses the same `alegra-modal` SCSS mixin and dialog markup |

## 9. Testing Strategy

- `npm run lint`, `npm run type-check`, `npm run test:unit`, `npm run build`
- New unit test: `generateMockInvoice()` returns a stable shape for a given payload/timestamp
- New unit test: `apiService.createInvoice()` does not call `axiosClient` when mocking is enabled
- Manual: submit the invoice form in `npm run dev`, confirm the popup appears with a number/date/total and "back to home" navigates correctly

## 10. Estimate & Dependencies

- **Estimate:** 2h (generator + service branch 0.5h, modal + wiring 0.75h, i18n 0.25h, tests + docs 0.5h)
- **Dependencies:** builds on the axios/error-handling layer from `SPEC-P4-01` (already merged); no other upstream dependency
- **Branch:** `fix/mock-invoice-creation`

---

## Approval

- **Jör Approved:** 2026-09-04, in chat ("do it")
- **Status:** IMPLEMENTED locally on `fix/mock-invoice-creation`, pending Jör's local `test:unit`/`build` verification and push/PR (see §7)
