"use client";

import { useState } from "react";
import { Grenze_Gotisch } from "next/font/google";

const grenze = Grenze_Gotisch({ subsets: ["latin"], weight: ["400"] });

import TraitCard from "@/components/TraitCard";
import TraitRightSlider from "@/components/TraitRightSlider";

const TraitItem = ({ trait }: { trait: { type: string; name: string } }) => {
  return (
    <li className="w-full px-[10px] pt-[10px]">
      <div className="w-full flex flex-row justify-between">
        <span className="text-white/50">{trait.type}</span>
        <span>{trait.name}</span>
      </div>
    </li>
  );
};
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTrait, setSelectedTrait] = useState<{
    type: string;
    name: string;
    equipped: boolean;
  }>();
  const characters = [
    {
      id: 1,
    },
  ];

  const traits = [
    {
      type: "Weapon",
      name: "Hand item",
      equipped: true,
    },
    {
      type: "Head Armor",
      name: "Head item",
      equipped: true,
    },
    {
      type: "Neck",
      name: "Neck item",
      equipped: true,
    },
    {
      type: "Shoulder",
      name: "Shoulder item",
      equipped: false,
    },
    {
      type: "Back",
      name: "Back item",
      equipped: false,
    },
  ];
  return (
    <>
      {selectedTrait && (
        <TraitRightSlider
          isSliderOpen={isModalOpen}
          setIsSliderOpen={setIsModalOpen}
          selectedTrait={selectedTrait}
          action={{
            label: selectedTrait.equipped ? "Unequip" : "Equip",
            callback: () => {},
          }}
        />
      )}
      <section className="grid grid-cols-3 overflow-y-scroll z-0 h-full">
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
            {characters.map((char, idx) => {
              return (
                <div className="mb-8" key={`char-${idx}`}>
                  <div className="border border-white/20 w-full aspect-square block">
                    <ul className="text-white text-xs uppercase">
                      {traits
                        .filter((trait) => trait.equipped)
                        .map((trait, idx) => (
                          <TraitItem trait={trait} key={idx} />
                        ))}
                    </ul>
                  </div>
                  <span className="text-xs text-white ml-1">
                    Character #{"1".padStart(4, "0")}
                  </span>
                </div>
              );
            })}
            <div className="border border-white/20 w-full aspect-square flex items-center justify-center text-white text-xs cursor-pointer">
              + Mint a new character
            </div>
          </div>
        </div>
        <div className="col-span-2 overflow-y-scroll z-0">
          <div className="p-4 border-b border-white/20 w-full">
            <h2 className="text-white uppercase">Traits</h2>
            <p className="text-white/50 text-sm uppercase">
              All of the individual traits held by your token.
            </p>
          </div>
          {/* maybe inactive traits are grayed out (in the backpack but not active) */}
          <div className="grid grid-cols-4 gap-x-4 gap-y-8 p-4">
            {traits.map((trait, idx) => {
              return (
                <div>
                  <TraitCard
                    key={`trait-${idx}`}
                    trait={trait}
                    onClick={() => {
                      setIsModalOpen(true);
                      setSelectedTrait(trait);
                    }}
                  />

                  <div className="flex flex-row space-x-2 items-center mt-1 ml-1">
                    <span
                      className={`h-2 w-2 rounded-full block ${
                        trait.equipped ? "bg-green-300" : "bg-gray-500"
                      }`}
                    ></span>
                    <span
                      className={`text-xs ml-1 text-white ${
                        !trait.equipped && "opacity-50"
                      }`}
                    >
                      Trait #{idx.toString().padStart(4, "0")}
                      {!trait.equipped && " (unequipped)"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
