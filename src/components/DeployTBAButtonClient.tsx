"use client";

import {
  ACCOUNT_IMPLEMENTATION_CONTRACT_ADDRESS,
  CHARACTER_CONTRACT_ADDRESS,
  TRAIT_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ADDRESS,
  SALT,
} from "@/utils/constants";
import { TraitABI } from "@/abi/trait";
import { AccountABI } from "@/abi/account";
import { AccountRegistryABI } from "@/abi/accountRegistry";
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
} from "wagmi";
import { encodeFunctionData } from "viem";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import Tooltip from "@/components/Tooltip";

const DeployTBAButtonClient = ({ tokenId }: { tokenId: bigint }) => {
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

  const { config: createTBAConfig } = usePrepareContractWrite({
    chainId: 84531,
    address: REGISTRY_CONTRACT_ADDRESS,
    abi: AccountRegistryABI,
    functionName: "createAccount",
    args: [
      ACCOUNT_IMPLEMENTATION_CONTRACT_ADDRESS,
      BigInt(84531),
      CHARACTER_CONTRACT_ADDRESS,
      tokenId,
      SALT,
      "0x",
    ],
  });

  const { write: createTBA } = useContractWrite(createTBAConfig);

  const deployedTBA = !error?.message.includes("returned no data");

  if (deployedTBA) {
    return null;
  }

  return (
    <button
      className="flex flex-row space-x-1 items-center justify-center mx-auto bg-white w-full mt-4 py-2 rounded"
      onClick={() => createTBA?.()}
    >
      <span>Deploy TBA</span>
      <Tooltip
        button={<QuestionMarkCircleIcon className="h-4 w-4 text-black" />}
        text="Before you can equip traits, you need to activate your character by deploying a token bound account (TBA). This is a one-time action."
      />
    </button>
  );
};

export default DeployTBAButtonClient;
