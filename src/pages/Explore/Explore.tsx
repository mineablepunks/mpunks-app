import styles from "./Explore.module.scss";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Input, Frame } from "@react95/core";
import React, { useState, useEffect } from "react";
import { getPunkIdsByAddress, getRecentlyMinedPunks } from "../../util";
import { HackilyRewriteHistory } from "../../hooks";
import {
  PunkIdRenderer,
  IdentifiedPunk,
} from "../../components/Punk/QueriedPunk";
import Divider from "../../components/Divider/Divider";

const RecentlyMinedPunks = () => {
  const { library } = useWeb3React<Web3Provider>();
  const [punkIds, setPunkIds] = useState<Array<number>>([]);

  useEffect(() => {
    getRecentlyMinedPunks(library!).then(setPunkIds, (e) => {
      console.log(e);
      setPunkIds([]);
    });
  }, [library]);

  return (
    <div className={styles.recentlyMined}>
      {punkIds.map((punkId) => (
        <IdentifiedPunk key={punkId} punkId={punkId} />
      ))}
    </div>
  );
};

const PunksByAddressExplorer = () => {
  const { library, account } = useWeb3React<Web3Provider>();

  const [inputVal, setInputVal] = useState<string>("");
  const [ownedPunkIds, setOwnedPunkIds] = useState<Array<number>>([]);

  useEffect(() => {
    if (account) {
      setInputVal(account);
    } else {
      setInputVal("0xD0bA4295Acf286a173cbaB2A1312c2B83FCa0723")
    }
  }, [account, library]);

  useEffect(() => {
    getPunkIdsByAddress(library!, inputVal).then(setOwnedPunkIds, () =>
      setOwnedPunkIds([])
    );
  }, [inputVal, library]);

  const onChange = (i: React.FormEvent<HTMLInputElement>) => {
    const text: any = i.currentTarget.value;
    setInputVal(text);
  };

  return (
    <div>
      <div className={styles.inputContainer}>
        <Input
          placeholder={"enter address to see owned punks"}
          value={inputVal}
          onChange={onChange}
        />
      </div>
      <div className={styles.ownedPunks}>
        {ownedPunkIds.map((punkId) => (
          <IdentifiedPunk key={punkId} punkId={punkId} />
        ))}
      </div>
    </div>
  );
};

export const Explore = () => {
  HackilyRewriteHistory({ title: "explore" });

  return (
    <div className={styles.container}>
      {/* @ts-ignore */}
      <Frame boxShadow="in" className={styles.exploreCopy}>
        <p>
          mpunks are mineable, 100% on-chain punks. visit the faq tab for more
          information.{" "}
        </p>
        <br />
        <p>click a punk to go to its opensea page.</p>
      </Frame>
      <p>mined in past day:</p>
      <RecentlyMinedPunks />
      <Divider />
      <p>search by id:</p>
      <PunkIdRenderer />
      <Divider />
      <p>search by addr:</p>
      <PunksByAddressExplorer />
    </div>
  );
};
