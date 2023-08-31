import { useEffect } from "react";
import TraitCard from "@/components/TraitCard";
import { useContractStore } from "@/stores/contractStore";

const TraitCardWrapper = ({
  traitId,
  onClick,
}: {
  traitId: bigint;
  onClick?: (trait: {
    id: bigint;
    traitType: string;
    name: string;
    equipped: boolean;
  }) => void;
}) => {
  const { callMethod, getDataForMethod } = useContractStore();
  const traitDetails = getDataForMethod("getTraitDetails", traitId);

  useEffect(() => {
    callMethod("getTraitDetails", traitId);
  }, [traitId, callMethod]);

  return (
    <div>
      {traitDetails && (
        <TraitCard
          trait={traitDetails}
          onClick={() => onClick?.({ id: traitId, ...traitDetails })}
        />
      )}
      <div className="flex flex-row space-x-2 items-center mt-1 ml-1">
        <span
          className={`h-2 w-2 rounded-full block ${
            traitDetails?.equipped ? "bg-green-300" : "bg-gray-500"
          }`}
        ></span>
        <span
          className={`text-xs ml-1 text-white ${
            !traitDetails?.equipped && "opacity-50"
          }`}
        >
          Trait #{traitId.toString().padStart(4, "0")}
          {!traitDetails?.equipped && " (unequipped)"}
        </span>
      </div>
    </div>
  );
};

export default TraitCardWrapper;
