import { createPublicClient, http } from "viem";
import { baseGoerli } from "viem/chains";

const baseGoerliClient = createPublicClient({
  cacheTime: 0,
  chain: baseGoerli,
  transport: http(`https://goerli.base.org`, {
    fetchOptions: {
      cache: "no-store",
    },
  }),
});

export const activeClient = baseGoerliClient;
