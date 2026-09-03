# SPEC-P4-03: GitHub Actions CI Pipeline

| Field | Value |
|-------|-------|
| **Status** | DRAFT (awaiting PR review) |
| **Topic** | Add a GitHub Actions workflow running lint, type-check, unit tests, and build on every PR/merge (single topic: CI pipeline) |
| **Estimate** | 3h |
| **Branch** | `feature/ci-pipeline` |
| **Proposal** | PROPOSAL-2026-016 |
| **ADS Reference** | Section 11.2 |
| **EST Reference** | EST-L02 |

## 1. Context

The repo has no automation between local checks and a merge. Every PR depends on the human reviewer (Jör) running `lint`, `test:unit`, and `build` manually — which is exactly how the `$router` test regression slipped through in EST-M03 (test suite was red on the branch before the test was updated). There is also a latent type error: `tsc --noEmit` reported 2 errors in `tests/unit/composables/useContest.spec.ts` that `vite build` (esbuild) does not surface, so the repo could pass `build` while failing a strict type-check. EST-L02 adds a GitHub Actions workflow so lint + type-check + tests + build run automatically and block the merge.

## 2. Topic & Scope

- **Topic:** add a CI pipeline that runs the project's own check scripts on every push/PR to `staging`/`main`.

**In scope:**
- `.github/workflows/ci.yml` — one job running the four checks in order: `npm run lint`, `npm run type-check`, `npm run test:unit`, `npm run build`
- `package.json` — add a `type-check` script (`tsc --noEmit`) so the workflow and developers share one command
- `tests/unit/composables/useContest.spec.ts` — fix the 2 pre-existing type errors so the new `type-check` step (and thus CI) starts green; the type-check job would otherwise fail from day one. Companion fix required by the acceptance criterion "type-check exits 0".

**Out of scope (forbidden in this branch):**
- Husky / lint-staged pre-commit hooks (EST-L01 — separate topic)
- Env-secret provisioning or deploy steps (the existing Netlify deploy is its own platform/PR)
- Migrating PRs from manual links to `gh` automation
- Any UI/UX or feature work
- Removing unused dependencies (EST-M09)

## 3. Design Patterns

| Pattern | Where applied | Why this pattern |
|---------|---------------|------------------|
| CI/CD pipeline (continuous verification) | `.github/workflows/ci.yml` | run the same verified checks automatically on every push/PR and gate the merge; single source of truth shared with local `package.json` scripts |
| DTO / factory fixture | `makeImage()` helper in `tests/unit/composables/useContest.spec.ts` | produce a minimal valid `Image` for tests without hand-writing 15 required fields per fixture, and to satisfy strict typing |

## 4. SOLID

- **S** — Single Responsibility: the workflow has exactly one job with one responsibility (verify `src`/`tests` compile, lint, and build); each step maps 1:1 to a `package.json` script.
- **O** — Open/Closed: adding future checks means adding one step/script without altering existing ones.
- **D** — Dependency Inversion: the workflow invokes `npm run *` scripts (a stable interface) rather than hard-coding tool invocations, so versions/locale stay consistent with the repo's own config.
- O / L / I : not applied — config-only change.

## 5. Architecture & Why

```
Trigger: push/PR → staging, main
Job:    npm ci → lint → type-check → test:unit → build
Command sources: package.json scripts (lint, type-check, test:unit, build)
```

Why this shape:
- One job keeps the workflow minimal and the failure fast (fail-fast on the first failing step).
- `npm ci` (not `npm install`) installs exactly from the lockfile, so CI always matches a clean local install and never drifts.
- Targeting `staging`/`main` on both `push` and `pull_request` protects the exact flows the governance contract relies on (PR into `staging`; merges to `main`).

## 6. Future Avoid

- [x] Skipping type-check on CI because `build` (esbuild) is lenient — banned; `type-check` is a distinct, mandatory step
- [x] Red CI on first commit — banned; the latent `tsc` errors are fixed in this same branch
- [x] Hard-coding tool versions/commands in the workflow instead of using `package.json` scripts — banned
- [x] Mixing deploy (Netlify) or secret handling into this verification workflow — banned (own topic)
- [x] Adding pre-commit hooks (EST-L01) to this branch — banned

## 7. Acceptance Criteria

- [ ] `.github/workflows/ci.yml` exists with a single `ci` job running lint, type-check, unit tests, build
- [ ] `npm run type-check` script exists and `tsc --noEmit` exits 0 locally
- [ ] All four steps pass when run locally in order (lint 0, tests 23/23, build green)
- [ ] `tests/unit/composables/useContest.spec.ts` has no TS errors (`npx tsc --noEmit` exit 0)
- [ ] Touched files: `.github/workflows/ci.yml`, `package.json`, `tests/unit/composables/useContest.spec.ts`, `specs/SPEC-P4-03-*.md`, `CHANGELOG-PROPOSALS.md`
- [ ] 1 topic = 1 PR ≤ 8 files (satisfies RULE 3A)

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Node version drift between CI and local | Low | Medium | pin `actions/setup-node@v4` to Node 22 (matches dev machine v22.22); add `cache: npm` |
| `npm ci` fails if lockfile out of sync | Low | Medium | lockfile is committed and current; CI install is reproducible |
| Workflow YAML syntax broken without a runner locally | Low | High | `on:`/`jobs` structure follows GitHub's documented schema; verified by review before merge and by the first run post-merge |
| New `type-check` fails on Windows-only path chars | Very low | Low | `tsc` is platform-agnostic; fixes target pure type shapes |

## 9. Testing Strategy

- Run locally in exact CI order: `npm run lint`, `npm run type-check`, `npm run test:unit`, `npm run build` — all pass
- `npx tsc --noEmit` → exit 0 (proves the type-check step will pass)
- Post-merge: observe the Actions run on the merged `staging` commit turns green

## 10. Estimate & Dependencies

- **Estimate:** 3h (workflow 1h, type-check script 0.3h, test-fixture type fix 1h, spec+proposal+changelog 0.7h)
- **Dependencies:** none — modern stack already merged (Vite 8, TS 5.9, eslint flat)
- **Branch:** `feature/ci-pipeline`

---

## Approval

- **Jör Approved:** (pending)
- **Status:** DRAFT — await PR review on GitHub