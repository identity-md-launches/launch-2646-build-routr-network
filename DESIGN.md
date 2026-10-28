# Routr Network design system

## Overview

Routr presents cross-chain infrastructure to developers and protocol users. The page uses a near-black canvas, mint actions and a restrained routing schematic as its main visual idea. Shared edges, thin structural borders and generous section gaps carry the hierarchy. The hero is a page-specific two-column arrangement; the tokens and components below are reusable.

The source of truth is `src/styles.css`, followed by component markup in `src/components/` and page composition in `src/App.tsx`. This document describes the finished source and inspected production export.

## Colors

Tokens live in `:root` in `src/styles.css`.

| Token | Value | Role |
| --- | --- | --- |
| `--color-bg` | `#07080b` | Page canvas, input backgrounds |
| `--color-surface` | `#0d1015` | Cards, code window, dialogs, secondary actions |
| `--color-surface-hover` | `#141921` | Hovered controls |
| `--color-surface-active` | `#1b2430` | Pressed neutral controls |
| `--color-text` | `#f0f2f5` | Headings and primary text |
| `--color-muted` | `#8b93a7` | Body descriptions, metadata, comments |
| `--color-border` | `#232832` | Structural 1px borders |
| `--color-border-hover` | `#424b5b` | Hovered borders |
| `--color-accent` | `#6ee7b7` | Primary action, focus, brand and Live status |
| `--color-accent-hover` | `#92efcc` | Hovered primary action |
| `--color-on-accent` | `#081c14` | Text on mint actions |
| `--color-accent-dim` | `#0f211b` | Live pill background |
| `--color-secondary` | `#3b82f6` | Secondary brand hue, mirrored in the SVG route gradient |
| `--color-code-keyword` | `#bd9bf3` | TypeScript keywords |
| `--color-danger` | `#fda4af` | Form and wallet errors |

Brand marks preserve their identifying colors. Diagram lines, their low-opacity grid and radial glow use local SVG/CSS values in `RoutingDiagram.tsx` and `.routing-diagram`; they are decorative, not controls. Status always includes text as well as color.

The final rendered contract block measured 17.86:1 for its address and symbol (`#f0f2f5` on `#07080b`), 6.51:1 for its label and feedback (`#8b93a7` on `#07080b`), and 15.72:1 for the hovered copy button (`#f0f2f5` on `#141921`). The final probe passed its contrast check for measured solid backgrounds. It excluded 22 text boxes over images or gradients; see the validation limitations.

## Typography

`--font-ui` is `Inter, Arial, sans-serif`. Local `public/fonts/inter-latin.woff2` is a variable font declared at weights 100–900; the interface uses only 400, 500 and 600. All three intended weights loaded in Chromium. `--font-mono` is `SFMono-Regular, Consolas, Liberation Mono, monospace`, for labels, chain symbols, numeric timings, code and addresses.

The six roles are `--text-xs` 12px, `--text-sm` 14px, `--text-base` 16px, `--text-lg` 20px, `--text-heading` 36px and `--text-display` 80px at the 16px root size. From 860–1100px, display type is 64px. Below 860px, display type is 48px and section/stat type is 32px. The wordmark reduces to 20px below 360px.

The hero uses 1.05 line-height and −0.065em tracking (−0.055em on smaller layouts); section headings use 1.2 and −0.045em. Body copy uses 1.6–1.75 line-height, regular weight and natural tracking. Headings balance wrapping. Descriptions use `text-wrap: pretty` and constrained measures. Stats and chain timings use tabular numbers. SDK code is 12px at 1.9 line-height and wraps long lines without clipping. The contract address uses 14px monospace at 1.6 line-height, left-to-right ordering, an optional `<wbr>` after character 22 and `overflow-wrap: anywhere`. This preserves every character without shrinking or ellipsis. Inputs stay at 16px on phones. Useful text remains selectable; the contract address uses `user-select: all` for manual copying.

## Layout

The shared `.container` is at most 1200px wide, with 40px side margins on desktop, 24px below 860px, 20px below 640px and 16px below 360px. Spacing uses recurring 8, 12, 16, 20, 24, 28 and 32px increments. Sections start with 100px of space on desktop and 64px below 860px.

- Hero: two equal columns above 859px; copy then schematic in one column below. At 390×844, the action row ends at approximately y=437, well inside the first screen.
- Token contract: beneath the hero footnote, separated with a 1px rule, 24px top margin and 16px top padding. Its label/copy row wraps naturally when it cannot fit (observed at 320px). The full address breaks into two readable lines on phones and ends at approximately y=610 at 390×844. A stable 19.2px feedback line reserves space for success or fallback text; observed block height did not change between these states at 390px.
- Stats: four divided cells, becoming a two-by-two layout below 640px.
- Flow: four tiles with horizontal arrows; below 860px, one column and arrows rotated 90 degrees.
- Features: three columns, becoming one column below 860px, as required by the brief.
- Chain table: five columns from 640px; below that, each row becomes a full-width group with the chain name above two columns of labelled data. All nine rows and all fields remain present.
- Build: copy beside code; below 860px, copy precedes the full-width code window.
- Header: wordmark left, navigation and wallet utility right. Navigation links hide below 860px; the wallet control stays visible.
- Footer: compact horizontal layout, stacking below 640px.

Checked at 320, 390, 640, 859, 860, 1024 and 1440px without horizontal page overflow. The layout uses logical spacing properties; diagram geometry intentionally uses physical SVG coordinates. English is the implemented language. RTL and browser-native zoom remain unverified.

## Elevation & Depth

The design is flat: cards have structural borders and no box shadows. The schematic uses a subtle grid and a radial glow; its core has a tonal gradient. A dialog uses the browser top layer and a `#030509c9` backdrop with 6px blur. There is no fixed header, parallax, scroll-jacking or entrance animation.

## Shapes

`--radius` is 16px for cards, table, code window and desktop dialogs. `--radius-control` is 8px for buttons, fields and wallet rows. The Live pill is fully rounded. Diagram nodes use 10px corners (8px on narrow screens), and the router core uses 22px (16px on phones). Phone dialogs have 20px top corners and respect the bottom safe area. Borders are 1px throughout.

## Components

| Component / pattern | Source | Behavior and reuse |
| --- | --- | --- |
| `.button` | `src/styles.css` | 48px primary/secondary actions; mint fill only for the primary action. Hover, pressed, disabled and 2px offset focus states. Wallet utility is a compact 42px variant. |
| `Icon` | `src/components/Icon.tsx` | One outline set using `currentColor`, decorative `aria-hidden` SVGs. Icon-only buttons supply their own accessible names. |
| `ChainMark` | `src/components/ChainMark.tsx` | Small local SVG identifiers for all nine chains; always paired with a written name. |
| `RoutingDiagram` | `src/components/RoutingDiagram.tsx` | Labelled figure with an inline SVG route network. Illustrative, not live activity. |
| `.step`, `.feature` | `src/App.tsx`, `src/styles.css` | Bordered information tiles. Number/icon/header/body structure for steps; icon chip/header/body for features. |
| `.chain-table` | `src/App.tsx`, `src/styles.css` | Native table, caption, row headers, static snapshot status and responsive visible field labels. |
| `CodeBlock` | `src/components/CodeBlock.tsx` | Highlighted TypeScript, muted line numbers, copy feedback and fallback instruction when clipboard access fails. |
| `ContractAddress` | `src/components/ContractAddress.tsx` | Named group using `routrToken` from `src/data.ts`. Full selectable address, 44px copy button, stable polite status, pending/success/failure states. Pending uses guarded `aria-disabled` and `aria-busy` to keep keyboard focus while ignoring repeat activation. Reuses `.button-secondary`, `Icon` and existing focus/hover/reduced-motion rules. |
| `Modal` | `src/components/Modal.tsx` | Native `dialog.showModal()`, labelled heading, initial/title-change heading focus, explicit Tab/Shift+Tab cycling, Escape/backdrop/close, body scroll lock and focus return. `wide` supports docs. Bottom sheet below 640px. |
| `RouteBuilder` | `src/components/RouteBuilder.tsx` | Named fields, decimal amount, cross-chain/slippage validation, focused errors, review/edit and unsigned JSON download. A persistent notice identifies the preview boundary. |
| `WalletControl` | `src/components/WalletControl.tsx` | EIP-6963 names/icons, mobile wallet-browser links, Coinbase connector, per-row pending text, disabled peers, recoverable errors, short checksummed address, network switch and disconnect. Full address available in its dialog. |
| `Docs` | `src/components/Docs.tsx` | Local protocol reference, lifecycle explanation, preview boundaries and build-section link. |

Transitions name their properties and use `--duration: 200ms` with `cubic-bezier(.2,0,0,1)`. Pressed controls scale to 0.96. The only continuous motion is the Live dot's 2.6s opacity pulse. Reduced motion disables animation, transitions, smooth scrolling and pressed scaling. Hover treatments are gated by pointer capability. Focus uses mint and is replaced with system `Highlight` in forced-colors mode.

## Do’s and Don’ts

- Start new sections with `.container` and `.section`, using the existing heading, body and spacing roles.
- Use a mint filled action for the most important action; use the neutral secondary pattern for peers.
- Pair icons and status color with text. Keep labels, addresses and errors readable and selectable.
- Keep contract addresses in `src/data.ts`, display every character and use optional line breaks rather than clipping. An informational token address does not imply a chain or settlement integration.
- Preserve the six-size scale, three weights, restrained borders and single-column mobile card behavior.
- Keep runtime assets local and URLs relative. Keep new sections in document order and page navigation as anchors.
- Do not present the draft builder, SDK example or supplied protocol snapshot as a live execution service.
- Reuse `Modal` for overlays so focus, scroll and dismissal behavior stay consistent.

Design knowledge was applied from Jakub Krehel’s [Better Interface](https://github.com/jakubkrehel/skills/tree/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/better-interface), MIT. Documentation method was adapted from Paul Bakaus’s [Impeccable document reference](https://github.com/pbakaus/impeccable/blob/9d715cc4f5564a990ca8345abfdd5df6dc9b41c8/skill/reference/document.md), Apache-2.0. Their notices and licenses are retained in `docs/licenses/design-guides.txt`.
