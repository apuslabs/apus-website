import { ConfigProvider, message, Spin } from "antd";
import { ImgPlayground } from "../../assets";
import "./playground.css";
import TextArea from "antd/es/input/TextArea";
import { useChatbot } from "../../contexts/chatbot";
import { useState } from "react";
import { useAutoScroll } from "../../utils/react-use";
import { useArweaveContext } from "../../contexts/arconnect";

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
  const { activeAddress, connectWallet } = useArweaveContext();
  const {
    chatQuestion,
    fetchResult,
    isWaitingForAnswer,
    chatHistory,
    getChatAnswering,
    sendChatQuestioning,
  } = useChatbot("91256d3c61e27f696e6cd0d146aeda39ac4953a1");

  const [question, setQuestion] = useState<string>();

  const isBtnDisabled = getChatAnswering || sendChatQuestioning;

  const scrollRef = useAutoScroll();
  return (
    <div id="playground" className="max-w-[1080px] mx-auto pb-24 pt-6">
      <div className="p-6">
      <div className="w-full rounded-2xl overflow-hidden shadow-xl cursor-pointer" onClick={() => window.location.href = "https://permabrawl.arweave.net/#/home"}>
        <img src={ImgPlayground.BrawlBanner} className="w-full" />
      </div>
        <div className="text-2xl text-[#333333] font-bold mb-4 mt-8">Chat</div>
        <div className="rounded-2xl overflow-hidden bg-white">
          <div className="h-[534px] p-6 overflow-y-auto scroll-smooth" ref={scrollRef}>
            {chatHistory.map(({ role, message }, index) => {
              const isUser = role === "user";
              return (
                <div key={index} className={`flex gap-2 ${isUser ? "flex-row-reverse justify-start" : ""}`}>
                  <div className="flex-0 w-12 h-12">
                    <img src={isUser ? ImgPlayground.UserAvatar : ImgPlayground.ApusAvatar} className="" />
                  </div>
                  <div
                    className={`max-w-[60%] rounded-lg py-3 px-4 font-medium text-base leading-normal mb-4 shadow-sm ${
                      isUser ? " bg-[#d9d9d9]" : "bg-[#f3f3f3]"
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
                      connectWallet();
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
    </div>
  );
};

export default function PlaygroundWrapper() {
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
