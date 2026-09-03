# Seller Images Contest

A Vue 3 application that lets users search inspiring images (Unsplash), vote for their favorite sellers in a points-based contest, and create a sales invoice via the Alegra API.

This repo has been progressively hardened under a **governance-driven** workflow: Spec-Driven Development, small pull requests, state management on Pinia, and a build/test setup on Vite + Vitest. See [Governance](GOVERNANCE-CONTRACT.md) and [Architecture](ADS-DOCUMENT.md).

## Features

- **Image search** — search Unsplash by keyword ("¿Qué estás buscando?").
- **Sales contest** — each seller is matched to an image; vote +3 points; when a seller reaches 20 points the contest ends and a winner is shown.
- **Invoice creation** — fill a form to create a sales invoice through the Alegra API.

## Demo

- [Live demo](https://imagenes-mundo.netlify.app/)

## Technologies

| Area | Stack |
|------|-------|
| Framework | [Vue 3](https://vuejs.org/) (Composition API, `<script setup>` ready) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| State | [Pinia](https://pinia.vuejs.org/) |
| Build & dev server | [Vite](https://vitejs.dev/) |
| Testing | [Vitest](https://vitest.dev/) + [@vue/test-utils](https://test-utils.vuejs.org/) + jsdom |
| Routing | [Vue Router](https://router.vuejs.org/) |
| HTTP / APIs | [Axios](https://axios-http.com/) + [unsplash-js](https://github.com/unsplash/unsplash-js) |
| Styling | SCSS (Sass) |
| Linting | ESLint + Prettier |
| Notifications | vue-toastification |

## Getting Started

### Prerequisites

- Node.js **18+** (project runs on Node 22.x; Vite 8 requires a modern Node)
- npm

### Installation

```bash
# 1. Clone
git clone https://github.com/gioudi/seller-images-contest-vue-typescript.git
cd seller-images-contest-vue-typescript

# 2. Install dependencies
npm install

# 3. Configure environment variables (see below)
cp .env.example .env
```

### Environment Variables

Create a `.env` file from `.env.example`. **Never commit `.env` with real keys.**

| Variable | Description |
|----------|-------------|
| `VITE_ALEGRA_API_KEY` | Alegra API key (Basic Auth header) |
| `VITE_ALEGRA_BASE_URL` | Alegra base URL (defaults to `https://api.alegra.com/api/v1/`) |
| `VITE_UNSPLASH_ACCESS_KEY` | Unsplash API access key |

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` / `npm run serve` | Start the Vite dev server with hot reload |
| `npm run build` | Build a production bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run test:unit` | Run the Vitest unit suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run lint` | Lint `src` and `tests` (ESLint + Prettier) |

## Usage

1. **Search images** — on the landing page, type a keyword and click **Buscar** to go to the image list.
2. **Vote** — on the list, click **Votar** on a seller card to give +3 points. The contest ends when a seller reaches 20 points.
3. **Create an invoice** — after a winner is chosen, click through to the invoice form and submit the required details.

## Project Structure

```
seller-images-contest-vue-typescript/
  src/
    components/          # Reusable UI components (bylayer, e.g. search/, seller/)
    composables/         # Reusable logic helpers (useImages, useSellers, useContest, ...)
    config/              # App constants (contest rules, URLs)
    routes/              # Vue Router routes
    services/            # API clients (Alegra, Unsplash)
    stores/              # Pinia stores + per-store types
    styles/              # Global SCSS (variables, base, mixins)
    utils/               # Shared utilities (toast, error messages)
    views/               # Page components (LandingPage, ImageList, InvoiceForm)
    App.vue              # Root component
    main.ts              # App bootstrap
  specs/                 # Governance specs per phase
  tests/unit/            # Vitest unit tests
  GOVERNANCE-CONTRACT.md # How the project is run
  ADS-DOCUMENT.md        # Architecture Design Specification
```

## Contributing

This project follows the rules in [GOVERNANCE-CONTRACT.md](GOVERNANCE-CONTRACT.md):

- Every change needs an approved spec (`specs/`) before code is written.
- Work happens on a dedicated branch and lands via a small Pull Request into `staging`.
- Only the project owner merges to `main` and tags releases.

## Architecture & Decisions

- [Architecture Design Specification (ADS)](ADS-DOCUMENT.md)
- [Architecture Decision Records (DECISIONS)](DECISIONS.md)
- [Estimations & Resolutions](ESTIMATIONS-AND-RESOLUTIONS.md)

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
