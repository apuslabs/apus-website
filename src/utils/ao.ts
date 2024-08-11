import { message, createDataItemSigner, dryrun, result } from "@permaweb/aoconnect";
import { BENCHMARK_PROCESS } from "../config/process";
import { blueLabelStyle, greenLabelStyle, messageStyle, redLabelStyle, yellowLabelStyle } from "../config/console";
import { useState } from "react";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";

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

export function messageResultWrapper(process: string, debug?: boolean) {
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
        process,
      });
      debug && console.log(`%c${tags.Action ?? ""}%c %cMsg%c ${messageId}`, blueLabelStyle, messageStyle, greenLabelStyle, messageStyle, messageReturn);
      return messageReturn;
    } catch (e) {
      debug && console.log(`%c${tags.Action ?? ""}%c %cMsg%c ${messageId}`, blueLabelStyle, messageStyle, redLabelStyle, messageStyle);
      console.error(e);
    }
  };
}

export function dryrunResultWrapper(process: string, debug?: boolean) {
  return async function (
    tags: Record<string, string>,
    data?: string | Record<string, any> | number
  ) {
    try {
      const dryrunResult = await dryrun({
        process,
        tags: obj2tags(tags),
        // signer: createDataItemSigner(window.arweaveWallet),
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

export function getTagsFromMessage(message: MessageResult | DryRunResult | undefined, index: number = 0): Record<string, string> | undefined {
  return message?.Messages?.[index]?.Tags?.reduce((acc: any, tag: any) => {
    acc[tag.name] = tag.value;
    return acc;
  }, {} as Record<string, string>);
}

export function getDataFromMessage<T = any>(message: MessageResult | DryRunResult | undefined, index: number = 0): T | undefined {
  return message?.Messages?.[index]?.Data;
}

export const useMessageWrapper = (process: string) => (Action: string) => {
  const [result, setResult] = useState<MessageResult>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const msg = async (tags: Record<string, string>  = {}, data?: string | number | Record<string, any>) => {
    setLoading(true)
    try {
      const result = await messageResultWrapper(process, true)({ ...tags, Action }, data)
      if (result == null) {
        throw new Error("No result")
      }
      if (result.Error) {
        setError(toString(result.Error))
      }
      setResult(result as any)
      return result
    } catch (e) {
      setError(toString(e))
      throw e
    } finally {
      setLoading(false)
    }
  }
  
  return {
    result,
    output: result?.Output,
    firstMessageData: result?.Messages?.[0]?.Data,
    firstMessgeTags: result?.Messages?.[0]?.Tags,
    loading,
    error,
    msg,
  }
}

export const useDryrunWrapper = (process: string) => (Action: string) => {
  const [result, setResult] = useState<MessageResult>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const msg = async (tags: Record<string, string> = {}, data?: string | number | Record<string, any>) => {
    setLoading(true)
    try {
      const result = await dryrunResultWrapper(process, true)({ ...tags, Action }, data)
      if (result == null) {
        throw new Error("No result")
      }
      if (result.Error) {
        setError(toString(result.Error))
      }
      setResult(result as any)
      return result
    } catch (e) {
      setError(toString(e))
    } finally {
      setLoading(false)
    }
  }
  
  return {
    result,
    output: result?.Output,
    firstMessageData: result?.Messages?.[0]?.Data,
    firstMessgeTags: result?.Messages?.[0]?.Tags,
    loading,
    error,
    msg,
  }
}
