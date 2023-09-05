"use client";

// https://twitter.com/diegohaz/status/1688191712957460481?s=20
import { useState } from "react";
import RightSlider from "@/components/RightSlider";
import { useRouter } from "next/navigation";

const Page = () => {
  const [open, setOpen] = useState<boolean>(true);
  const router = useRouter();

  return (
    <RightSlider
      key="slider"
      open={open}
      setOpen={(open: boolean) => {
        setOpen(open);
        setTimeout(() => {
          router.push("/character/1");
        }, 500);
      }}
      useInnerPadding={false}
    >
      <div className="p-4 border-b border-white/20 w-full">
        <h2 className="text-white uppercase">No character selected</h2>
      </div>
    </RightSlider>
  );
};

export default Page;
