"use client";

import { useContractWrite, usePrepareContractWrite } from "wagmi";

import {
  CHARACTER_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ADDRESS,
  ACCOUNT_IMPLEMENTATION_CONTRACT_ADDRESS,
  SALT,
} from "@/utils/constants";
import CharacterCardClient from "@/components/CharacterCardClient";
import { CharacterABI } from "@/abi/character";
import { AccountRegistryABI } from "@/abi/accountRegistry";
import { useContractStore } from "@/stores/contractStore";

const ProfileButton = () => {
  const { config: createTBAConfig } = usePrepareContractWrite({
    chainId: 84531,
    address: REGISTRY_CONTRACT_ADDRESS,
    abi: AccountRegistryABI,
    functionName: "createAccount",
    args: [
      ACCOUNT_IMPLEMENTATION_CONTRACT_ADDRESS,
      BigInt(84531),
      CHARACTER_CONTRACT_ADDRESS,
      BigInt(0),
      SALT,
      "0x",
    ],
  });

  const { data: createTBaData, write: createTBA } =
    useContractWrite(createTBAConfig);

  const { config } = usePrepareContractWrite({
    chainId: 84531,
    address: CHARACTER_CONTRACT_ADDRESS,
    abi: CharacterABI,
    functionName: "mint",
  });

  const { data: mintData, write: mint } = useContractWrite(config);

  const createTBAAndMint = async () => {
    await mint?.();
    await createTBA?.();
  };

  // useWaitForTransaction({
  //   chainId: 84531,
  //   hash: mintData?.hash,
  //   onSuccess: () => {
  //     toast.success("Character minted");
  //     callMethod("characterTokensOfOwner", address);
  //     setIsPending(false);
  //   },
  // });

  return (
    <button className="text-white text-xs border border-white/30 rounded px-2 py-1">
      Mint character
    </button>
  );
};

export default ProfileButton;
