import { hash } from "./miner";
import { BigNumber } from "@ethersproject/bignumber";

test("creates a valid hash", () => {
  const lastMinedAssets = BigNumber.from("0");
  const addrBits = BigNumber.from("3403600618869088658022");
  const nonce = BigNumber.from("259189777607285672844773770");
  const expectedResult = BigNumber.from("183727861656616168682820668");
  const actualResult = hash(lastMinedAssets, addrBits, nonce);

  expect(actualResult).toStrictEqual(expectedResult);
});
