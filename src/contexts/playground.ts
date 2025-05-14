import { useCallback, useEffect, useMemo, useState } from "react";
import { CHAT_PROCESS, POOL_PROCESS } from "../utils/config";
import { getDataFromMessage, getTagsFromMessage, useAO } from "../utils/ao";
import { useInterval, useLocalStorage } from "react-use";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // ES 2015
dayjs.extend(relativeTime);

const DEFAULT_OUTPUT_TOKENS = "20";
const USER_WAIT_TIPS = (isOverTime: boolean, timeLeft: string) =>
  isOverTime
    ? "The Chat is taking longer than expected. Please wait a few more minutes."
    : `Response time is about ${timeLeft}.Thanks for waiting! We are working hard to improve.😊`;
const USER_TIMEOUT_TIPS =
  "Sorry for the inconvenience. The Chat maynot be able to provide the result in time. Please try again later.";

interface DatasetItem {
  dataset_hash: string;
  dataset_name: string;
}

interface ChatItem {
  role: string;
  message: string;
  reference: string;
  timestamp: number;
  expectedTime: number;
}

type UserHistory = Record<string, ChatItem[]>;

const calculateInferenceTime = (question: string) => {
  const avgTokens = question.length / 3;
  const avgTime = avgTokens * 0.5; // seconds
  const baseTime = 300;
  return avgTime + baseTime;
};

export function usePlayground(poolid?: string, dataset_hash?: string) {
  const [userHistory, setUserHistory] = useLocalStorage<UserHistory>("session-history", {});

  const {
    execute: getDatasets,
    result: datasetsResult,
    loading: datasetsLoading,
  } = useAO(POOL_PROCESS, "Get-Datasets", "dryrun", { autoLoad: true });
  const { execute: chatQuestionMsg, loading: sendChatQuestioning } = useAO(CHAT_PROCESS, "Chat-Question", "message");
  const { execute: getChatAnswer, loading: getChatAnswering } = useAO(CHAT_PROCESS, "Get-Chat-Answer", "dryrun", {
    checkStatus: false,
  });

  useEffect(() => {
    getDatasets({}, poolid);
  }, [getDatasets, poolid]);

  const chatHistory = useMemo(
    () => (dataset_hash ? userHistory?.[dataset_hash] || [] : []),
    [dataset_hash, userHistory],
  );

  const chatQuestion = async (question: string) => {
    if (dataset_hash && question) {
      const cqResult = await chatQuestionMsg({}, { dataset_hash, question, token: DEFAULT_OUTPUT_TOKENS });
      const cqReference = cqResult?.Messages?.[1]?.Data || "";
      if (cqReference) {
        chatHistory.push({
          role: "user",
          message: question,
          reference: cqReference,
          timestamp: dayjs().valueOf(),
          expectedTime: dayjs().add(calculateInferenceTime(question), "seconds").valueOf(),
        });
        setUserHistory({ ...userHistory, [dataset_hash]: chatHistory });
        setNeedRefresh(true);
      }
    }
  };

  const isWaitingForAnswer = chatHistory.length != 0 && chatHistory[chatHistory.length - 1]?.role !== "assistant";

  const fetchResult = useCallback(async () => {
    if (!isWaitingForAnswer) return;
    if (dataset_hash) {
      if (chatHistory.length) {
        const lastChat = chatHistory[chatHistory.length - 1];
        const chatAnswerResult = await getChatAnswer({}, lastChat.reference);
        const chatTags = getTagsFromMessage(chatAnswerResult);
        const chatAnswer = getDataFromMessage(chatAnswerResult);
        if (chatTags?.Status == "nil" || chatTags?.Status == "102") {
          const isOverTime = dayjs().isAfter(dayjs(lastChat.expectedTime));
          const timeLeft = dayjs().to(dayjs(lastChat.expectedTime), true);
          // if over 1 hour, stop waiting, and show tips
          if (dayjs().diff(dayjs(lastChat.expectedTime), "hour") > 1) {
            chatHistory.push({
              role: "assistant",
              message: USER_TIMEOUT_TIPS,
              reference: lastChat.reference,
              timestamp: dayjs().valueOf(),
              expectedTime: lastChat.expectedTime,
            });
          } else {
            chatHistory.push({
              role: "frontend",
              message: USER_WAIT_TIPS(isOverTime, timeLeft),
              reference: lastChat.reference,
              timestamp: dayjs().valueOf(),
              expectedTime: lastChat.expectedTime,
            });
          }
          setUserHistory({ ...userHistory, [dataset_hash]: chatHistory });
        } else if (chatTags?.Status == "200") {
          chatHistory.push({
            role: "assistant",
            message: String(chatAnswer),
            reference: lastChat.reference,
            timestamp: dayjs().valueOf(),
            expectedTime: lastChat.expectedTime,
          });
          setUserHistory({ ...userHistory, [dataset_hash]: chatHistory });
        }
      }
    }
  }, [chatHistory, dataset_hash, getChatAnswer, isWaitingForAnswer, setUserHistory, userHistory]);

  useInterval(
    () => {
      fetchResult();
    },
    5 * 60 * 1000,
  );

  const [needRefresh, setNeedRefresh] = useState(true);

  useEffect(() => {
    if (dataset_hash && userHistory && !userHistory[dataset_hash]) {
      // set Default Text
      setUserHistory({
        ...userHistory,
        [dataset_hash]: [
          {
            role: "assistant",
            message:
              "Hi, welcome to the Playground! Please type your question into the text box below. You can select your chosen dataset from the drop-down options above. Enjoy!",
            reference: "",
            timestamp: dayjs().valueOf(),
            expectedTime: dayjs().valueOf(),
          },
        ],
      });
      return;
    }
    // load chat history
    if (dataset_hash && userHistory && userHistory[dataset_hash] && userHistory[dataset_hash].length && needRefresh) {
      setNeedRefresh(false);
      fetchResult();
    }
  }, [dataset_hash, fetchResult, needRefresh, setUserHistory, userHistory]);

  const datasetsMsg = datasetsResult?.Messages?.[0]?.Data || JSON.stringify([]);

  const datasets: DatasetItem[] = JSON.parse(datasetsMsg);

  return {
    datasets,
    datasetsLoading,
    chatQuestion,
    fetchResult,
    isWaitingForAnswer,
    chatHistory,
    getChatAnswering,
    sendChatQuestioning,
    setNeedRefresh,
  };
}
