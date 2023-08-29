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
  const { data: tokenURI, error } = useContractRead({
    chainId: 5,
    address: CHARACTER_CONTRACT_ADDRESS,
    abi: CharacterABI,
    functionName: "tokenURI",
    args: [tokenId],
  });

  const metadata = JSON.parse(atob(tokenURI?.split(",")[1] || ""));

  return (
    <img
      className="border border-white/20"
      // src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj48c3R5bGU+LmJhc2UgeyBmb250LWZhbWlseTogIklCTSBQbGV4IE1vbm8iLCBtb25vc3BhY2U7IGZvbnQtc2l6ZTogMTJweDsgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgZmlsbDogI0ZGRiB9PC9zdHlsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJibGFjayIgLz48dGV4dCB4PSIxMCIgeT0iMjAiIGNsYXNzPSJiYXNlIGxlZnQiPkVtcHR5PC90ZXh0Pjwvc3ZnPg=="
      src={metadata.image}
      alt="Token details."
      onClick={onClick}
    />
  );
};

export default CharacterCard;
