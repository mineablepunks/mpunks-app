import * as ethers from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { Web3Provider } from "@ethersproject/providers";
import { Otherpunks__factory } from "./contracts/otherpunks";
import { PublicCryptopunksData__factory } from "./contracts/public-cryptopunks-data";
import { Mineablepunks__factory } from "./contracts/mineablepunks";

// Mainnet
export const OTHERPUNKS_ADDR = "0x1a9b1bb73ed02db2dc3cd0d25adb42ad4d06389f";
export const MINABLEPUNKS_ADDR = "0x595a8974c1473717c4b5d456350cd594d9bda687";
export const PUBLIC_CRYPTOPUNKS_ADDR =
  "0x0f15e15b4b2b7e3c25afde61c424c82e186cd1cc";

export const numberToSeed = function (num: number): ethers.BytesLike {
  return ethers.utils.keccak256(ethers.utils.hexlify(num));
};

export const assetInfoFromSeed = async function (
  lib: Web3Provider,
  seed: ethers.BigNumberish
): Promise<{ assetNames: string; assets: ethers.BigNumber }> {
  const otherPunks = Otherpunks__factory.connect(OTHERPUNKS_ADDR, lib);
  const publicCryptopunksData = PublicCryptopunksData__factory.connect(
    PUBLIC_CRYPTOPUNKS_ADDR,
    lib
  );

  const assets = await otherPunks.seedToPunkAssets(seed);
  const assetNames = await publicCryptopunksData.getPackedAssetNames(assets);
  return { assets, assetNames };
};

export const renderSeed = async function (
  lib: Web3Provider,
  seed: ethers.BigNumberish
) {
  const otherPunks = Otherpunks__factory.connect(OTHERPUNKS_ADDR, lib);
  const publicCryptopunksData = PublicCryptopunksData__factory.connect(
    PUBLIC_CRYPTOPUNKS_ADDR,
    lib
  );

  const assets = await otherPunks.seedToPunkAssets(seed);
  const hex = await publicCryptopunksData.render(assets);
  return hex;
};

export const renderId = async function (lib: Web3Provider, id: number) {
  const contract = Mineablepunks__factory.connect(MINABLEPUNKS_ADDR, lib);
  const hex = await contract.render(id);
  return hex;
};

export const renderBlockNumberPreview = async function (
  lib: Web3Provider,
  blockNumber: number
) {
  const block = await lib.getBlock(blockNumber);
  const seed = BigNumber.from(block.hash);
  const hex = await renderSeed(lib, seed);
  return hex;
};

export const getBlockNumberAssetNames = async function (
  lib: Web3Provider,
  blockNumber: number
) {
  const block = await lib.getBlock(blockNumber);
  const seed = BigNumber.from(block.hash);
  const assets = await assetInfoFromSeed(lib, seed);
  return assets.assetNames;
};

export const getBlockNumberAssets = async function (
  lib: Web3Provider,
  blockNumber: number
) {
  const block = await lib.getBlock(blockNumber);
  const seed = BigNumber.from(block.hash);
  const assets = await assetInfoFromSeed(lib, seed);
  return assets.assets;
};

export const attemptMint = async function (
  lib: Web3Provider,
  seed: ethers.BytesLike,
  blockNumber: number
): Promise<string> {
  console.log(blockNumber);
  const contract = Mineablepunks__factory.connect(MINABLEPUNKS_ADDR, lib);
  try {
    const signer = lib.getSigner();
    const numMined = await contract.numMined();
    const tx = await contract.connect(signer).mint(seed, blockNumber, {
      gasLimit: (numMined + 1) % 33 === 0 ? 1400000 : 700000,
    });
    return tx.hash;
  } catch (e) {
    const message: string = e.message;
    if (message.includes("Bad nonce")) {
      return "Nonce does not create a punk.";
    }

    throw e;
  }
};

export const isValidMintInput = async function (
  lib: Web3Provider,
  seed: ethers.BytesLike,
  blockNumber: number
): Promise<boolean> {
  const contract = Mineablepunks__factory.connect(MINABLEPUNKS_ADDR, lib);
  const signer = lib.getSigner();
  const isValid = await contract.connect(signer).isValidNonce(seed);

  if (isValid) {
    const assets = await getBlockNumberAssets(lib, blockNumber);
    const existingId = await contract.punkAssetsToId(assets);

    console.log("valid");
    if (existingId.toNumber() === 0) {
      return true;
    }
  }

  return false;
};

export const getPunkIdsByAddress = async function (
  lib: Web3Provider,
  addr: string
): Promise<Array<number>> {
  const contract = Mineablepunks__factory.connect(MINABLEPUNKS_ADDR, lib);
  const transferTos = await contract.queryFilter(
    contract.filters.Transfer(null, addr)
  );

  const transferFroms = await contract.queryFilter(
    contract.filters.Transfer(addr, null)
  );

  const transferFromSet = new Set(
    transferFroms.map((r) => r.args.tokenId.toNumber())
  );

  const punkIds = transferTos
    .map((r) => r.args.tokenId.toNumber())
    .filter((tokenId) => !transferFromSet.has(tokenId));

  return punkIds;
};

export const getRecentlyMinedPunks = async function (
  lib: Web3Provider
): Promise<Array<number>> {
  const contract = Mineablepunks__factory.connect(MINABLEPUNKS_ADDR, lib);
  const mints = await contract.queryFilter(
    contract.filters.Transfer("0x0000000000000000000000000000000000000000"),
    13422973
  );

  return mints.reverse().map((r) => r.args.tokenId.toNumber());
};

type MiningDetails = {
  lastMinedAssets: BigNumber;
  addressBits: BigNumber;
  difficultyTarget: BigNumber;
};

export const getMiningDetails = async function (
  lib: Web3Provider,
  addr: string
): Promise<MiningDetails> {
  const contract = Mineablepunks__factory.connect(MINABLEPUNKS_ADDR, lib);
  const lastMinedAssets = await contract.lastMinedPunkAssets();
  const difficultyTarget = await contract.difficultyTarget();
  const addressBits = BigNumber.from(
    "0x" + addr.substring(addr.length - 18, addr.length)
  );

  const miningDetails = {
    lastMinedAssets,
    addressBits,
    difficultyTarget,
  };

  return miningDetails;
};
