import { ColumnType } from "antd/es/table"
import { ShortAddress } from "../../utils/ao"
import { ConfigProvider, Empty, GetProp } from "antd"
import { ImgCompetition } from "../../assets/image";

export const TableColumns: ColumnType<any>[] = [
  {
    title: "RANK",
    dataIndex: "rank",
    key: "rank",
  },
  {
    title: "DATASET",
    dataIndex: "dataset_name",
    key: "dataset_name",
  },
  {
    title: "SCORE",
    dataIndex: "score",
    key: "score",
  },
  {
    title: "TRAINER",
    dataIndex: "author",
    key: "author",
    render: (text: string) => ShortAddress(text),
  },
  {
    title: "REWARD",
    dataIndex: "granted_reward",
    key: "granted_reward",
    render: (text: string) => <span>{text} Points</span>,
  },
  {
    title: "USING AI MODELS",
    key: "operations",
    align: "right",
    render: (_: string, item: any) => (
      <div className="btn-default btn-small">Chat</div>
    ),
  },
];

export const renderEmpty: GetProp<typeof ConfigProvider, 'renderEmpty'> = (componentName) => {
  if (componentName === 'Table' /** 👈 5.20.0+ */) {
    return <Empty imageStyle={{ height: "auto" }} image={<div className="flex justify-center"><img className="w-32 h-32" src={ImgCompetition.TableNull} /></div>} description={<span className="text-black50">No Data Available At This Time</span>} />;
  }
}