import type { ChainKey } from "./components/ChainMark";
import type { IconName } from "./components/Icon";
export const routrToken = {
  symbol: "$ROUTR",
  contractAddress: "0x42353202046B059BA748C052a62b16744E8b83E1",
} as const;

export const chains: {
  key: ChainKey;
  name: string;
  native: string;
  settle: string;
}[] = [
  { key: "ethereum", name: "Ethereum", native: "ETH", settle: "12.4s" },
  { key: "bnb", name: "BNB Smart Chain", native: "BNB", settle: "1.1s" },
  { key: "base", name: "Base", native: "ETH", settle: "1.8s" },
  { key: "arbitrum", name: "Arbitrum One", native: "ETH", settle: "1.2s" },
  { key: "optimism", name: "Optimism", native: "ETH", settle: "1.9s" },
  { key: "polygon", name: "Polygon PoS", native: "POL", settle: "2.1s" },
  { key: "solana", name: "Solana", native: "SOL", settle: "0.8s" },
  { key: "avalanche", name: "Avalanche", native: "AVAX", settle: "1.6s" },
  { key: "linea", name: "Linea", native: "ETH", settle: "2.4s" },
];
export const steps = [
  {
    title: "Sign intent",
    detail: "Define and sign your outcome.",
    meta: "EIP-712",
    icon: "signature",
  },
  {
    title: "Solver auction",
    detail: "Solvers compete to fill your intent.",
    meta: "40+ solvers",
    icon: "activity",
  },
  {
    title: "Route split",
    detail: "Liquidity takes the optimal path.",
    meta: "Multi-path",
    icon: "route",
  },
  {
    title: "Atomic settle",
    detail: "The entire route settles or reverts.",
    meta: "All or nothing",
    icon: "shield",
  },
] satisfies { title: string; detail: string; meta: string; icon: IconName }[];
export const features = [
  {
    title: "Single signature",
    body: "One signature expresses your outcome and handles the entire route.",
    icon: "signature",
  },
  {
    title: "Atomic or nothing",
    body: "Your intent settles in full or reverts, so funds never get stranded in a partial fill.",
    icon: "shield",
  },
  {
    title: "Best effective rate",
    body: "Solvers compete on the final amount you receive, with gas and fees included.",
    icon: "route",
  },
  {
    title: "Drop-in SDK",
    body: "Bring intent routing into your app through a small interface for a complex problem.",
    icon: "code",
  },
  {
    title: "No wrapped assets",
    body: "Send and receive native assets without extra wrappers to hold or unwind.",
    icon: "layers",
  },
  {
    title: "Fully observable",
    body: "Follow every intent from signature to settlement with each step accounted for.",
    icon: "activity",
  },
] satisfies { title: string; body: string; icon: IconName }[];
export const sdkExample = `import { Routr } from '@routr/sdk';

const routr = new Routr({ wallet });

// Define the outcome for this route.
const quote = await routr.quote({
  from: { chain: 'bsc', token: 'USDT' },
  to:   { chain: 'base', token: 'ETH' },
  amount: '1000',
  slippageBps: 30,
});

// Sign once for atomic settlement.
const signature = await wallet.signTypedData(quote.typedData);
const result = await routr.settle({ quote, signature });

console.log(result.amountOut);`;
