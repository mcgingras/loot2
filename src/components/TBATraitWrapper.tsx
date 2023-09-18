"use client";

import { TraitABI } from "@/abi/trait";
import { AccountABI } from "@/abi/account";
import { encodeFunctionData } from "viem";
import {
  ACCOUNT_IMPLEMENTATION_CONTRACT_ADDRESS,
  CHARACTER_CONTRACT_ADDRESS,
  TRAIT_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ADDRESS,
  SALT,
} from "@/utils/constants";
import { AccountRegistryABI } from "@/abi/accountRegistry";
import { usePrepareContractWrite, useContractRead } from "wagmi";

const TBATraitWrapper = ({
  children,
  tokenId,
}: {
  children: React.ReactNode;
  tokenId: bigint;
}) => {
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

  // This prepare call doesn't even matter -- we are just trying to call it to see if it fails
  // If it fails we know we need to deploy a TBA
  const { error } = usePrepareContractWrite({
    chainId: 84531,
    address: tbaAddress,
    abi: AccountABI,
    functionName: "execute",
    args: [
      TRAIT_CONTRACT_ADDRESS,
      BigInt(0),
      encodeFunctionData({
        abi: TraitABI,
        functionName: "equip",
        args: [BigInt(1)],
      }),
      BigInt(0),
    ],
  });

  const deployedTBA = !error?.message.includes("returned no data");

  if (deployedTBA) {
    return <span>{children}</span>;
  } else {
    return (
      <div className="p-4 w-full text-white text-sm">
        You must deploy a token bound account before adding traits to this
        character.
      </div>
    );
  }
};

export default TBATraitWrapper;
