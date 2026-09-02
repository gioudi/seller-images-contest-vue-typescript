# SPEC-P4-04: Remove Unused Dependencies (EST-M09)

| Field | Value |
|-------|-------|
| **Status** | DRAFT (awaiting PR review) |
| **Topic** | Remove dependencies no longer used after the Vite + `<script setup>` migration (single topic: dependency cleanup) |
| **Estimate** | 0.5h |
| **Branch** | `feature/remove-unused-deps` |
| **Proposal** | PROPOSAL-2026-017 |
| **ADS Reference** | Section 8.2, 11.1 |
| **EST Reference** | EST-M09 |

## 1. Context

The EST-M09 planning entry listed `node-sass vue-class-component dotenv`. Since that plan was written, the stack moved twice: Vite now compiles SCSS via `sass` (not `node-sass`), and the last Options-API components were converted to `<script setup>` in EST-M03 (so `vue-class-component` has no consumers). `dotenv` was never needed because Vite reads `import.meta.env` from env files natively. `core-js` (a Vue CLI / Babel polyfill helper) is unused under esbuild. These four are dead weight: larger `node_modules`, install surface, and audit noise.

## 2. Topic & Scope

- **Topic:** remove unused packages and prune the lockfile (single topic: dependency cleanup).

**In scope:**
- `package.json` + `package-lock.json`: remove `core-js`, `dotenv`, `vue-class-component` from `dependencies`
- `node_modules` re-sync via `npm uninstall`

**Out of scope (forbidden in this branch):**
- Touching `sass` (it IS used by SCSS under Vite) — `node-sass` is not present in `package.json` and needs no action
- `.browserslistrc`, Babel config, or `core-js` polyfill wiring (Babel was removed in the Vite migration)
- `npm audit fix` / other dependency upgrades (own topic, requires its own review)
- Husky/lint-staged, CI changes, any source code change

## 3. Design Patterns

| Pattern | Where applied | Why this pattern |
|---------|---------------|------------------|
| Dependency minimization | `package.json` `dependencies` | fewer, current packages reduce install time, lockfile size, and audit surface; the plan's principle of "remove unused dependencies" |

## 4. SOLID

- **S** — Single Responsibility: a single change removing only unused packages; no behavior touched.
- O / L / I / D : not exercised — no code, interfaces, or abstractions change.

## 5. Architecture & Why

```
package.json           dependencies: axios, pinia, sass, unsplash-js, vue, vue-router, vue-toastification, vue3-carousel
                        (removed: core-js, dotenv, vue-class-component)
```

Why:
- Evidence-gated: greps across `src`, `tests`, and config files return zero references to the three removed packages.
- `vite build` (esbuild) does not need `core-js` polyfills; `import.meta.env` replaces `dotenv`; `<script setup>` removes any `vue-class-component` need.
- Keeping ambiguous packages would violate ADS 8.2 (dependency hygiene).

## 6. Future Avoid

- [x] Re-adding Vue-CLI-era packages (`core-js`, `babel`, `node-sass`, `vue-class-component`) — banned; the current toolchain (Vite + esbuild + `sass`) is the standard
- [x] Running blanket `npm audit fix` / version bumps inside a "remove unused deps" PR — banned (own topic)
- [x] Removing a package that is still imported — banned; verified usage is empty before removal

## 7. Acceptance Criteria

- [ ] `npm ls core-js dotenv vue-class-component` → empty (no packages)
- [ ] `package.json` `dependencies` no longer lists `core-js`, `dotenv`, `vue-class-component`; lockfile updated
- [ ] `npm run lint`, `npm run type-check`, `npm run test:unit` (23/23), `npm run build` all exit 0 (the CI gates)
- [ ] `npm audit` reports advisories are not regressed by this change (unchanged scope — not fixing here)
- [ ] Touched files: `package.json`, `package-lock.json`, `specs/SPEC-P4-04-*.md`, `CHANGELOG-PROPOSALS.md`

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| A removed package is actually transitively required | Low | Medium | verified zero import sites; CI (lint/type/test/build) re-validated after removal |
| Lockfile/node_modules drift | Low | Low | removal done via `npm uninstall`, which updates both consistently; `npm ci` path re-verified |

## 9. Testing Strategy

- `npm ls` for the removed names (empty)
- Run the four CI gates locally: lint, type-check, test:unit, build — all green

## 10. Estimate & Dependencies

- **Estimate:** 0.5h
- **Dependencies:** EST-M03 (Composition API) merged — confirms `vue-class-component` has no consumers; Vite stack already in place from EST-M02
- **Branch:** `feature/remove-unused-deps`

---

## Approval

- **Jör Approved:** (pending)
- **Status:** DRAFT — await PR review on GitHub