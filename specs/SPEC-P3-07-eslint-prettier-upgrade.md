# SPEC-P3-07: Upgrade ESLint + Prettier (EST-L11)

| Field | Value |
|-------|-------|
| **Status** | APPROVED - IMPLEMENTED (awaiting merge to staging via PR) |
| **Topic** | Rebuild the lint layer on the modern toolchain — ESLint 9 (flat config), typescript-eslint 8, eslint-plugin-vue 10, Prettier 3 — and enable type-aware rules. |
| **Estimate** | 4h |
| **Branch** | `feature/upgrade-linting` |
| **ADS Reference** | Section 11.1 + Phase-3 checklist ("Upgrade ESLint to 8+ with strict TypeScript rules", "Add `@typescript-eslint/strict-type-checked` config") |
| **Proposal** | PROPOSAL-2026-013 |

## 1. Context

The lint toolchain is the last pile of 2021-era software in the repo, and it is now actively incompatible with the TypeScript 5.9 upgrade (EST-L10, merged PR #34):

- **ESLint 7.32** — three majors behind (7 → 8 → 9). Its config format (`eslintrc`) is legacy; ESLint 9 uses flat config.
- **@typescript-eslint 5.62** — only supports TS < 5.1. It still *parses* TS 5.9 today, but that support is unofficial and dead-ended. Version 8 is the current release and mandates supporting TS 5.x properly.
- **Prettier 2.8** — superseded by Prettier 3. Note: Prettier 3 changed the default `trailingComma` from `"es5"` to `"all"`, which would reformat almost every file unless we pin the old default.
- **eslint-plugin-vue 8 / vue-eslint-parser 8** — also legacy; v10 is the flat-config-compatible release.
- Crucially, **there is no type-aware linting today**: the parser runs without `parserOptions.project`, so rules like `no-unsafe-*`, `no-floating-promises` and others that need type information are impossible. The ADS Phase-3 checklist explicitly asks for `@typescript-eslint/strict-type-checked`.

Node is v22, which supports all modern releases. This is the enabler for the last ADS Quality & DX items (CI, husky pre-commit hooks come after).

## 2. Topic & Scope

- **Topic:** replace the legacy ESLint 7 + @typescript-eslint 5 + Prettier 2 setup with ESLint 9 (flat config) + typescript-eslint 8 + eslint-plugin-vue 10 + Prettier 3, and turn on type-aware rules.

**In scope:**
- `package.json` — swap devDependencies: `eslint` 7 → 9, `@typescript-eslint/*` 5 → `typescript-eslint` 8, `eslint-plugin-vue` 8 → 10, `vue-eslint-parser` bump, `prettier` 2 → 3, `eslint-config-prettier` → 10, `eslint-plugin-prettier` → latest flat-config build
- Replace `.eslintrc.cjs` with `eslint.config.js` (flat config, ESM — the repo is already `"type": "module"`)
- Add `.prettierrc.json` pinning `trailingComma: "es5"` to preserve today's formatting (Prettier 3 default differs)
- Update the `lint` npm script (ESLint 9 drops `--ext`): `eslint src tests`
- Enable type-aware rules: `typescript-eslint` `recommendedTypeChecked` for `.ts`/`.tsx` files; keep `strictTypeChecked` decision pending the empirical check in §9
- Fix whatever real issues the new rule-set surfaces in `src/`/`tests/` (expected to be small)
- `specs/SPEC-P3-07-eslint-prettier-upgrade.md` + `CHANGELOG-PROPOSALS.md`

**Out of scope (forbidden in this branch):**
- Husky / lint-staged pre-commit hooks (own ADS checklist item)
- GitHub Actions CI pipeline (own ADS checklist item)
- Adding `vue-tsc` / a `tsc --noEmit` / real type-check gate (own PR)
- Changing app behavior or any runtime source logic
- Prettier reformatting beyond the files lint already touches (formatting diff must stay minimal)

## 3. Design Patterns

| Pattern | Where applied | Why this pattern |
|---------|---------------|------------------|
| Flat config (ESLint 9 native) | `eslint.config.js` | ESLint 9's canonical config; composable `files` arrays per file-type (ts, vue, config) instead of hierarchical overrides |
| Facade / single toolchain entry | `lint` script + flat config file | one command and one config file own all linting decisions; no scattered `.eslintrc` |
| Declarative scope via `files` globs | type-aware rules limited to TypeScript files | keeps the SFC/template parsing path safe while still giving real type-aware checks where the compiler can run |

## 4. SOLID

- **S** — Single Responsibility: the config splits rules by file type (`**/*.ts` the compiler-aware set, `**/*.vue` the Vue set, root configs), each block does one job.
- **O** — Open/Closed: rules live in composable arrays; adding a later rule is appending to a named block.
- **L** — Liskov: n/a — no subtype hierarchies.
- **I** — Interface Segregation: type-aware rules only apply where type info is available (TS files), not to markdown/JSON/HTML-ish contexts.
- **D** — Dependency Inversion: lint config depends on plugin interfaces (`typescript-eslint` config objects), never on concrete internal parser APIs.

## 5. Architecture & Why

```
Lint layer (files, in lint order):        Owned by:
eslint.config.js  (flat, ESM)             ESLint 9 — composer for all rule blocks
├─ files: ["**/*.ts","**/*.tsx"]          typescript-eslint 8 — recommendedTypeChecked (+ possibly strict)
├─ files: ["**/*.vue"]                    eslint-plugin-vue 10 — vue3-recommended + prettier
├─ files: ["eslint.config.js", ...root]   eslint's own node/ESM block
.prettierrc.json   trailingComma: "es5"    Prettier 3 — formatting constants
package.json "lint": "eslint src tests"    ESLint 9 — no --ext flag
```

Why this shape: ESLint 9's flat config is the format moving forward (eslintrc is deprecated). Splitting `files` arrays means type-aware rules (`recommendedTypeChecked`) get real compiler info for `.ts` files while `.vue` SFCs go through `vue-eslint-parser` → `@typescript-eslint/parser` without demanding that plain `tsc` understand `.vue` (it can't, per EST-L10 research). The explicit `.prettierrc.json` keeps the diff tiny by freezing the Prettier-2 defaults that Prettier 3 changed.

## 6. Future Avoid

- [ ] Never reintroduce `.eslintrc*` files — flat config (`eslint.config.js`) only
- [ ] Never use `--ext` with ESLint 9 — invalid; scope is declared in the flat config `files` globs
- [ ] Never mix ESLint/TS upgrades with unrelated topics — one toolchain change per PR
- [ ] No `any` escapes even if type-aware rules pressure code — fix types, don't suppress rules
- [ ] No blanket `eslint-disable` comments or rule-suppress on legacy-rule names that no longer exist
- [ ] Don't chase StackOverflow-era eslintrc recipes — all config is flat-config native

## 7. Acceptance Criteria

- [x] `npm run lint` exits 0, with **at least as many checks as before** (still covers all `src` and `tests` `.ts`/`.tsx`/`.vue` files)
- [x] `npm run test:unit` unchanged (23/23 passing)
- [x] `npm run build` unchanged (128 modules, exits 0)
- [x] Broader rule surface than today — type-aware rules active and catching real issues (`no-floating-promises`, `no-unsafe-*`, `unbound-method`, etc.); zero suppresses
- [x] `npx eslint --version` reports 9.x; `npx tsc --version` still 5.9.x
- [x] No Visual / runtime change; formatting diff on existing files stays minimal (thanks to `trailingComma` pin)

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Type-aware rules flag issues the codebase never saw before | High | Medium | scope type-aware to `.ts`/`.tsx` first; decide `strictTypeChecked` per the empirical check in §9; fix real issues instead of suppressing |
| Prettier 3 reformats everything (default `trailingComma` change) | High | Medium | pin `trailingComma: "es5"` in `.prettierrc.json`, matching current output |
| Flat-config migration breaks SFC linting | Medium | Medium | eslint-plugin-vue 10 + vue-eslint-parser 10 flat-config support is official; verify `.vue` files lint in the gate |
| ESLint 9 drops `--ext` and old override syntax | Medium | Low | script updated to `eslint src tests`; overrides → flat `files` blocks |
| `strictTypeChecked` demands compiler access to `.vue` templates | Medium | Medium | keep strict/type-checked config limited to TS files; SFCs get non-type-aware recommended + eslint-plugin-vue rules (documented decision, reversible later) |

## 9. Testing Strategy

- Gate: `npm run lint` + `npm run test:unit` + `npm run build`
- **Empirical decision gate (during implementation, documented in the PR):** after enabling `recommendedTypeChecked`, run the gate. If it passes without rule-suppressions, upgrade to `strictTypeChecked` (per ADS); if that surfaces structural issues beyond a small fix, ship `recommendedTypeChecked` and note `strict` as a fast-follow — either way the ADS intent (type-aware rules on) is met and the choice is reviewed with Jör in the PR
- **Outcome (implemented):** `recommendedTypeChecked` passed fully with zero suppressions → upgraded to `strictTypeChecked`. It surfaced only 3 small, real issues, all fixed: a void-return arrow shorthand (`useSellers.ts`), an unguarded template literal `string | undefined` (`apiService.ts` Authorization header, now `?? ""`), and a `no-unnecessary-condition` on the `ResizeObserver` polyfill guard in `tests/unit/setup.ts` (now guarded via an explicit `globalThis as { ResizeObserver?: ... }` cast). `strictTypeChecked` is the active rule-set.
- Manual: `npm run dev` smoke; confirm no rule regressions on the three routes

## 10. Estimate & Dependencies

| Task | h |
|------|---|
| Install/swap toolchain packages | 0.5 |
| Flat-config migration + rules | 1.5 |
| Type-aware rules empirical run + fixes | 1.0 |
| Docs (spec + CHANGELOG proposal) | 0.5 |
| Buffer / review cycles | 0.5 |
| **Total** | **4.0** |

**Dependencies:** EST-L10 TS 5.9 merged to staging ✅ (this requires it). Next after this: remaining ADS Phase-3 items — Husky/lint-staged, GitHub Actions CI — then the **v1.0.2** release.

---

## Approval

- **Jör Approved:** ✅ (via chat, proceeded to implementation after spec review)
- **Status:** APPROVED - IMPLEMENTED — branch `feature/upgrade-linting`, awaiting merge via PR