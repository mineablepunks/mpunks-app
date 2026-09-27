import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";

const LOCAL_DEV_CHAIN_ID = 1340;
export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainnet
    LOCAL_DEV_CHAIN_ID, // Hardhat
  ],
});

const mainnetUrl =
  import.meta.env.REACT_APP_MAINNET_URL?.trim() || "https://ethereum.publicnode.com";

export const networkConnector = new NetworkConnector({
  urls: {
    1: mainnetUrl,
  },
  defaultChainId: 1,
});
