import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";

const LOCAL_DEV_CHAIN_ID = 1340;
export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainnet
    LOCAL_DEV_CHAIN_ID, // Hardhat
  ],
});

let mainnetUrl = process.env.REACT_APP_MAINNET_URL;
if (!mainnetUrl) {
  mainnetUrl = "https://cloudflare-eth.com";
}

export const networkConnector = new NetworkConnector({
  urls: {
    1: mainnetUrl!,
  },
  defaultChainId: 1,
});
