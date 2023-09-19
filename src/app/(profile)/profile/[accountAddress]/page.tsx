import { CHARACTER_CONTRACT_ADDRESS } from "@/utils/constants";
import { CharacterABI } from "@/abi/character";
import Link from "next/link";
import CharacterCard from "@/components/CharacterCard";
import { activeClient } from "../../../../lib/viem/";
import { Grenze_Gotisch } from "next/font/google";

const grenze = Grenze_Gotisch({ subsets: ["latin"], weight: ["400"] });

const getCharactersOfOwner = async (ownerAddress: `0x${string}`) => {
  try {
    const data = await activeClient.readContract({
      address: CHARACTER_CONTRACT_ADDRESS,
      abi: CharacterABI,
      functionName: "tokensOfOwner",
      args: [ownerAddress],
    });

    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default async function Profile({ params }: { params: any }) {
  const characters = await getCharactersOfOwner(params.accountAddress);
  return (
    <section className="h-full flex flex-col">
      <div className="w-full border-b border-white/20 p-4">
        <h1 className={`${grenze.className} text-white font-bold text-8xl`}>
          Profile
        </h1>
        <p className="text-white/50 text-sm uppercase mt-2">Your characters</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-x-4 gap-y-8 p-4 overflow-y-scroll grow">
        {characters.map((tokenId, idx) => {
          return (
            <div className="mb-8" key={`char-${idx}`}>
              <Link href={`/character/${tokenId}`} className="cursor-pointer">
                <CharacterCard tokenId={tokenId} />
              </Link>
              <span className="text-xs text-white ml-1">
                Character #{tokenId.toString().padStart(4, "0")}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
