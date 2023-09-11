import CharacterTraitGrid from "@/components/CharacterTraitGrid";

const Page = ({ params }: { params: { tokenId: bigint } }) => {
  return (
    <>
      <div className="p-4 border-b border-white/20 w-full">
        <h2 className="text-white uppercase">
          Character {params.tokenId.toString().padStart(4, "0")}
        </h2>
        <p className="text-white/50 text-sm uppercase mt-1">
          All of the individual traits held by the character.
        </p>
      </div>
      <CharacterTraitGrid tokenId={BigInt(params.tokenId)} />
    </>
  );
};

export default Page;
