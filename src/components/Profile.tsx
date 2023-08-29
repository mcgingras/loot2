"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function Profile() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const { disconnect } = useDisconnect();

  if (isConnected)
    return (
      <button
        onClick={() => disconnect()}
        className="text-white text-xs border border-white/30 rounded px-2 py-1"
      >
        Disconnect ({address && address.slice(0, 4)}...
        {address && address.slice(-4)})
      </button>
    );

  return (
    <button
      onClick={() => connect()}
      className="bg-white text-xs border border-white/30 rounded px-2 py-1"
    >
      Connect Wallet
    </button>
  );
}
