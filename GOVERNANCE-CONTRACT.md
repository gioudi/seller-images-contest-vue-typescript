# Project Governance Contract

## Seller Images Contest - Vue TypeScript

**Effective Date:** 2026-08-28  
**Version:** 1.1  

---

## Amendment History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-08-28 | Initial contract |
| 1.1 | 2026-08-28 | Added RULE 3A (Small Pull Requests) at Jör's request after reviewing a 22-file PR |

## Parties

| Role | Name | Responsibilities |
|------|------|-----------------|
| **Broker** (Architecture Consultant) | Broker | Proposes changes, implements features, provides technical guidance, documents decisions. Cannot merge or deploy without approval. |
| **Owner** (Project Owner) | Jör | Approves all changes, final merge authority, defines priorities and scope, releases to production. |

---

## Rule Set

All parties agree to abide by the following rules. No exception shall be made without explicit written agreement from both parties.

### RULE 1: Spec-Driven Development

> **No code is written without a spec.**

- Every feature, fix, or change MUST have a written specification before implementation begins.
- Specs must include:
  - **Purpose:** What problem does this solve?
  - **Scope:** What is included and what is explicitly excluded?
  - **Acceptance Criteria:** How do we know it is done?
  - **Technical Approach:** High-level implementation strategy.
  - **Testing Strategy:** How will it be verified?
- The spec must be approved by Jör before any branch is created.
- Specs live in the `specs/` directory with the naming convention: `SPEC-{phase}-{number}-{short-description}.md`.

### RULE 2: Environment Strategy

> **Two environments: `main` and `staging`. No direct commits to either.**

| Environment | Purpose | Deployment |
|-------------|---------|------------|
| **`staging`** | Integration testing, QA, review | Automatic on merge to `staging` branch |
| **`main`** | Production release | Manual merge from `staging` ONLY, with tag |

- `staging` is the integration branch where all feature branches converge.
- `main` is the production branch, protected and deployment-ready at all times.
- Environment variables may differ between staging and production.

### RULE 3: Branching Strategy (GitHub Flow)

> **Every change lives in a dedicated branch. No exceptions.**

#### Branch Naming Convention

```
{type}/{ticket-id}-{short-description}
```

#### Allowed Types

| Type | When to Use |
|------|-------------|
| `feature/` | New functionality |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes only |
| `refactor/` | Code restructuring without behavior change |
| `test/` | Adding or updating tests |
| `chore/` | Tooling, CI/CD, dependency updates |
| `hotfix/` | Emergency production fixes (bypass staging) |

#### Examples

```
feature/i18n-internationalization
fix/alegra-auth-header
docs/ads-document
refactor/extract-composables
test/unit-store-modules
chore/upgrade-typescript-5
hotfix/security-api-key-rotation
```

#### Branch Lifecycle

```
feature/xyz  -->  staging  -->  main (with tag)
                    |
              (review & approval)
```

### RULE 3A: Small Pull Requests

> **Small PRs beat big PRs. One task = one branch = one PR.**

- Every Pull Request must be small enough to review in one sitting.
- Guidance:
  - 1 task = 1 spec = 1 branch = 1 PR
  - Soft limits: at most **8 files** OR at most **1 work day**, whichever is smaller
  - Do not mix change types (docs + code + tooling) in one PR even if they share a topic
  - Spec-only PRs are separate from the implementation PR that follows them
- If a task cannot meet the soft limits, the Broker MUST say so explicitly when pushing the branch and justify the size (e.g., "Vite migration - expected large, split into commits by concern").
- Jör may reject any PR for being too large and ask for it to be split.

### RULE 4: No Changes Without Approval

> **Broker proposes. Jör disposes.**

- Broker MUST present the change proposal (scope, approach, estimated time) to Jör BEFORE creating a branch.
- Jör MUST provide explicit approval (written: "approved", "go ahead", or similar) before any code is written.
- If Jör does not respond, Broker SHALL NOT proceed. Wait for response.
- Approved proposals are logged in `CHANGELOG-PROPOSALS.md` with timestamp and approval method.

### RULE 5: No Direct Merge to `main`

> **All releases flow through `staging`.**

- Broker merges feature branches into `staging` via Pull Request.
- Jör reviews and approves the PR.
- Only Jör may merge `staging` into `main`.
- Exception: `hotfix/` branches may merge directly to `main` with Jör's explicit real-time authorization, then back-merged to `staging`.

#### Merge Flow

```
1. Broker creates feature/xyz branch
2. Broker implements changes
3. Broker creates PR: feature/xyz -> staging
4. Broker requests review from Jör
5. Jör reviews (may request changes)
6. Jör approves PR
7. Jör or Broker merges to staging (after approval)
8. Jör verifies in staging environment
9. Jör merges staging -> main
10. Jör creates release tag
```

### RULE 6: Every Release Must Have a Tag

> **No release without a version tag.**

- Every merge from `staging` to `main` MUST be accompanied by a git tag.
- Tag format follows [Semantic Versioning](https://semver.org/): `v{MAJOR}.{MINOR}.{PATCH}`
- Jör is responsible for creating the tag at the time of merge to `main`.
- Tag message must reference the changes included.

#### Tag Convention

```
v1.0.0  - Initial professional release
v1.1.0  - Added i18n support
v1.1.1  - Fixed auth header bug
v2.0.0  - Major architecture overhaul (Vuex -> Pinia)
```

#### When to Bump

| Version | When |
|---------|------|
| **MAJOR** | Breaking changes (architecture migration, API contract changes) |
| **MINOR** | New features (i18n, theme toggle, new components) |
| **PATCH** | Bug fixes, security patches, documentation updates |

### RULE 7: When Unsure, Present Options

> **Broker presents options. Jör chooses.**

- If Broker encounters an architectural decision, design choice, or ambiguous requirement, Broker MUST:
  1. Stop work on that item.
  2. Present 2-4 options with pros/cons and estimated impact.
  3. Wait for Jör's decision.
- Options must be documented in the relevant spec or in `DECISIONS.md`.
- Decisions are logged as Architecture Decision Records (ADRs) with context, options considered, and rationale.

### RULE 8: Specs Are Mandatory

> **No implementation without approved spec. Every spec lives in `specs/`.**

- Spec file structure:

```
specs/
  SPEC-P0-01-emergency-fixes.md
  SPEC-P1-01-foundation-types.md
  SPEC-P2-01-pinia-migration.md
  SPEC-F01-i18n.md
  SPEC-F02-accessibility-reader.md
  SPEC-F03-theme-toggle.md
```

- Spec template:

```markdown
# SPEC-{Phase}-{Number}: {Title}

## Status: [DRAFT | APPROVED | IMPLEMENTED | CLOSED]

## Purpose
{Why this change is needed}

## Scope
### Included
- {item 1}
- {item 2}

### Excluded
- {item 1}

## Acceptance Criteria
- [ ] {Criterion 1}
- [ ] {Criterion 2}

## Technical Approach
{High-level implementation plan}

## Testing Strategy
{How this will be tested}

## Estimated Time
{Hours/days}

## Dependencies
{Other specs or tasks this depends on}

## Approval
- **Broker:** {name, date}
- **Jör:** {name, date, approval method}
```

### RULE 9: Professional README

> **The README is the front door. It must be professional.**

- The README.md MUST be rewritten to include:
  - Project description and purpose
  - Architecture overview (linking to ADS)
  - Technology stack with badges
  - Installation and setup instructions
  - Environment variables documentation
  - Available scripts
  - Project structure
  - Contributing guidelines
  - License
  - Links to ADS document and governance contract
- README updates follow the same branching and approval rules as code changes.
- README lives on `main` and is updated with every major release.

---

## Workflow Summary Diagram

```
Jör (Owner)                    Broker (Consultant)
    |                                |
    |  1. Receives requirement       |
    |  <-----------------------------|
    |                                |
    |  2. Reviews & approves spec    |
    |  ----->  APPROVED / CHANGES    |
    |                                |
    |  3. Broker implements          |
    |                                |--- feature/xyz branch
    |                                |--- coding...
    |                                |--- tests...
    |                                |
    |  4. Broker creates PR          |
    |  <----- PR to staging ---------|
    |                                |
    |  5. Jör reviews PR             |
    |  -----> APPROVED / REQUEST CHG |
    |                                |
    |  6. Merge to staging           |
    |  <-----> staging ------------->|
    |                                |
    |  7. Jör verifies staging       |
    |                                |
    |  8. Jör merges staging -> main |
    |  9. Jör creates tag v{x.y.z}  |
    |                                |
    | 10. Release deployed           |
```

---

## File Structure (Post-Governance)

```
seller-images-contest-vue-typescript/
  .github/
    workflows/
      ci.yml                  # GitHub Actions CI pipeline
  specs/
    SPEC-P0-01-emergency-fixes.md
    SPEC-P1-01-foundation.md
    ...more specs...
  src/                        # Application source
  ADS-DOCUMENT.md             # Architecture Design Specification
  ESTIMATIONS-AND-RESOLUTIONS.md  # Time estimates and resolution plan
  GOVERNANCE-CONTRACT.md      # This file
  CHANGELOG-PROPOSALS.md      # Approved change proposals log
  DECISIONS.md                # Architecture Decision Records
  CHANGELOG.md                # Release changelog
  README.md                   # Professional project README
  ...
```

---

## Amendment Process

- Any change to this contract requires agreement from both Broker and Jör.
- Amendments are documented as version increments of this file.
- All parties must acknowledge the new version before it takes effect.

---

## Acceptance

By working under this governance model, both parties agree to all rules stated herein.

| | Broker | Jör |
|--|--------|-----|
| **Name** | Broker | Jör |
| **Signature** | __________________ | __________________ |
| **Date** | __________________ | __________________ |

---

*This contract is effective as of the date signed and governs all development activities for the Seller Images Contest project.*
