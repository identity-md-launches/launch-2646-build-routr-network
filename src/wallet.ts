import { createConfig, http } from "wagmi";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { bsc, base, mainnet, arbitrum } from "viem/chains";
export const config = createConfig({
  chains: [bsc, base, mainnet, arbitrum],
  multiInjectedProviderDiscovery: true,
  connectors: [
    injected(),
    coinbaseWallet({
      appName: "Routr Network",
      preference: { options: "all" },
    }),
  ],
  transports: {
    [bsc.id]: http("https://bsc-dataseed.binance.org"),
    [base.id]: http("https://mainnet.base.org"),
    [mainnet.id]: http("https://ethereum-rpc.publicnode.com"),
    [arbitrum.id]: http("https://arb1.arbitrum.io/rpc"),
  },
});
declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
