import { useContractRead } from "wagmi";
import { CHARACTER_CONTRACT_ADDRESS } from "@/utils/constants";
import { CharacterABI } from "@/abi/character";

const CharacterCard = ({
  tokenId,
  onClick,
}: {
  tokenId: bigint;
  onClick?: () => void;
}) => {
  const {
    data: tokenURI,
    error,
    refetch,
  } = useContractRead({
    chainId: 5,
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
      onClick={onClick}
    />
  );
};

export default CharacterCard;
