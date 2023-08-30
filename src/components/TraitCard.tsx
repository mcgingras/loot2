export default function TraitCard({
  trait,
  onClick,
}: {
  trait: { equipped: boolean; traitType: string; name: string };
  onClick?: () => void;
}) {
  return (
    <div
      className={`border border-white/20 p-4 aspect-square hover:border-white/50 transition-all cursor-pointer ${
        !trait.equipped && "opacity-50"
      }`}
      onClick={onClick}
    >
      <div className="w-full flex flex-row justify-between text-xs uppercase">
        <span className="text-white/50">{trait.traitType}</span>
        <span className="text-white">{trait.name}</span>
      </div>
    </div>
  );
}
