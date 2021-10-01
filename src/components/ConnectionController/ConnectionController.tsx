import { useEagerWithRemoteFallback } from "../../web3-util/util";
import styles from "./ConnectionController.module.scss";
import { Button } from "@react95/core";
import { injectedConnector } from "../../web3-util/connectors";

export const ConnectionController = () => {
  const {
    status,
    provider: { account, activate },
  } = useEagerWithRemoteFallback();

  const connect = () => {
    activate(injectedConnector);
  };

  return (
    /* @ts-ignore */
    <div className={styles.container}>
      <div className={styles.buttons}>
        <Button
          className={styles.button}
          onClick={connect}
          disabled={account != null}
        >
          {!account || !status ? "connect" : "connected"}
        </Button>
      </div>
      <div>Account: {!account || !status ? "not connected" : account}</div>
    </div>
  );
};
