import { solidityKeccak256 } from "ethers/lib/utils";
import { BigNumber } from "@ethersproject/bignumber";

export function hash(
  lastMinedAssets: BigNumber,
  addressBits: BigNumber,
  nonce: BigNumber
): BigNumber {
  const slice = solidityKeccak256(
    ["uint96", "uint72", "uint88"],
    [lastMinedAssets, addressBits, nonce]
  ).substring(44, 66);

  return BigNumber.from("0x" + slice);
}

export function mine(
  _rangeStart: BigNumber,
  _rangeEnd: BigNumber,
  _lastMinedAssets: BigNumber,
  _addressBits: BigNumber,
  _difficultyTarget: BigNumber
): BigNumber {
  const rangeStart = BigNumber.from(_rangeStart._hex);
  const rangeEnd = BigNumber.from(_rangeEnd._hex);
  const lastMinedAssets = BigNumber.from(_lastMinedAssets._hex);
  const addressBits = BigNumber.from(_addressBits._hex);
  const difficultyTarget = BigNumber.from(_difficultyTarget._hex);

  for (let i = rangeStart; i.lt(rangeEnd); i = i.add(1)) {
    const attempt = hash(lastMinedAssets, addressBits, i);

    if (attempt.lt(difficultyTarget)) {
      return i;
    }
  }

  return BigNumber.from(-1);
}
