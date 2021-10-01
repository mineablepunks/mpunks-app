import { useState, useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { injectedConnector, networkConnector } from "./connectors";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";

export function useEagerWithRemoteFallback(): {
  provider: Web3ReactContextInterface<Web3Provider>;
  status: boolean;
} {
  const provider = useWeb3React<Web3Provider>();
  const { library, active, activate, account } = provider;

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!account || !active || !library) {
      setSuccess(false);
      injectedConnector.isAuthorized().then((isAuthorized: boolean) => {
        function activateNetwork() {
          activate(networkConnector, (e) => {
            console.log("Error connecting to network web3: " + e);
            setSuccess(false);
          }).then(() => {
            console.log("Successfully connected to network web3");
            setSuccess(true);
          });
        }

        if (isAuthorized) {
          activate(injectedConnector, (e) => {
            console.log("Falling back to network connector due to error: " + e);
            activateNetwork();
          }).then(() => {
            console.log("Successfully connected to injected web3");
            setSuccess(true);
          });
        } else {
          console.log(
            "Falling back to network connector (no injected found)..."
          );
          activateNetwork();
        }
      });
    } else {
      setSuccess(true);
    }
  }, [account, active, activate, library]);

  return {
    provider: provider,
    status: success,
  };
}
