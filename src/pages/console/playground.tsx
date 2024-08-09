import { ConfigProvider, Form, Input, message, Select, Spin } from "antd";
import { ImgPlayground } from "../../assets/image";
import "./playground.css";
import TextArea from "antd/es/input/TextArea";
import { usePlayground } from "../../contexts/playground";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAutoScroll } from "../../utils/react-use";
import { useLocalStorage } from "react-use";

// const textLengthOptions = [
//   {
//     text: (
//       <div className="flex items-center">
//         <img className="w-3 h-3 mr-2" src={ImgPlayground.SignalGreen} />
//         <span className="whitespace-pre">
//           <span className="inline-block w-28">Short Text</span>
//           <span className="inline-block w-32">Max.30 words.</span>
//           15 second load
//         </span>
//       </div>
//     ),
//     token: 30,
//   },
//   {
//     text: (
//       <div className="flex items-center">
//         <img className="w-3 h-3 mr-2" src={ImgPlayground.SignalYellow} />
//         <span className="whitespace-pre">
//           <span className="inline-block w-28">Medium Text</span>
//           <span className="inline-block w-32">Max.60 words.</span>
//           30 second load
//         </span>
//       </div>
//     ),
//     token: 60,
//   },
//   {
//     text: (
//       <div className="flex items-center">
//         <img className="w-3 h-3 mr-2" src={ImgPlayground.SignalRed} />
//         <span className="whitespace-pre">
//           <span className="inline-block w-28">Long Text</span>
//           <span className="inline-block w-32">Max.120 words.</span>
//           45 second load
//         </span>
//       </div>
//     ),
//     token: 120,
//   },
// ];

function truncateString(str: string, delimiters: string[] = ["<|", "\n"]) {
  let minIndex = str.length;

  delimiters.forEach(delimiter => {
      const index = str.indexOf(delimiter);
      if (index !== -1 && index < minIndex) {
          minIndex = index;
      }
  });

  return str.substring(0, minIndex);
}

export const Playground = () => {
  const [selectedDataset, setSelectedDataset] = useLocalStorage<string>("selected-dataset")
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
  } = usePlayground(selectedDataset);
  const { search } = useLocation()

  const [initDataset, setInitDataset] = useState(false)
  useEffect(() => {
    if (!initDataset) {
      const searchParams = new URLSearchParams(search)
      const passed_dataset = searchParams.get('dataset_id')
      if (passed_dataset) {
        setSelectedDataset(passed_dataset)
        setInitDataset(true)
      } else if (!selectedDataset && datasets.length) {
        setSelectedDataset(passed_dataset || datasets[0].participant_dataset_hash)
        setInitDataset(true)
      }
    }
  }, [datasets, initDataset, selectedDataset])

  const [question, setQuestion] = useState<string>()

  const isBtnDisabled = getChatAnswering || sendChatQuestioning

  const scrollRef = useAutoScroll()
  return (
    <div
      id="playground"
      className="max-w-[1080px] mx-auto pb-32 pt-6"
    >
      <div className="text-sm text-black50 mb-4">Dataset</div>
      <div className="flex items-center gap-4">
        <Select
          value={selectedDataset}
          loading={datasetsLoading}
          size="large"
          className="w-1/2"
          onSelect={v => {
            setSelectedDataset(v)
            setNeedRefresh(true)
          }}
        >
          {datasets.map(({ participant_dataset_hash, upload_dataset_name }) => {
            return (
              <Select.Option key={participant_dataset_hash} value={participant_dataset_hash}>
                {upload_dataset_name}
              </Select.Option>
            );
          })}
        </Select>
        {/* <Select
          defaultValue={textLengthOptions[0].token}
          size="large"
          className="w-1/2"
        >
          {textLengthOptions.map(({ text, token }) => {
            return (
              <Select.Option key={token} value={token}>
                {text}
              </Select.Option>
            );
          })}
        </Select> */}
      </div>
      <div className="text-sm text-black50 mb-4 mt-8">Chat</div>
      <div className="rounded-2xl overflow-hidden bg-[#EBEFFF]">
        <div className="h-[534px] p-6 overflow-y-auto scroll-smooth" ref={scrollRef}>
          {chatHistory.map(({ role, message }, index) => {
            const isUser = role === 'user'
            return (
              <div key={index} className={`flex gap-2 ${isUser ? 'flex-row-reverse justify-start' : ''}`}>
                <div className="flex-0 w-12 h-12">
                  <img src={isUser ? ImgPlayground.UserAvatar : ImgPlayground.ApusAvatar} className="" />
                </div>
                <div className={`max-w-[60%] rounded-lg py-3 px-4 font-medium text-base leading-normal mb-4 ${isUser ? ' bg-white50' : 'bg-white'}`}>{role !== 'user' ? truncateString(message) : message}</div>
              </div>
            );
          })}
        </div>
        <div className="relative bg-[#F5F7FF] p-4" style={{
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1)',
        }}>
          <TextArea value={question} onChange={e => {
            setQuestion(e.target.value)
          }} disabled={isWaitingForAnswer} placeholder="Enter prompt here" style={{
            paddingRight: '20%',
          }} />
          <div className={`absolute right-8 bottom-6`}>
            <Spin spinning={isBtnDisabled}>
              <div className={`btn-gradient3 w-32`} onClick={() => {
                if (isBtnDisabled) return
                if (isWaitingForAnswer) {
                  fetchResult()
                } else {
                  if (!question?.trim().length) {
                    message.warning('Please enter a prompt')
                  } else {
                    chatQuestion(question.trim()).then(() => {setQuestion('')})
                  }
                }
              }}>{isWaitingForAnswer ? 'Refresh' : 'Send'}</div>
            </Spin>
          </div>
        </div>
      </div>
    </div>
  );
}; 

export default function () {
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
