"use client";

import { useState, useEffect } from "react";
import { useContractRead, useAccount } from "wagmi";
import Link from "next/link";
import {
  CHARACTER_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ADDRESS,
} from "@/utils/constants";

import { AccountRegistryABI } from "@/abi/accountRegistry";
import TraitCardWrapper from "@/components/TraitCardWrapper";
import MintTraitCard from "@/components/MintTraitCard";
import { useContractStore } from "@/stores/contractStore";

const CharacterTraitGrid = ({ tokenId }: { tokenId: bigint }) => {
  const { isConnected } = useAccount();

  const { callMethod, getDataForMethod } = useContractStore();
  const [isNewTraitPending, setIsNewTraitPending] = useState<boolean>(false);

  const { data: tbaAddress } = useContractRead({
    chainId: 5,
    address: REGISTRY_CONTRACT_ADDRESS,
    abi: AccountRegistryABI,
    functionName: "account",
    args: [BigInt(5), CHARACTER_CONTRACT_ADDRESS, tokenId],
  });

  const traitsOfOwnerData = getDataForMethod("traitsOfOwner", tbaAddress);
  useEffect(() => {
    callMethod("traitsOfOwner", tbaAddress);
  }, [tbaAddress]);

  const onPending = () => {
    setIsNewTraitPending(true);
  };

  const onSuccess = () => {
    setIsNewTraitPending(false);
    callMethod("traitsOfOwner", tbaAddress);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-8 p-4">
      {traitsOfOwnerData?.map((traitId: bigint, idx: number) => {
        return (
          <Link href={`/character/${tokenId}/trait/${traitId}`}>
            <TraitCardWrapper traitId={traitId} key={`trait=${idx}`} />
          </Link>
        );
      })}

      {isNewTraitPending && (
        <div className="border border-white/20 p-4 aspect-square hover:border-white/50 transition-all cursor-pointer animate-pulse">
          <div className="w-full h-full flex-row text-xs text-white flex items-center justify-center">
            <span>Minting new trait...</span>
          </div>
        </div>
      )}
      {isConnected && (
        <MintTraitCard
          tokenId={tokenId}
          onPending={onPending}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
};

export default CharacterTraitGrid;
