"use client";

import { Grenze_Gotisch } from "next/font/google";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
} from "wagmi";
import { CHARACTER_CONTRACT_ADDRESS } from "@/utils/constants";
import Link from "next/link";

const grenze = Grenze_Gotisch({ subsets: ["latin"], weight: ["400"] });

import CharacterCard from "@/components/CharacterCard";
import { CharacterABI } from "@/abi/character";

export default function Home() {
  const { address } = useAccount();

  const { data: characterTokens, error } = useContractRead({
    chainId: 5,
    address: CHARACTER_CONTRACT_ADDRESS,
    abi: CharacterABI,
    functionName: "tokensOfOwner",
    enabled: !!address,
    args: [address as `0x${string}`],
  });

  const { config } = usePrepareContractWrite({
    chainId: 5,
    address: CHARACTER_CONTRACT_ADDRESS,
    abi: CharacterABI,
    functionName: "mint",
  });

  const {
    data: mintData,
    isLoading: isMintLoading,
    isSuccess: isMintSuccessful,
    write: mint,
  } = useContractWrite(config);

  return (
    <>
      <div className="p-4 border-b border-white/20 w-full">
        <h2 className="text-white uppercase">No character selected</h2>
        <p className="text-white/50 text-sm uppercase mt-1">
          Select a character to view it's inventory.
        </p>
      </div>
    </>
  );
}
