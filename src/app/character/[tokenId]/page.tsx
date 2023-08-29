import CharacterTraitGrid from "@/components/CharacterTraitGrid";

const Page = ({ params }: { params: { tokenId: bigint } }) => {
  return (
    <>
      <div className="p-4 border-b border-white/20 w-full">
        <h2 className="text-white uppercase">Traits</h2>
        <p className="text-white/50 text-sm uppercase">
          All of the individual traits held by your character.
        </p>
      </div>
      <CharacterTraitGrid tokenId={BigInt(params.tokenId)} />
    </>
  );
};

export default Page;
