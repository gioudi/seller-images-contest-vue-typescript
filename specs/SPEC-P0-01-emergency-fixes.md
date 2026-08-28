# SPEC-P0-01: Emergency Fixes - Phase 0

## Status: APPROVED - IMPLEMENTED (awaiting staging merge)

## Purpose
Resolve all P0/P1 blocking issues that prevent the application from functioning correctly or compromise security. This is the emergency stabilization pass.

## Scope

### Included
- Rotate and secure the Unsplash API key (currently hardcoded in source code)
- Fix the broken Alegra API authorization header (trailing brace)
- Remove all artificial `setTimeout` loading delays
- Fix the syntax error in `ErrorFile.vue` (stray `s` character)
- Fix the double JSON parse in `invoices/actions.ts`
- Remove `console.log` from production code
- Create `.env.example` documenting all environment variables

### Excluded
- Any refactoring beyond the specific bug fixes
- Architecture migrations (Pinia, Vite) - handled in later phases
- New features (i18n, theme toggle, accessibility) - handled in later phases

## Acceptance Criteria
- [ ] No API keys exist anywhere in source code
- [ ] API keys read from environment variables only
- [ ] Alegra API authentication header is correct (`Basic ${API_KEY}`)
- [ ] App loads without any artificial wait time
- [ ] All `.vue` files compile without errors
- [ ] Invoice creation works end-to-end
- [ ] No `console.log` statements in production code
- [ ] `.env.example` exists with `VUE_APP_ALEGRA_API_KEY` and `VUE_APP_UNSPLASH_ACCESS_KEY`
- [ ] `.env` is present in `.gitignore`

## Technical Approach

| Task | File(s) Modified | Approach |
|------|-----------------|----------|
| Secure API keys | `apiImagesService.ts`, `apiService.ts`, new `.env`, `.env.example` | Move keys to env variables, read via `process.env.VUE_APP_*` |
| Fix auth header | `apiService.ts` | Remove trailing `}` from template literal |
| Remove delays | `App.vue`, `ImageList.vue` | Delete `await new Promise(setTimeout...)` blocks |
| Fix syntax error | `ErrorFile.vue` | Remove stray `s` character |
| Fix JSON parse | `invoices/actions.ts` | Remove `await response.json()` |
| Remove console.log | `apiService.ts` | Delete `console.log(payload)` |
| Document env vars | `.env.example` | List all required variables |

## Testing Strategy
- `npm run build` succeeds
- `npm run lint` passes
- Manual verification: app loads immediately, images load, seller list loads, invoice submission works

## Estimated Time
3.2 hours (0.5 work days)

## Dependencies
- None

## Approval
- **Broker:** Pending
- **Jör:** Approved 2026-08-28 (written, "Start with phase 0")