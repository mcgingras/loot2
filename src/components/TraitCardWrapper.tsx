import TraitCard from "@/components/TraitCard";
import { createPublicClient, http } from "viem";
import { baseGoerli } from "viem/chains";
import { TRAIT_CONTRACT_ADDRESS } from "@/utils/constants";
import { TraitABI } from "@/abi/trait";

const baseGoerliClient = createPublicClient({
  chain: baseGoerli,
  transport: http(`https://goerli.base.org`),
});

const getTraitDetails = async (traitId: bigint) => {
  const data = await baseGoerliClient.readContract({
    address: TRAIT_CONTRACT_ADDRESS,
    abi: TraitABI,
    functionName: "getTraitDetails",
    args: [traitId],
  });

  return data;
};

const TraitCardWrapper = async ({ traitId }: { traitId: bigint }) => {
  const traitDetails = await getTraitDetails(traitId);

  return (
    <div>
      {traitDetails && <TraitCard trait={traitDetails} />}
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
