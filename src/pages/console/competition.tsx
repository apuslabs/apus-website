import { FC, useState } from "react";
import { ImgCompetition } from "../../assets/image";
import { Link } from "react-router-dom";
import { ConfigProvider, Form, Input, Modal, Table, Tooltip } from "antd";
import { ShortAddress } from "../../utils/ao";
import "./competition.css";
import { useArweaveContext } from "../../contexts/arconnect";
import { useForm } from "antd/es/form/Form";
import { ColumnType } from "antd/es/table";

const TwitterVideo = () => (
  <iframe
    className="w-[22.25rem] h-[12.5rem] rounded-lg"
    src="https://www.youtube.com/embed/-rPbCeCbJVc?si=778KTA2eKneoQLDF"
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
  ></iframe>
);

const QuickButton: FC<{
  address?: string;
  text: string;
  onJoinCompetition: () => void;
}> = ({ address, text, onJoinCompetition }) => {
  const { activeAddress, connectWallet } = useArweaveContext();
  return (
    <div
      className={`btn-gradient3`}
      onClick={() => {
        if (!activeAddress) {
          connectWallet();
        } else {
          onJoinCompetition()
        }
      }}
    >
      {activeAddress ? "Join Competition" : "Connect Wallet"}
    </div>
  );
};

const ButtonShowMore: FC<{
  open: boolean;
  onClick: () => void;
}> = ({ open, onClick }) => {
  return (
    <div
      className=" absolute right-6 top-6
    btn-default flex items-center gap-2"
      onClick={onClick}
    >
      Show {open ? "Less" : "More"}{" "}
      <img
        src={ImgCompetition.ChevronDown}
        className={`w-3 h-3 ${open ? "rotate-180" : ""}`}
      />
    </div>
  );
};

const CompeittionDetails = [
  {
    icon: ImgCompetition.IconCoinsStacked,
    label: "Reward Pool",
    value: (
      <div className="flex items-center gap-1">
        <span className="text-gradient2 font-medium">400M Point</span>
        <Tooltip title="50% of the reward pool is allocated to the top three participants in the leaderboards." overlayInnerStyle={{
          width: '20rem'
        }}>
          <img src={ImgCompetition.IconInfoCircle} className="w-4 h-4" />
        </Tooltip>
      </div>
    ),
  },
  {
    icon: ImgCompetition.IconCalendar,
    label: "Duration",
    value: "2024.06.25 8:00 - 2024.06.30 8:00",
  },
  {
    icon: ImgCompetition.IconHourGlass,
    label: "Stage",
    value: "Active",
  },
  {
    icon: ImgCompetition.IconFile,
    label: "Fine-tuning Tutorial",
    value: (
      <Link to="/" className=" text-blue font-medium">
        https://github.com
      </Link>
    ),
  },
  {
    icon: ImgCompetition.IconData,
    label: "Dataset",
    value: (
      <Link to="/" className="text-blue font-medium">
        https://github.com
      </Link>
    ),
  },
];

const Statisitcs = [
  {
    label: "Total Participants",
    value: "2,000",
  },
  {
    label: "Rewards Distributed",
    value: "14,758,800 Points",
  },
  {
    label: "Your Rank",
    value: "128",
  },
  {
    label: "Your Points",
    value: "1,000 Points",
  },
];

const TableColumns: ColumnType<any>[] = [
  {
    title: "RANK",
    dataIndex: "rank",
    key: "rank",
  },
  {
    title: "MODEL",
    dataIndex: "model",
    key: "model",
  },
  {
    title: "SCORE",
    dataIndex: "score",
    key: "score",
  },
  {
    title: "TRAINER",
    dataIndex: "trainer",
    key: "trainer",
    render: (text: string) => ShortAddress(text),
  },
  {
    title: "REWARD",
    dataIndex: "reward",
    key: "reward",
    render: (text: string) => <span>{text} Points</span>,
  },
  {
    title: "USING AI MODELS",
    key: "operations",
    align: 'right',
    render: (_: string, item: any) => (
      <div className="btn-default btn-small">Chat With AI Model</div>
    ),
  },
];

const FakeData = () => {
  // create 4 item array
  const itemList = new Array(20).fill({
    rank: 1,
    model: "Model A",
    score: 95,
    trainer: "1234567890abcdef1234567890abcdef12345678",
    reward: 2500,
  });
  return itemList.map((v, i) => ({ ...v, model: v.model + i }));
};

const JoinCompetitionModal: FC<{
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
}> = ({ visible, onCancel, onOk }) => {
  const [form] = useForm();
  return (
    <Modal
      title={
        <div className="font-bold text-black text-2xl">
          Submit Fine-tuned Model
        </div>
      }
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      footer={null}
    >
      <Form layout="vertical" form={form} className="my-10">
        <Form.Item
          name="modelName"
          label={<div className="text-xs text-black50">Model Name</div>}
        >
          <Input
            placeholder="Enter your model name (Example: AI model type A)"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="modelFile"
          label={
            <div className="text-xs text-black50 flex items-center gap-1">
              File Hash on Arweave
              <Tooltip title="A hash code is a digital fingerprint of an input data set, where the code is used to verify or identify the original document at a later time. A hash value is usually produced by applying a hashing function to an input value." overlayClassName="w-80" overlayInnerStyle={{
                width: '20rem'
              }}>
                <img
                  src={ImgCompetition.IconInfoCircle}
                  className="w-3 h-3 cursor-pointer"
                />
              </Tooltip>
            </div>
          }
        >
          <Input placeholder="Enter your File Hash on Arweave " size="large" />
        </Form.Item>
      </Form>
      <div className="flex justify-end gap-4">
        <div
          className="btn-default w-32"
          onClick={() => {
            onCancel();
          }}
        >
          Cancel
        </div>
        <div
          className="btn-gradient3 w-32"
          onClick={() => {
            onOk();
          }}
        >
          Submit
        </div>
      </div>
    </Modal>
  );
};

const Competition = () => {
  const [showMore, setShowMore] = useState(false);
  const [joinCompetitionModalVisible, setJoinCompetitionModalVisible] =
    useState(false);
  return (
    <div id="competition" className="max-w-[1080px] mx-auto pb-64">
      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-xl font-semibold text-neutral-900">
          Competition Pool
        </h2>
        <QuickButton text="Connect Wallet" onJoinCompetition={() => {setJoinCompetitionModalVisible(true)}} />
      </div>
      <div className="relative p-6 bg-light rounded-2xl">
        <div className="w-3/5">
          <h1 className="mb-6 font-bold text-3xl leading-tight">
            Fine-tune AI model_Conversations On Coding, Debugging, Storytelling
          </h1>
          <p className=" text-neutral-900 leading-none">
            Ends in 2 days 16 hours
          </p>
        </div>
        <ButtonShowMore
          open={showMore}
          onClick={() => setShowMore((n) => !n)}
        />
        <div className={`mt-6 justify-between ${showMore ? "flex" : "hidden"}`}>
          <ul className="flex flex-col gap-4 w-3/5">
            {CompeittionDetails.map(({ icon, label, value }) => {
              return (
                <li className="flex items-center gap-1 text-sm" key={label}>
                  <img src={icon} className="w-4 h-4" />
                  <span className="text-black">{label}:</span>
                  <span className="text-black50">{value}</span>
                </li>
              );
            })}
            <li className="text-sm">
              <div className="flex items-center gap-1 mb-3">
                <img src={ImgCompetition.IconAlignLeft} className="w-4 h-4" />
                <span className="text-black">Requirements:</span>
              </div>
              <p className="text-black50 px-5 leading-relaxed">
                Large language models (LLMs) are rapidly entering our lives, but
                ensuring their responses resonate with users is critical for
                successful interaction. This competition presents a unique
                opportunity to tackle this challenge with real-world data and
                help us bridge the gap between LLM capability and human
                preference.
              </p>
            </li>
          </ul>
          <TwitterVideo />
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-xl font-semibold text-neutral-900">Dashboard</h2>
      </div>
      <div className="flex gap-4">
        {Statisitcs.map(({ label, value }) => {
          return (
            <div
              className="flex-1 bg-light p-6 
            border border-black5 border-solid rounded-2xl"
              key={label}
            >
              <label className="text-black50 text-xs mb-4">{label}</label>
              <div className="font-medium text-xl">{value}</div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col mt-8 mb-4">
        <h2 className="text-xl font-semibold text-neutral-900">Leaderboard</h2>
        <p className="mt-2 text-black50 text-xs">
          Leaderboard updated every 24 hours
        </p>
      </div>
      <div className="rounded-2xl">
        <Table dataSource={FakeData()} rowKey="model" columns={TableColumns} />
      </div>
      <JoinCompetitionModal
        visible={joinCompetitionModalVisible}
        onCancel={() => {
          setJoinCompetitionModalVisible(false);
        }}
        onOk={() => {
          setJoinCompetitionModalVisible(true);
        }}
      />
    </div>
  );
};

export default () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: "transparent",
        },
        components: {
          Table: {
            headerBg: "rgba(6,45,250,0.1)",
            rowHoverBg: "rgba(6,45,250,0.1)",
          },
          Pagination: {
            itemActiveBg: "#061EFA",
          },
          Input: {
            paddingBlockLG: 15,
            paddingInlineLG: 16,
            borderRadiusLG: 8,
          },
        },
      }}
    >
      <Competition />
    </ConfigProvider>
  );
};
