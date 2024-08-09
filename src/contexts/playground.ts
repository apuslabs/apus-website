import { useEffect, useState } from "react";
import { BENCHMARK_PROCESS } from "../config/process";
import {
  getDataFromMessage,
  getTagsFromMessage,
  useDryrunWrapper,
  useMessageWrapper,
} from "../utils/ao";
import { useArweaveContext } from "./arconnect";
import { useDebounce, useLocalStorage } from "react-use";
import dayjs from "dayjs";

const DEFAULT_OUTPUT_TOKENS = "20";
const USER_WAIT_TIPS = (isOverTime: boolean, timeLeft: string) => isOverTime ? "The Chat is taking longer than expected. Please wait a few more minutes." : `Chat Result Will Reach You in ${timeLeft}`;
const USER_TIMEOUT_TIPS = "Sorry for the inconvenience. The Chat maynot be able to provide the result in time. Please try again later.";

const usePlaygroundMessage = useMessageWrapper(BENCHMARK_PROCESS);
const usePlaygroundDryrun = useDryrunWrapper(BENCHMARK_PROCESS);

interface DatasetItem {
  id: number;
  author: string;
  participant_dataset_hash: string;
  rewarded_tokens: number;
  upload_dataset_name: string;
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
  const avgTokens = question.length / 3
  const avgTime = avgTokens * 0.5 // seconds
  const baseTime = 600
  return avgTime + baseTime
}

export function usePlayground(dataset_hash?: string) {
  const { activeAddress } = useArweaveContext();
  const [userHistory, setUserHistory] = useLocalStorage<UserHistory>("session-history", {});

  const { msg: getDatasets, result: datasetsResult, loading: datasetsLoading } =
    usePlaygroundDryrun("Get-Datasets");
  const { msg: chatQuestionMsg, loading: sendChatQuestioning } = usePlaygroundMessage("Chat-Question");
  const { msg: getChatAnswer, loading: getChatAnswering } =
    usePlaygroundDryrun("Get-Chat-Answer");

  // auto get datasets when active address changes
  useEffect(() => {
    if (activeAddress) {
      getDatasets();
    }
  }, [activeAddress]);

  const chatHistory = dataset_hash ? userHistory?.[dataset_hash] || [] : []

  const chatQuestion = async (question: string) => {
    if (dataset_hash && question) {
      const cqResult = await chatQuestionMsg(
        {},
        { dataset_hash, question, token: DEFAULT_OUTPUT_TOKENS }
      );
      const cqTags = getTagsFromMessage(cqResult, 1);
      const cqReference = cqTags?.Reference || "";
      console.log(cqReference)
      if (cqReference) {
        chatHistory.push({
          role: "user",
          message: question,
          reference: cqReference,
          timestamp: dayjs().valueOf(),
          expectedTime: dayjs().add(calculateInferenceTime(question), "seconds").valueOf()
        });
        setUserHistory({ ...userHistory, [dataset_hash]: chatHistory });
        setNeedRefresh(true)
      }
    }
  };

  const isWaitingForAnswer = chatHistory.length != 0 && chatHistory[chatHistory.length - 1]?.role !== "assistant"

  const fetchResult = async () => {
    if (!isWaitingForAnswer) return
    if (dataset_hash) {
      if (chatHistory.length) {
        const lastChat = chatHistory[chatHistory.length - 1];
        console.log(lastChat.reference)
        const chatAnswerResult = await getChatAnswer({}, lastChat.reference);
        const chatTags = getTagsFromMessage(chatAnswerResult);
        const chatAnswer = getDataFromMessage(chatAnswerResult);
        if (chatTags?.status == "nil" || chatTags?.status == "100") {
          const isOverTime = dayjs().isAfter(dayjs(lastChat.expectedTime));
          const timeLeft = dayjs().to(dayjs(lastChat.expectedTime));
          // if over 1 hour, stop waiting, and show tips
          if (dayjs().diff(dayjs(lastChat.expectedTime), "hour") > 1) {
            chatHistory.push({
              role: "assistant",
              message: USER_TIMEOUT_TIPS,
              reference: lastChat.reference,
              timestamp: dayjs().valueOf(),
              expectedTime: lastChat.expectedTime
            })
          } else {
            chatHistory.push({
              role: "frontend",
              message: USER_WAIT_TIPS(isOverTime, timeLeft),
              reference: lastChat.reference,
              timestamp: dayjs().valueOf(),
              expectedTime: lastChat.expectedTime
            });
          }
          setUserHistory({ ...userHistory, [dataset_hash]: chatHistory });
        } else if (chatTags?.status == "200") {
          chatHistory.push({
            role: "assistant",
            message: chatAnswer,
            reference: lastChat.reference,
            timestamp: dayjs().valueOf(),
            expectedTime: lastChat.expectedTime
          });
          setUserHistory({ ...userHistory, [dataset_hash]: chatHistory });
        }
      }
    }
  };

  const [needRefresh, setNeedRefresh] = useState(true);
  
  useEffect(() => {
    if (dataset_hash && userHistory && !userHistory[dataset_hash]) {
      // set Default Text
      setUserHistory({ ...userHistory, [dataset_hash]: [{
        role: "assistant",
        message: "Hi, welcome to the Playground! Please type your question into the text box below. You can select your chosen dataset from the drop-down options above. Enjoy!",
        reference: "",
        timestamp: dayjs().valueOf(),
        expectedTime: dayjs().valueOf(),
      }] });
      return
    }
    // load chat history
    if (dataset_hash && userHistory && userHistory[dataset_hash] && userHistory[dataset_hash].length && needRefresh) {
      setNeedRefresh(false);
      fetchResult();
    }
  }, [dataset_hash, JSON.stringify(userHistory), needRefresh])

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
