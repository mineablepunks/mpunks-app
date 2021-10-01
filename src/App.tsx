import React from "react";
import styles from "./App.module.scss";

import { TitleBar, Tabs, Tab, Frame } from "@react95/core";

import { FileIcons } from "@react95/icons";
import { RandomPunk } from "./components/Punk/QueriedPunk";
import { Explore } from "./pages/Explore/Explore";
import { FAQ } from "./pages/FAQ/FAQ";
import { ConnectionController } from "./components/ConnectionController/ConnectionController";
import { useLocation } from "react-router-dom";
import { MINABLEPUNKS_ADDR } from "./util";

function App() {
  const location = useLocation();
  const trimmed = location.pathname.replace("/", "");
  const activeTab = trimmed.length > 0 ? trimmed : "explore";

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <TitleBar
          className={styles.titleBar}
          title="mpunks.org | mineable punks"
          icon={<FileIcons variant="32x32_4" />}
        >
          <TitleBar.OptionsBox>
            <TitleBar.Option>X</TitleBar.Option>
          </TitleBar.OptionsBox>
        </TitleBar>
        {/* @ts-ignore */}
        <Frame className={styles.frame} boxShadow="in">
          <div className={styles.innerFrame}>
            <p>the rest of the punks. not affiliated with larvalabs</p>
            <p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://etherscan.io/address/${MINABLEPUNKS_ADDR}`}
              >
                contract
              </a>{" "}
              |{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://opensea.io/collection/mineablepunks"
              >
                opensea
              </a>{" "}
              |{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://twitter.com/mineable_punks"
              >
                twitter
              </a>
              |{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://discord.gg/EVquaxg9WA"
              >
                discord
              </a>
            </p>
            <div className={styles.punksContainer}>
              <RandomPunk />
              <RandomPunk />
              <RandomPunk />
            </div>
          </div>
        </Frame>
        <div className={styles.connectionDetails}>
          <ConnectionController />
        </div>
        <div className={styles.tabsContainer}>
          <Tabs defaultActiveTab={activeTab}>
            <Tab title="explore">
              <Explore />
            </Tab>
            <Tab title="faq">
              <FAQ />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default App;
