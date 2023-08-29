"use client";

import { useState } from "react";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  CHARACTER_CONTRACT_ADDRESS,
  TRAIT_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ADDRESS,
} from "@/utils/constants";

import { TraitABI } from "@/abi/trait";
import { AccountRegistryABI } from "@/abi/accountRegistry";

import TraitCardWrapper from "@/components/TraitCardWrapper";
import TraitRightSlider from "@/components/TraitRightSlider";
import MintTraitCard from "@/components/MintTraitCard";

const CharacterTraitGrid = ({ tokenId }: { tokenId: bigint }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTrait, setSelectedTrait] = useState<{
    id: bigint;
    type: string;
    name: string;
    equipped: boolean;
  }>();

  const { data: tbaAddress, error: tbaAddressError } = useContractRead({
    chainId: 5,
    address: REGISTRY_CONTRACT_ADDRESS,
    abi: AccountRegistryABI,
    functionName: "account",
    args: [BigInt(5), CHARACTER_CONTRACT_ADDRESS, tokenId],
  });

  const { data: traitTokenIds, error } = useContractRead({
    chainId: 5,
    address: TRAIT_CONTRACT_ADDRESS,
    abi: TraitABI,
    functionName: "tokensOfOwner",
    enabled: !!tbaAddress,
    args: [tbaAddress as `0x${string}`],
  });

  const { config } = usePrepareContractWrite({
    chainId: 5,
    address: TRAIT_CONTRACT_ADDRESS,
    abi: TraitABI,
    functionName: "equip",
    enabled: !!selectedTrait,
    args: [selectedTrait?.id || BigInt(0)],
  });

  const {
    data: equipData,
    isLoading: isEquipLoading,
    isSuccess: isEquipSuccessful,
    write: equip,
  } = useContractWrite(config);

  return (
    <>
      {selectedTrait && (
        <TraitRightSlider
          isSliderOpen={isModalOpen}
          setIsSliderOpen={setIsModalOpen}
          selectedTrait={selectedTrait}
          action={{
            label: selectedTrait.equipped ? "Unequip" : "Equip",
            callback: () => {
              equip?.();
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
                setIsModalOpen(true);
                setSelectedTrait(trait);
              }}
            />
          );
        })}
        <MintTraitCard tokenId={tokenId} />
      </div>
    </>
  );
};

export default CharacterTraitGrid;
