import { BigNumber, ethers } from "ethers";

export function splitBigNumber(num: BigNumber, decimals: number = 18) {
  const integer = num.div(BigNumber.from(10).pow(decimals));
  const decimal = num.mod(BigNumber.from(10).pow(decimals));
  // 补足小数部分的0
  const decimalStr = decimal.toString();
  const decimalLength = decimalStr.length;
  const zeroLength = decimals - decimalLength;
  const zeroStr = "0".repeat(zeroLength);
  const decimalStrFixed = zeroStr + decimalStr;
  // add , to the integer part
  const formattedInteger = integer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return {
    integer: formattedInteger,
    decimal: decimalStrFixed,
  };
}

export function formatBigNumber(num: BigNumber, decimals: number = 18, fixed?: number) {
  if (num.isZero()) {
    return "0";
  }
  const formattedValue = ethers.utils.formatUnits(num, decimals);
  if (fixed && fixed >= 1) {
    const { integer, decimal } = splitBigNumber(num, decimals);
    // if the integer part is 0 and the decimal part is 0, return origin value, or return truncat value
    if (integer === "0" && decimal.slice(0, fixed) === "0".repeat(fixed)) {
      return formattedValue;
    } else {
      return `${integer}.${decimal.slice(0, fixed)}`;
    }
  } else {
    return formattedValue;
  }
}
