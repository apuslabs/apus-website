import { ColumnType } from "antd/es/table";
import { ShortAddress } from "../../utils/ao";
import { ConfigProvider, Empty, GetProp, Tooltip } from "antd";
import { ImgCompetition } from "../../assets/image";
import { Leaderboard } from "../../contexts/competition";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const BlueText = ({ text, isBlue }: { text: string| number; isBlue: boolean }) => (
  <span className={isBlue ? "text-blue" : ""}>{text}</span>
);

const TitleWithTip = ({ title, tip }: { title: string; tip: string }) => (
  <div className="flex">
    {title}
    <Tooltip title={tip}>
      <img src={ImgCompetition.IconInfoCircle} className="w-4 h-4 ml-1" />
    </Tooltip>
  </div>
);

export const TableColumns = (activeAddress?: string): ColumnType<any>[] => [
  {
    title: <TitleWithTip title="RANK" tip="If scores are tied, earlier submissions rank higher." />,
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
    title: <TitleWithTip title="SCORE" tip="The total score is out of 100, with higher scores ranking higher." />,
    dataIndex: "score",
    key: "score",
    render: (text: string, item: Leaderboard) => {
      const score = Number(text) / 2
      const isOver1Day = dayjs(item.upload_time).isBefore(dayjs().subtract(1, "day"))
      const progressTip = item.completion_progress === 1 || isOver1Day ? "" : `(${Math.floor(item.completion_progress * 100)}%)`
      return <BlueText text={text ? `${score} ${progressTip}` : "N/A"} isBlue={item.author === activeAddress} />
    },
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
    title: <TitleWithTip title="REWARDS" tip="The competition rewards will fluctuate based on changes in ranking. Your ranking may shift as more participants join" />,
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
