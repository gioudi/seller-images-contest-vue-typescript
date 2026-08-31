# SPEC-P2-02: Vite Migration

| Field | Value |
|-------|-------|
| **Status** | DRAFT (awaiting Jör approval via PR) |
| **Topic** | Migrate the build tool from Vue CLI to Vite (ADR-002). Single topic: the platform/build tooling. |
| **Estimate** | 16h |
| **Branch** | `refactor/vite-migration` |
| **Proposal** | PROPOSAL-2026-005 |

## 1. Context

The project builds with **Vue CLI 5** (webpack), which is in maintenance-only. The ecosystem standard for Vue 3 is **Vite**: faster dev server, faster production builds, native ESM, and first-class support for our Pinia store (migrated in SPEC-P2-01) and `<script setup>`. Vue CLI also forces the whole toolchain (webpack config, `@vue/cli-plugin-*`, babel) into the project, and its unit-test runner (`@vue/cli-plugin-unit-jest`) is coupled to the build. ADR-002 already ACCEPTED the migration, and ADR-003 fixed the sequencing: Pinia first (done), then Vite. This is that second migration.

## 2. Topic & Scope

- **Topic:** replace Vue CLI (webpack) with Vite as the build/dev/test platform, and nothing else.

**In scope:**
- Add `vite` + `@vitejs/plugin-vue`; remove Vue CLI dependencies (`@vue/cli-service`, `@vue/cli-plugin-*`)
- Add `vite.config.ts` (path alias `@` → `src`, `@vitejs/plugin-vue`)
- Move `public/index.html` → root `index.html` (Vite format: `%VITE_*%`, `<script type="module" src="/src/main.ts">`)
- Migrate env vars `VUE_APP_*` → `VITE_*`; `process.env.X` → `import.meta.env.X` in `apiService.ts`, `apiImagesService.ts`
- `createWebHistory(process.env.BASE_URL)` → `createWebHistory(import.meta.env.BASE_URL)`
- Replace Jest (`@vue/cli-plugin-unit-jest`) with **Vitest**; port the same 8 unit tests
- Update `package.json` scripts (`dev`, `build`, `preview`, `test:unit`, `lint`)
- Update `tsconfig.json` for Vite (`vite/client` types, `env.d.ts`)
- Update `.env.example` variable names to `VITE_*`
- Update `.eslintrc.js` for Vite-native run
- Remove `vue.config.js`, `babel.config.js`, `jest.config.js` (no longer needed)

**Out of scope (forbidden in this branch):**
- Any behavior/feature change (i18n, a11y, theme, voting rules)
- Change to Pinia stores or their logic (SPEC-P2-01 already done)
- TypeScript major version upgrade (own spec, EST-L10)
- ESLint/Prettier major upgrade (own spec, EST-L11)
- CI/CD, Husky, lazy-loading (own specs, later phases)

## 3. Design Patterns

| Pattern | Where applied | Why this pattern |
|---------|---------------|------------------|
| **Facade / Build tool abstraction** | `vite.config.ts` | config centralizes alias + plugin; app code never imports build-tool specifics |
| **Factory** | `@vitejs/plugin-vue` + `defineConfig` | Vite provides a declarative config factory; app stays framework-agnostic |
| **Configuration as code** | `vite.config.ts`, `vitest.config.ts` | typed, testable platform config instead of opaque webpack/babel files |

## 4. SOLID

- **S** — Single Responsibility: `vite.config.ts` (build), `vitest.config.ts` (tests), `env.d.ts` (types) each own one concern; removed `vue.config.js`/`babel.config.js`/`jest.config.js` consolidate into their Vite counterparts.
- **O** — Open/Closed: adding a new env var is a `VITE_*` line in `.env`; adding a route/test is a file, no build-tool edit.
- **L** — Liskov: n/a — no subtype hierarchies introduced.
- **I** — Interface Segregation: `import.meta.env` exposes only typed `VITE_*` vars; app code sees a small, explicit surface instead of `process.env` (whole process).
- **D** — Dependency Inversion: services depend on `import.meta.env` (framework-provided), not on Node `process` — preserves the existing direction.

## 5. Architecture & Why

```
Before (Vue CLI / webpack):          After (Vite):
vue.config.js  -> webpack            vite.config.ts  -> esbuild/rollup
babel.config.js -> babel transform   (removed — esbuild handles TS/JSX)
jest.config.js  -> jest+webpack      vitest.config.ts -> vitest (esbuild)
public/index.html (EJS/webpack)      index.html (root, Vite)
process.env.VUE_APP_*                import.meta.env.VITE_*
src/main.ts (bundler entry)          src/main.ts referenced by index.html module script
```

Why:
- **Runtime-only swap again** (mirrors Pinia): stores, components, services logic are untouched; only the platform/config layer changes, so the 8 Vitest tests prove the app still works.
- **Env isolation**: `import.meta.env` is statically replaced at build time and only `VITE_*` are exposed — cleaner than `process.env` and avoids leaking non-prefixed vars.
- **Move test runner too**: `@vue/cli-plugin-unit-jest` cannot run without Vue CLI, so removing Vue CLI forces Vitest — done here as one platform PR (RULE 3A is one platform change: the build/test platform).

## 6. Future Avoid

- [ ] `process.env.VUE_APP_*` anywhere in `src` after this PR — banned; use `import.meta.env.VITE_*`
- [ ] New `@vue/cli-*` / webpack / babel config files — banned
- [ ] Bundler-specific code imported by app code (app stays framework-agnostic)
- [ ] Two build tools coexisting — banned; exactly one platform
- [ ] Adding new Jest config — banned; Vitest is the runner

## 7. Acceptance Criteria

- [ ] `npm run build` exits 0 and produces `dist/`
- [ ] `npm run dev` starts the Vite dev server and serves the app
- [ ] `npm run test:unit` exits 0 — same 8 tests, now under Vitest
- [ ] `npm run lint` exits 0
- [ ] `grep -ri "VUE_APP_" src/`: zero matches; `process.env` zero in `src/`
- [ ] `.env.example` uses `VITE_*` names
- [ ] Root `index.html` exists; `public/index.html` removed/relocated
- [ ] No `@vue/cli-*` or `webpack` or `babel` in `package.json`
- [ ] Behavior identical: landing auto-fetches "cute" images; vote +3 (CONTEST.VOTE_POINTS); winner modal at 20; invoice create — manual smoke on `npm run dev`

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Env var rename breaks API calls | Medium | High | Simple find/replace `VUE_APP_*`—`VITE_*`; grep acceptance; manual smoke with real `.env` |
| Vitest port changes test behavior | Medium | Medium | Port tests 1:1; assert same 8 pass; shallowMount API identical |
| SCSS/carousel asset resolution differs | Low | Medium | Vite handles `@/` alias + sass natively; build in-gate catches |
| Base URL / history mode mismatch | Low | Medium | `import.meta.env.BASE_URL` mirrors previous `process.env.BASE_URL` |
| Node/version compat | Low | Low | Node 22 supports current Vite major |

## 9. Testing Strategy

- `npm run build` + `npm run lint` + `npm run test:unit` as the gate
- grep-based acceptance (`VUE_APP_`, `process.env`, `vue-cli`) as listed in §7
- Manual `npm run dev` smoke: the three flows above (sellers load, vote, invoice)

## 10. Estimate & Dependencies

| Task | h |
|------|---|
| Add vite + plugin-vue; remove vue-cli deps; package.json scripts | 1.0 |
| `vite.config.ts`, `vitest.config.ts`, root `index.html`, `env.d.ts`, tsconfig | 2.0 |
| Env migration `VUE_APP_*` → `VITE_*` (services, routes) | 1.0 |
| Jest → Vitest port of 8 tests + setup | 3.0 |
| eslint config for Vite-native run | 1.0 |
| Remove vue.config.js/babel.config.js/jest.config.js, .env.example rename | 1.0 |
| Verify gate (build/lint/test) + manual smoke | 2.0 |
| Buffer | 3.0 |
| Docs (SPEC status, CHANGELOG proposal, ADR-002) | 2.0 |
| **Total** | **16.0** |

**Dependencies:** SPEC-P2-01 Pinia migration merged ✅ (this runs on top of it). Next dependency: this PR approved → then TypeScript upgrade (EST-L10) etc.

---

## Approval

- **Jör Approved:** (pending)
- **Status:** DRAFT — await PR review on GitHub
