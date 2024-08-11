import { ColumnType } from "antd/es/table";
import { ShortAddress } from "../../utils/ao";
import { ConfigProvider, Empty, GetProp, Tooltip } from "antd";
import { ImgCompetition } from "../../assets/image";
import { Leaderboard } from "../../contexts/competition";
import { Link } from "react-router-dom";

const BlueText = ({ text, isBlue }: { text: string; isBlue: boolean }) => (
  <span className={isBlue ? "text-blue" : ""}>{text}</span>
);

export const TableColumns = (activeAddress?: string): ColumnType<any>[] => [
  {
    title: (
      <div className="flex">
        RANK
        <Tooltip
          title="If scores are tied, earlier submissions rank higher."
        >
          <img src={ImgCompetition.IconInfoCircle} className="w-4 h-4 ml-1" />
        </Tooltip>
      </div>
    ),
    dataIndex: "rank",
    key: "rank",
    render: (text: string, item: Leaderboard) => (
      <BlueText
        text={item.score ? text : "N/A"}
        isBlue={item.author === activeAddress}
      />
    ),
  },
  {
    title: "DATASET",
    dataIndex: "dataset_name",
    key: "dataset_name",
    render: (text: string, item: Leaderboard) => (
      <BlueText text={text} isBlue={item.author === activeAddress} />
    ),
  },
  {
    title: <div className="flex">
    SCORE
    <Tooltip
      title="Out of 200. Higher scores rank higher."
    >
      <img src={ImgCompetition.IconInfoCircle} className="w-4 h-4 ml-1" />
    </Tooltip>
  </div>,
    dataIndex: "score",
    key: "score",
    render: (text: string, item: Leaderboard) => (
      <BlueText text={text || "N/A"} isBlue={item.author === activeAddress} />
    ),
  },
  {
    title: "TRAINER",
    dataIndex: "author",
    key: "author",
    render: (text: string, item: Leaderboard) => (
      <BlueText
        text={ShortAddress(text)}
        isBlue={item.author === activeAddress}
      />
    ),
  },
  {
    title: "REWARD",
    dataIndex: "granted_reward",
    key: "granted_reward",
    render: (text: string, item: Leaderboard) => (
      <BlueText
        text={`${text} APUS_Tn1`}
        isBlue={item.author === activeAddress}
      />
    ),
  },
  {
    title: "USING AI MODELS",
    key: "operations",
    align: "right",
    render: (_: string, item: any) => (
      <Link to={`../playground?dataset_id=${item.dataset_id}`}>
        <div className="btn-default btn-small">Chat</div>
      </Link>
    ),
  },
];

export const renderEmpty: GetProp<typeof ConfigProvider, "renderEmpty"> = (
  componentName
) => {
  if (componentName === "Table" /** 👈 5.20.0+ */) {
    return (
      <Empty
        imageStyle={{ height: "auto" }}
        image={
          <div className="flex justify-center">
            <img className="w-32 h-32" src={ImgCompetition.TableNull} />
          </div>
        }
        description={
          <span className="text-black50">No Data Available At This Time</span>
        }
      />
    );
  }
};
