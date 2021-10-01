import { HackilyRewriteHistory } from "../../hooks";
import { Button, Input, Range, Frame } from "@react95/core";
import { PowerOn, PowerOff } from "@react95/icons";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";
import {
  attemptMint,
  getBlockNumberAssetNames,
  isValidMintInput,
} from "../../util";
import styles from "./Mine.module.scss";
import MiningController from "./MiningController";
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import { PreviewedPunk } from "../../components/Punk/QueriedPunk";
import {
  setIntervalAsync,
  clearIntervalAsync,
} from "set-interval-async/dynamic";
import { assetsToPunkId } from "../../assets";

const PREVIEW_REFRESH_RATE = 10000;

type WorkersRangeProps = {
  disabled?: boolean;
  onChange: (val: number) => void;
  value: number;
};

const WorkersRange = ({ onChange, disabled, value }: WorkersRangeProps) => {
  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseInt(e.currentTarget.value);
    onChange(newVal);
  };

  return (
    <div className={styles.rangeContainer}>
      <p>cpu cores: {value}</p>
      <Range
        min="4"
        max={navigator.hardwareConcurrency?.toString() || "16"}
        step="1"
        disabled={disabled}
        value={value}
        className={styles.range}
        onChange={_onChange}
      />
    </div>
  );
};

enum MiningStatus {
  WAITING_TO_START,
  STARTED,
  WAITING_TO_STOP,
  STOPPED,
}

const MiningOnStates = [MiningStatus.STARTED, MiningStatus.WAITING_TO_STOP];
const MiningWaitingStates = [
  MiningStatus.WAITING_TO_START,
  MiningStatus.WAITING_TO_STOP,
];

const MiningStatusView = ({ miningStatus }: { miningStatus: MiningStatus }) => {
  const message = MiningOnStates.includes(miningStatus)
    ? "mining"
    : "currently not mining";

  const icon = MiningOnStates.includes(miningStatus) ? (
    <PowerOn />
  ) : (
    <PowerOff />
  );

  return (
    <div className={styles.miningStatus}>
      {message}
      {icon}
    </div>
  );
};

const ConnectedView = () => {
  const { library, account } = useWeb3React<Web3Provider>();

  const [inputVal, setInputVal] = useState("");
  const [workerCount, setWorkerCount] = useState(4);
  const [miningStatus, setMiningStatus] = useState<MiningStatus>(
    MiningStatus.STOPPED
  );
  const [miningController, setMiningController] =
    useState<MiningController | null>(null);
  const [mintStatus, setMintStatus] = useState("nothing to report.");
  const [hashRate, setHashRate] = useState(0);
  const [mintBlockNumber, setMintBlockNumber] = useState<number | null>(null);
  const [previewBlockNumber, setPreviewBlockNumber] = useState<number | null>(
    null
  );

  const onChange = (i: React.FormEvent<HTMLInputElement>) => {
    const text: any = i.currentTarget.value;
    if (!isNaN(text)) {
      setInputVal(text);
    }
  };

  useEffect(() => {
    const updateBlockNumber = async () => {
      try {
        const blockNumber = await library!.getBlockNumber();
        setMintBlockNumber(blockNumber);
      } catch (e) {
        console.error("Error fetching block number for minting: " + e);
      }
    };

    updateBlockNumber();
    const interval = setIntervalAsync(updateBlockNumber, PREVIEW_REFRESH_RATE);

    return () => {
      clearIntervalAsync(interval);
    };
  });

  const mint = () => {
    const seed = ethers.utils.hexlify(BigNumber.from(inputVal));
    (async () => {
      const isValid = await isValidMintInput(library!, seed, mintBlockNumber!);

      if (isValid) {
        try {
          const assetNames = await getBlockNumberAssetNames(
            library!,
            mintBlockNumber!
          );
          // @ts-ignore
          const originalCryptopunkId = assetsToPunkId[assetNames];

          if (originalCryptopunkId) {
            setMintStatus(
              `your nonce is valid, 
              but submitting it now would mint one of the original 10K cryptopunks 
              (punk id ${originalCryptopunkId}). please wait a few seconds before clicking "Mint" again.`
            );
          } else {
            setPreviewBlockNumber(mintBlockNumber);
            setMintStatus(
              "valid nonce detected! waiting on tx confirmation..."
            );
            const txHash = await attemptMint(library!, seed, mintBlockNumber!);
            setMintStatus(txHash);
          }
        } catch (e) {
          setMintStatus(JSON.stringify(e));
        } finally {
          setPreviewBlockNumber(null);
        }
      } else {
        setMintStatus(
          "nonce is invalid, or mints an existing mpunk. try mining again"
        );
      }
    })();
  };

  useEffect(() => {
    const stop = () => {
      miningController?.terminate();
      setMiningController(null);
      setMiningStatus(MiningStatus.STOPPED);
      setHashRate(0);
    };
    const onNonceFound = (nonce: BigNumber) => {
      stop();
      setInputVal(nonce.toString());
    };

    if (miningStatus === MiningStatus.WAITING_TO_STOP) {
      stop();
    } else if (miningStatus === MiningStatus.WAITING_TO_START) {
      const controller = new MiningController({
        library: library!,
        address: account!,
        workerCount,
        onNonceFound,
        updateHashRate: setHashRate,
      });

      setMiningController(controller);
      controller.start().catch((e) => {
        console.log("Error mining: " + e);
        stop();
      });

      setMiningStatus(MiningStatus.STARTED);
    }

    return () => {
      miningController?.terminate();
    };
  }, [miningStatus, library, account, miningController, workerCount]);

  return (
    <div>
      {/* @ts-ignore */}
      <Frame boxShadow="in" className={styles.mintDirections}>
        <p>INSTRUCTIONS:</p>
        <br />
        <p>click the button below to start mining.</p>
        <p>the input will populate with a valid nonce once one is found.</p>
        <br />
        <p>
          NOTICE: the current difficulty makes this web-based CPU miner
          infeasible. you can still try to mine a punk, but the odds of getting
          one from this miner are incredibly low.
        </p>
      </Frame>
      <div className={styles.topMargin}>
        <MiningStatusView miningStatus={miningStatus} />
      </div>
      <p className={styles.topMargin}>hashes per second: {hashRate}</p>
      <WorkersRange
        disabled={miningStatus !== MiningStatus.STOPPED}
        onChange={setWorkerCount}
        value={workerCount}
      />
      <Button
        className={styles.miningButton}
        disabled={MiningWaitingStates.includes(miningStatus)}
        onClick={() =>
          setMiningStatus(
            miningStatus === MiningStatus.STOPPED
              ? MiningStatus.WAITING_TO_START
              : MiningStatus.WAITING_TO_STOP
          )
        }
      >
        {MiningOnStates.includes(miningStatus) ? "Stop Mining" : "Start Mining"}
      </Button>
      <div className={styles.mintForm}>
        <Input value={inputVal} onChange={onChange} />
        <Button disabled={!account || inputVal.length === 0} onClick={mint}>
          Mint
        </Button>
      </div>
      <p className={styles.topMargin}>status: {mintStatus}</p>
      <br />
      {previewBlockNumber && (
        <>
          <p>
            This could be your new mpunk! Make sure to mint before another mpunk
            is minted, or your nonce will become invalid!
          </p>
          <PreviewedPunk blockNumber={previewBlockNumber} />
        </>
      )}
    </div>
  );
};

export const Mine = () => {
  HackilyRewriteHistory({ title: "mine" });
  const provider = useWeb3React<Web3Provider>();
  const { account } = provider;

  return account != null ? (
    <ConnectedView />
  ) : (
    <p>must connect account to mine</p>
  );
};
