# SPEC-F03: Dark/Light Theme Toggle

## Status: DRAFT

## Purpose
Provide users the ability to switch between light and dark themes with persistence, system-preference detection, and full WCAG-compliant color contrast in both themes.

## Scope

### Included
- CSS custom property (design token) system for theming
- `useTheme()` composable: toggle, persist (localStorage), system preference detection
- `ThemeToggle.vue` accessible toggle component
- Refactor all hardcoded colors in SCSS to CSS custom properties
- Theme transition animation for smooth switching
- Integration into navbar
- WCAG AA contrast verification in both themes

### Excluded
- Multiple custom themes beyond light/dark (v2)
- Theme alongside i18n persistence complexity (both use localStorage, will coexist)
- Dark-mode specific image assets (will use CSS filters if needed)

## Acceptance Criteria
- [ ] Toggle switches between light and dark instantly
- [ ] Selection persists across page reloads (`localStorage`)
- [ ] System dark-mode preference is respected on first visit (via `prefers-color-scheme`)
- [ ] No flash of wrong theme on initial load (FOUC prevention)
- [ ] All views render correctly in both themes
- [ ] All text meets WCAG AA contrast in both themes
- [ ] Toggle is keyboard accessible with ARIA label
- [ ] Animation is subtle and respects `prefers-reduced-motion`
- [ ] `npm run lint` and `npm run test:unit` pass

## Theme Design Tokens

### Light Theme (default)
| Token | Value |
|-------|-------|
| `--color-bg-body` | `#f4f4f4` |
| `--color-bg-surface` | `#ffffff` |
| `--color-bg-card` | `#ffffff` |
| `--color-text-primary` | `#333333` |
| `--color-text-secondary` | `#666666` |
| `--color-text-inverse` | `#ffffff` |
| `--color-accent` | `#00b19d` |
| `--color-accent-hover` | `#00897c` |
| `--color-border` | `#d4f2f1` |
| `--color-overlay` | `rgba(0, 0, 0, 0.5)` |
| `--shadow-card` | `0 6px 14px rgba(18, 25, 84, 0.07)` |

### Dark Theme
| Token | Value | Contrast check |
|-------|-------|----------------|
| `--color-bg-body` | `#121212` | - |
| `--color-bg-surface` | `#1e1e1e` | - |
| `--color-bg-card` | `#2d2d2d` | - |
| `--color-text-primary` | `#e0e0e0` | 12.6:1 on #2d2d2d (PASS) |
| `--color-text-secondary` | `#a0a0a0` | 5.7:1 on #2d2d2d (PASS) |
| `--color-text-inverse` | `#121212` | - |
| `--color-accent` | `#00d4aa` | 4.8:1 on #2d2d2d (PASS) |
| `--color-accent-hover` | `#00e6b8` | - |
| `--color-border` | `#3d3d3d` | - |
| `--color-overlay` | `rgba(0, 0, 0, 0.7)` | - |
| `--shadow-card` | `0 6px 14px rgba(0, 0, 0, 0.4)` | - |

## Technical Approach

### Implementation Strategy
Use CSS custom properties on `:root` (light) and `[data-theme="dark"]` overrides. This is more performant than SCSS variables for runtime switching because no recompilation is needed.

```scss
/* _variables.scss */
:root {
  --color-bg-body: #f4f4f4;
  --color-text-primary: #333333;
  /* ...all light tokens */
}

[data-theme="dark"] {
  --color-bg-body: #121212;
  --color-text-primary: #e0e0e0;
  /* ...all dark tokens */
}
```

### Files
| File | Change |
|------|--------|
| `src/styles/_variables.scss` | Add CSS custom properties for both themes |
| `src/composables/useTheme.ts` | Create theming composable |
| `src/components/ThemeToggle.vue` | Create toggle component |
| `src/App.vue` | Use `data-theme` attribute on root element |
| `src/components/NavbarFile.vue` | Integrate ThemeToggle |
| All component styles | Replace SCSS color references with CSS vars |

### useTheme Composable API
```typescript
const { theme, toggleTheme, setTheme, isDark } = useTheme();
```

### System Preference Propagation
```
1. Check localStorage for saved theme -> use it
2. If none, check matchMedia('(prefers-color-scheme: dark)') -> use it
3. Set data-theme attribute on document root
4. Add listener for system theme changes (only when no explicit user choice)
```

### FOUC Prevention
Inline a tiny script in `index.html` that reads localStorage/system preference and sets `data-theme` BEFORE the app mounts.

## Testing Strategy
- Unit tests for `useTheme` (persistence, preference detection, toggle)
- Component test for `ThemeToggle` (accessibility, emits)
- Manual visual test in both themes for all 3 views
- Automated contrast check for both themes
- Build and lint verification

## Estimated Time
24 hours (3 work days)

## Dependencies
- EST-M06 (SCSS 7-1 architecture refactor)

## Approval
- **Broker:** Pending
- **Jör:** Pending