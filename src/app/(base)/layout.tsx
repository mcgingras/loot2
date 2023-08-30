"use client";

import { useState, useEffect } from "react";
import { Grenze_Gotisch } from "next/font/google";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useConnect,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { CHARACTER_CONTRACT_ADDRESS } from "@/utils/constants";
import CharacterCard from "@/components/CharacterCard";
import { CharacterABI } from "@/abi/character";
import { useContractStore } from "@/stores/contractStore";

const grenze = Grenze_Gotisch({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { registry, callMethod } = useContractStore();
  const { data: characterTokens, pending: characterTokensPending } =
    registry.characterTokensOfOwner;

  useEffect(() => {
    callMethod("characterTokensOfOwner", address);
  }, [address]);

  const [isPending, setIsPending] = useState<boolean>(false);

  const { config } = usePrepareContractWrite({
    chainId: 5,
    address: CHARACTER_CONTRACT_ADDRESS,
    abi: CharacterABI,
    functionName: "mint",
  });

  const { data: mintData, write: mint } = useContractWrite(config);

  useEffect(() => {
    if (mintData?.hash) {
      setIsPending(true);
    }
  }, [mintData]);

  useWaitForTransaction({
    chainId: 5,
    hash: mintData?.hash,
    onSuccess: () => {
      toast.success("Character minted");
      callMethod("characterTokensOfOwner", address);
      setIsPending(false);
    },
  });

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 overflow-y-scroll z-0 h-full">
      <div className="col-span-1 border-r border-white/20 h-full flex flex-col overflow-y-scroll">
        <div className="p-4 border-b border-white/20 w-full">
          <h1 className={`${grenze.className} text-white font-bold text-8xl`}>
            Loot 2
          </h1>
          <p className="text-white/50 text-sm uppercase mt-1">
            Token bound upgrade to the original loot project.
          </p>
        </div>
        <div className="p-4 overflow-y-scroll grow">
          {characterTokens?.map((tokenId: bigint, idx: number) => {
            return (
              <div className="mb-8" key={`char-${idx}`}>
                <Link href={`/character/${tokenId}`} className="cursor-pointer">
                  <CharacterCard tokenId={tokenId} />
                </Link>
                <span className="text-xs text-white ml-1">
                  Character #{tokenId.toString().padStart(4, "0")}
                </span>
              </div>
            );
          })}
          {isPending ? (
            <div
              className="border border-white/20 transition-colors w-full aspect-square flex items-center justify-center text-white text-xs animate-pulse"
              onClick={() => mint?.()}
            >
              Minting character...
            </div>
          ) : (
            <div
              className="border border-white/20 hover:border-white/50 transition-colors w-full aspect-square flex items-center justify-center text-white text-xs cursor-pointer"
              onClick={() => {
                isConnected ? mint?.() : connect();
              }}
            >
              {isConnected
                ? "+ Mint a new character"
                : "Connect wallet to mint a character"}
            </div>
          )}
        </div>
      </div>
      <div className="col-span-1 sm:col-span-2 overflow-y-scroll z-0">
        {children}
        <Toaster
          position="bottom-right"
          containerClassName="text-xs uppercase font-bold"
        />
      </div>
    </section>
  );
}
