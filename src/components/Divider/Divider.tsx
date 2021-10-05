import { classNames } from "../../classNames";
import styles from "./Divider.module.scss";

const Divider = (props: { className?: string }) => {
  return <div className={classNames(styles.divider, props.className)} />;
};

export default Divider;
