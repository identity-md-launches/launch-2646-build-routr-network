# Routr Network

A responsive, static landing site for a cross-chain intent routing protocol, built with React, TypeScript and Vite. The finished export is in `dist/`; its asset URLs are relative and it works beneath a static-hosting subpath.

## Install, run and rebuild

Use Node **22.12 or newer** (Node 24 was used for validation).

```sh
npm ci
npm run dev
```

To rebuild and preview the production export:

```sh
npm run typecheck
npm run build
npm run preview
```

Serve the entire `dist/` directory over HTTP. No server-side routes, environment files, API credentials or backend are required. Opening the HTML directly with `file://` is not supported by browser ES modules. The delivered export contains all fonts, icons and share assets locally.

## Interactions

- **Start routing** opens an intent builder with source/destination selection, amount and slippage validation, review, editing and a JSON download. The default is USDT on BNB Smart Chain to ETH on Base at 30 bps.
- **Connect wallet** uses wagmi with EIP-6963 discovery, named browser extensions and Coinbase Wallet. Phone browsers offer MetaMask, Coinbase Wallet, Rabby and Phantom deep links, followed by Coinbase Smart Wallet. Connected accounts can switch to BNB Smart Chain or disconnect.
- Protocol, chain and footer navigation use page anchors. Docs controls open an accessible local reference dialog. The SDK block copies its complete snippet to the clipboard, with feedback and a manual-selection fallback.

This assignment supplies a landing-page brief, not a deployed routing service. The builder exports **unsigned intent drafts**; it does not obtain quotes, request token approvals, sign typed data or send transactions. The SDK snippet is explicitly an **illustrative API preview**, not an installed SDK. The site identifies its supplied metrics and Live labels as a protocol snapshot; it does not simulate telemetry. Per-chain solver depth was not supplied and reads “Not published”.

## Validation

```sh
npx playwright install chromium webkit
npm run check:ui
```

The validation script serves `dist/` under `/preview/` in a bounded foreground process, checks the actual export with Chromium and axe, then closes its server and browsers. Results go to disposable `test/scratch/interactions/`. WebKit is attempted and is reported separately when its runtime is unavailable. No real wallet or signing key is needed; the EIP-6963 test provider lives only inside the test browser.

Actual final results:

| Check | Result |
| --- | --- |
| Production build | Passed, Vite 8.3.5 |
| TypeScript check | Passed |
| Fresh `npm ci`, typecheck and build | Passed |
| Interaction suite | 18 groups passed; 1 WebKit limitation |
| axe WCAG A/AA scans | No violations detected on desktop, route form and phone wallet sheet |
| Responsive widths | 320, 390, 640, 859, 860, 1024 and 1440 px passed |
| Offline taste@1 probe | 14/16 passed; required Live pill and numbered steps explain the two flags |
| Console and resources | No page errors or failed local resources in the final Chromium suite |

Vite reports an upstream `node:worker_threads` browser-externalization warning from an unused viem/ox Tempo module. The finished bundles contain no `worker_threads` reference, and browser checks pass. React server-component directives in dependencies are omitted from this client-only build.

WebKit was downloaded but could not launch because required Linux shared libraries are unavailable. Physical wallet apps, real extension approval, Coinbase passkeys, screen readers and browser-native zoom were not tested. These are limitations, not claimed passes.

See [the full validation and six-domain review](artifacts/validation.md), [design probe output](artifacts/design-probe.json), [interaction results](artifacts/interaction-results.json), and [screenshots](artifacts/screenshots/). [DESIGN.md](DESIGN.md) documents the implemented design system.

## Source map and maintenance

- `src/App.tsx`: page composition and modal entry points.
- `src/styles.css`: design tokens, layouts, component states and responsive rules.
- `src/data.ts`: supplied chain snapshot, feature copy and illustrative SDK snippet.
- `src/components/`: diagram, chain marks, code block, intent builder and shared dialogs.
- `src/wallet.ts`, `src/open-in.ts`: public chain configuration and wallet browser links.
- `scripts/`: development/build launcher, typecheck and repeatable browser validation.
- `public/`: local runtime assets, including Inter, wallet marks, favicon and share-card source/export.

For a restricted workspace, `ROUTR_DEPENDENCY_ROOT` may point to an **external** `node_modules` directory. Normal installations do not need it. Dependency folders, browser downloads and npm caches were kept outside this repository for delivery; do not add them to a submission. No ignore file was changed.

Inter is licensed under the SIL Open Font License in `public/fonts/OFL.txt`. Wallet assets retain their upstream license in `public/wallets/LICENSE.txt`. Design guidance attribution and licenses are recorded in `DESIGN.md` and `artifacts/licenses/design-guides.txt`.
