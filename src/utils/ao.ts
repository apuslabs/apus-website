import { message, createDataItemSigner, dryrun, result as fetchResult } from "@permaweb/aoconnect";
import { useCallback, useState } from "react";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";

const isEnvDev = import.meta.env.DEV;

export const ShortAddress = (address: string) =>
  `${address.substring(0, 4)}...${address.substring(address.length - 4, address.length)}`;

function obj2tags(obj: Record<string, unknown>) {
  return Object.entries(obj).map(([key, value]) => ({
    name: key,
    value: toString(value),
  }));
}

function toString(value: unknown): string {
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
  msgType: string,
  result: MessageResult,
  tags: Record<string, unknown>,
  data: unknown,
  checkStatus: boolean,
) {
  const msgErr = result.Error;
  if (result.Error) {
    throw new Error(toString(msgErr));
  }
  const resultTags = getTagsFromMessage(result);
  if (checkStatus && resultTags && "Status" in resultTags && resultTags.Status !== "200") {
    throw new Error(`${resultTags.Status} ${getDataFromMessage(result)}`);
  }
  if (isEnvDev) {
    logDebugInfo(tags, msgType, data, result);
  }
}

function logDebugInfo(tags: Record<string, unknown>, msgType: string, data: unknown, result: MessageResult) {
  console.log(`${tags.Action ?? ""} ${msgType}`, {
    reqTags: tags,
    reqData: data,
    output: result?.Output?.data,
    ...formatResult(result),
  });
}

async function executeResult(
  process: string,
  isDryRun: boolean,
  tags: Record<string, string>,
  data?: unknown,
  checkStatus?: boolean,
) {
  try {
    let msgResult;
    if (isDryRun) {
      msgResult = await dryrun({
        process,
        tags: obj2tags(tags),
        data: toString(data),
      });
    } else {
      const messageId = await message({
        process,
        tags: obj2tags(tags),
        signer: createDataItemSigner(window.arweaveWallet),
        data: toString(data),
      });
      msgResult = await fetchResult({
        message: messageId,
        process,
      });
    }
    handleResult(isDryRun ? "DryRun" : "Msg", msgResult, tags, data, checkStatus ?? true);
    return msgResult;
  } catch (e) {
    if (isEnvDev) {
      logError(tags, isDryRun ? "DryRun" : "Msg");
    }
    console.error(e);
    throw e;
  }
}

function logError(tags: Record<string, string>, msgType: string) {
  console.log(`${tags.Action ?? ""} ${msgType}`);
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

export function useAO(
  process: string,
  action: string,
  msgType: "message" | "dryrun",
  options: {
    autoLoad?: boolean;
    checkStatus?: boolean;
  } = {
    autoLoad: false,
    checkStatus: true,
  },
) {
  const isDryRun = msgType === "dryrun";
  const { autoLoad, checkStatus } = options;
  const [result, setResult] = useState<MessageResult>();
  const [loading, setLoading] = useState(autoLoad || false);
  const [error, setError] = useState<string>();

  const execute = useCallback(
    async (tags: Record<string, string> = {}, data?: unknown) => {
      setLoading(true);
      try {
        const result = await executeResult(process, isDryRun, { ...tags, Action: action }, data, checkStatus);
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
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [process, action, checkStatus, isDryRun],
  );
  return {
    result,
    loading,
    error,
    execute,
  };
}
