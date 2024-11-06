import { message, createDataItemSigner, dryrun, result } from "@permaweb/aoconnect";
import { blueLabelStyle, greenLabelStyle, messageStyle, redLabelStyle } from "../config/console";
import { useCallback, useState } from "react";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";

export const ShortAddress = (address: string) =>
  `${address.substring(0, 4)}...${address.substring(address.length - 5, address.length - 1)}`;
function obj2tags(obj: Record<string, unknown>) {
  return Object.entries(obj).map(([key, value]) => ({
    name: key,
    value: toString(value),
  }));
}

export function toString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value.toString();
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
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
  tags: Record<string, unknown>,
  data: unknown,
  continueOnError?: boolean,
) {
  const msgErr = result.Error;
  if (msgErr !== undefined) {
    if (typeof msgErr === "string" || typeof msgErr === "number") {
      throw new Error(msgErr + "");
    } else {
      throw new Error(JSON.stringify(msgErr));
    }
  }
  if (result?.Messages?.[0]) {
    const msg: AOMessage | undefined = result?.Messages?.[0];
    const Status = msg?.Tags?.find((tag) => tag.name === "Status");
    if (Status) {
      if (!continueOnError && Status.value != "200") {
        throw new Error(Status.value + " " + msg?.Data);
      }
    }
  }
  if (debug) {
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
}

export function messageResultWrapper(process: string, debug?: boolean) {
  return async function (tags: Record<string, string>, data?: unknown) {
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
      if (debug) {
        console.log(
          `%c${tags.Action ?? ""}%c %cMsg%c ${messageId}`,
          blueLabelStyle,
          messageStyle,
          redLabelStyle,
          messageStyle,
        );
      }
      console.error(e);
      throw e;
    }
  };
}

export function dryrunResultWrapper(process: string, debug?: boolean, continueOnError?: boolean) {
  return async function (tags: Record<string, string>, data?: unknown) {
    try {
      const dryrunResult = await dryrun({
        process,
        tags: obj2tags(tags),
        // signer: createDataItemSigner(window.arweaveWallet),
        data: toString(data),
      });
      handleResult(debug, "DryRun", dryrunResult, undefined, tags, data, continueOnError);
      return dryrunResult;
    } catch (e) {
      if (debug) {
        console.log(`%c${tags.Action ?? ""}%c %cDryRun%c`, blueLabelStyle, messageStyle, redLabelStyle, messageStyle);
      }
      console.error(e);
    }
  };
}

export function getTagsFromMessage(
  message: MessageResult | DryRunResult | undefined,
  index: number = 0,
): Record<string, string> | undefined {
  return message?.Messages?.[index]?.Tags?.reduce(
    (acc: Record<string, string>, tag: AOMessageTag) => {
      acc[tag.name] = tag.value;
      return acc;
    },
    {} as Record<string, string>,
  );
}

export function getDataFromMessage<T = unknown>(
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
    async (tags: Record<string, string> = {}, data?: unknown) => {
      setLoading(true);
      try {
        const result = await messageResultWrapper(process, import.meta.env.DEV)({ ...tags, Action }, data);
        if (result == null) {
          throw new Error("No result");
        }
        if (result.Error) {
          throw result.Error;
        }
        setResult(result);
        return result;
      } catch (e) {
        setError(toString(e));
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [Action],
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
  (Action: string, autoLoad = false, continueOnError = false) => {
    const [result, setResult] = useState<MessageResult>();
    const [loading, setLoading] = useState(autoLoad);
    const [error, setError] = useState<string>();

    const msg = useCallback(
      async (tags: Record<string, string> = {}, data?: unknown) => {
        setLoading(true);
        try {
          const result = await dryrunResultWrapper(
            process,
            import.meta.env.DEV,
            continueOnError,
          )({ ...tags, Action }, data);
          if (result == null) {
            throw new Error("No result");
          }
          if (result.Error) {
            setError(toString(result.Error));
          }
          setResult(result);
          return result;
        } catch (e) {
          setError(toString(e));
        } finally {
          setLoading(false);
        }
      },
      [Action, continueOnError],
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
