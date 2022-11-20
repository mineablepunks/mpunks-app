import React from "react";
import { HackilyRewriteHistory } from "../../hooks";
import styles from "./Mine.module.css";

export const Mine = () => {
  HackilyRewriteHistory({ title: "mine" });

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        the mpunks GPU miner can be found here:
      </div>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/mineablepunks/mpunks-miner-bundle-windows-x64"
      >
        mpunks-miner-bundle-windows-x64
      </a>
      <br />
      <div className={styles.inner}>
        instructions for joining the mpunks mining pool can be found here:
      </div>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://mpunkspool.com"
      >
        mpunkspool.com
      </a>
    </div>
  );
};
