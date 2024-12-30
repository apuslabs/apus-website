import { message, createDataItemSigner, dryrun, result as fetchResult } from "@permaweb/aoconnect";
import { useCallback, useState } from "react";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { DryRunResult, MessageInput } from "@permaweb/aoconnect/dist/lib/dryrun";
import { sendEthMessage } from "./ethHelpers";
import { useConnectWallet } from "@web3-onboard/react";
import dayjs from "dayjs";

function sendEventToGA(category: string, action: string, label: string, value: string) {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

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
  msgType: "message" | "dryrun",
  tags: Record<string, string>,
  data?: unknown,
  checkStatus?: boolean,
) {
  const startTime = dayjs();
  try {
    let msgResult;
    const options: MessageInput = {
      process,
      tags: obj2tags(tags),
      data: toString(data),
    };
    if (tags.Owner) {
      options.Owner = tags.Owner;
    }
    if (msgType === "dryrun") {
      msgResult = await dryrun(options);
    } else {
      const messageId = await message({
        ...options,
        signer: createDataItemSigner(window.arweaveWallet),
      });
      msgResult = await fetchResult({
        message: messageId,
        process,
      });
    }
    handleResult(msgType, msgResult, tags, data, checkStatus ?? true);
    sendEventToGA(
      process,
      "AO " + msgType + " Success",
      tags.Action ?? "",
      dayjs().diff(startTime, "second").toFixed(0),
    );
    return msgResult;
  } catch (e) {
    if (isEnvDev) {
      logError(tags, msgType);
    } else {
      console.error(e);
    }
    sendEventToGA(process, "AO " + msgType + " Fail", tags.Action ?? "", JSON.stringify(e));
    throw e;
  }
}

function logError(tags: Record<string, string>, msgType: string) {
  console.log(`${tags.Action ?? ""} ${msgType}`);
}

export function getTagsFromMessage<U extends Record<string, string>>(
  message: MessageResult | DryRunResult | undefined,
  index: number = 0,
): U | undefined {
  return message?.Messages?.[index]?.Tags?.reduce((acc: Record<string, string>, tag: AOMessageTag) => {
    acc[tag.name] = tag.value;
    return acc;
  }, {} as U);
}

export function getDataFromMessage<T = unknown>(
  message: MessageResult | DryRunResult | undefined,
  index: number = 0,
): T | undefined {
  return message?.Messages?.[index]?.Data;
}

export function useAO<T>(
  process: string,
  action: string,
  msgType: "message" | "dryrun",
  {
    autoLoad = false,
    checkStatus = true,
    loadingWhenFail = false,
  }: {
    autoLoad?: boolean;
    checkStatus?: boolean;
    loadingWhenFail?: boolean;
  },
) {
  const [result, setResult] = useState<MessageResult>();
  const [loading, setLoading] = useState(autoLoad || false);
  const [error, setError] = useState<string>();

  const execute = useCallback(
    async (tags: Record<string, string> = {}, data?: unknown) => {
      setLoading(true);
      try {
        const result = await executeResult(process, msgType, { ...tags, Action: action }, data, checkStatus);
        if (result == null) {
          throw new Error("No result");
        }
        if (result.Error) {
          setResult(undefined);
          setError(toString(result.Error));
        }
        setResult(result);
        if (loadingWhenFail) {
          setLoading(false);
        }
        return result;
      } catch (e) {
        setResult(undefined);
        setError(toString(e));
        throw e;
      } finally {
        if (!loadingWhenFail) {
          setLoading(false);
        }
      }
    },
    [process, action, checkStatus, msgType, loadingWhenFail],
  );
  return {
    result,
    data: getDataFromMessage<T>(result),
    tags: getTagsFromMessage(result),
    loading,
    setLoading,
    error,
    execute,
  };
}

export function useEthMessage<T = unknown>(
  process: string,
  action: string,
  {
    loadingWhenFail = false,
  }: {
    loadingWhenFail?: boolean;
  },
) {
  const [{ wallet }] = useConnectWallet();
  const [result, setResult] = useState<MessageResult>();
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const execute = useCallback(
    async (tags: Record<string, string> = {}, data?: unknown) => {
      if (!wallet || !wallet.accounts.length) {
        throw new Error("Wallet not connected");
      }
      setLoading(true);
      try {
        const result = await sendEthMessage(wallet, {
          process,
          tags: obj2tags({ ...tags, Action: action }),
          data: toString(data),
        });
        setResult(result);
        if (result.Error) {
          setResult(undefined);
          throw new Error(result.Error);
        }
        setData(getDataFromMessage(result));
        if (loadingWhenFail) {
          setLoading(false);
        }
        return result;
      } catch (e) {
        setResult(undefined);
        setError(toString(e));
        throw e;
      } finally {
        if (!loadingWhenFail) {
          setLoading(false);
        }
      }
    },
    [action, process, wallet, loadingWhenFail],
  );
  return {
    result,
    data,
    setLoading,
    loading,
    error,
    execute,
  };
}
