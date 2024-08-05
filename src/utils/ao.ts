import { message, createDataItemSigner, dryrun, result } from "@permaweb/aoconnect";
import { BENCHMARK_PROCESS } from "../config/process";
import { blueLabelStyle, greenLabelStyle, messageStyle, redLabelStyle, yellowLabelStyle } from "../config/console";

export const ShortAddress = (address: string) =>
  `${address.substring(0, 4)}...${address.substring(
    address.length - 5,
    address.length - 1
  )}`;
function obj2tags(obj: Record<string, any>) {
  return Object.entries(obj).map(([key, value]) => ({
    name: key,
    value: toString(value),
  }));
}

export function toString(value: any): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value.toString();
  }
  try {
    return JSON.stringify(value);
  } catch {
    return value.toString();
  }
}

function messageResultWrapper(process: string, debug?: boolean) {
  return async function (
    tags: Record<string, string>,
    data?: string | Record<string, any> | number
  ) {
    const messageId = await message({
      process,
      tags: obj2tags(tags),
      signer: createDataItemSigner(window.arweaveWallet),
      data: toString(data),
    });
    try {
      const messageReturn = await result({
        // the arweave TXID of the message
        message: messageId,
        // the arweave TXID of the process
        process: BENCHMARK_PROCESS,
      });
      debug && console.log(`%c${tags.Action ?? ""}%c %cMsg%c ${messageId}`, blueLabelStyle, messageStyle, greenLabelStyle, messageStyle, messageReturn);
      return messageReturn;
    } catch (e) {
      debug && console.log(`%c${tags.Action ?? ""}%c %cMsg%c ${messageId}`, blueLabelStyle, messageStyle, redLabelStyle, messageStyle);
      console.error(e);
    }
  };
}

export const benchmarkMsg = messageResultWrapper(BENCHMARK_PROCESS, true);

function dryrunResultWrapper(process: string, debug?: boolean) {
  return async function (
    tags: Record<string, string>,
    data?: string | Record<string, any> | number
  ) {
    try {
      const dryrunResult = await dryrun({
        process,
        tags: obj2tags(tags),
        signer: createDataItemSigner(window.arweaveWallet),
        data: toString(data),
      });
      debug && console.log(`%c${tags.Action ?? ""}%c %cDryRun%c`, blueLabelStyle, messageStyle, greenLabelStyle, messageStyle, dryrunResult);
      return dryrunResult;
    } catch (e) {
      debug && console.log(`%c${tags.Action ?? ""}%c %cDryRun%c`, blueLabelStyle, messageStyle, redLabelStyle, messageStyle);
      console.error(e);
    }
  };
}

export const benchmarkDryrun = dryrunResultWrapper(BENCHMARK_PROCESS, true);
