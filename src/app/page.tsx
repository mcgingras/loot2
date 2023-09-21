import { CHARACTER_CONTRACT_ADDRESS } from "@/utils/constants";
import { CharacterABI } from "@/abi/character";
import Link from "next/link";
import CharacterCard from "@/components/CharacterCard";
import { activeClient } from "../lib/viem/";
import { Grenze_Gotisch } from "next/font/google";
const grenze = Grenze_Gotisch({ subsets: ["latin"], weight: ["400"] });

const totalSupply = async () => {
  try {
    const data = await activeClient.readContract({
      address: CHARACTER_CONTRACT_ADDRESS,
      abi: CharacterABI,
      functionName: "totalSupply",
    });
    return data;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export default async function Home() {
  const total = await totalSupply();
  return (
    <section className="h-full flex flex-col">
      <div className="w-full border-b border-white/20 p-4">
        <h1 className={`${grenze.className} text-white font-bold text-8xl`}>
          Loot 2
        </h1>
        <p className="text-white/50 text-sm uppercase mt-2">
          Tokenbound upgrade to the original loot project
        </p>
      </div>
      <div className="overflow-y-scroll grow">
        <h1 className="text-white mx-4 mt-2 text-xs uppercase">
          The Twelve Chosen
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-x-4 gap-y-8 p-4 ">
          {Array.from({ length: Number(12) }, (_, i) => i + 1).map(
            (tokenId, idx) => {
              return (
                <div className="mb-8" key={`char-${idx}`}>
                  <Link
                    href={`/character/${tokenId}`}
                    className="cursor-pointer"
                  >
                    <CharacterCard tokenId={BigInt(tokenId)} />
                  </Link>
                  <span className="text-xs text-white ml-1">
                    Character #{tokenId.toString().padStart(4, "0")}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
