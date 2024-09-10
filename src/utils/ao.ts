import {
  message,
  createDataItemSigner,
  dryrun,
  result,
} from "@permaweb/aoconnect";
import { POOL_PROCESS } from "../config/process";
import {
  blueLabelStyle,
  greenLabelStyle,
  messageStyle,
  redLabelStyle,
  yellowLabelStyle,
} from "../config/console";
import { useCallback, useState } from "react";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";

export const ShortAddress = (address: string) =>
  `${address.substring(0, 4)}...${address.substring(
    address.length - 5,
    address.length - 1,
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

function formatResult(result: MessageResult) {
  if (result?.Messages?.length > 1) {
    return {
      resMsgs: result?.Messages,
    };
  } else {
    const data = result?.Messages?.[0]?.Data;
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = data;
    }
    return {
      resTags: result?.Messages?.[0]?.Tags,
      resData: parsedData,
    };
  }
}

function handleResult(
  debug: boolean | undefined,
  msgType: string,
  result: MessageResult,
  messageId = "",
  tags: any,
  data: any,
) {
  const msgErr = result.Error || (result as any).error;
  if (msgErr !== undefined) {
    if (typeof msgErr === "string" || typeof msgErr === "number") {
      throw new Error(msgErr + "");
    } else {
      throw new Error(JSON.stringify(msgErr));
    }
  }
  if (result?.Messages?.[0]) {
    const msg = result?.Messages?.[0];
    if (msg.Tags?.Status) {
      if (msg.Tags?.Status !== "200") {
        throw new Error(msg.Tags?.Status + " " + msg.Data);
      }
    }
  }
  debug &&
    console.log(
      `%c${tags.Action ?? ""}%c %c${msgType}%c ${messageId}`,
      blueLabelStyle,
      messageStyle,
      greenLabelStyle,
      messageStyle,
      Object.assign(
        {
          reqTags: tags,
          reqData: data,
          output: result?.Output?.data,
        },
        formatResult(result),
      ),
    );
}

export function messageResultWrapper(process: string, debug?: boolean) {
  return async function (
    tags: Record<string, string>,
    data?: string | Record<string, any> | number,
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
      handleResult(debug, "Msg", messageReturn, messageId, tags, data);
      return messageReturn;
    } catch (e) {
      debug &&
        console.log(
          `%c${tags.Action ?? ""}%c %cMsg%c ${messageId}`,
          blueLabelStyle,
          messageStyle,
          redLabelStyle,
          messageStyle,
        );
      console.error(e);
      throw e;
    }
  };
}

export function dryrunResultWrapper(process: string, debug?: boolean) {
  return async function (
    tags: Record<string, string>,
    data?: string | Record<string, any> | number,
  ) {
    try {
      const dryrunResult = await dryrun({
        process,
        tags: obj2tags(tags),
        // signer: createDataItemSigner(window.arweaveWallet),
        data: toString(data),
      });
      handleResult(debug, "DryRun", dryrunResult, undefined, tags, data);
      return dryrunResult;
    } catch (e) {
      debug &&
        console.log(
          `%c${tags.Action ?? ""}%c %cDryRun%c`,
          blueLabelStyle,
          messageStyle,
          redLabelStyle,
          messageStyle,
        );
      console.error(e);
    }
  };
}

export function getTagsFromMessage(
  message: MessageResult | DryRunResult | undefined,
  index: number = 0,
): Record<string, string> | undefined {
  return message?.Messages?.[index]?.Tags?.reduce(
    (acc: any, tag: any) => {
      acc[tag.name] = tag.value;
      return acc;
    },
    {} as Record<string, string>,
  );
}

export function getDataFromMessage<T = any>(
  message: MessageResult | DryRunResult | undefined,
  index: number = 0,
): T | undefined {
  return message?.Messages?.[index]?.Data;
}

export const messageWrapper = (process: string) => (Action: string) => {
  const [result, setResult] = useState<MessageResult>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const msg = useCallback(
    async (
      tags: Record<string, string> = {},
      data?: string | number | Record<string, any>,
    ) => {
      setLoading(true);
      try {
        const result = await messageResultWrapper(process, import.meta.env.DEV)(
          { ...tags, Action },
          data,
        );
        if (result == null) {
          throw new Error("No result");
        }
        if (result.Error) {
          throw result.Error;
        }
        setResult(result as any);
        return result;
      } catch (e) {
        setError(toString(e));
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    result,
    output: result?.Output,
    firstMessageData: result?.Messages?.[0]?.Data,
    firstMessgeTags: result?.Messages?.[0]?.Tags,
    loading,
    error,
    msg,
  };
};

export const dryrunWrapper =
  (process: string) =>
  (Action: string, autoLoad = false) => {
    const [result, setResult] = useState<MessageResult>();
    const [loading, setLoading] = useState(autoLoad);
    const [error, setError] = useState<string>();

    const msg = useCallback(
      async (
        tags: Record<string, string> = {},
        data?: string | number | Record<string, any>,
      ) => {
        setLoading(true);
        try {
          const result = await dryrunResultWrapper(
            process,
            import.meta.env.DEV,
          )({ ...tags, Action }, data);
          if (result == null) {
            throw new Error("No result");
          }
          if (result.Error) {
            setError(toString(result.Error));
          }
          setResult(result as any);
          return result;
        } catch (e) {
          setError(toString(e));
        } finally {
          setLoading(false);
        }
      },
      [],
    );

    return {
      result,
      output: result?.Output,
      firstMessageData: result?.Messages?.[0]?.Data,
      firstMessgeTags: result?.Messages?.[0]?.Tags,
      loading,
      error,
      msg,
    };
  };
