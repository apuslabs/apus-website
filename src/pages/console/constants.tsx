import { ColumnType } from "antd/es/table";
import { ShortAddress } from "../../utils/ao";
import { Empty, Tooltip } from "antd";
import { ImgCompetition } from "../../assets";
import { Leaderboard } from "../../contexts/competition";
import { Link } from "react-router-dom";

const BlueText = ({ text, isBlue }: { text: string | number; isBlue: boolean }) => (
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

export const TableColumns = (poolid?: string, activeAddress?: string): ColumnType<Leaderboard>[] => {
  return [
    {
      title: <TitleWithTip title="RANK" tip="If scores are tied, earlier submissions rank higher." />,
      dataIndex: "rank",
      key: "rank",
      render: (text: string, item: Leaderboard) => (
        // <BlueText text={item.progress ? text : "N/A"} isBlue={item.author === activeAddress} />
        <BlueText text={item.progress ? "*" : "N/A"} isBlue={item.author === activeAddress} />
      ),
    },
    {
      title: "DATASET",
      dataIndex: "dataset_name",
      key: "dataset_name",
      render: (text: string, item: Leaderboard) => <BlueText text={text} isBlue={item.author === activeAddress} />,
    },
    {
      title: <TitleWithTip title="SCORE" tip="The total score is out of 100, with higher scores ranking higher." />,
      dataIndex: "score",
      key: "score",
      render: (text: string, item: Leaderboard) => {
        // const score = Number(text) / 2;
        const progressTip = item.progress === 1 ? "" : `(${Math.floor(item.progress * 100)}%)`;
        return (
          <BlueText text={item.progress ? `* ${progressTip}` : "N/A"} isBlue={item.author === activeAddress} />
          // <BlueText text={item.progress ? `${score} ${progressTip}` : "N/A"} isBlue={item.author === activeAddress} />
        );
      },
    },
    {
      title: "TRAINER",
      dataIndex: "author",
      key: "author",
      render: (text: string, item: Leaderboard) => (
        <BlueText text={ShortAddress(text)} isBlue={item.author === activeAddress} />
      ),
    },
    {
      title: (
        <TitleWithTip
          title="REWARDS"
          tip="The competition rewards will fluctuate based on changes in ranking. Your ranking may shift as more participants join"
        />
      ),
      dataIndex: "reward",
      key: "reward",
      render: (text: string, item: Leaderboard) => (
        // <BlueText text={item.progress ? `${text || 0} APUS_Tn1` : "N/A"} isBlue={item.author === activeAddress} />
        <BlueText text={item.progress ? `*` : "N/A"} isBlue={item.author === activeAddress} />
      ),
    },
    {
      title: "USING AI MODELS",
      key: "operations",
      align: "right",
      render: (_: string, item: Leaderboard) => {
        return (
          <Link to={`../playground/${poolid}?dataset_id=${item.dataset_hash}`}>
            <div className="btn-default btn-small">Chat</div>
          </Link>
        );
      },
    },
  ];
};

export function RenderEmpty() {
  return (
    <Empty
      imageStyle={{ height: "auto" }}
      image={
        <div className="flex justify-center">
          <img className="w-32 h-32" src={ImgCompetition.TableNull} />
        </div>
      }
      description={<span className="text-black50">No Data Available At This Time</span>}
    />
  );
}
