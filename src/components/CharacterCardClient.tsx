import { CHARACTER_CONTRACT_ADDRESS } from "@/utils/constants";
import { CharacterABI } from "@/abi/character";
import { useContractRead } from "wagmi";

const CharacterCardClient = ({ tokenId }: { tokenId: bigint }) => {
  const { data: tokenURI } = useContractRead({
    address: CHARACTER_CONTRACT_ADDRESS,
    abi: CharacterABI,
    functionName: "tokenURI",
    args: [tokenId],
  });

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

export default CharacterCardClient;
