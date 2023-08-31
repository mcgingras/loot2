import { useEffect } from "react";
import { useContractStore } from "@/stores/contractStore";

const CharacterCard = ({
  tokenId,
  onClick,
}: {
  tokenId: bigint;
  onClick?: () => void;
}) => {
  const { callMethod, getDataForMethod } = useContractStore();
  const tokenURI = getDataForMethod("characterTokenURI", tokenId);

  useEffect(() => {
    callMethod("characterTokenURI", tokenId);
  }, [tokenId, callMethod]);

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
