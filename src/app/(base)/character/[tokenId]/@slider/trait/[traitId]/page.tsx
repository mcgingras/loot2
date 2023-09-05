// https://twitter.com/diegohaz/status/1688191712957460481?s=20
import TraitRightSlider from "@/components/TraitRightSlider";
import { createPublicClient, http } from "viem";
import { goerli } from "viem/chains";
import { TRAIT_CONTRACT_ADDRESS } from "@/utils/constants";
import { TraitABI } from "@/abi/trait";

const getTraitDetails = async (traitId: bigint) => {
  const goerliClient = createPublicClient({
    chain: goerli,
    transport: http(
      `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const data = await goerliClient.readContract({
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
    <TraitRightSlider traitId={params.traitId} traitDetails={traitDetails} />
  );
};

export default Page;
