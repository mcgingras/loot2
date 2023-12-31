"use client";

import { useEffect, useState, useTransition } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isNewTraitPending, setIsNewTraitPending] = useState<boolean>(false);
  const { isConnected } = useAccount();
  const { data: tbaAddress } = useContractRead({
    chainId: 8453,
    address: REGISTRY_CONTRACT_ADDRESS,
    abi: AccountRegistryABI,
    functionName: "account",
    args: [
      ACCOUNT_IMPLEMENTATION_CONTRACT_ADDRESS,
      BigInt(8453),
      CHARACTER_CONTRACT_ADDRESS,
      tokenId,
      SALT,
    ],
  });

  const { config } = usePrepareContractWrite({
    chainId: 8453,
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
    chainId: 8453,
    hash: mintData?.hash,
    onSuccess: () => {
      toast.success("Trait minted");
      setIsNewTraitPending(false);
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
      });
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
