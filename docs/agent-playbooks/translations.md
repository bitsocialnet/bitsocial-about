# Translations

The about site uses i18next JSON at `public/translations/{lang}/default.json`. Docs-site translations live in the `bitsocialnet/bitsocial-docs` repository.

## About-site keys

Use `.agents/skills/translate/SKILL.md`. Discover current locales from disk and preserve placeholders, markup, technical terms, and brand names. For larger requests, children can generate independent maps, but one parent applies every locale write serially; the updater has no writer lock.

Use a unique task-owned map path. Preview with `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry`, then apply with the same arguments and `--write`. Verify coverage/values after writing and remove only the temporary maps owned by this task.

Use `--delete` for requested removals. Inspect `--audit --dry` findings before an authorized `--audit --write`; dynamic translation keys require manual source review. Copy English into every locale only for a technical term, brand, or placeholder.

## Optional semantic review

For selected i18next keys, use `scripts/jev/translation-README.md`. Add `--live` only with the task's provider authorization and budget; the shared private machine configuration supplies credentials and a pinned model. Semantic results are advisory: inspect reported issues and uncertainty, and retain deterministic checks.
