"use client";

import { Grenze_Gotisch } from "next/font/google";
import { useParams } from "next/navigation";
import { Toaster } from "react-hot-toast";
import CharacterCardClient from "@/components/CharacterCardClient";

const grenze = Grenze_Gotisch({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tokenId } = useParams();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 overflow-y-scroll z-0 h-full">
      <div className="col-span-1 border-r border-white/20 h-full flex flex-col overflow-y-scroll">
        <div className="p-4 border-b border-white/20 w-full">
          <h1 className={`${grenze.className} text-white font-bold text-8xl`}>
            Loot 2
          </h1>
          <p className="text-white/50 text-sm uppercase mt-1">
            Token bound upgrade to the original loot project.
          </p>
        </div>
        <div className="p-4 overflow-y-scroll grow">
          {tokenId && (
            <CharacterCardClient tokenId={BigInt(tokenId as string)} />
          )}
        </div>
      </div>
      <div className="col-span-1 sm:col-span-2 overflow-y-scroll z-0">
        {children}
        <Toaster
          position="bottom-right"
          containerClassName="text-xs uppercase font-bold"
        />
      </div>
    </section>
  );
}
