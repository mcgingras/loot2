import Link from "next/link";
import {
  CHARACTER_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ADDRESS,
} from "@/utils/constants";
import { AccountRegistryABI } from "@/abi/accountRegistry";
import TraitCardWrapper from "@/components/TraitCardWrapper";
import MintTraitCard from "@/components/MintTraitCard";
import {
  TRAIT_CONTRACT_ADDRESS,
  SALT,
  ACCOUNT_IMPLEMENTATION_CONTRACT_ADDRESS,
} from "@/utils/constants";
import { activeClient } from "@/lib/viem";
import { TraitABI } from "@/abi/trait";

const getTraitsOfOwner = async (ownerAddress: `0x${string}`) => {
  const data = await activeClient.readContract({
    address: TRAIT_CONTRACT_ADDRESS,
    abi: TraitABI,
    functionName: "traitsOfOwner",
    args: [ownerAddress],
  });

  return data;
};

const getTbaAddress = async (tokenId: bigint) => {
  const data = await activeClient.readContract({
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

  return data;
};

const CharacterTraitGrid = async ({ tokenId }: { tokenId: bigint }) => {
  const tbaAddress = await getTbaAddress(tokenId);
  const traitsOfOwnerData = await getTraitsOfOwner(tbaAddress);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-8 p-4">
      {traitsOfOwnerData?.map((traitId: bigint, idx: number) => {
        return (
          <Link
            href={`/character/${tokenId}/trait/${traitId}`}
            key={`trait=${idx}`}
          >
            <TraitCardWrapper traitId={traitId} />
          </Link>
        );
      })}

      <MintTraitCard tokenId={tokenId} />
    </div>
  );
};

export default CharacterTraitGrid;
