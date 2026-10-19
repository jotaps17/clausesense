# ClauseSense

Browser extension (Chrome/Firefox) that scans the Terms of Service or Privacy
Policy of the page you're on and flags data-privacy and security hazards —
data sharing, retention, dispute resolution, dark patterns, and more — so you
don't have to read the whole document to spot the risky parts. Not legal
advice.

## Features

- Extracts the policy text from the current page and runs it through a rule
  engine entirely client-side (no data leaves the browser).
- Detects which jurisdiction(s) the text is written for — US, EU, or Brazil —
  by scoring regex signals (e.g. `GDPR`, `LGPD`, `CCPA`) and the page's TLD
  against a threshold, then runs only the relevant jurisdiction's rules.
- Rule set covers common hazards (data collection, data sharing, data
  retention, dispute resolution, consent model, dark patterns, security
  posture) plus jurisdiction-specific ones (e.g. LGPD for Brazil, GDPR
  profiling/cross-border transfer/user rights for the EU, children & minors
  and user rights for the US).
- Popup UI (Preact) summarizes the hazards found on the current page;
  options page for settings.
- Available in English, Portuguese (BR), and Spanish.

## Stack

TypeScript, Preact, esbuild (bundler), Jest + ts-jest (tests), Manifest V3
(Chrome and Firefox builds).

## Running it

```bash
npm ci
npm run build          # builds both targets → dist/chrome/ and dist/firefox/
npm run build:chrome
npm run build:firefox
```

Load the unpacked extension from `dist/chrome/` (Chrome) or `dist/firefox/`
(Firefox) via the browser's extension developer mode.

## Tests

```bash
npm test          # Jest
npm run typecheck # tsc --noEmit
```

## Screenshots

> _placeholder — add screenshots of the popup and options page here_

## License

MIT — see [LICENSE](LICENSE).
