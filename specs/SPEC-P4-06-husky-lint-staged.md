# SPEC-P4-06: Husky + lint-staged Pre-Commit Hooks (EST-L01)

| Field | Value |
|-------|-------|
| **Status** | IMPLEMENTED (merged via PR #43) |
| **Topic** | Add pre-commit hooks that lint staged source/test files (single topic: local git hooks for quality) |
| **Estimate** | 2h |
| **Branch** | `feature/husky-lint-staged` |
| **Proposal** | PROPOSAL-2026-019 |
| **ADS Reference** | Section 11.1 |
| **EST Reference** | EST-L01 |

## 1. Context

CI (EST-L02) now runs lint + type-check + tests + build on every push/PR, but local commits have no guardrails. A contributor can commit code that fails lint, and the failure surfaces only after push. EST-L01 adds local pre-commit hooks via Husky + lint-staged so committed files must pass ESLint before they land. This catches issues at the earliest point (commit time) and complements the remote CI.

## 2. Topic & Scope

- **Topic:** add Husky (v9) + lint-staged (v17) pre-commit hook running ESLint on staged source files.

**In scope:**
- `devDependencies`: `husky`, `lint-staged`
- `package.json` — `prepare: "husky"` script + a `lint-staged` config running `eslint --fix` on `*.{ts,tsx,vue,js}`
- `.husky/pre-commit` hook file (runs `npx lint-staged`); the husky-managed `_` internal dir stays git-ignored

**Out of scope (forbidden in this branch):**
- Running tests or type-check in the hook (lint-only keeps the hook fast/quiet); CI already covers those
- Adding Advanced CI config or deploy steps
- Touching source code, SCSS, or any feature work
- Fixing the pre-existing `npm audit` advisories (own topic, requires its own review)

## 3. Design Patterns

| Pattern | Where applied | Why this pattern |
|---------|---------------|------------------|
| Git hooks (pre-commit) + staged-only linting (lint-staged) | `.husky/pre-commit` + `lint-staged` config | run the smallest possible check on just the changed files at commit time, giving fast feedback and avoiding full-suite latency on every commit |
| Staged-file scoping (lint-staged) | `*.{ts,tsx,vue,js}` → `eslint --fix` | only files about to be committed are validated, per the manager scope |

## 4. SOLID

- **S** — Single Responsibility: the hook runs one task (ESLint on staged files); CI owns type/test/build.
- **O** — Open/Closed: adding a future hook (e.g. type-check, commit-msg) means adding another `.husky` file without altering the pre-commit hook.
- O / L / I / D : not newly exercised — configuration-only.

## 5. Architecture & Why

```
Commit time (local): git commit → husky → .husky/pre-commit → npx lint-staged → eslint --fix on *.ts|tsx|vue|js
Push time (remote):  CI (EST-L02) → lint → type-check → test:unit → build
```

Why:
- Local hooks give immediate feedback on exactly the staged files; the full quality gate still runs centrally in CI.
- `eslint --fix` auto-corrects trivial issues and errors on the rest, so the developer is never blocked by noise.
- `prepare: "husky"` makes hooks install automatically on `npm install` (dev machines), so it's reproducible for any contributor.

## 6. Future Avoid

- [x] Commit-time hooks running the whole suite (slow) — banned; lint-staged scopes to staged files and the hook is lint-only
- [x] Shipping the husky `_` internal directory in git — banned; its `.gitignore` (`*`) keeps it local
- [x] Coupling the pre-commit hook to CI tasks — banned; layering is local lint → remote full gate
- [x] Adding unrelated changes (audit fixes, feature work) to this branch

## 7. Acceptance Criteria

- [ ] `.husky/pre-commit` exists, tracked; `npm run prepare` installs husky
- [ ] `package.json` has `prepare` script and a `lint-staged` config for `*.{ts,tsx,vue,js}` → `eslint --fix`
- [ ] A staged file with a lint error blocks the hook (verified manually: reverts staging, exit 1)
- [ ] `npm run lint`, `npm run type-check`, `npm run test:unit` (23/23), `npm run build` all exit 0
- [ ] Touched files: `package.json`, `package-lock.json`, `.husky/pre-commit`, `tests` none, `specs/SPEC-P4-06-*.md`, `CHANGELOG-PROPOSALS.md`

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Hook not installed on dev machines | Medium | Low | `prepare: "husky"` auto-installs on `npm install`; documented install path |
| Windows path/environment differences | Medium | Low | lint-staged runs via npm node shim; verified manually on this Windows machine |
| Hook adds friction for a one-line doc change in a non-linted file | Low | Low | lint-staged only matches `ts/tsx/vue/js`, so docs/JSON/index.html commits are unaffected |

## 9. Testing Strategy

- Manually stage a `.ts` file with `any` → run hook → confirm it errors and reverts staging
- Run the four CI gates locally (lint, type-check, test:unit, build)

## 10. Estimate & Dependencies

- **Estimate:** 2h (install+config 0.75h, hook 0.5h, verify 0.5h, spec+proposal 0.25h)
- **Dependencies:** none — complements CI added in EST-L02
- **Branch:** `feature/husky-lint-staged`

---

## Approval

- **Jör Approved:** yes (merged via PR #43)
- **Status:** IMPLEMENTED — merged to `staging`; hooks active (proven to fire on commit)