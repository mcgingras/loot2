"use client";

import { useState } from "react";
import { Grenze_Gotisch } from "next/font/google";
import TraitRightSlider from "@/components/TraitRightSlider";

const grenze = Grenze_Gotisch({ subsets: ["latin"], weight: ["400"] });

export default function Store() {
  const [isSlider, setIsSliderOpen] = useState<boolean>(false);
  const [selectedTrait, setSelectedTrait] = useState<{
    type: string;
    name: string;
    equipped: boolean;
  }>();

  return (
    <>
      {selectedTrait && (
        <TraitRightSlider
          isSliderOpen={isSlider}
          setIsSliderOpen={setIsSliderOpen}
          selectedTrait={selectedTrait}
          action={{
            label: "Buy",
            callback: () => {},
          }}
        />
      )}
      <section className="h-full flex flex-col">
        <div className="w-full border-b border-white/20 p-4">
          <h1 className={`${grenze.className} text-white font-bold text-8xl`}>
            Store
          </h1>
          <p className="text-white/50 text-sm uppercase mt-1">
            Purchase new loot to add to your character.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-x-4 gap-y-8 p-4 overflow-y-scroll grow">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
            (trait, idx) => {
              return (
                <div key={`trait-${idx}`}>
                  <div
                    className="border border-white/20 p-4 aspect-square hover:border-white/50 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedTrait({
                        type: "Weapon",
                        name: "Long sword",
                        equipped: false,
                      });
                      setIsSliderOpen(true);
                    }}
                  >
                    <div className="w-full flex flex-row justify-between text-xs uppercase">
                      <span className="text-white/50">Weapon</span>
                      <span className="text-white">Long sword</span>
                    </div>
                  </div>
                  <span className="text-xs ml-1 text-white">
                    Trait #{idx.toString().padStart(4, "0")}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </section>
    </>
  );
}
