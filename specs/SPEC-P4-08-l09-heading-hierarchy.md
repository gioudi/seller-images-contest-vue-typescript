# SPEC-P4-08: EST-L09 Heading Hierarchy + L10/L11 Status Synchronization

| Field | Value |
|-------|-------|
| **Status** | IMPLEMENTED (merged via PR #45) |
| **Topic** | Fix the heading-hierarchy inconsistency flagged by the ADS (2.4.6) and synchronize the EST backlog: normalize page-title visual levels (EST-L09) and mark EST-L10/L11 as MET (already satisfied by the current toolchain). |
| **Estimate** | 1h (L09: 0.33h, L10/L11 sync: 0.33h, docs: 0.33h) |
| **Branch** | `fix/l09-heading-hierarchy` |
| **Proposal** | PROPOSAL-2026-021 |
| **ADS Reference** | Section 10.1 (WCAG 2.1 — 2.4.6 Headings), EST-L09 / L10 / L11 |

## 1. Context

The ADS flags a heading-hierarchy inconsistency: "Heading hierarchy jumps (h3 -> h5 -> h4) across views" (Section 10.1, criterion **2.4.6 Headings**) and recommends "Use semantic heading hierarchy (h1 -> h2 -> h3, no skips)" (Section 10.3.9). EST-L09 is the task scoped to fix it.

Auditing the current templates (all `<h1>`–`<h6>` across `src/`) shows:

- The **semantic** hierarchy is already correct: each page renders exactly one `<h1>` (the page title), and nested components render `<h2>` (`WinnerModal`, `SellerCard`) in correct DOM order under that `<h1>` — no level is skipped in any single page outline.
- The inconsistency the ADS refers to is **visual**: the page-title `<h1>` elements carry Bootstrap display classes that render at different sizes — `LandingPage` stamped its main title as `h3` while `ImageList` and `InvoiceForm` stamped theirs as `h5`. The page's primary heading therefore looked "big" on one view and "small" on others, contradicting the uniform importance of a page `<h1>`.

Separately, the remaining "upgrade" backlog items are already satisfied by the merged foundation work: the toolchain runs **TypeScript 5.9.3**, **ESLint 9 (flat config)**, and **Prettier 3.9.6** (installed/resolved). EST-L10 ("Upgrade TypeScript to 5.x") and EST-L11 ("Upgrade ESLint + Prettier") are therefore **already met**; there is no code change left to make for them — only a backlog-status update so the estimate table reflects reality.

## 2. Topic & Scope

- **Topic:** (a) normalize the visual level of the page-title `<h1>` across views (EST-L09), and (b) mark EST-L10/L11 as MET in `ESTIMATIONS-AND-RESOLUTIONS.md`.

**In scope:**
- `src/views/ImageList.vue`, `src/views/InvoiceForm.vue` — change the page `<h1>` class from `h5` to `h3` so all three views render the primary heading at a consistent, prominent `h3` level (LandingPage already uses `h3`)
- `ESTIMATIONS-AND-RESOLUTIONS.md` — add a `Status: MET` field to EST-L10 (TS 5.x) and EST-L11 (ESLint/Prettier) with the reason (already satisfied via SPEC-P3-06 / SPEC-P3-07)

**Explicitly out of scope (forbidden in this branch):**
- Changing the semantic heading *tags* or nesting (they are already correct; do not touch `<h1>`/`<h2>` elements' semantics)
- Re-styling beyond the Bootstrap display-class normalization (no color/typography/SCSS/global style changes)
- Any behavior, logic, or script changes
- Implementing the other a11y ADS items (skip-link, focus trap, ARIA on vote button, alt text, contrast) — those are separate EST items / future PRs
- Re-doing the TS/ESLint/Prettier upgrades themselves (already met)

## 3. Design in plain words

Every page opens with a main title — an `<h1>`. Search-engine bots and screen readers read that title to understand "what is this page about," so it must look and read like *the* main heading, consistently on every view. Right now the underlying `<h1>` was right but it was dressed in two different visual sizes (`h5` on two views, `h3` on one), so the pages felt inconsistent. This step dresses all three main titles in the same `h3` look — one title, one level, one size — while leaving the underlying semantic structure untouched.

The second half is housekeeping: the "upgrade" tasks (L10 TypeScript, L11 ESLint/Prettier) were actually completed during the earlier foundation work. We annotate them as **MET** so the backlog stops asking for work that is already done.

## 4. The five design principles, in plain words

- **S — one job per heading.** Each heading keeps its single semantic job (the page's `<h1>` is the page's `<h1>`); this change only makes the visual size uniform.
- **O — easy to grow.** New views copy the same `h3` display class for their `<h1>`, keeping the pattern consistent.
- **L — interchangeable.** Visual display classes (`h3`/`h5`) are independent of semantic tags; changing the look does not change meaning.
- **I — only what's needed.** We normalize exactly the three page-title elements; nested `<h2>`s and the navbar brand are untouched.
- **D — one source of truth.** The EST backlog (ESTIMATIONS-AND-RESOLUTIONS.md) now states L10/L11 are MET, consistent with the actual installed tooling.

## 5. Where things live and why

```
src/views/LandingPage.vue    <h1 class="h3 …">Descubre Imágenes que Inspiran</h1>   (unchanged — already h3)
src/views/ImageList.vue      <h1 class="h5 …">  →  <h1 class="h3 …">Lista de Imágenes…   (normalized)
src/views/InvoiceForm.vue    <h1 class="h5 …">  →  <h1 class="h3 …">Crear factura…      (normalized)
ESTIMATIONS-AND-RESOLUTIONS.md  EST-L10 → Status: MET   EST-L11 → Status: MET
```

Why `h3` as the common level: it is the existing prominent title size already chosen for the landing page, fits the app's layout, and reads as the primary heading on all views without overflow.

## 6. Rules going forward

- [ ] Every view's page-title `<h1>` uses the same display class (`h3`) — no per-view divergence
- [ ] Semantic heading tags (one `<h1>` per page, then `<h2>`/`<h3>` without skips) must not regress
- [ ] Keep `ESTIMATIONS-AND-RESOLUTIONS.md` statuses in sync with reality (MET items are not re-implemented)

## 7. Acceptance Criteria

- [ ] `ImageList.vue` and `InvoiceForm.vue` `<h1>` use `class="h3 …"` (LandingPage already `h3`) — all three page titles visually consistent
- [ ] The semantic heading structure is unchanged (still exactly one `<h1>` per view; `<h2>` only in `WinnerModal`/`SellerCard`)
- [ ] `ESTIMATIONS-AND-RESOLUTIONS.md` EST-L10 and EST-L11 carry a `Status: MET` field with the reason
- [ ] `npm run lint`, `npm run type-check`, `npm run test:unit`, `npm run build` all exit 0
- [ ] Touched files: `src/views/ImageList.vue`, `src/views/InvoiceForm.vue`, `ESTIMATIONS-AND-RESOLUTIONS.md`, `specs/SPEC-P4-08-*.md`, `CHANGELOG-PROPOSALS.md`

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Improving title size causes overflow on small screens | Low | Low | `h3` is a moderate size; verified by build + existing responsive classes; no test expects old size |
| Someone misreads this as re-styling the design | Medium | Low | scope explicitly limited to the Bootstrap display-class normalization |
| L10/L11 marked MET incorrectly (versions regressed) | Low | Medium | verified at author time: TS 5.9.3, ESLint 9.39.5, Prettier 3.9.6 installed |

## 9. Testing Strategy

- `npm run lint`, `npm run type-check`, `npm run test:unit` (no test asserts heading classes — verified), `npm run build`
- Visual/logical check: grep confirms all three view `<h1>` use `h3`

## 10. Estimate & Dependencies

- **Estimate:** 1h
- **Dependencies:** none; TS/ESLint/Prettier versions already current
- **Branch:** `fix/l09-heading-hierarchy`

---

## Approval

- **Jör Approved:** yes (merged via PR #45)
- **Status:** IMPLEMENTED — merged to `staging`; page-title `<h1>` normalized to `h3`, EST-L10/L11 marked MET