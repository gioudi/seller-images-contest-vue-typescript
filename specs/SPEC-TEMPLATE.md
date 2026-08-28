# SPEC-TEMPLATE

Standard structure for every spec in this repository. All specs MUST follow this template, section by section. A spec without every section is a draft and cannot be approved.

| Field | Value |
|-------|-------|
| **Name pattern** | SPEC-{P0..Pn or Fnn}-{topic}.md in `specs/` |
| **Status lifecycle** | DRAFT → APPROVED → IMPLEMENTED → VERIFIED → CLOSED |
| **One spec = one topic** | If this spec would cover unrelated work, split it. Bundling is only allowed within one topic. |
| **Approval** | Only Jör approves a spec. Without Jör's approval there is no implementation. |

---

## 1. Context

Why does this task exist? What is the current state, and what is wrong with it? One short paragraph + the problem symptoms. No solution here yet.

## 2. Topic & Scope

- **Topic:** a single sentence naming the one topic this spec covers.
- **In scope:** the concrete deliverables of THIS spec (bullet list).
- **Out of scope:** explicitly what this spec will NOT touch (bullet list). Anything out of scope is forbidden during implementation even if it seems related.

## 3. Design Patterns

Every spec names the design patterns used and exactly where they are applied. Choose from established patterns only (Gang of Four + architectural patterns). If no pattern applies, say so explicitly ("no patterns — trivial change") instead of inventing one.

| Pattern | Where applied | Why this pattern |
|---------|---------------|------------------|
| e.g. Repository | `src/services/apiService.ts` | isolates data access from components/store |

## 4. SOLID

State which SOLID principles drive the design and prove each with concrete files/functions.

- **S** — Single Responsibility: <which file has exactly one job>
- **O** — Open/Closed: <where we extend without modifying>
- **L** — Liskov: <only when subtypes exist>
- **I** — Interface Segregation: <only when interfaces exist>
- **D** — Dependency Inversion: <where dependencies point inward>

## 5. Architecture & Why

Describe the target shape in plain "text diagram" form (layer → who owns it → key files). Give the reason for each relevant decision. If a decision exists in ADRs (`DECISIONS.md`), reference it here.

```
Layer:            Files:                        Owned by:
Views            src/views, src/components     presentation only, no business logic
Store (Vuex)     src/store/**                    state + actions, thin, typed
Services         src/services/**                 only code touching HTTP/external APIs
Config           src/config/**                   constants & environment, no imports from other layers
```

Why this shape: <reasons>.

## 6. Future Avoid

The anti-patterns and practices we deliberately avoid — now AND in the future. Any of these reappearing requires a NEW proposal; they do not get re-introduced silently.

- [ ] e.g. `any` types in signatures — banned
- [ ] e.g. magic numbers — banned
- [ ] e.g. build-our-own-again where a maintained library exists
- [ ] e.g. mixing unrelated topics into one branch

## 7. Acceptance Criteria

Measurable, verifiable items. Each can be checked by a command, a file listing, or a visible behavior. Tick-box format, approved by Jör.

- [ ] `npm run build` exits 0
- [ ] ...

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|

## 9. Testing Strategy

What proves the change works: unit tests, lint, build, manual checks. Test files named.

## 10. Estimate & Dependencies

- **Estimate:** Xh (list per item)
- **Dependencies:** what must exist/be merged before this starts
- **Branch:** the dedicated branch this spec is implemented on

---

## Approval

- **Jör Approved:** (date + word)
- **Status after approval:** → APPROVED → implementation may begin on the spec's dedicated branch.