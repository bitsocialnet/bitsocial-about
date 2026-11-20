[![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](./LICENSE)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Bitsocial About

The public Bitsocial landing and ecosystem site served at [bitsocial.net](https://bitsocial.net/): the about pages, the project directory at `/projects`, the privacy page, and the `/api/release-integrity` endpoint that 5chan and Seedit use to verify release downloads.

It is a Vite + React app. Vercel serves the client build from `dist/` and renders pages on the server through the functions in `api/`, which load the SSR bundle from `dist-server/`. `vercel.json` holds the routes, security headers and the permanent redirects of `/docs` and `/stats` to their subdomains.

The site moved here from the `about/` folder of [bitsocialnet/bitsocial-web](https://github.com/bitsocialnet/bitsocial-web) with its history. The other sites from that repository live in [bitsocial-docs](https://github.com/bitsocialnet/bitsocial-docs) (docs.bitsocial.net), [bitsocial-chain](https://github.com/bitsocialnet/bitsocial-chain) (chain.bitsocial.net) and [bitsocial-stats](https://github.com/bitsocialnet/bitsocial-stats) (stats.bitsocial.net).

## Layout

```text
src/       React app (pages, components, lib) and the SSR entry
public/    Static assets, translations and the served llms.txt files
api/       Vercel functions: ssr.ts and release-integrity.ts
tests/     Playwright specs
scripts/   Dev servers, React perf tooling, llms generator, agent hooks and node tests
emails/    Newsletter welcome email templates
docs/agent-playbooks/   Contributor and agent workflow notes
```

## Getting started

Use the Node.js version in [`.nvmrc`](./.nvmrc) and Yarn 4 through Corepack.

```bash
nvm install && nvm use
corepack enable
corepack yarn install
corepack yarn start
```

`yarn start` serves the site with SSR at `https://bitsocial.localhost` through Portless; `PORTLESS=0 yarn start` uses a plain local port instead. `yarn start:android-usb` and `yarn start:ios-sim` preview it on a device.

## Commands

```bash
corepack yarn build            # typecheck, client build to dist/, SSR bundle to dist-server/
corepack yarn preview
corepack yarn typecheck
corepack yarn lint
corepack yarn format:check
corepack yarn knip
corepack yarn test:planet-theme   # Playwright specs in tests/
corepack yarn llms:check
corepack yarn llms:generate
corepack yarn doctor
corepack yarn deps:check-pinned
corepack yarn deps:check-hardened
```

The llms files also cover the docs and Chain sites, so `llms:generate` needs sibling checkouts of [bitsocial-docs](https://github.com/bitsocialnet/bitsocial-docs) at `../bitsocial-docs` and [bitsocial-chain](https://github.com/bitsocialnet/bitsocial-chain) with the site at `../bitsocial-chain/site` (override with `BITSOCIAL_DOCS_DIR` and `BITSOCIAL_CHAIN_SITE_DIR`). Without them it writes nothing, and `llms:check` checks only this site's files.

## Deployment

Vercel deploys `master` to bitsocial.net with these project settings:

| Setting          | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Root directory   | repository root                                                       |
| Install command  | `YARN_IGNORE_NODE=1 corepack yarn install --immutable`                |
| Build command    | `corepack yarn exec vite build --config vite.config.ts --outDir dist` |
| Output directory | `dist`                                                                |
| Node.js          | 22.x                                                                  |

## Newsletter env vars

The newsletter box stays disabled unless the build includes:

```bash
VITE_NEWSLETTER_SUBSCRIBE_URL=https://newsletter.bitsocial.net/api/bitsocial/subscribe
VITE_NEWSLETTER_LIST_UUIDS=<list-uuid>
```

The subscribe URL should point at the Bitsocial newsletter gateway, not raw listmonk, so server-side delivery providers and welcome emails can change without touching the frontend.

Optional:

```bash
VITE_NEWSLETTER_CONFIRMATION_REQUIRED=false
```

Set `VITE_NEWSLETTER_CONFIRMATION_REQUIRED=true` only when the backend really uses a double opt-in flow.

## License

[AGPL-3.0](./LICENSE)
