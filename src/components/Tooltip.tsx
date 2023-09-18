import * as RTooltip from "@radix-ui/react-tooltip";

const Tooltip = ({
  button,
  text,
}: {
  button: React.ReactElement;
  text: string;
}) => {
  return (
    <RTooltip.Provider>
      <RTooltip.Root>
        <RTooltip.Trigger asChild>{button}</RTooltip.Trigger>
        <RTooltip.Portal>
          <RTooltip.Content
            className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none rounded-[4px] bg-white px-[15px] py-[10px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] z-50 text-xs w-[300px] text-center"
            sideOffset={5}
          >
            {text}
            <RTooltip.Arrow className="fill-white" />
          </RTooltip.Content>
        </RTooltip.Portal>
      </RTooltip.Root>
    </RTooltip.Provider>
  );
};

export default Tooltip;
