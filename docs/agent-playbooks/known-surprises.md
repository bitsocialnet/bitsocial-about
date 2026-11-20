# Known Surprises

This file tracks repository-specific confusion points that caused agent mistakes.

## Entry Criteria

Add an entry only if all are true:

- It is specific to this repository (not generic advice).
- It is likely to recur for future agents.
- It has a concrete mitigation that can be followed.

If uncertain, ask the developer before adding an entry.

## Entry Template

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Entries

### Vercel app production domains can drift back to Git master deployments

- **Date:** 2026-04-28
- **Observed by:** Tommaso + Codex
- **Context:** Verifying Seedit and 5chan app mirrors in the Bitsocial Web app directory.
- **What was surprising:** The Vercel `seedit` and `5chan` projects had `gitProviderOptions.createDeployments = "enabled"`, so GitHub `master` pushes were promoted to the production domains even though the repo policy expects production app mirrors to serve release artifacts only.
- **Impact:** App-directory verified mirror badges can become false because production domains serve the latest development commit instead of the GitHub release ZIP whose `index.html` hash is recorded in `src/lib/apps-data.ts`.
- **Mitigation:** Before adding or refreshing mirror verification metadata, check the Vercel project with `vercel api /v9/projects/<project-id>` and confirm `gitProviderOptions.createDeployments = "disabled"`. Deploy release ZIP contents with `vercel deploy --prebuilt --prod` and use `seedit-omega.vercel.app` or `5chan-omega.vercel.app` for development deployments.
- **Status:** confirmed

### Portless 0.11 reuses legacy proxy state unless the launcher forces HTTPS

- **Date:** 2026-04-28
- **Observed by:** Tommaso + Codex
- **Context:** Upgrading the normal `yarn start` flow from the old `http://bitsocial.localhost:1355` proxy URL to `https://bitsocial.localhost`.
- **What was surprising:** Even with `portless@0.11.1` installed, Portless reused the existing `~/.portless/proxy.port = 1355` HTTP proxy and printed the legacy `:1355` URL.
- **Impact:** Updating package versions and docs is not enough; `yarn start` can still advertise and use the old URL when a contributor has legacy Portless state running.
- **Mitigation:** Keep the start scripts explicitly starting the Portless HTTPS proxy on port `443` before registering app routes, so the runtime flow migrates away from persisted `1355` state instead of inheriting it.
- **Status:** confirmed

### Portless changes the canonical local app URL

- **Date:** 2026-03-18
- **Observed by:** Codex
- **Context:** Browser verification and smoke flows
- **What was surprising:** The default local URL is not the usual Vite port. The repo expects `https://bitsocial.localhost` through Portless, so checking `localhost:3000` or `localhost:5173` can hit the wrong app or nothing at all.
- **Impact:** Browser checks can fail or validate the wrong target even when the dev server is healthy.
- **Mitigation:** Use `https://bitsocial.localhost` first. Only bypass it with `PORTLESS=0 corepack yarn start` when you explicitly need a direct Vite port.
- **Status:** confirmed

### Commitizen hooks block non-interactive commits

- **Date:** 2026-03-18
- **Observed by:** Codex
- **Context:** Agent-driven commit workflows
- **What was surprising:** `git commit` triggers Commitizen through Husky and waits for interactive TTY input, which hangs non-interactive agent shells.
- **Impact:** Agents can stall indefinitely during what should be a normal commit.
- **Mitigation:** Use `git commit --no-verify -m "message"` for agent-created commits. Humans can still use `corepack yarn commit` or `corepack yarn exec cz`.
- **Status:** confirmed

### Corepack is required to avoid Yarn classic

- **Date:** 2026-03-19
- **Observed by:** Codex
- **Context:** Package manager migration to Yarn 4
- **What was surprising:** The machine still has a global Yarn classic install on `PATH`, so running plain `yarn` can resolve to v1 instead of the pinned Yarn 4 version.
- **Impact:** Developers can accidentally bypass the repo's package-manager pinning and get different install behavior or lockfile output.
- **Mitigation:** Use `corepack yarn ...` for shell commands, or run `corepack enable` first so plain `yarn` resolves to the pinned Yarn 4 version.
- **Status:** confirmed

### Fixed Portless app names collide across Bitsocial Web worktrees

- **Date:** 2026-03-30
- **Observed by:** Codex
- **Context:** Starting `yarn start` in one Bitsocial Web worktree while another worktree was already serving through Portless
- **What was surprising:** Using the literal Portless app name `bitsocial` in every worktree makes the route itself collide, even when the backing ports are different, so the second process fails because `bitsocial.localhost` is already registered.
- **Impact:** Parallel Bitsocial Web branches can block each other even though Portless is meant to let them coexist safely.
- **Mitigation:** Keep Portless startup behind `scripts/start-dev.mjs`, which now uses a branch-scoped `*.bitsocial.localhost` route outside the canonical case and falls back to a branch-scoped route when the bare `bitsocial.localhost` name is already occupied.
- **Status:** confirmed

### Worktree shells can miss the repo's pinned Node version

- **Date:** 2026-04-03
- **Observed by:** Codex
- **Context:** Running `yarn start` in Git worktrees such as `.claude/worktrees/*` or sibling worktree checkouts
- **What was surprising:** Some worktree shells resolved `node` and `yarn node` to Homebrew Node `25.2.1` even though the repo pins `22.12.0` in `.nvmrc`, so `yarn start` could silently run the dev launchers under the wrong runtime.
- **Impact:** Dev-server behavior can drift between the main checkout and worktrees, making bugs hard to reproduce and violating the repo's expected Node 22 toolchain.
- **Mitigation:** Keep the dev launcher behind `scripts/start-dev.mjs`, which now re-execs under the `.nvmrc` Node binary when the current shell is on the wrong version. Shell setup should still prefer `nvm use`.
- **Status:** confirmed

### About-site no-JS checks must use the Portless route, not a standalone SSR preview

- **Date:** 2026-04-12
- **Observed by:** Codex
- **Context:** Verifying no-JS support for the about site from a branch worktree
- **What was surprising:** A standalone SSR preview can look healthy while the actual branch-scoped Portless route is still serving the wrong app shell or an older process. In this repo, the real local contract is the Portless hostname from `yarn start`, not an ad hoc preview server.
- **Impact:** Agents can incorrectly claim no-JS support works, or miss regressions that only show up on `*.bitsocial.localhost`.
- **Mitigation:** For about-site browser verification, always start the real local server with `yarn start` and test the branch-scoped Portless URL first. If a Portless hostname looks stale, inspect and stop the old process before retesting.
- **Status:** confirmed

### Browser P2P runs on secure WebSockets; pkc-js denies WebRTC and WebTransport by default

- **Date:** 2026-08-02
- **Observed by:** Claude
- **Context:** Writing landing-page and docs copy about how Bitsocial browser P2P works
- **What was surprising:** `@pkcprotocol/pkc-js` ships a default connection gater that rejects WebRTC and WebTransport dials in the browser — `dist/browser/helia/dial-transport-filter.js` exports `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Its source comment gives the reason: in the browser those transports add long, often-failing connection-establishment paths (STUN/ICE, certhash rotation) that slow loads, while WebSocket is direct and reliable. Every live peer on the blog's P2P status panel shows "Secure WebSocket". The gater lives in `node_modules`, so nothing in the repo hints at it.
- **Impact:** It is very easy to write technically plausible but false public copy — for example crediting WebTransport reaching browser Baseline in March 2026 for making Bitsocial browser P2P possible. That claim shipped into the landing page, the comparison table, and two docs pages before the developer caught it. Wrong architecture claims on public pages are checked by exactly the developer audience the site targets.
- **Mitigation:** Never infer which transports Bitsocial uses from what libp2p or the browser platform supports in principle. Check `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` for the current deny list, confirm no `connectionGater` override exists under `src/`, and read the live transport labels in the blog's "P2P status" panel before making any public claim. The upstream change that actually unblocked browser publishing was the gossipsub monotonic-seqno fix in `@libp2p/gossipsub` 15.0.21 (May 2026); pkc-js currently ships 16.0.4.
- **Status:** confirmed

### Concurrent `update-translations.js` runs silently lose keys

- **Date:** 2026-08-02
- **Observed by:** Claude
- **Context:** Applying 26 translated i18next keys across all 36 locales via the `translate` skill
- **What was surprising:** Each invocation is a read-modify-write over all 36 locale files, so two invocations running at once clobber each other and one key vanishes with no error. The `translate` skill explicitly instructs spawning up to 4 subagents concurrently, each of which would call the script.
- **Impact:** Fails silently: keys go missing from arbitrary locales, and the diff still looks plausible.
- **Mitigation:** Never let translator subagents write locale files concurrently — have them emit dictionary JSON files only, then apply every key serially from the parent agent. After applying, verify programmatically that each key exists in all 35 non-English locales and that no value is byte-identical to the English source.
- **Status:** confirmed
- **Update (2026-08-10):** The script used to also resolve its target as `path.join(process.cwd(), "public", "translations")`, so the documented repo-root command failed with "Translations directory not found" and had to be run from the about site's directory. It now resolves the translations from the current directory or from its own location, and works from anywhere. The concurrency trap above is unchanged.

### Development annotation controls can intercept driven clicks

- **Context:** The about and chain sites have fixed controls in the bottom-right corner, where the Agentation toolbar also appears in development.
- **Mitigation:** `scripts/pw-session.sh open` registers `window.__NO_DEV_TOOLBAR__ = true` before reloading the page. The Agentation initializer also honors `__VISUAL_TESTING__` and `__PROFILING__`; source inspection remains available independently. Direct browser automation must set the same flag before loading the application.

### `skills add` installs Codex and Cursor copies into the gitignored `.agents/` directory

- **Date:** 2026-08-18
- **Observed by:** Tommaso + Claude
- **Context:** Installing the `improve-threejs` skill from `millionco/react-doctor` with the `skills` CLI (`vercel-labs/skills`).
- **What was surprising:** `npx skills add <repo> --skill <name> --agent codex` and `--agent cursor` both write to `.agents/skills/<name>/`, not to `.codex/skills/` or `.cursor/skills/`. `AGENTS.md` forbids a repo-level `.agents/` directory and `.gitignore:29` ignores it, so both copies are silently untracked. Only `--agent claude-code` writes to the expected `.claude/skills/`. Separately, the documented comma-separated form (`--agent claude-code,codex,cursor`) fails with "Invalid agents" and installs nothing, even though each name is valid on its own.
- **Impact:** The install reports success while two of the three toolchain copies land somewhere that will never be committed, so Codex and Cursor silently lack the skill after a fresh clone. The comma form can also produce a no-op install that reads as a success.
- **Current mitigation:** The repository now tracks `.agents/skills` as its canonical source and generates Claude copies with `yarn ai-workflow:sync`. The former `.agents` prohibition and ignore rule have been removed. Do not copy new skills into three independent roots; check generated parity and the app catalog after adding a skill.
- **Status:** confirmed
