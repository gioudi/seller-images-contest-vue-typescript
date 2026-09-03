# SPEC-P3-05: SEO — Meta Tags, Open Graph & Font Preconnect (EST-L06 / L07 / L08)

| Field | Value |
|-------|-------|
| **Status** | DRAFT (awaiting Jör approval via PR) |
| **Topic** | Improve how search engines and social networks see the app, and speed up font loading, by adding the right metadata to the page's `<head>` (EST-L06, L07, L08). Single topic: SEO + page metadata + font preconnect. Nothing else. |
| **Estimate** | 6.5h (L06: 0.2h, L07: 4h, L08: 2h) |
| **Branch** | `feature/seo-meta-tags` |
| **Proposal** | PROPOSAL-2026-010 |
| **ADS Reference** | Section 9.1 (Current SEO State: POOR), 9.2 (SEO Recommendations) |

## 1. Context

Right now our homepage sends search engine bots and social networks very little information to work with:

- The page's language says nothing (`<html lang="">`), so search engines can't tell the content is Spanish.
- There is **no description** — the short paragraph a search engine shows under your title in results is absent, so it auto-picks (or shows nothing useful).
- When someone shares a link on WhatsApp, Facebook, Slack, LinkedIn or Twitter/X, there are **no Open Graph / Twitter Card tags**, so the app can't tell those platforms "here's the title, a good description, and a nice preview image to show." Links share as a bare, ugly URL.
- There is **no canonical link** — no way to say "this is the *official* address of this page," which matters if the same page can be reached from more than one URL.
- The Google Font is loaded, but the browser doesn't get an early "preconnect" hint, so font downloading starts later than it could — adding a small delay to first render.

The ADS flags all of this (Section 9.1 "Current SEO State: POOR"). This step fixes the parts that live in the single `index.html` `<head>`: proper language, base title + description + meta tags, canonical, Open Graph and Twitter Cards, and the preconnect hint. The app must keep looking and behaving exactly as it does now — this only adds "invisible" metadata and a network hint, nothing visual. That is the acceptance bar.

## 2. Topic & Scope

- **Topic:** add static SEO + social-sharing metadata and the Google Fonts preconnect hint, all in `index.html`. No visual or behavior change.

**In scope (all inside `index.html`):**
- **EST-L06 — Google Fonts preconnect (0.2h):**
  - `<link rel="preconnect" href="https://fonts.googleapis.com">`
  - `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
- **EST-L07 — SEO meta tags (4h):**
  - `<html lang="es">` (content is Spanish — the app is the "Imágenes del mundo" contest)
  - Proper `<title>` (already present; keep/refine wording)
  - `<meta name="description">` (a clear 1–2 sentence summary)
  - `<meta name="author">`, `<meta name="robots">`, `<meta name="keywords">`, `<meta name="theme-color">`
  - `<link rel="canonical">` — the official URL of the page
- **EST-L08 — Open Graph & Twitter Cards (2h):**
  - Open Graph: `og:title`, `og:description`, `og:type`, `og:url`, `og:image` (+ `og:image:width/height/alt`), `og:site_name`, `og:locale`
  - Twitter Cards: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:site`

**Out of scope (forbidden in this branch):**
- Any visual/appearance change
- Route-specific / dynamic meta per screen using a head library (`@vueuse/head`/`vue-meta`) — this is a bigger, separate concern (own PR)
- `robots.txt`, `sitemap.xml`, JSON-LD structured data (own PRs)
- Server-side rendering / prerendering (a whole separate track)
- Any `.vue` or JS logic changes

## 3. Design in plain words

Imagine you're introducing the app to two kinds of visitors you never see face to face: **search engines** and **social networks**. They only read the "name tag" (the `<head>`) of your page. Right now that name tag is nearly blank.

- **SEO meta tags = "fill out the name tag."** You tell Google, "Hello, my name is Imágenes del mundo, I'm in Spanish, this is my one-line summary, here's the author, and this is my official web address." When someone searches, the result can show a proper title and a helpful summary instead of a blank line.

- **Open Graph = "the business card that gets shared."** Open Graph is a protocol Facebook invented; the `og:` tags tell any sharing platform (WhatsApp, Facebook, LinkedIn, Slack) what title, summary, and preview picture to show when your link is pasted. Twitter uses its own `twitter:` tags for the same idea.

- **Preconnect = "knock on the door early."** Your app uses a Google-hosted font. Before the browser can download that font it must first make a connection to Google's servers. Preconnect says "start that connection now, in advance," so by the time it actually needs the font the connection is already open — the font shows a touch sooner.

None of this changes what *you* see on screen. It changes what search engines and social apps can find *out* about the page, and shaves a little latency off the font.

## 4. The five design principles, in plain words

- **S — each tag has one job.** The title does the title, the description does the description, the canonical says the address, each OG/Twitter tag covers exactly one piece of the preview. No tag does two things.
- **O — easy to grow.** Every new page or feature can reuse the same patterns; adding a preview image or Twitter handle later is a one-line edit.
- **L — interchangeable pieces.** Each tag is independent. You can change the description or the preview image without touching the rest.
- **I — only what's needed.** We add exactly the tags that matter (title, summary, address, preview), not a huge pile of redundant metadata.
- **D — the data flows from clear sources.** The title/description/image are the same "facts" about the app in every tag — one clear source of truth repeated consistently, so Google and social apps tell the same story.

## 4b. Technical design patterns & vocabulary

The formal names of the techniques this step applies (handy to reference in interviews). Each maps to a plain-language idea above.

- **`<head>` metadata** — the collection of `<meta>` elements, `<title>` and `<link>` tags that describe a page without rendering anything on screen.
- **SEO (Search Engine Optimization)** — shaping markup so search engines can understand and rank a page; here via meta tags, `lang`, canonical, robots hints.
- **Meta description** — the `<meta name="description">` snippet search engines may show as the result summary (and a ranking/CTR factor in practice).
- **Canonical URL (`rel="canonical"`)** — declares the authoritative address for a page, consolidating duplicate URLs and preventing diluted ranking (a core **duplicate-content** technique).
- **`lang` attribute / document language** — signals the page language to search engines, screen readers and translation tools (`lang="es"`).
- **Open Graph protocol** — Facebook's `og:` meta tag standard that lets any web page control how it appears when shared (title, description, image, type, URL). Widely adopted beyond Facebook.
- **Twitter Cards** — Twitter's `twitter:` meta tags, the same idea as Open Graph but for Twitter/X previews (summary card, summary_large_image, etc.).
- **Resource hints** — `<link rel="preconnect">` (and `dns-prefetch`, `preload`, `prefetch`) tell the browser to start network/lookup work early. Here it warms the connection to `fonts.googleapis.com`/`fonts.gstatic.com` before the font is requested, improving **LCP (Largest Contentful Paint)** and perceived performance.
- **`robots` meta / head-extrinsic handling** — how crawlers are told what to index (search engines mostly index the full subdomain now; the directive remains a meaningful, lightweight signal).

## 5. Where things live and why

```
index.html
  <head>
    <html lang="es">                          ← L07 (language)
    <meta name="description"> …               ← L07
    <meta name="author"> <meta name="robots">
    <meta name="keywords"> <meta name="theme-color">
    <link rel="canonical" href="…">           ← L07
    <link rel="preconnect" href="https://fonts.googleapis.com">       ← L06
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> ← L06
    <meta property="og:title"> … og:description/type/url/image …      ← L08
    <meta name="twitter:card"> … twitter:title/description/image …    ← L08
  </head>
```

Why this shape: `index.html` is the single entry the server sends to every visitor and bot, so static, app-wide metadata belongs here — one obvious place, no JS needed, parseable on the very first byte. Dynamic per-route metadata would need a head-management library and a separate PR (out of scope).

## 6. Rules going forward (so this stays clean)

- [ ] Keep `<html lang="es">` in sync with the app's actual language
- [ ] Any new page-level metadata via a head library goes in its own concern (not dumped into `index.html`)
- [ ] OG and Twitter tags always describe the same title, summary and image (no drift between them)
- [ ] Keep the canonical URL pointed at the official public address of the app

## 7. Acceptance Criteria

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm run test:unit` exits 0 (unchanged behavior — tests unaffected)
- [ ] `index.html` has `<html lang="es">`
- [ ] `index.html` has a non-empty `<meta name="description">`, canonical link, and the core SEO meta tags
- [ ] `index.html` has Google Fonts `preconnect` links (`fonts.googleapis.com` + `fonts.gstatic.com`)
- [ ] `index.html` has Open Graph (`og:*`) and Twitter Card (`twitter:*`) tags
- [ ] Manual `npm run dev` smoke: page renders identically; title still correct; no missing fonts (preconnect didn't break font loading)

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Typo in a tag breaks markup | Low | Low | Tags added inside `<head>` only; verify with build + manual view of rendered head |
| `theme-color`/`og:image` value points at a missing asset | Low | Low | use a real, existing asset URL or a safe placeholder; verify reachable |
| Preconnect with wrong `crossorigin` still fine | Low | Low | `fonts.gstatic.com` needs `crossorigin`; `fonts.googleapis.com` does not — follow exact patterns |
| Drift between OG and Twitter tag values | Low | Low | keep both describing the same title/summary/image per RULE above |
| Scope creep into route-meta / sitemap / structured data | Medium | Low | explicit out-of-scope; separate PRs |

## 9. Testing Strategy

- Gate: `npm run build` + `npm run lint` + `npm run test:unit`
- Manual: open the dev server, view page source, confirm `<head>` contains all new tags and the page renders identically
- Confirm fonts still load (preconnect didn't change font rendering)

## 10. Estimate & Dependencies

| Task | h |
|------|---|
| SPEC + branch setup | 0.5 |
| EST-L06 Google Fonts preconnect | 0.2 |
| EST-L07 SEO meta tags (`lang`, title, description, canonical, author, robots, keywords, theme-color) | 4.0 |
| EST-L08 Open Graph + Twitter Cards | 2.0 |
| gate (build/lint/test) + manual smoke | 0.5 |
| Docs (spec status, CHANGELOG proposal) | 0.3 |
| **Total** | **7.5** |

**Dependencies:** EST-L03/L04/L05 lazy-loading merged to staging ✅. Next after this: remaining L-wave (L09 heading hierarchy, L10 TS 5.x, L11 ESLint/Prettier) as separate PRs, then the **v1.0.2** release.

---

## Approval

- **Jör Approved:** (pending)
- **Status:** DRAFT — await PR review on GitHub
