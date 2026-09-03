# SPEC-P4-07: EST-L08 — Deliver Open Graph / Twitter Preview Image (og-image.png)

| Field | Value |
|-------|-------|
| **Status** | DRAFT (awaiting PR review) |
| **Topic** | Make the Open Graph / Twitter Card preview image actually work by delivering the `og:image` asset that the existing tags already reference. Single topic: the missing OG/Twitter preview image. Nothing else. |
| **Estimate** | 1.5h (asset 0.75h, audit 0.25h, docs 0.25h, verify 0.25h) |
| **Branch** | `feature/est-l08-open-graph` |
| **Proposal** | PROPOSAL-2026-020 |
| **ADS Reference** | Section 9.1 (Current SEO State), EST-L08 |
| **EST Reference** | EST-L08 (Open Graph & Twitter Cards) |

## 1. Context

The SEO metadata (SPEC-P3-05, merged) already added the full set of Open Graph and Twitter Card tags to `index.html`, including:

```
<meta property="og:image" content="/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:image" content="/og-image.png" />
```

However, the asset these tags reference — `public/og-image.png` — **does not exist**. The `public/` directory only contains `404.html` and `favicon.ico`. Consequently, when the link is shared on WhatsApp, Facebook, LinkedIn, Slack or Twitter/X, those platforms request `/og-image.png`, get a **404**, and fall back to showing a blank/placeholder preview (or no image). The nice preview image the tags promise is broken.

This was anticipated in SPEC-P3-05 §8 ("Risk: `og:image` value points at a missing asset → mitigation: use a real, existing asset URL or a safe placeholder; verify reachable"). EST-L08 is exactly this remaining piece: **deliver the actual preview image asset** so `og:image`/`twitter:image` resolve to a real, reachable file.

## 2. Topic & Scope

- **Topic:** add the missing `public/og-image.png` (1200×630) that the existing OG/Twitter tags reference, so social-network previews render a branded image.

**In scope:**
- Generate a valid 1200×630 PNG at `public/og-image.png` (brand teal `#00b19d` background, white Arial title "Imágenes del mundo", subline "Concurso de vendedores · Vota por tu favorito")
- Confirm it matches the declared `og:image:width` (1200) / `og:image:height` (630)
- Confirm the production build (`vite build`) copies the file into `dist/` so it is served at `/og-image.png`

**Out of scope (forbidden in this branch):**
- Changing any existing OG/Twitter tag values, `index.html`, or the canonical URL
- Any `.vue`, JS/TS, or SCSS changes
- `robots.txt`, `sitemap.xml`, JSON-LD, dynamic/per-route meta (own PRs — see SPEC-P3-05)
- Regenerating the source `og-image.png` in the future by hand — it should only change in a deliberate, reviewed PR
- Fixing the pre-existing `npm audit` advisories (own topic)

## 3. Design in plain words

The OG and Twitter tags are the "business card" a sharing app displays when your link is pasted. Right now that business card names a photo that doesn't exist — the card looks empty. This change puts a real, on-brand photo in the frame (`og-image.png`, 1200×630), sized exactly as `og:image:width/height` promise. Nothing about the page's look or behaviour changes; we only make the already-declared preview image real and reachable at `/og-image.png` in the deployed build.

## 4. The five design principles, in plain words

- **S — one job.** The asset serves exactly one purpose: the social preview image referenced by `og:image` and `twitter:image`.
- **O — easy to replace.** It's a static file in `public/`, so swapping in a new brand image later is a one-file change (no code, no config).
- **L — interchangeable.** It's independent of every other tag; the tags already work with any image URL.
- **I — only what's needed.** A single 1200×630 PNG; we do not add superfluous formats or dimensions.
- **D — truth from one source.** The file's real 1200×630 dimensions are the same values declared in `og:image:width/height`, and both `og:image` and `twitter:image` point at the same file — one fact, consistent everywhere.

## 5. Where things live and why

```
public/
  404.html          (existing)
  favicon.ico       (existing)
  og-image.png      (NEW — 1200×630, served at /og-image.png)
```

Why: Vite copies the entire `public/` directory verbatim into `dist/` at build time, so a file at `public/og-image.png` is served at the absolute path `/og-image.png` — exactly what `og:image` and `twitter:image` reference. No bundler config, no imports, no code changes needed.

## 6. Rules going forward

- [ ] `og:image:width`/`og:image:height` in `index.html` must always match the actual pixel dimensions of `public/og-image.png`
- [ ] Any regeneration of `og-image.png` must be a deliberate, reviewed change (not regenerated locally and committed ad hoc)
- [ ] Both `og:image` and `twitter:image` continue pointing at the same file (no drift)

## 7. Acceptance Criteria

- [ ] `public/og-image.png` exists, is a valid PNG (signature `89 50 4E 47…`), dimensions exactly **1200×630**
- [ ] `index.html` `og:image`/`twitter:image` (`/og-image.png`) and the `og:image:width/height` values are unchanged and now resolve to that real file
- [ ] `npm run build` exits 0 and copies the file to `dist/og-image.png` (reachable at `/og-image.png`)
- [ ] `npm run lint`, `npm run type-check`, `npm run test:unit` all exit 0 (unchanged — no code touched)
- [ ] Touched files: `public/og-image.png`, `specs/SPEC-P4-07-*.md`, `CHANGELOG-PROPOSALS.md` only (no code change)

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Generated asset is corrupt or wrong size | Low | Medium | verified: valid PNG signature `89 50 4E 47`, exactly 1200×630, ~15.5 KB |
| Vite doesn't serve `/og-image.png` | Low | Medium | `public/` is copied verbatim to `dist/` by Vite; confirmed in build output |
| Text rendering differs across OS fonts | Low | Low | Arial is guaranteed on the target deploy env at build time; it's a static asset held in the repo |
| Drift between file dimensions and `og:image:width/height` | Low | Medium | RULE above keeps them in sync |

## 9. Testing Strategy

- Programmatic check: PNG signature bytes + `System.Drawing` reads back exactly 1200×630
- Build check: `npm run build` → confirm `dist/og-image.png` exists
- Gates: `npm run lint`, `npm run type-check`, `npm run test:unit` (no code touched; expected green)

## 10. Estimate & Dependencies

- **Estimate:** 1.5h
- **Dependencies:** none — completes the asset promised by SPEC-P3-05 (merged)
- **Branch:** `feature/est-l08-open-graph`

---

## Approval

- **Jör Approved:** (pending)
- **Status:** DRAFT — await PR review on GitHub