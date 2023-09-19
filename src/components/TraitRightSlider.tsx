"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RightSlider from "@/components/RightSlider";
import TraitCard from "@/components/TraitCard";
import { Grenze_Gotisch } from "next/font/google";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
  useWaitForTransaction,
} from "wagmi";
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
import { encodeFunctionData } from "viem";

const grenze = Grenze_Gotisch({ subsets: ["latin"], weight: ["400"] });

const TraitRightSlider = ({
  characterId,
  traitId,
  traitDetails,
}: {
  characterId: bigint;
  traitId: bigint;
  traitDetails: { traitType: string; name: string; equipped: boolean };
}) => {
  const [open, setOpen] = useState<boolean>(true);
  const [pending, setPending] = useState<boolean>(false);
  const router = useRouter();
  const { isConnected } = useAccount();

  const { data: tbaAddress } = useContractRead({
    chainId: 84531,
    address: REGISTRY_CONTRACT_ADDRESS,
    abi: AccountRegistryABI,
    functionName: "account",
    args: [
      ACCOUNT_IMPLEMENTATION_CONTRACT_ADDRESS,
      BigInt(84531),
      CHARACTER_CONTRACT_ADDRESS,
      characterId,
      SALT,
    ],
  });

  const { config: equipConfig } = usePrepareContractWrite({
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
        args: [traitId],
      }),
      BigInt(0),
    ],
  });

  const { config: unequipConfig } = usePrepareContractWrite({
    chainId: 84531,
    address: tbaAddress,
    abi: AccountABI,
    functionName: "execute",
    args: [
      TRAIT_CONTRACT_ADDRESS,
      BigInt(0),
      encodeFunctionData({
        abi: TraitABI,
        functionName: "unequip",
        args: [traitId],
      }),
      BigInt(0),
    ],
  });

  const {
    data: equipData,
    isLoading: isEquipLoading,
    write: equip,
  } = useContractWrite({
    ...equipConfig,
    onSuccess: () => {
      setPending(true);
    },
  });

  const {
    data: unequipData,
    isLoading: isUnequipLoading,
    write: unequip,
  } = useContractWrite({
    ...unequipConfig,
    onSuccess: () => {
      setPending(true);
    },
  });

  const toggleEquip = async () => {
    if (traitDetails.equipped) {
      await unequip?.();
    } else {
      await equip?.();
    }
  };

  useWaitForTransaction({
    chainId: 84531,
    hash: traitDetails.equipped ? unequipData?.hash : equipData?.hash,
    onSuccess: async () => {
      setPending(false);
      setOpen(false);
      setTimeout(() => {
        router.push(`/character/${characterId}`);
        router.refresh();
      }, 500);
    },
  });

  return (
    <RightSlider
      open={open}
      setOpen={(open: boolean) => {
        setOpen(open);
        setTimeout(() => {
          router.push(`/character/${characterId}`);
        }, 500);
      }}
      useInnerPadding={false}
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-col p-4">
          <h1 className={`${grenze.className} text-white text-4xl mb-2`}>
            Trait #{traitId.toString().padStart(4, "0")}
          </h1>
          <span className="uppercase text-white/50 text-xs mb-4 block">
            type: {traitDetails.traitType}
          </span>
          <TraitCard trait={traitDetails} />
        </div>
        {isConnected && (
          <button
            className="w-full border-t bg-white uppercase fixed bottom-0 py-4"
            onClick={() => toggleEquip()}
          >
            <span>
              {pending
                ? "Pending..."
                : traitDetails.equipped
                ? "Unequip"
                : "Equip"}
            </span>
          </button>
        )}
      </div>
    </RightSlider>
  );
};

export default TraitRightSlider;
