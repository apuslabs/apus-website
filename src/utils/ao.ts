import { message, createDataItemSigner, dryrun, result as fetchResult } from "@permaweb/aoconnect";
import { useCallback, useState } from "react";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { DryRunResult, MessageInput } from "@permaweb/aoconnect/dist/lib/dryrun";
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
    return value ? String(value) : "";
  }
}

function formatResult(result: MessageResult | DryRunResult) {
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
  result: MessageResult | DryRunResult,
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

function logDebugInfo(tags: Record<string, unknown>, msgType: string, data: unknown, result: MessageResult | DryRunResult) {
  console.log(`${tags.Action ?? ""} ${msgType}`, {
    reqTags: tags,
    reqData: data,
    output: result?.Output?.data,
    ...formatResult(result),
  });
}

// NEW: Queueing mechanism state
const requestQueues: Record<string, Array<() => Promise<void>>> = {};
const isProcessing: Record<string, boolean> = {};

// NEW: Queue processor
async function processQueueInternal(processId: string) {
  if (isProcessing[processId] || !requestQueues[processId] || requestQueues[processId].length === 0) {
    return;
  }

  isProcessing[processId] = true;
  const taskToExecute = requestQueues[processId].shift();

  if (taskToExecute) {
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 50)); // Simulate a delay
      await taskToExecute(); // This executes the core logic and resolves/rejects the Promise of the original executeResult call
    } catch (e) {
      // Errors are expected to be handled by the task itself by rejecting its promise.
      // This catch is a fallback for unexpected issues in queue management itself.
      console.error(`Error during queued task execution for process ${processId} (should be handled by task):`, e);
    } finally {
      isProcessing[processId] = false;
      processQueueInternal(processId); // Attempt to process the next item in the queue
    }
  } else {
    // This case should ideally not be reached if the length > 0 check was performed correctly.
    isProcessing[processId] = false;
  }
}

async function executeResult(
  process: string,
  msgType: "message" | "dryrun",
  tags: Record<string, string>,
  data?: unknown,
  checkStatus?: boolean,
): Promise<MessageResult | DryRunResult> {
  return new Promise<MessageResult | DryRunResult>((resolve, reject) => {
    const task = async () => {
      const startTime = dayjs();
      try {
        let msgResult: MessageResult | DryRunResult;
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
        
        // handleResult expects MessageResult. DryRunResult is cast here,
        // assuming structural compatibility for the fields accessed within handleResult 
        // (e.g., .Error, .Messages, .Output).
        handleResult(msgType, msgResult, tags, data, checkStatus ?? true); 
        
        sendEventToGA(
          process,
          "AO " + msgType + " Success",
          tags.Action ?? "",
          dayjs().diff(startTime, "second").toFixed(0),
        );
        resolve(msgResult);
      } catch (e) {
        if (isEnvDev) {
          logError(tags, msgType);
        } else {
          console.error(e);
        }
        sendEventToGA(process, "AO " + msgType + " Fail", tags.Action ?? "", JSON.stringify(e));
        reject(e);
      }
    };

    if (!requestQueues[process]) {
      requestQueues[process] = [];
    }
    requestQueues[process].push(task);
    processQueueInternal(process); // Trigger processing if not already active
  });
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
  const data = message?.Messages?.[index]?.Data;
  try {
    if (typeof data === "string") {
      return JSON.parse(data) as T;
    }
  } catch {
    return data as T;
  }
}

export function useAO<T>(
  process: string,
  action: string,
  msgType: "message" | "dryrun",
  options: {
    autoLoad?: boolean;
    checkStatus?: boolean;
    loadingWhenFail?: boolean;
  } = {
    autoLoad: false,
    checkStatus: true,
    loadingWhenFail: false,
  },
) {
  const { autoLoad, checkStatus, loadingWhenFail } = options;
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