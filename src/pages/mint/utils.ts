import { BigNumber, ethers } from "ethers";

export function splitBigNumber(num: BigNumber, decimals: number = 18) {
  const str = num.toString();
  const integer = str.slice(0, -decimals) || "0";
  // add , to the integer part
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return {
    integer: formattedInteger,
    decimal: str.slice(-decimals),
  };
}

export function formatBigNumber(num: BigNumber, decimals: number = 18, fixed?: number) {
  const formattedValue = ethers.utils.formatUnits(num, decimals);
  if (fixed && fixed >= 1) {
    // split the number into integer and decimal parts, truncat the decimal part to fixed length
    const { integer, decimal } = splitBigNumber(num, decimals);
    return `${integer}.${decimal.slice(0, fixed)}`;
  } else {
    return formattedValue;
  }
}
