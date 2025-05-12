import { useState } from "react";
import BalanceSection from "../components/BalanceSection";
import { Breadcrumb, Select, Slider, Table } from "antd";
import StakeSection from "../components/StakeSection";

const pools = [
  { name: "Pool 1", apr: 7, fee: 2 },
  { name: "Pool 2", apr: 5, fee: 3 },
  { name: "Pool 3", apr: 8, fee: 1 },
  { name: "Pool 4", apr: 6, fee: 2 },
  { name: "Pool 5", apr: 9, fee: 4 },
];

export function Component() {
  const [percent, setPercent] = useState(0);
  const onPercentChange = (value: number) => {
    setPercent(value);
  };
  return (
    <main className="pt-[170px] pb-[90px] bg-[#F9FAFB]">
      <div className="content-area mb-[60px]">
        <Breadcrumb
          items={[
            {
              title: "Dashboard",
              path: "/anpm/console",
            },
            {
              title: "Stake APUS",
            },
          ]}
        />
      </div>
      <div className="max-w-[1200px] mx-auto flex gap-10">
        <div className="flex flex-col gap-10 w-[250px]">
          <BalanceSection />
          <StakeSection />
        </div>
        <div className="w-[640px] flex flex-col items-center gap-[10px]">
          <div className="box w-full">
            <Table
              dataSource={pools}
              size="small"
                pagination={false}
              columns={[
                { title: "Pool", dataIndex: "name", key: "name", render: (text, _, index) => <span><span className="inline-block w-5 font-bold">{index}.</span>{text}</span> },
                { title: "APR", dataIndex: "apr", key: "apr", render: (text) => <span className="font-bold">{text}%</span> },
                { title: "Fee", dataIndex: "fee", key: "fee", render: (text) => <span className="font-bold">{text}%</span> },
              ]}
            />
          </div>
          <div className="box w-full flex flex-col items-center gap-[10px]">
            <Select placeholder="Select a pool" className="w-full mb-[15px]">
              <Select.Option value="pool1">Pool 1</Select.Option>
              <Select.Option value="pool2">Pool 2</Select.Option>
              <Select.Option value="pool3">Pool 3</Select.Option>
              <Select.Option value="pool4">Pool 4</Select.Option>
              <Select.Option value="pool5">Pool 5</Select.Option>
            </Select>
          <div className="box w-[280px] text-center text-[#262626] text-base gap-[15px]">
            <div>
              Staked APUS = <span className="font-bold">44,234.56</span>
            </div>
            <div>
              Available APUS = <span className="font-bold">100,234.56</span>
            </div>
          </div>
          <Slider
            className="w-full"
            min={0}
            max={100}
            step={1}
            value={percent}
            onChange={(v) => onPercentChange(v)}
          />
          <div className="btn-mainblue font-semibold w-36 h-12">Stake APUS</div>
          </div>
        </div>
      </div>
    </main>
  );
}
