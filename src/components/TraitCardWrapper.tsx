import { useContractRead } from "wagmi";
import { TRAIT_CONTRACT_ADDRESS } from "@/utils/constants";

import { TraitABI } from "@/abi/trait";

import TraitCard from "@/components/TraitCard";

const TraitCardWrapper = ({
  traitId,
  onClick,
}: {
  traitId: bigint;
  onClick?: (trait: {
    id: bigint;
    type: string;
    name: string;
    equipped: boolean;
  }) => void;
}) => {
  const { data: traitData, error: traitDataError } = useContractRead({
    chainId: 5,
    address: TRAIT_CONTRACT_ADDRESS,
    abi: TraitABI,
    functionName: "getTraitDetails",
    args: [traitId],
  });

  const trait = {
    id: traitId,
    type: traitData?.[0],
    name: traitData?.[1],
    equipped: traitData?.[2],
  } as { id: bigint; type: string; name: string; equipped: boolean };

  return (
    <div>
      <TraitCard trait={trait} onClick={() => onClick?.(trait)} />
      <div className="flex flex-row space-x-2 items-center mt-1 ml-1">
        <span
          className={`h-2 w-2 rounded-full block ${
            trait.equipped ? "bg-green-300" : "bg-gray-500"
          }`}
        ></span>
        <span
          className={`text-xs ml-1 text-white ${
            !trait.equipped && "opacity-50"
          }`}
        >
          Trait #{traitId.toString().padStart(4, "0")}
          {!trait.equipped && " (unequipped)"}
        </span>
      </div>
    </div>
  );
};

export default TraitCardWrapper;
