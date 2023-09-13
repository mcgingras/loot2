"use client";

import { useEffect, useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import toast from "react-hot-toast";
import { useContractStore } from "@/stores/contractStore";

import {
  CHARACTER_CONTRACT_ADDRESS,
  TRAIT_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ADDRESS,
  ACCOUNT_IMPLEMENTATION_CONTRACT_ADDRESS,
  SALT,
} from "@/utils/constants";

import { TraitABI } from "@/abi/trait";
import { AccountRegistryABI } from "@/abi/accountRegistry";

// eventually move tokenId to url param
const MintTraitCard = ({ tokenId }: { tokenId: bigint }) => {
  const { callMethod } = useContractStore();
  const [isNewTraitPending, setIsNewTraitPending] = useState<boolean>(false);
  const { isConnected } = useAccount();
  const { data: tbaAddress } = useContractRead({
    chainId: 84531,
    address: REGISTRY_CONTRACT_ADDRESS,
    abi: AccountRegistryABI,
    functionName: "account",
    args: [
      ACCOUNT_IMPLEMENTATION_CONTRACT_ADDRESS,
      BigInt(84531),
      CHARACTER_CONTRACT_ADDRESS,
      tokenId,
      SALT,
    ],
  });

  const { config } = usePrepareContractWrite({
    chainId: 84531,
    address: TRAIT_CONTRACT_ADDRESS,
    abi: TraitABI,
    enabled: !!tbaAddress,
    functionName: "mint",
    args: [tbaAddress as `0x${string}`],
  });

  const { data: mintData, write: mint } = useContractWrite(config);

  useEffect(() => {
    if (mintData?.hash) {
      setIsNewTraitPending(true);
    }
  }, [mintData]);

  useWaitForTransaction({
    chainId: 84531,
    hash: mintData?.hash,
    onSuccess: () => {
      toast.success("Trait minted");
      setIsNewTraitPending(false);
      callMethod("traitsOfOwner", tbaAddress);
    },
  });

  if (!isConnected) {
    return null;
  }

  return (
    <>
      {isNewTraitPending && (
        <div className="border border-white/20 p-4 aspect-square hover:border-white/50 transition-all cursor-pointer animate-pulse">
          <div className="w-full h-full flex-row text-xs text-white flex items-center justify-center">
            <span>Minting new trait...</span>
          </div>
        </div>
      )}
      <div
        className={`border border-white/20 p-4 aspect-square hover:border-white/50 transition-all cursor-pointer`}
        onClick={() => {
          mint?.();
        }}
      >
        <div className="w-full h-full flex-row text-xs text-white flex items-center justify-center">
          <span>+ Mint a new trait</span>
        </div>
      </div>
    </>
  );
};

export default MintTraitCard;
