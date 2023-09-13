// https://twitter.com/diegohaz/status/1688191712957460481?s=20
import TraitRightSlider from "@/components/TraitRightSlider";
import { createPublicClient, http } from "viem";
import { baseGoerli } from "viem/chains";
import { TRAIT_CONTRACT_ADDRESS } from "@/utils/constants";
import { TraitABI } from "@/abi/trait";

const getTraitDetails = async (traitId: bigint) => {
  const baseGoerliClient = createPublicClient({
    chain: baseGoerli,
    transport: http(`https://goerli.base.org`),
  });

  const data = await baseGoerliClient.readContract({
    address: TRAIT_CONTRACT_ADDRESS,
    abi: TraitABI,
    functionName: "getTraitDetails",
    args: [traitId],
  });

  return data;
};

const Page = async ({ params }: { params: any }) => {
  const traitId = BigInt(params.traitId);
  const traitDetails = await getTraitDetails(traitId);

  return (
    <TraitRightSlider
      characterId={params.tokenId}
      traitId={params.traitId}
      traitDetails={traitDetails}
    />
  );
};

export default Page;
