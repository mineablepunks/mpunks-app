import styles from "./Explore.module.scss";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Input, Frame } from "@react95/core";
import React, { useState, useEffect } from "react";
import { isAddress } from "@ethersproject/address";
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
  const [error, setError] = useState(false);

  useEffect(() => {
    setPunkIds([]);
    setError(false);
    if (!library) return;

    let cancelled = false;
    getRecentlyMinedPunks(library).then(
      (ids) => {
        if (!cancelled) setPunkIds(ids);
      },
      () => {
        if (!cancelled) setError(true);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [library]);

  return (
    <div className={styles.recentlyMined}>
      {error && (
        <p role="status">
          Recent mints are unavailable. Please try again later.
        </p>
      )}
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
  const [lookupState, setLookupState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (account) {
      setInputVal(account);
    } else {
      setInputVal("0xD0bA4295Acf286a173cbaB2A1312c2B83FCa0723");
    }
  }, [account, library]);

  useEffect(() => {
    setOwnedPunkIds([]);
    setLookupState("idle");
    if (!library || !isAddress(inputVal)) return;

    let cancelled = false;
    setLookupState("loading");
    getPunkIdsByAddress(library, inputVal).then(
      (ids) => {
        if (!cancelled) {
          setOwnedPunkIds(ids);
          setLookupState("success");
        }
      },
      () => {
        if (!cancelled) setLookupState("error");
      }
    );
    return () => {
      cancelled = true;
    };
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
      {lookupState === "loading" && (
        <p role="status">Looking up owned punks…</p>
      )}
      {lookupState === "error" && (
        <p role="status">
          Wallet lookup is unavailable. You can still search by punk ID.
        </p>
      )}
      {lookupState === "success" && ownedPunkIds.length === 0 && (
        <p role="status">No owned punks found.</p>
      )}
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
