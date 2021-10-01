import { HackilyRewriteHistory } from "../../hooks";
import styles from "./FAQ.module.css";

export const FAQ = () => {
  HackilyRewriteHistory({ title: "faq" });
  return (
    <div className={styles.inner}>
      <h3 id="what-is-this-">What is this?</h3>
      <p>mpunks are generated using cryptopunk assets, all on-chain.</p>
      <p>
        mpunks cannot be claimed; they must be mined. A valid 256-bit hash can
        be fed through an on-chain minting function that uses the probability
        distribution and assets of the original 10,000 cryptopunks to generate
        an mpunk.
      </p>
      <br />
      <br />
      <h3>Why is my nonce invalid/why did my Mint transaction revert?</h3>
      <p>
        there are two common reasons why a nonce is invalid or why a Mint
        transaction could revert. One reason is that someone else mined an mpunk
        before your Mint transaction was confirmed. Another is that you waited
        too long (a few minutes is too long) to send the transaction after
        finding a valid nonce.
      </p>
      <br />
      <br />
      <h3>Difficulty increases</h3>
      <p>
        difficulty increases follow a schedule determined by an immutable
        configuration contract called "OtherPunksConfiguration" (our original
        name). you can see this in the contract source code. the schedule is as
        follows:
      </p>
      <br />
      <p>
        0-99 = easy. should take a 2017 macbook pro no more than a few minutes
        to mine a punk.
      </p>
      <p>
        100-499 = a bit harder. should take a 2017 macbook pro 1 hour to mine a
        punk.
      </p>
      <p>
        500-1999 = dramatic increase. browser-based mining is impractical.
        should take 100 RTX 3080's 1 hour to mine a punk.
      </p>
      <p>2000-2999 = should take 500 RTX 3080's 1 hour to mine a punk.</p>
      <p>3000-3999 = should take 1,000 RTX 3080's 1 hour to mine a punk.</p>
      <p>4000-5999 = should take 3,000 RTX 3080's 1 hour to mine a punk.</p>
      <p>6000-9999 = should take 10,000 RTX 3080's 1 hour to mine a punk.</p>
      <p>
        10000+ = possible but almost infeasible. should take the entire ethereum
        network hash rate 1 year to mine a punk.
      </p>
      <br />
      <br />
      <h3 id="what-about-the-original-cryptopunks-">
        What about the original cryptopunks?
      </h3>
      <p>
        while it is technically possible for an original cryptopunk to be mined,
        this application prevents you from mining one of the original
        cryptopunks. if someone were to create their own miner and mine an
        original cryptopunk, the mpunks contract allows for the burning of any
        mined original cryptopunks, or the blockage of any specific original
        cryptopunk from being mined, through the following functions:
      </p>
      <ul>
        <li>- burnMinedOriginalPunkId</li>
        <li>- blockUnminedOriginalPunkId</li>
      </ul>
      <p>anyone can call these functions.</p>
      <br />
      <br />
      <h3>Why does mpunk XXXXX look exactly like OG CryptoPunk XXXX?</h3>
      <p>
        Some attributes are visually hidden behind other attributes. For
        example, mpunk 10006 has an earring, whereas OG CryptoPunk 2273 does
        not. However, the white hair is displayed on top of the earring, and
        thus the punks look visually identical. There are a few other pairings
        we have noticed, such as mpumk 10489 and OG CryptoPunks 294. We consider
        the true element of uniqueness to be the unique combination of punk
        attributes. Our burnMinedOriginalPunkId compares attributes, and not raw
        pixel values. Because of this, when certain attributes are combined
        (e.g. wild white hair + earring), the pixel values of mpunks are not
        always guaranteed to deconflict with the pixel values of CryptoPunks.
      </p>
      <br />
      <br />
      <h3 id="how-can-i-get-an-mpunk-">How can I get an mpunk?</h3>
      <p>
        mpunks are created by miners, who work to discover valid numbers that in
        turn generate mpunks. you can buy an mpunk from opensea, or become a
        miner!
      </p>
      <br />
      <br />
      <h3 id="how-many-mpunks-are-there-">How many mpunks are there?</h3>
      <p>
        while there are technically millions of mpunks, the number of mpunks is
        practically only 10,000 based on where modern day GPU's are at.
      </p>
      <p>
        we encountered an issue on our initial launch and subsequently
        transferred the ownership of mpunks from the original contracts to the
        current contract (you can see this in the source code). more are
        generated over time through mining, with a practical cap of 10,000.
        mining difficulty increases as more punks are mined. after 10,000 mpunks
        are mined, mining becomes extremely difficult; with modern hardware, it
        would take the entire ethereum mining network a year to mine mpunk
        #10001.
      </p>
      <br />
      <br />
      <h3 id="how-does-mining-work-">How does mining work?</h3>
      <p>
        the mpunks contract stores an 88-bit integer called a “Difficulty
        Target”.{" "}
      </p>
      <p>
        to mint mpunks, miners submit an 88-bit integer, called a “nonce”, to
        the contract’s Mint function. the nonce is then hashed with the miner’s
        address, as well as the assets of the most recently mined punk, to
        produce a 256-bit integer called a “seed”.
      </p>
      <p>
        the last 88 bits of the seed are then compared to the Difficulty Target.
        if the last 88 bits are less than the Difficulty Target, the submitted
        nonce is considered valid, and an mpunk is generated from the 256-bit
        seed.
      </p>
      <p>
        the app auto suggests a high gas limit. gas cost is dynamic based on
        punk rarity. minting should cost around 400,000 gas on average. however,
        every 33rd punk spawns an extra punk for founders. this brings the worst
        case gas cost to 1,400,000.
      </p>
      <br />
      <br />
      <h3 id="how-are-mpunks-stored-">How are mpunks stored?</h3>
      <p>
        the mpunks contract stores a mapping between mpunk Token ID’s, and their
        respective assets. a punk’s assets are represented by a 96 bit integer.
        this integer consists of 12 8-bit chunks. each 8-bit chunk corresponds
        to an attribute slot (eg. head, eyes, mouth, beard). the value of an
        8-Bit chunk maps to an asset ID, stored in the PublicCryptopunksData
        contract. the render function of PublicCryptopunksData then layers these
        assets on top of one another to produce a punk’s image.
      </p>
      <br />
      <br />
      <h3 id="how-are-founders-rewarded-">How are founders rewarded?</h3>
      <p>
        every 33rd mint will mint an additional punk that is sent to the
        contract owner. this will essentially double the gas cost of every 33rd
        mint.
      </p>
      <p>
        the seed for this additional punk is obtained by hashing the seed of the
        most recent 33rd punk. (This is essentially a double hash, since the
        seed of the prior punk is itself a hash).
      </p>
    </div>
  );
};
