import { ConfigProvider, Form, Input, Select } from "antd";
import { ImgPlayground } from "../../assets/image";
import "./playground.css";
import TextArea from "antd/es/input/TextArea";

const fakeDataset = [
  {
    dataset_hash: "1",
    dataset_name: "#1 Anna's dataset",
  },
  {
    dataset_hash: "2",
    dataset_name: "#2 Anna's dataset",
  },
  {
    dataset_hash: "3",
    dataset_name: "#3 Anna's dataset",
  },
];

const textLengthOptions = [
  {
    text: (
      <div className="flex items-center">
        <img className="w-3 h-3 mr-2" src={ImgPlayground.SignalGreen} />
        <span className="whitespace-pre">
          <span className="inline-block w-28">Short Text</span>
          <span className="inline-block w-32">Max.30 words.</span>
          15 second load
        </span>
      </div>
    ),
    token: 30,
  },
  {
    text: (
      <div className="flex items-center">
        <img className="w-3 h-3 mr-2" src={ImgPlayground.SignalYellow} />
        <span className="whitespace-pre">
          <span className="inline-block w-28">Medium Text</span>
          <span className="inline-block w-32">Max.60 words.</span>
          30 second load
        </span>
      </div>
    ),
    token: 60,
  },
  {
    text: (
      <div className="flex items-center">
        <img className="w-3 h-3 mr-2" src={ImgPlayground.SignalRed} />
        <span className="whitespace-pre">
          <span className="inline-block w-28">Long Text</span>
          <span className="inline-block w-32">Max.120 words.</span>
          45 second load
        </span>
      </div>
    ),
    token: 120,
  },
];

const fakeMessages = [
  {
    role: "assiasent",
    message:
      "Hi, welcome to the Playground! Please type your question into the text box below. You can select your chosen AI model and text response length from the drop-down options above. Enjoy!",
  },
  {
    role: "user",
    message:
      "What are some of the better decentralised Ai products available on Blockchain, then each product describes 3 benefits?",
  },
];

export const Playground = () => {
  return (
    <div
      id="playground"
      className="max-w-[1080px] mx-auto pb-32 pt-6"
      style={{
        height: "calc(100vh - 5rem)",
      }}
    >
      <div className="text-sm text-black50 mb-4">Dataset & Text Length</div>
      <div className="flex items-center gap-4">
        <Select
          defaultValue={fakeDataset[0].dataset_hash}
          size="large"
          className="w-1/2"
        >
          {fakeDataset.map(({ dataset_hash, dataset_name }) => {
            return (
              <Select.Option key={dataset_hash} value={dataset_hash}>
                {dataset_name}
              </Select.Option>
            );
          })}
        </Select>
        <Select
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
        </Select>
      </div>
      <div className="text-sm text-black50 mb-4 mt-8">Chat</div>
      <div className="rounded-2xl overflow-hidden bg-[#EBEFFF]">
        <div className="h-[534px] p-6">
          {fakeMessages.map(({ role, message }, index) => {
            const isUser = role === 'user'
            return (
              <div key={index} className={`flex gap-2 ${isUser ? 'flex-row-reverse justify-start' : ''}`}>
                <div className="flex-0 w-12 h-12">
                  <img src={isUser ? ImgPlayground.UserAvatar : ImgPlayground.ApusAvatar} className="" />
                </div>
                <div className="flex-1 max-w-[60%] bg-white rounded-lg p-4 font-medium text-base leading-normal mb-4">{message}</div>
              </div>
            );
          })}
        </div>
        <div className="relative bg-[#F5F7FF] p-6" style={{
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1)',
        }}>
          <TextArea placeholder="Enter prompt here" />
          <div className="btn-gradient3 absolute right-10 bottom-8 w-32">Send</div>
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
