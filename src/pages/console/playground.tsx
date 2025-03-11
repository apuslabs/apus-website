import { ConfigProvider, message, Select, Spin } from "antd";
import { ImgPlayground } from "../../assets";
import "./playground.css";
import TextArea from "antd/es/input/TextArea";
import { usePlayground } from "../../contexts/playground";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAutoScroll } from "../../utils/react-use";
import { useLocalStorage } from "react-use";
import { useActiveAddress, useConnection } from "arweave-wallet-kit";

function truncateString(str: string, delimiters: string[] = ["<|"]) {
  let minIndex = str.length;

  delimiters.forEach((delimiter) => {
    const index = str.indexOf(delimiter);
    if (index !== -1 && index < minIndex) {
      minIndex = index;
    }
  });

  return str.substring(0, minIndex).replace("\n", " ").trim();
}

export const Playground = () => {
  const activeAddress = useActiveAddress();
  const {connect} = useConnection();
  const [selectedDataset, setSelectedDataset] = useLocalStorage<string>("selected-dataset");
  const { poolid } = useParams();
  const {
    datasets,
    datasetsLoading,
    chatQuestion,
    fetchResult,
    isWaitingForAnswer,
    chatHistory,
    getChatAnswering,
    sendChatQuestioning,
    setNeedRefresh,
  } = usePlayground(poolid, selectedDataset);
  const { search } = useLocation();

  const [initDataset, setInitDataset] = useState(false);
  useEffect(() => {
    if (!initDataset) {
      const searchParams = new URLSearchParams(search);
      const passed_dataset = searchParams.get("dataset_id");
      if (passed_dataset) {
        setSelectedDataset(passed_dataset);
        setInitDataset(true);
      } else if (!selectedDataset && datasets.length) {
        setSelectedDataset(passed_dataset || datasets[0].dataset_hash);
        setInitDataset(true);
      }
    }
  }, [datasets, initDataset, selectedDataset, search, setSelectedDataset]);

  const [question, setQuestion] = useState<string>();

  const isBtnDisabled = getChatAnswering || sendChatQuestioning;

  const scrollRef = useAutoScroll();
  return (
    <div id="playground" className="max-w-[1080px] mx-auto pb-32 pt-6">
      <div className="text-sm text-black50 mb-4">Dataset</div>
      <div className="flex items-center gap-4">
        <Select
          value={datasetsLoading ? undefined : selectedDataset}
          loading={datasetsLoading}
          size="large"
          className="w-1/2"
          onSelect={(v) => {
            setSelectedDataset(v);
            setNeedRefresh(true);
          }}
        >
          {datasets.map(({ dataset_hash, dataset_name }) => {
            return (
              <Select.Option key={dataset_hash} value={dataset_hash}>
                {dataset_name}
              </Select.Option>
            );
          })}
        </Select>
      </div>
      <div className="text-sm text-black50 mb-4 mt-8">Chat</div>
      <div className="rounded-2xl overflow-hidden bg-[#EBEFFF]">
        <div className="h-[534px] p-6 overflow-y-auto scroll-smooth" ref={scrollRef}>
          {chatHistory.map(({ role, message }, index) => {
            const isUser = role === "user";
            return (
              <div key={index} className={`flex gap-2 ${isUser ? "flex-row-reverse justify-start" : ""}`}>
                <div className="flex-0 w-12 h-12">
                  <img src={isUser ? ImgPlayground.UserAvatar : ImgPlayground.ApusAvatar} className="" />
                </div>
                <div
                  className={`max-w-[60%] rounded-lg py-3 px-4 font-medium text-base leading-normal mb-4 ${
                    isUser ? " bg-white50" : "bg-white"
                  }`}
                >
                  {role !== "user" ? truncateString(message) : message}
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="relative bg-[#F5F7FF] p-4"
          style={{
            boxShadow: "0 -4px 16px rgba(0, 0, 0, 0.1)",
          }}
        >
          <TextArea
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
            disabled={isWaitingForAnswer}
            placeholder="Enter prompt here"
            style={{
              paddingRight: "20%",
            }}
          />
          <div className={`absolute right-8 bottom-6`}>
            <Spin spinning={isBtnDisabled}>
              <div
                className={`btn-blueToPink135 w-32`}
                onClick={() => {
                  if (isBtnDisabled) return;
                  if (!activeAddress) {
                    connect();
                    return;
                  }
                  if (isWaitingForAnswer) {
                    fetchResult();
                  } else {
                    if (!question?.trim().length) {
                      message.warning("Please enter a prompt");
                    } else {
                      chatQuestion(question.trim()).then(() => {
                        setQuestion("");
                      });
                    }
                  }
                }}
              >
                {activeAddress ? (isWaitingForAnswer ? "Refresh" : "Send") : "Connect"}
              </div>
            </Spin>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Component() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: "#111111",
        },
        components: {
          Select: {
            optionHeight: 44,
            optionFontSize: 16,
            optionLineHeight: "44px",
            optionSelectedBg: "#ffffff",
            optionPadding: "5px 16px",
          },
        },
      }}
    >
      <Playground />
    </ConfigProvider>
  );
}
