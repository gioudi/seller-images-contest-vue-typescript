# SPEC-F02: Accessibility Reader / Screen Reader Support

## Status: DRAFT

## Purpose
Make the application fully usable by blind and visually impaired users through comprehensive WCAG 2.1 AA compliance, proper semantic HTML, ARIA attributes, keyboard navigation, and screen-reader announcements.

## Scope

### Included
- WCAG 2.1 AA compliance across all views and components
- ARIA labels on all interactive elements
- Accessible modal (`WinnerModal.vue`) with focus trap and ESC handling
- Skip-to-content navigation link
- `aria-live` regions for dynamic content announcement
- Visible focus indicators
- WCAG AA color contrast (4.5:1) for all text
- Form accessibility (labels, error association, `aria-describedby`)
- Proper heading hierarchy (h1 > h2 > h3, no skips)
- Keyboard navigation for carousel and custom controls
- Screen reader announcement composable `useAnnouncer()`
- Lighthouse accessibility audit >= 95/100

### Excluded
- Screen-magnifier-specific optimizations (v2)
- Voice control compatibility testing (v2)
- Custom audio description DVR functionality (requires backend)

## Acceptance Criteria
- [ ] Lighthouse accessibility score >= 95
- [ ] All interactive elements focusable and operable via keyboard
- [ ] Modal traps focus, supports ESC to close, announches when opened
- [ ] All images have meaningful `alt` text
- [ ] All form inputs have associated labels and error messages announced
- [ ] Skip-to-content link is first tabbable element and visible on focus
- [ ] Color contrast meets WCAG AA for all text in both themes (light + dark)
- [ ] Heading hierarchy is logical across all views
- [ ] `useAnnouncer()` works for async content updates
- [ ] axe-core automated checks pass via CI

## WCAG 2.1 AA Compliance Matrix

| Criterion | Requirement | Verification |
|-----------|-------------|--------------|
| 1.1.1 Non-text Content | Descriptive alt text on all images | Manual + axe-core |
| 1.3.1 Info & Relationships | Semantic HTML, label associations | axe-core |
| 1.4.3 Contrast (AA) | 4.5:1 normal text, 3:1 large text | Contrast checker |
| 1.4.10 Reflow | No horizontal scroll at 320px | Manual test |
| 1.4.11 Non-text Contrast | 3:1 for UI component boundaries | Contrast checker |
| 2.1.1 Keyboard | All functionality keyboard accessible | Manual keyboard test |
| 2.4.1 Bypass Blocks | Skip navigation link present | Manual + axe-core |
| 2.4.3 Focus Order | Logical DOM/tab order | Manual test |
| 2.4.7 Focus Visible | Clear focus indicator on all elements | Manual + CSS audit |
| 2.5.5 Target Size | 44x44px minimum touch targets | Manual measure |
| 3.3.1 Error Identification | Errors described in text | Manual form test |
| 3.3.2 Labels or Instructions | All inputs labeled | axe-core |
| 4.1.2 Name, Role, Value | ARIA on custom components | axe-core |

## Technical Approach

### New Files
| File | Purpose |
|------|---------|
| `src/components/SkipToContent.vue` | Hidden link visible on focus |
| `src/composables/useAnnouncer.ts` | Screen-reader announcement helper |
| `src/composables/useFocusTrap.ts` | Modal focus trap logic |
| `src/directives/vFocus.ts` | Auto-focus directive |

### Modified Files
| File | Change |
|------|--------|
| `App.vue` | Add SkipToContent, semantic structure, `aria-live` region |
| `WinnerModal.vue` | Focus trap, `role="dialog"`, `aria-modal`, ESC handling |
| `ImageList.vue` | ARIA on vote buttons, `aria-live` for winner announcement |
| `CarouselFile.vue` | Keyboard navigation, ARIA carousel roles |
| `InvoiceForm.vue` | Error association via `aria-describedby` |
| `styles/_variables.scss` | Contrast-compliant color tokens |
| `styles/base/_reset.scss` | Global focus indicator styles |

### Accessibility Patterns to Implement
1. **Skip link**: First element in `<body>`, targets `#main-content`
2. **Modal pattern**: `role="dialog" aria-modal="true"`, focus trap, restore focus on close
3. **Live regions**: `aria-live="polite"` for loading and async content updates
4. **Announcer**: Hidden visually-but-present region that receives messages
5. **Focus ring**: `:focus-visible` global style, `outline: 3px solid` with 2px offset

## Testing Strategy
- `axe-core` automated tests in CI (Lighthouse + Jest integration)
- Keyboard-only navigation walkthrough for all 3 views
- Screen reader verification (NVDA + VoiceOver) on main flows
- Color contrast automated checks
- Jest tests for `useFocusTrap` and `useAnnouncer`

## Estimated Time
32 hours (4 work days)

## Dependencies
- SPEC-P0-01 (Emergency fixes must be in place)
- EST-M06 (SCSS architecture refactor enables clean color tokens)

## Approval
- **Broker:** Pending
- **Jör:** Pending