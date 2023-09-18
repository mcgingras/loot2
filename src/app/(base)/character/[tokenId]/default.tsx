import TBATraitWrapper from "@/components/TBATraitWrapper";
import CharacterTraitGrid from "@/components/CharacterTraitGrid";

const Default = ({ params }: { params: { tokenId: bigint } }) => {
  return (
    <>
      <div className="p-4 border-b border-white/20 w-full">
        <h2 className="text-white uppercase">Traits</h2>
        <p className="text-white/50 text-sm uppercase mt-1">
          The individual traits held by character{" "}
          {params.tokenId.toString().padStart(4, "0")}.
        </p>
      </div>
      <div></div>
      <TBATraitWrapper tokenId={params.tokenId}>
        <CharacterTraitGrid tokenId={params.tokenId} />
      </TBATraitWrapper>
    </>
  );
};

export default Default;
