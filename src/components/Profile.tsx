"use client";

import { ConnectKitButton } from "connectkit";

export default function Profile() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address }) => {
        return (
          <button
            onClick={show}
            className="bg-white text-xs border border-white/30 rounded px-2 py-1"
          >
            {isConnected ? address : "Custom Connect"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
