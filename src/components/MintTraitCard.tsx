import { useEffect } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
} from "wagmi";
import toast from "react-hot-toast";

import {
  CHARACTER_CONTRACT_ADDRESS,
  TRAIT_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ADDRESS,
} from "@/utils/constants";

import { TraitABI } from "@/abi/trait";
import { AccountRegistryABI } from "@/abi/accountRegistry";

// eventually move tokenId to url param
const MintTraitCard = ({
  tokenId,
  onPending,
  onSuccess,
}: {
  tokenId: bigint;
  onPending: () => void;
  onSuccess: () => void;
}) => {
  const { data: tbaAddress } = useContractRead({
    chainId: 5,
    address: REGISTRY_CONTRACT_ADDRESS,
    abi: AccountRegistryABI,
    functionName: "account",
    args: [BigInt(5), CHARACTER_CONTRACT_ADDRESS, tokenId],
  });

  const { config } = usePrepareContractWrite({
    chainId: 5,
    address: TRAIT_CONTRACT_ADDRESS,
    abi: TraitABI,
    enabled: !!tbaAddress,
    functionName: "mint",
    args: [tbaAddress as `0x${string}`],
  });

  const { data: mintData, write: mint } = useContractWrite(config);

  useEffect(() => {
    if (mintData?.hash) {
      onPending();
    }
  }, [mintData]);

  useWaitForTransaction({
    chainId: 5,
    hash: mintData?.hash,
    onSuccess: () => {
      toast.success("Trait minted");
      onSuccess();
    },
  });

  return (
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
  );
};

export default MintTraitCard;
