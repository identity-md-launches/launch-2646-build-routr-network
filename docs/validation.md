# $ROUTR address update: validation and design review

## Scope and requirements

The request is to add `$ROUTR` contract address `0x42353202046B059BA748C052a62b16744E8b83E1` to the existing Routr Network site. The implemented change is an informational contract block beneath the hero actions. No chain was supplied for the address; no explorer, trading link or settlement integration is inferred. Existing routes, wallet configuration, supplied metrics and visual identity are preserved.

| Area | Final result |
| --- | --- |
| Request and acceptance criteria | 8 met; 0 missing; 0 faked |
| Broken features found in the final checked scope | 0 |
| Product and primary action on first screen at 390px | Yes; contract also visible |
| taste@1 | 14/16; 2 retained existing-design exceptions below |
| Copy findings | 0 unresolved in the added surface |
| Share metadata | Title, favicon, description, og:title and og:image present |

- “Add ca $ROUTR 0x42353202046B059BA748C052a62b16744E8b83E1”: met by `src/data.ts:3`, `src/components/ContractAddress.tsx:22` and `src/App.tsx:82`. The full mixed-case string is displayed and copied exactly, with no inserted spaces or line-break characters.
- “a usable website exists with working primary interactions and responsive layouts”: met by the production export and 21 passed interaction groups across seven widths.
- “dist/index.html and its assets are committed alongside the source and lockfile, with relative asset URLs suitable for static hosting”: complete working-tree deliverable in `dist/`, with the existing source, unchanged manifest/lockfile and relative export URLs. Tested beneath `/preview/`.
- “runs the production build, typecheck and useful interaction validation, and records actual results and limitations”: commands and outcomes below; machine-readable results beside this document.
- “applies the pinned Better Interface guide … six domains … fixes … coverage, findings and limitations”: reviewed during implementation and after fixes; domain coverage below.
- “first screen at 390 wide … product and its main action … title, favicon, description, og:title and og:image”: met. At 390×844 the main action ends at y=436.9 and the full address ends at y=609.7. Metadata is in `index.html` and the rebuilt export.
- “DESIGN.md at the repository root”: updated with implemented tokens, typography, contract component states and responsive behavior.
- “README explains how to install, preview and rebuild”: retained and updated with current results and limitations.

Visual idea: Routr presents cross-chain routing on a near-black canvas, with mint primary actions and a restrained routing schematic; the contract uses the existing neutral control and monospace data styles.

## Commands and actual outcomes

Validation used Node 24, dependencies installed by `npm ci` into an external directory from exact copies of the unchanged package manifest and lockfile, and the existing `ROUTR_DEPENDENCY_ROOT` mechanism. No dependency or build configuration was edited. Browser downloads and npm caches stayed outside the repository. These are the portable project commands:

| Command / check | Actual outcome |
| --- | --- |
| `npm ci` using the unchanged manifest and lockfile in the external dependency directory | Exit 0; 52 packages installed |
| `npm run typecheck` | Exit 0 after the last source change |
| `npm run build` | Exit 0 after the last source change; Vite 8.3.5; complete `dist/` rebuilt |
| `npm run check:ui` | Exit 0 on the final export; 21 passed groups, 1 WebKit limitation |
| `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste --offline` | Exit 0 on the final export; 14/16 checks passed |
| Browser tool inspection of `/preview/` | Chromium screenshots at 320×844, 390×844 and 1440×1000; primary route dialog opened and dismissed; token success, keyboard focus and unavailable-clipboard states inspected |
| Accessibility scans | Zero detected WCAG A/AA violations on desktop, route form and phone wallet sheet |
| Runtime and resources | Zero page errors or failed local responses in the final suite; browser tool also reported zero console warnings/errors and successful local resources |

The final build retains the existing upstream warning: an unused viem/ox Tempo module imports `node:worker_threads`, which Vite externalizes for browsers. A search of the final export found no `worker_threads` reference. Runtime checks passed. This is a recorded build warning, not a claim that the dependency itself was changed.

## Interaction coverage

The repeatable `scripts/validate.mjs` serves the actual export beneath a subpath and closes its own server and browser. It checks:

- Contract text and real Chromium clipboard contents against the exact supplied address. The optional `<wbr>` changes neither text content nor manual selection.
- Unavailable clipboard, manual selection, reloading and keyboard retry. The visible instruction is “Copy unavailable. Select the address to copy.”
- Delayed clipboard completion with focus retained, `aria-busy`/`aria-disabled` pending state, ignored duplicate activation and recovery. The delayed/unavailable APIs are test-browser overrides, never shipped application behavior.
- Anchor navigation, local docs navigation, complete SDK snippet copying, invalid amount, same-chain rejection, slippage validation, intent review, JSON download, editing, Escape and focus return.
- Wallet-absent error/retry, mobile wallet link formats and local icons, plus browser-only EIP-6963 provider discovery, rejection, retry, switch/add network, reconnection and disconnect.
- Responsive layouts at 320, 390, 640, 859, 860, 1024 and 1440px; no page overflow, expected grid transitions, primary action and address inside the first 390px screen.
- Skip link, keyboard modal containment, reduced motion, static assets, console errors and local response failures.

## Better Interface coverage

The pinned workflow and core principles of all six domains were read before implementing the component. Existing tokens and patterns were reused during construction. The final review concerns the changed contract surface and affected hero layout, with regression checks of the existing flows.

| Domain | Status and evidence | Unperformed / not applicable |
| --- | --- | --- |
| Accessibility | Checked: native button, named group, redundant text/icon feedback, stable polite status, selectable complete address, keyboard Space activation and retained focus, visible 2px mint focus outline, 44px copy target, axe scans. See `copy-focus.png` and the focus finding below. | Screen-reader sessions, physical touch devices and native browser zoom not verified. |
| Layout | Checked: source/DOM order, logical margins/padding, natural header wrapping, full-address reflow, seven automated widths and screenshots at 320/390/1440. Product/main action/address fit the first 390px screen. At 390px the contract block bottom remained y=636.84 before and after unavailable-clipboard feedback. | RTL, pseudo-localization and browser-native 200% zoom not verified; the product is English-only. No new fixed chrome or hidden content. |
| Writing | Checked: existing restrained voice, “Contract address”, “Copy address”, “Copying…”, “Address copied.” and a recoverable manual-selection instruction. Address copied verbatim; no invented chain, price, verification claim or execution service. | No new form validation, destructive action or empty collection is introduced. |
| Typography | Checked: existing six-size scale and three weights preserved, 14px monospace address at 1.6 line-height, no truncation or shrinking, optional middle break, full selection matching exact input. Inter loaded; browser font checks passed for 400/500/600. | Additional languages/font fallback on other operating systems not verified. |
| Colors | Checked: existing semantic hex tokens only. Measured rendered pairs: address/symbol 17.86:1, metadata/feedback 6.51:1, default copy button 16.99:1, hovered copy button 15.72:1. Focus mint against the page measured 13.14:1 and was visually inspected. | The global probe excludes 22 text boxes over image/gradient backgrounds; those ratios are not claimed. No light theme is implemented or added. |
| UI | Checked: existing flat structural rule, 8px button radius, 16px currentColor icon, hover/focus/pressed styles, guarded pending state, static success/failure feedback. Reduced-motion regression passed. | Browser Animations panel at 10% speed was not inspected; no new animation, image, modal or theme transition was added. |

## Findings, fixes and rechecks

### Medium · keyboard focus lost during copy — fixed

Source: `src/components/ContractAddress.tsx:10`, `src/components/ContractAddress.tsx:32` and the shared disabled appearance in `src/styles.css:82`.

Before: the initial implementation used native `disabled` during the asynchronous clipboard write. Reproduction at 390px: focus the copy button and press Space; after “Address copied.” the browser reported `document.activeElement.tagName === "BODY"`. This interrupted keyboard navigation.

Fix: keep the control focusable with `aria-disabled` and `aria-busy`, guard duplicate calls while copying, and reuse the existing muted/waiting appearance for the pending state.

Recheck: the final interaction suite checks delayed completion, duplicate suppression and focus before/after completion. Browser tool Space activation retained `.token-copy` as the focused element with `:focus-visible === true`; the final screenshot shows the mint outline. No unresolved finding remains.

### Low · one-character address wrap — fixed

Source: `src/components/ContractAddress.tsx:40`, `src/styles.css:356`.

Before: with only `overflow-wrap: anywhere`, the last character sat alone on the second line at 390px. The full value was available, but it was awkward to read and compare.

Fix: add one optional `<wbr>` after character 22 while preserving the 14px font and `overflow-wrap: anywhere` fallback.

Recheck: final 320px/390px screenshots show two readable address segments; desktop remains one line. Clipboard and browser range-selection checks both equal the exact original 42-character address. No whitespace is inserted.

### Existing visual conventions · two probe flags retained

The probe reports `casing` and `eyebrows` failures at `src/App.tsx:47` (the existing “LIVE ON 9 CHAINS” pill) and `src/App.tsx:127` (the four existing step-number labels). These are visible in the final desktop screenshot. The earlier project explicitly requested the Live pill; numbered steps are an established part of its protocol flow. They are retained for this bounded address update. They are documented exceptions, not counted as passed probe checks. The added contract block introduces neither an above-heading kicker nor tracked uppercase prose.

### Low · accessible name differed from visible label — fixed

Source: `src/components/ContractAddress.tsx:31`.

Source review found that “Copy $ROUTR contract address” did not contain the exact visible label “Copy address”. The final accessible name is “Copy address for $ROUTR”, and while pending it matches the visible “Copying…” text. The final interaction suite verifies the accessible name, and the final browser export was reloaded and its copy/focus/fallback states rechecked after this correction.

## Evidence and limitations

- [Raw final probe](design-probe.json), [final interaction groups](interaction-results.json).
- [390px first screen](screenshots/mobile-390.png), [320px first screen](screenshots/mobile-320.png), [1440px first screen](screenshots/desktop-1440.png), [desktop full page](screenshots/desktop-full.png).
- [Keyboard success/focus](screenshots/copy-focus.png), [unavailable clipboard/focus](screenshots/copy-fallback.png), [mobile route form](screenshots/route-mobile.png).

WebKit was downloaded and its launch attempted. It could not run because required Linux shared libraries are absent, so Safari/WebKit rendering and interaction remain unverified. The Chromium mobile viewport is an emulation, not an iPhone test. No real wallet, transaction, extension approval, native wallet-app opening or Coinbase passkey flow was performed. No on-chain claim was needed to display the requester-supplied address. Automated accessibility results do not establish full accessibility compliance.

The probe is a pinned assignment input and disappears from the deliverable; its actual result is retained. Evidence is under `docs/` because `artifacts/` is excluded from this repository's Git bundle. No ignore file was changed. Screenshots, JSON and license notices are delivery documentation, not runtime dependencies.

Final delivery checks passed: `git diff --check`, local export asset references and documentation links. Changed/new file contents total approximately 1.87 MiB, below the 8 MiB limit. Protected build/dependency files are unchanged; no dependency/cache directory or submodule was added. Old hashed bundles were replaced by the current build output.

**Complete for the stated scope**, with the browser/device limitations and two retained pre-existing design exceptions above. These are worker-recorded results, not independent certification.
