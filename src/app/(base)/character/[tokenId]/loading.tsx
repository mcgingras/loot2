const Loading = () => {
  return (
    <>
      <div className="p-4 border-b border-white/20 w-full">
        <h2 className="text-white uppercase">Character...</h2>
        <p className="text-white/50 text-sm uppercase mt-1">
          All of the individual traits held by your character.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-8 p-4">
        {Array.from({ length: 4 }).map((_, idx) => {
          return (
            <div
              className="border border-white/20 p-4 aspect-square hover:border-white/50 transition-all cursor-pointer opacity-50 animate-pulse"
              key={`trait-${idx}`}
            ></div>
          );
        })}
      </div>
    </>
  );
};

export default Loading;
