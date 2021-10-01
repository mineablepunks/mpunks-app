import React, { useEffect, useState, memo } from "react";
import { PunkSmall } from "./RenderedPunk";
import {
  renderSeed,
  renderId,
  numberToSeed,
  MINABLEPUNKS_ADDR,
  renderBlockNumberPreview,
} from "../../util";
import { BytesLike } from "@ethersproject/bytes";
import { Web3Provider } from "@ethersproject/providers";
import { Progman37, Confcp118 } from "@react95/icons";
import { Input } from "@react95/core";
import { useWeb3React } from "@web3-react/core";
import styles from "./Punk.module.scss";

enum QueryState {
  WAITING,
  SUCCESS,
  FAILURE,
}

const OPENSEA_URL = "https://opensea.io";

const constructOpenSeaPath = (punkId: number) =>
  `${OPENSEA_URL}/assets/${MINABLEPUNKS_ADDR}/${punkId}`;

const OpenSeaWrapper = ({
  punkId,
  children,
}: {
  punkId: number;
  children: React.ReactNode;
}) => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={styles.openSeaAnchor}
      href={constructOpenSeaPath(punkId)}
    >
      {children}
    </a>
  );
};

export const LoadingPunkWithText = ({ text }: { text: string }) => {
  return (
    <div className={styles.imageContainer}>
      <Progman37 />
      <p>text</p>
    </div>
  );
};

const _QueriedPunk = ({
  punkId,
  seed,
  blockNumber,
  ...args
}: {
  punkId?: number;
  seed?: BytesLike;
  blockNumber?: number;
}) => {
  const { library, active } = useWeb3React<Web3Provider>();

  const [queryState, setQueryState] = useState<QueryState>(QueryState.WAITING);

  const [punkBytes, setPunkBytes] = useState<string>("");

  useEffect(() => {
    setQueryState(QueryState.WAITING);
    if (active) {
      let query: Promise<string>;
      if (punkId) {
        query = renderId(library!, punkId);
      } else if (seed) {
        query = renderSeed(library!, seed!);
      } else {
        query = renderBlockNumberPreview(library!, blockNumber!);
      }

      query.then(
        (pb) => {
          setQueryState(QueryState.SUCCESS);
          setPunkBytes(pb);
        },
        (e) => {
          setQueryState(QueryState.FAILURE);
          setPunkBytes("");
          console.log(e);
        }
      );
    }
  }, [active, library, punkId, seed, blockNumber]);

  let component;
  switch (queryState) {
    case QueryState.WAITING:
      component = <Progman37 />;
      break;
    case QueryState.SUCCESS:
      component = punkId ? (
        <OpenSeaWrapper punkId={punkId}>
          <PunkSmall punkHex={punkBytes} />
        </OpenSeaWrapper>
      ) : (
        <PunkSmall punkHex={punkBytes} />
      );
      break;
    default:
      component = <Confcp118 />;
      break;
  }

  return component;
};

const QueriedPunk = memo(_QueriedPunk);

export const RandomPunk = () => {
  const [seed, setSeed] = useState<BytesLike | null>(null);
  useEffect(() => {
    setSeed(numberToSeed(Math.floor(Math.random() * 10000000)));
  }, []);

  return (
    <div className={styles.imageContainer}>
      <QueriedPunk seed={seed!} />
      <p>random</p>
    </div>
  );
};

export const IdentifiedPunk = ({ punkId }: { punkId: number }) => {
  return (
    <div className={styles.imageContainer}>
      <QueriedPunk punkId={punkId} />
      <p>{punkId}</p>
    </div>
  );
};

export const PreviewedPunk = ({ blockNumber }: { blockNumber: number }) => {
  return (
    <div className={styles.imageContainer}>
      <QueriedPunk blockNumber={blockNumber} />
      <p>preview</p>
    </div>
  );
};

export const PunkIdRenderer = () => {
  const [inputVal, setInputVal] = useState("10000");

  const onChange = (i: React.FormEvent<HTMLInputElement>) => {
    const text: any = i.currentTarget.value;
    console.log(text);
    if (!isNaN(text)) {
      setInputVal(text);
    }
  };

  return (
    <div className={styles.idRenderContainer}>
      <Input
        placeholder={"enter id (eg, 10000)"}
        value={inputVal}
        onChange={onChange}
      />
      {inputVal.length !== 0 ? (
        <QueriedPunk punkId={parseInt(inputVal)} />
      ) : (
        <div className={styles.imageContainer}>
          <Progman37 />
        </div>
      )}
    </div>
  );
};
