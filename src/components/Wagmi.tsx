"use client";

import { createConfig, WagmiConfig } from "wagmi";
import { baseGoerli } from "wagmi/chains";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
    walletConnectProjectId: process.env
      .NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
    appName: "Loot2",
    appDescription: "Tokenbound upgrade to the original loot project",
    chains: [baseGoerli],
  })
);

export default function Wagmi({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiConfig>
  );
}
