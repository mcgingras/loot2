import { create } from "zustand";
import { createPublicClient, http } from "viem";
import { goerli } from "viem/chains";

import {
  CHARACTER_CONTRACT_ADDRESS,
  TRAIT_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ADDRESS,
} from "@/utils/constants";

import { TraitABI } from "@/abi/trait";
import { AccountRegistryABI } from "@/abi/accountRegistry";

const client = createPublicClient({
  chain: goerli,
  transport: http(),
});

interface ContractStore {
  registry: any;
  setPendingForMethod: (method: string, newPending: boolean) => void;
  setDataForMethod: (method: string, newData: any) => void;
}

const DEFAULT_REGISTRY = {
  tokensOfOwner: {
    fetch: async (...args: [`0x${string}`]) => {
      const data = await client.readContract({
        address: TRAIT_CONTRACT_ADDRESS,
        abi: TraitABI,
        functionName: "traitsOfOwner",
        args: [...args],
      });
    },
    pending: false,
    data: [],
  },
};

/**
 * Intended as a global store for keeping track of the state of events on chain.
 * We might imagine a framrwork in which this is created by default that registers
 * all events from an ABI.
 */
export const useContractStore = create<ContractStore>((set) => ({
  registry: DEFAULT_REGISTRY,
  setPendingForMethod: (method: string, newPending: boolean) =>
    set((state) => ({
      registry: {
        ...state.registry,
        [method]: {
          ...state.registry[method],
          pending: newPending,
        },
      },
    })),
  setDataForMethod: (method: string, newData: any) =>
    set((state) => ({
      registry: {
        ...state.registry,
        [method]: {
          ...state.registry[method],
          data: newData,
        },
      },
    })),
}));
