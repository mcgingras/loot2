import Link from "next/link";
import {
  CHARACTER_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ADDRESS,
} from "@/utils/constants";

import { AccountRegistryABI } from "@/abi/accountRegistry";
import TraitCardWrapper from "@/components/TraitCardWrapper";
import MintTraitCard from "@/components/MintTraitCard";
import { createPublicClient, http } from "viem";
import { goerli } from "viem/chains";
import { TRAIT_CONTRACT_ADDRESS } from "@/utils/constants";
import { TraitABI } from "@/abi/trait";

const getTraitsOfOwner = async (ownerAddress: `0x${string}`) => {
  const goerliClient = createPublicClient({
    chain: goerli,
    transport: http(
      `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const data = await goerliClient.readContract({
    address: TRAIT_CONTRACT_ADDRESS,
    abi: TraitABI,
    functionName: "traitsOfOwner",
    args: [ownerAddress],
  });

  return data;
};

const getTbaAddress = async (tokenId: bigint) => {
  const goerliClient = createPublicClient({
    chain: goerli,
    transport: http(
      `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const data = await goerliClient.readContract({
    address: REGISTRY_CONTRACT_ADDRESS,
    abi: AccountRegistryABI,
    functionName: "account",
    args: [BigInt(5), CHARACTER_CONTRACT_ADDRESS, tokenId],
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
          <Link href={`/character/${tokenId}/trait/${traitId}`}>
            <TraitCardWrapper traitId={traitId} key={`trait=${idx}`} />
          </Link>
        );
      })}

      <MintTraitCard tokenId={tokenId} />
    </div>
  );
};

export default CharacterTraitGrid;
