"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RightSlider from "@/components/RightSlider";
import TraitCard from "@/components/TraitCard";
import { Grenze_Gotisch } from "next/font/google";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { TRAIT_CONTRACT_ADDRESS } from "@/utils/constants";
import { TraitABI } from "@/abi/trait";

const grenze = Grenze_Gotisch({ subsets: ["latin"], weight: ["400"] });

const TraitRightSlider = ({
  traitId,
  traitDetails,
}: {
  traitId: bigint;
  traitDetails: { traitType: string; name: string; equipped: boolean };
}) => {
  const [open, setOpen] = useState<boolean>(true);
  const router = useRouter();
  const { isConnected } = useAccount();

  const { config: equipConfig } = usePrepareContractWrite({
    chainId: 5,
    address: TRAIT_CONTRACT_ADDRESS,
    abi: TraitABI,
    functionName: "equip",
    args: [traitId],
  });

  const {
    data: equipData,
    isLoading: isEquipLoading,
    write: equip,
  } = useContractWrite(equipConfig);

  return (
    <RightSlider
      open={open}
      setOpen={(open: boolean) => {
        setOpen(open);
        setTimeout(() => {
          router.push("/character/1");
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
            onClick={() => equip?.()}
          >
            <span>{isEquipLoading ? "Pending..." : "Equip"}</span>
          </button>
        )}
      </div>
    </RightSlider>
  );
};

export default TraitRightSlider;
