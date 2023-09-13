import Link from "next/link";
import {
  CHARACTER_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ADDRESS,
} from "@/utils/constants";

import { AccountRegistryABI } from "@/abi/accountRegistry";
import TraitCardWrapper from "@/components/TraitCardWrapper";
import MintTraitCard from "@/components/MintTraitCard";
import { createPublicClient, http } from "viem";
import { baseGoerli } from "viem/chains";
import {
  TRAIT_CONTRACT_ADDRESS,
  SALT,
  ACCOUNT_IMPLEMENTATION_CONTRACT_ADDRESS,
} from "@/utils/constants";
import { TraitABI } from "@/abi/trait";

const baseGoerliClient = createPublicClient({
  chain: baseGoerli,
  transport: http(`https://goerli.base.org`),
});

const balanceOf = async (ownerAddress: `0x${string}`) => {
  const data = await baseGoerliClient.readContract({
    address: TRAIT_CONTRACT_ADDRESS,
    abi: TraitABI,
    functionName: "balanceOf",
    args: [ownerAddress],
  });

  return data;
};

const getTraitsOfOwner = async (ownerAddress: `0x${string}`) => {
  const data = await baseGoerliClient.readContract({
    address: TRAIT_CONTRACT_ADDRESS,
    abi: TraitABI,
    functionName: "traitsOfOwner",
    args: [ownerAddress],
  });

  return data;
};

const getTbaAddress = async (tokenId: bigint) => {
  const data = await baseGoerliClient.readContract({
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
  const balanceOfData = await balanceOf(tbaAddress);
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
