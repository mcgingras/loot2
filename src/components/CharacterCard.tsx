import { createPublicClient, http } from "viem";
import { baseGoerli } from "viem/chains";
import { CHARACTER_CONTRACT_ADDRESS } from "@/utils/constants";
import { CharacterABI } from "@/abi/character";

const baseGoerliClient = createPublicClient({
  chain: baseGoerli,
  transport: http(`https://goerli.base.org`),
});

const getTokenURI = async (tokenId: bigint) => {
  const data = await baseGoerliClient.readContract({
    address: CHARACTER_CONTRACT_ADDRESS,
    abi: CharacterABI,
    functionName: "tokenURI",
    args: [tokenId],
  });

  return data;
};

const CharacterCard = async ({ tokenId }: { tokenId: bigint }) => {
  const tokenURI = await getTokenURI(tokenId);

  // TODO:
  // return empty state from contract with same format as regular non empty state so we don't have to do this jank parse

  const metadata =
    tokenURI && !tokenURI.includes("svg")
      ? JSON.parse(atob(tokenURI?.split(",")[1] || ""))
      : {
          image: tokenURI,
        };

  return (
    <img
      className="border border-white/20"
      src={metadata.image}
      alt="Token details."
    />
  );
};

export default CharacterCard;
