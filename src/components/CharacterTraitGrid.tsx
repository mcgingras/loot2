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
  cacheTime: 0,
  chain: baseGoerli,
  transport: http(`https://goerli.base.org`),
});

const getTraitsOfOwner = async (ownerAddress: `0x${string}`) => {
  const test = await fetch("https://goerli.base.org/", {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 18,
      method: "eth_call",
      params: [
        {
          from: "0x0000000000000000000000000000000000000000",
          data: "0x25c1e8790000000000000000000000008ede7695632c668d99d62f89ccbbdbe602b76ebf",
          to: "0x4377183d9f9376e7da270c3d103f0250a5ec803f",
        },
        "latest",
      ],
    }),
  });

  const response = await test.json();
  const cleanedResult = response.result.substring(2);

  // Extract the array length (it's the second 32 bytes, so characters 64:128)
  const arrayLengthHex = cleanedResult.substring(64, 128);
  const arrayLength = Number(BigInt(`0x${arrayLengthHex}`));

  // Extract array elements based on the array length
  const elements = [];
  for (let i = 0; i < arrayLength; i++) {
    const start = 128 + i * 64; // Each element is 64 characters long
    const end = start + 64;
    const elementHex = cleanedResult.substring(start, end);
    const element = Number(BigInt(`0x${elementHex}`));
    elements.push(element);
  }

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
