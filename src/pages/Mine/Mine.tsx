import { Fieldset, Input } from "@react95/core";
import React from "react";
import { useCallback, useState } from "react";
import { classNames } from "../../classNames";
import Divider from "../../components/Divider/Divider";
import { HackilyRewriteHistory } from "../../hooks";
import styles from "./Mine.module.css";

const INDIVIDUAL_MINING_RATE = 6;
const CURRENT_DIFFICULTY = "5,731,203,885,580";
const CURRENT_PROBABILITY = 0.0000000185185;

function parseNumber(e: React.FormEvent<HTMLInputElement>) {
  return e.currentTarget.valueAsNumber;
}

function getTimeToMint(millionsOfHashesPerSecond: number) {
  if (millionsOfHashesPerSecond <= 0) {
    return Number.POSITIVE_INFINITY;
  }
  return 1000000 / (millionsOfHashesPerSecond * 1000000 * CURRENT_PROBABILITY);
}

function secondsToDhms(d: number) {
  const days = Math.floor(d / 86400);
  if (Number.isFinite(days)) {
    return days + " days " + secondsToHms(d % 86400);
  } else if (Number.isNaN(days)) {
    return "invalid time";
  }

  return days.toString() + " days";
}

function secondsToHms(d: number) {
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  return (
    ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2)
  );
}

export const Mine = () => {
  HackilyRewriteHistory({ title: "mine" });
  const [individualMiningRate, setIndividualMiningRate] = useState<number>(
    INDIVIDUAL_MINING_RATE
  );

  const displayedIndividualMiningRate = Number.isNaN(individualMiningRate)
    ? ""
    : individualMiningRate;

  const onIndividualMiningRateChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setIndividualMiningRate(parseNumber(e));
    },
    [setIndividualMiningRate]
  );

  const individualTimeToMint = React.useMemo(() => {
    return getTimeToMint(individualMiningRate);
  }, [individualMiningRate]);

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
      <div className={classNames(styles.inner, styles.content)}>
        <b>When should I mine?</b>
        <p className={styles.marginBottom}>
          always! no, that's not really true. we have put together some info to
          help you decide if it makes sense for you to mine.
        </p>
        <Divider className={styles.marginBottom} />
        <div className={styles.inputs}>
          <Fieldset className={styles.input} legend={"mining rate (MH/s)"}>
            <Input
              type={"number"}
              value={displayedIndividualMiningRate}
              onChange={onIndividualMiningRateChange}
            />
          </Fieldset>
        </div>
        <div className={styles.outputs}>
          <Output
            className={styles.output}
            label={"current difficulty"}
            value={CURRENT_DIFFICULTY}
          />
          <Output
            className={styles.output}
            label={"average time to mint (ddd:hh:mm:ss)"}
            value={secondsToDhms(individualTimeToMint)}
          />
        </div>
      </div>
    </div>
  );
};

const Output = React.memo(
  (props: { className?: string; label: string; value: string }) => {
    return (
      <div className={props.className}>
        <p>
          <b>{props.label}:</b> {props.value}
        </p>
      </div>
    );
  }
);
