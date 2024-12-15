import { BigNumber, ethers } from "ethers";

export function splitBigNumber(num: BigNumber, decimals: number = 18) {
  const str = num.toString();
  return {
    integer: str.slice(0, -decimals) || "0",
    decimal: str.slice(-decimals),
  };
}

export function formatBigNumber(num: BigNumber, decimals: number = 18, fixed?: number) {
  const formattedValue = ethers.utils.formatUnits(num, decimals);
  if (fixed && fixed >= 1) {
    return parseFloat(formattedValue).toFixed(fixed);
  } else {
    return formattedValue;
  }
}
