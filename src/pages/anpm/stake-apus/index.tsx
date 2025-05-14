import { useState } from "react";
import BalanceSection from "../components/BalanceSection";
import { Breadcrumb, Select, Slider, Table } from "antd";
import StakeSection from "../components/StakeSection";
import { ANPM_DEFAULT_POOL } from "../../../utils/config";
import { useStake } from "../contexts/stake";
import { useBalance } from "../contexts/balance";
import { formatApus } from "../../../utils/utils";

export function Component() {
  const {balance} = useBalance();
  const { staked, poolTotalStaked, poolCapacity, setPoolID, stake } = useStake();
  const [percent, setPercent] = useState(0);
  const onPercentChange = (value: number) => {
    setPercent(value);
  };
  return (
    <main className="pt-[148px] pb-[90px] bg-[#F9FAFB]">
      <div className="content-area mb-[40px]">
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
      <div className="max-w-[1200px] mx-auto p-5 flex gap-10">
        <div className="flex flex-col gap-10 w-[250px]">
          <BalanceSection />
          <StakeSection staked={staked} />
        </div>
        <div className="w-[640px] flex flex-col items-center gap-[10px]">
          <div className="box w-full">
            <Table
              dataSource={[{ name: ANPM_DEFAULT_POOL.Name, apr: ANPM_DEFAULT_POOL.APR, staked: poolTotalStaked, capacity: poolCapacity }]}
              size="small"
              pagination={false}
              columns={[
                { title: "Pool", dataIndex: "name", key: "name", render: (text, _, index) => <span><span className="inline-block w-5 font-bold">{index}.</span>{text}</span> },
                { title: "APR", dataIndex: "apr", key: "apr", render: (text) => <span className="font-bold">{text}%</span> },
                { title: "Staked", dataIndex: "staked", key: "staked", render: (text) => <span className="font-bold">{formatApus(text)}</span> },
                { title: "Capacity", dataIndex: "capacity", key: "capacity", render: (text) => <span className="font-bold">{formatApus(text)}</span> },
              ]}
            />
          </div>
          <div className="box w-full flex flex-col items-center gap-[10px]">
            <Select placeholder="Select a pool" className="w-full mb-[15px]" defaultValue={"1"} onChange={(value) => setPoolID(value)}>
              <Select.Option value="1">AI Inference</Select.Option>
            </Select>
          <div className="box w-[280px] text-center text-[#262626] text-base gap-[15px]">
            <div>
              Staked APUS = <span className="font-bold">{formatApus(staked)}</span>
            </div>
            <div>
              Available APUS = <span className="font-bold">{formatApus(balance)}</span>
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
          <div className="btn-mainblue font-semibold px-4 h-12" onClick={() => {
            stake((BigInt(balance) * BigInt(percent) / BigInt(100)).toString());
          }}>Stake {formatApus((BigInt(balance) * BigInt(percent) / BigInt(1e2)).toString())} APUS</div>
          </div>
        </div>
      </div>
    </main>
  );
}
