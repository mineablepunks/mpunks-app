import { HackilyRewriteHistory } from "../../hooks";
import styles from "./Mine.module.css";

export const Mine = () => {
  HackilyRewriteHistory({ title: "mine" });
  return (
    <div className={styles.inner}>
      mining is no longer feasible through the web browser. a GPU miner is under
      development and updates will be posted via twitter and discord.
    </div>
  );
};
