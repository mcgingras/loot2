"use client";

import { createConfig, configureChains, mainnet, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const config = createConfig({
  publicClient,
  webSocketPublicClient,
});

export default function Wagmi({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
