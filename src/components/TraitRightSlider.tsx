import { Dispatch, SetStateAction } from "react";
import RightSlider from "@/components/RightSlider";
import TraitCard from "@/components/TraitCard";
import { Grenze_Gotisch } from "next/font/google";
import { useAccount } from "wagmi";

const grenze = Grenze_Gotisch({ subsets: ["latin"], weight: ["400"] });

const TraitRightSlider = ({
  isSliderOpen,
  setIsSliderOpen,
  isEquipPending,
  selectedTrait,
  action,
}: {
  isSliderOpen: boolean;
  setIsSliderOpen: Dispatch<SetStateAction<boolean>>;
  isEquipPending: boolean;
  selectedTrait: {
    id: bigint;
    traitType: string;
    name: string;
    equipped: boolean;
  };
  action?: {
    label: string;
    callback: () => void;
  };
}) => {
  const { isConnected } = useAccount();
  return (
    <RightSlider
      open={isSliderOpen}
      setOpen={setIsSliderOpen}
      useInnerPadding={false}
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-col p-4">
          <h1 className={`${grenze.className} text-white text-4xl mb-2`}>
            Trait #{selectedTrait.id.toString().padStart(4, "0")}
          </h1>
          <span className="uppercase text-white/50 text-xs mb-4 block">
            type: {selectedTrait!.traitType}
          </span>
          <TraitCard trait={selectedTrait!} />
        </div>
        {action && isConnected && (
          <button
            className="w-full border-t bg-white uppercase fixed bottom-0 py-4"
            onClick={() => action.callback()}
          >
            <span>{isEquipPending ? "Pending..." : action.label}</span>
          </button>
        )}
      </div>
    </RightSlider>
  );
};

export default TraitRightSlider;
