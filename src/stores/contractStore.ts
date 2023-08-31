import { create } from "zustand";
import { createPublicClient, http } from "viem";
import { goerli } from "viem/chains";

import {
  CHARACTER_CONTRACT_ADDRESS,
  TRAIT_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ADDRESS,
} from "@/utils/constants";

import { CharacterABI } from "@/abi/character";
import { TraitABI } from "@/abi/trait";
import { AccountRegistryABI } from "@/abi/accountRegistry";

const argHash = (args: any[]) =>
  args
    .map((arg: any) => {
      if (typeof arg === "bigint") {
        arg = arg.toString();
      }
      return JSON.stringify(arg);
    })
    .join("");

const goerliClient = createPublicClient({
  chain: goerli,
  transport: http(
    `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  ),
});

interface ContractStore {
  registry: any;
  callMethod: (method: string, ...args: any[]) => void;
  setPendingForMethod: (method: string, newPending: boolean) => void;
  setDataForMethod: (method: string, args: any, newData: any) => void;
  getDataForMethod: (method: string, args: any) => any;
}

const DEFAULT_REGISTRY = {
  characterTokensOfOwner: {
    fetch: async (...args: [`0x${string}`]) => {
      if (!args[0]) {
        return [];
      }

      const data = await goerliClient.readContract({
        address: CHARACTER_CONTRACT_ADDRESS,
        abi: CharacterABI,
        functionName: "tokensOfOwner",
        args: args,
      });

      return data;
    },
    pending: false,
    data: {},
  },
  // need to make this contract specific
  characterTokenURI: {
    fetch: async (...args: [bigint]) => {
      if (!args[0]) {
        return undefined;
      }

      const data = await goerliClient.readContract({
        address: CHARACTER_CONTRACT_ADDRESS,
        abi: CharacterABI,
        functionName: "tokenURI",
        args: args,
      });

      return data;
    },
    pending: false,
    data: {},
  },
  traitsOfOwner: {
    fetch: async (...args: [`0x${string}`]) => {
      if (!args[0]) {
        return [];
      }

      const data = await goerliClient.readContract({
        address: TRAIT_CONTRACT_ADDRESS,
        abi: TraitABI,
        functionName: "traitsOfOwner",
        args: args,
      });

      return data;
    },
    pending: false,
    data: {},
  },
  getTraitDetails: {
    fetch: async (...args: [bigint]) => {
      if (!args[0]) {
        return undefined;
      }

      const data = await goerliClient.readContract({
        address: TRAIT_CONTRACT_ADDRESS,
        abi: TraitABI,
        functionName: "getTraitDetails",
        args: args,
      });

      return data;
    },
    pending: false,
    data: {},
  },
};

/**
 * Intended as a global store for keeping track of the state of events on chain.
 * We might imagine a framrwork in which this is created by default that registers
 * all events from an ABI.
 */
export const useContractStore = create<ContractStore>((set, get) => ({
  registry: DEFAULT_REGISTRY,
  callMethod: (method: string, ...args: any[]) => {
    const setPendingForMethod = get().setPendingForMethod;
    const setDataForMethod = get().setDataForMethod;
    const registry = get().registry;

    const { fetch, pending } = registry[method];

    // assumes we don't want to allow multiple calls to the same method while one is pending
    // if (pending) {
    //   return;
    // }

    setPendingForMethod(method, true);
    fetch(...args).then((newData: any) => {
      setDataForMethod(method, args, newData);
      setPendingForMethod(method, false);
    });
  },
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
  setDataForMethod: (method: string, args: any, newData: any) =>
    set((state) => ({
      registry: {
        ...state.registry,
        [method]: {
          ...state.registry[method],
          data: {
            ...state.registry[method].data,
            [argHash(args)]: newData,
          },
        },
      },
    })),
  getDataForMethod: (method: string, ...args: any[]) => {
    const registry = get().registry;
    return registry[method].data[argHash(args)];
  },
}));
