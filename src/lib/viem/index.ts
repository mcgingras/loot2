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
  chain: base,
  // transport: http(`https://mainnet.base.org`, {}),
  transport: http(
    "https://yolo-newest-dawn.base-mainnet.discover.quiknode.pro/026cfd472688703555555eae82f6c5dba64cfeba/"
  ),
});

export const activeClient = baseClient;
