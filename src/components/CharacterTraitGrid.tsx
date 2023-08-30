"use client";

import { useState, useEffect } from "react";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import {
  CHARACTER_CONTRACT_ADDRESS,
  TRAIT_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ADDRESS,
} from "@/utils/constants";
import toast from "react-hot-toast";

import { TraitABI } from "@/abi/trait";
import { AccountRegistryABI } from "@/abi/accountRegistry";

import TraitCardWrapper from "@/components/TraitCardWrapper";
import TraitRightSlider from "@/components/TraitRightSlider";
import MintTraitCard from "@/components/MintTraitCard";

const CharacterTraitGrid = ({ tokenId }: { tokenId: bigint }) => {
  const [isSliderOpen, setIsSliderOpen] = useState<boolean>(false);
  const [selectedTrait, setSelectedTrait] = useState<{
    id: bigint;
    traitType: string;
    name: string;
    equipped: boolean;
  }>();

  const [isNewTraitPending, setIsNewTraitPending] = useState<boolean>(false);
  const [isEquipPending, setIsEquipPending] = useState<boolean>(false);

  const { data: tbaAddress } = useContractRead({
    chainId: 5,
    address: REGISTRY_CONTRACT_ADDRESS,
    abi: AccountRegistryABI,
    functionName: "account",
    args: [BigInt(5), CHARACTER_CONTRACT_ADDRESS, tokenId],
  });

  const { data: traitTokenIds, refetch: refetchTraits } = useContractRead({
    chainId: 5,
    address: TRAIT_CONTRACT_ADDRESS,
    abi: TraitABI,
    functionName: "traitsOfOwner",
    enabled: !!tbaAddress,
    args: [tbaAddress as `0x${string}`],
  });

  const { config: equipConfig } = usePrepareContractWrite({
    chainId: 5,
    address: TRAIT_CONTRACT_ADDRESS,
    abi: TraitABI,
    functionName: "equip",
    enabled: !!selectedTrait,
    args: [selectedTrait?.id || BigInt(1)],
  });

  const { data: equipData, write: equip } = useContractWrite(equipConfig);

  const { config: unequipConfig } = usePrepareContractWrite({
    chainId: 5,
    address: TRAIT_CONTRACT_ADDRESS,
    abi: TraitABI,
    functionName: "unequip",
    enabled: !!selectedTrait,
    args: [selectedTrait?.id || BigInt(1)],
  });

  const { data: unequipData, write: unequip } = useContractWrite(unequipConfig);

  const onPending = () => {
    setIsNewTraitPending(true);
  };

  const onSuccess = () => {
    setIsNewTraitPending(false);
    refetchTraits();
  };

  useEffect(() => {
    if (equipData?.hash || unequipData?.hash) {
      setIsEquipPending(true);
    }
  }, [equipData, unequipData]);

  useWaitForTransaction({
    chainId: 5,
    hash: selectedTrait?.equipped ? unequipData?.hash : equipData?.hash,
    onSuccess: () => {
      toast.success("Trait equipped");
      setIsEquipPending(false);
      setIsSliderOpen(false);
      // refetchCharacter
      // refetchTraitDetails (for selectedTrait)
    },
  });

  return (
    <>
      {selectedTrait && (
        <TraitRightSlider
          isSliderOpen={isSliderOpen}
          setIsSliderOpen={setIsSliderOpen}
          isEquipPending={isEquipPending}
          selectedTrait={selectedTrait}
          action={{
            label: selectedTrait.equipped ? "Unequip" : "Equip",
            callback: () => {
              selectedTrait.equipped ? unequip?.() : equip?.();
            },
          }}
        />
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-8 p-4">
        {traitTokenIds?.map((traitId, idx) => {
          return (
            <TraitCardWrapper
              traitId={traitId}
              key={`trait=${idx}`}
              onClick={(trait) => {
                setIsSliderOpen(true);
                setSelectedTrait(trait);
              }}
            />
          );
        })}

        {isNewTraitPending && (
          <div className="border border-white/20 p-4 aspect-square hover:border-white/50 transition-all cursor-pointer animate-pulse">
            <div className="w-full h-full flex-row text-xs text-white flex items-center justify-center">
              <span>Minting new trait...</span>
            </div>
          </div>
        )}

        <MintTraitCard
          tokenId={tokenId}
          onPending={onPending}
          onSuccess={onSuccess}
        />
      </div>
    </>
  );
};

export default CharacterTraitGrid;
