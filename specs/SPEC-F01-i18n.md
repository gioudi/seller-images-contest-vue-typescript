# SPEC-F01: I18n - Internationalization (es / en / de)

## Status: DRAFT

## Purpose
Make the application fully internationalized with professional, brand-consistent copywriting in three languages: Spanish (es), English (en), and German (de). This includes rewriting all user-facing messages that currently have grammatical errors and informal phrasing (example: "Felicitationes!" is a typo of "Felicitaciones!").

## Scope

### Included
- Install and configure `vue-i18n` (v9+ for Vue 3)
- Create locale files: `es.json`, `en.json`, `de.json`
- Extract ALL existing Spanish text from templates and scripts into translation keys
- Professionally rewrite every message in all 3 languages
- Create `LanguageSwitcher.vue` component
- Persist selected locale in `localStorage`
- Reactively update `<html lang>` attribute
- Unit test the translation key completeness across all 3 locales

### Excluded
- Right-to-left (RTL) language support
- Automatic browser-locale detection (v1 - manual selection only)
- Translation of API error messages returned from backend
- Date/number localization formatting (v2)

## Acceptance Criteria
- [ ] All user-visible strings come from translation keys (zero hardcoded Spanish in templates)
- [ ] All 3 locale files have identical key sets (tested by unit test)
- [ ] LanguageSwitcher works and persists selection
- [ ] `<html lang>` updates reactively with locale selection
- [ ] German text does not cause layout overflow (tested at min supported width)
- [ ] Professional copy in all 3 languages (grammar and tone verified)
- [ ] `npm run lint` passes
- [ ] `npm run test:unit` passes with i18n coverage

## Message Catalog (Professional Rewrite Required)

### Navigation (~5 strings)
| Current (Spanish) | Issues | Proposed (en) |
|-------------------|--------|----------------|
| "Imágenes del mundo" | Needs brand voice | "Images of the World" |
| "Volver" | Generic button | "Back to Home" |

### Form Labels (~15 strings)
| Current | Issues | Proposed |
|---------|--------|----------|
| "Fecha:" | Neutral, acceptable | "Invoice Date:" (professional) |
| "Id Cliente:" | Abbreviation, informal | "Client ID:" |
| "Id Producto:" | Abbreviation | "Product ID:" |

### Buttons (~8 strings)
| Current | Issues | Proposed |
|---------|--------|----------|
| "Buscar" | Fine but could be clearer | "Search Images" |
| "Votar" | Ambiguous | "Vote" |
| "Crear factura" | Mixed grammar | "Create Invoice" |

### Validation/Error Messages (~14 strings)
| Current | Issues | Proposed |
|---------|--------|----------|
| "Todos los campos son necesarios!" | Punctuation, tone | "All fields are required." |
| "Felicitationes!" | **Typo** (should be "Felicitaciones!") | "Congratulations!" |
| "Error fetching sellers" | English error in Spanish UI | Localized per locale |

### Loading/Success/Info (~13 strings)
| Current | Issues | Proposed |
|---------|--------|----------|
| "Procesando su solicitud, por favor espere..." | Wordy | "Loading, please wait..." |
| "El ganador es X!" | Informal | "The winner is X!" |

### Page Headings (~6 strings)
| Current | Issues | Proposed |
|---------|--------|----------|
| "Descubre Imágenes que Inspiran" | Needs review | "Discover Inspiring Images" |
| "Lista de Imágenes que Inspiran" | Redundancy with title above | "Inspiring Images List" |
| "Crear factura de venta!" | Informal punctuation | "Create Sales Invoice" |

**Estimated total: ~59 unique strings x 3 languages = ~177 translations**

## Technical Approach

1. `npm install vue-i18n`
2. Create `src/i18n/index.ts` with `createI18n()` using global scope
3. Create `src/locales/es.json`, `en.json`, `de.json`
4. Register in `main.ts` via `app.use(i18n)`
5. Create `useLocale()` composable for persistence + reactive lang attribute
6. Create `LanguageSwitcher.vue` (accessible select or button group)
7. Replace all hardcoded strings with `t()` calls in `<script setup>`
8. Add unit test: `locales.test.ts` verifies key parity AND no missing keys

## Testing Strategy
- Unit: key parity test across all 3 locale files
- Unit: `useLocale` composable test (persistence, reactivity)
- Component: `LanguageSwitcher` renders and switches locale
- Manual: visual check in all 3 languages at mobile and desktop widths

## Estimated Time
40 hours (5 work days)

## Dependencies
- SPEC-P1-01 (Foundation) - type safety must be in place
- Standardized `<script setup>` (EST-M03) - will be done in Phase 2

## Approval
- **Broker:** Pending
- **Jör:** Pending