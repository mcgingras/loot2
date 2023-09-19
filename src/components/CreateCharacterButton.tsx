"use client";

import { useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { CHARACTER_CONTRACT_ADDRESS } from "@/utils/constants";
import { CharacterABI } from "@/abi/character";
import { useRouter } from "next/navigation";

const ProfileButton = () => {
  const [pending, setPending] = useState(false);

  const router = useRouter();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const { config } = usePrepareContractWrite({
    chainId: 8453,
    address: CHARACTER_CONTRACT_ADDRESS,
    abi: CharacterABI,
    functionName: "mint",
  });

  const { data: mintData, write: mint } = useContractWrite({
    ...config,
    onSuccess: (_data) => {
      setPending(true);
    },
  });

  // this was originally intended to mint character and create TBA
  // but I think I might just move creating TBA to trait minting so
  // you only "unlock" minting traits after you create the TBA
  const mintCharacter = async () => {
    await mint?.();
  };

  useWaitForTransaction({
    chainId: 8453,
    hash: mintData?.hash,
    onSuccess: (data) => {
      setPending(false);
      const tokenId = parseInt(data.logs[0].topics[3] as string, 16);
      router.push(`/character/${tokenId}`);
    },
  });

  return (
    <button
      className="text-white text-xs border border-white/30 rounded px-2 py-1"
      onClick={() => {
        if (chain?.id !== 8453) {
          switchNetwork?.(8453);
        }
        mintCharacter();
      }}
    >
      {pending ? "Minting..." : "Mint character"}
    </button>
  );
};

export default ProfileButton;
