import { createPublicClient, http } from "viem";
import { baseGoerli, base } from "viem/chains";

const baseGoerliClient = createPublicClient({
  cacheTime: 0,
  chain: baseGoerli,
  transport: http(`https://goerli.base.org`, {
    fetchOptions: {
      cache: "no-store",
    },
  }),
});

const baseClient = createPublicClient({
  cacheTime: 0,
  chain: base,
  transport: http(`https://base.org`, {
    fetchOptions: {
      cache: "no-store",
    },
  }),
});

export const activeClient = baseClient;
