import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
} from "wagmi";
import {
  CHARACTER_CONTRACT_ADDRESS,
  TRAIT_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ADDRESS,
} from "@/utils/constants";

import { TraitABI } from "@/abi/trait";
import { AccountRegistryABI } from "@/abi/accountRegistry";

// eventually move tokenId to url param
const MintTraitCard = ({ tokenId }: { tokenId: bigint }) => {
  const { data: tbaAddress, error: tbaAddressError } = useContractRead({
    chainId: 5,
    address: REGISTRY_CONTRACT_ADDRESS,
    abi: AccountRegistryABI,
    functionName: "account",
    args: [BigInt(5), CHARACTER_CONTRACT_ADDRESS, tokenId],
  });

  const { config, error } = usePrepareContractWrite({
    chainId: 5,
    address: TRAIT_CONTRACT_ADDRESS,
    abi: TraitABI,
    enabled: !!tbaAddress,
    functionName: "mint",
    args: [tbaAddress as `0x${string}`, "WEAPON"],
  });

  const {
    data: mintData,
    isLoading: isMintLoading,
    isSuccess: isMintSuccessful,
    write: mint,
  } = useContractWrite(config);

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
