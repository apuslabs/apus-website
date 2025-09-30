// import { BigNumber, ethers } from "ethers";

export function splitBigNumber(numStr: string, decimals: number = 18) {
  let integerStr: string;
  let decimalStr: string;

  if (numStr.length > decimals) {
    integerStr = numStr.slice(0, numStr.length - decimals);
    decimalStr = numStr.slice(numStr.length - decimals);
  } else {
    integerStr = "0";
    decimalStr = numStr.padStart(decimals, "0");
  }

  // add , to the integer part
  const formattedInteger = integerStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return {
    integer: formattedInteger,
    decimal: decimalStr,
  };
}

// export function formatBigNumber(num?: BigNumber, decimals: number = 18, fixed?: number) {
//   if (!num) {
//     return "--";
//   }
//   if (num.isZero()) {
//     return "0";
//   }
//   const formattedValue = ethers.utils.formatUnits(num, decimals);
//   if (fixed && fixed >= 1) {
//     const { integer, decimal } = splitBigNumber(num.toString(), decimals);
//     // if the integer part is 0 and the decimal part is 0, return origin value, or return truncat value
//     if (integer === "0" && decimal.slice(0, fixed) === "0".repeat(fixed)) {
//       return formattedValue;
//     } else {
//       return `${integer}.${decimal.slice(0, fixed)}`;
//     }
//   } else {
//     return formattedValue;
//   }
// }
