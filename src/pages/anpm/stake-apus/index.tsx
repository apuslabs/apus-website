import { useContext, useEffect } from "react";
import BalanceSection from "../components/BalanceSection";
import { Breadcrumb, Select, Slider, Spin, Table } from "antd";
import StakeSection from "./StakeSection";
import { useStake } from "./contexts";
import { BalanceContext } from "../contexts/balance";
import { formatApus } from "../../../utils/utils";

export function Component() {
  const {balance, defaultPool, pools, refetchPoolList, refetchBalance} = useContext(BalanceContext);
  const { staked, transfering, poolID, setPoolID, stake, percent, onPercentChange, unstake, unstaking } = useStake(refetchPoolList, refetchBalance);
  const currentPool = pools.find(pool => pool.pool_id === poolID);

  useEffect(() => {
    if (defaultPool) {
      setPoolID(defaultPool.pool_id);
    }
  }, [defaultPool, setPoolID])
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
          <StakeSection staked={staked} {...currentPool} withdraw={unstake} withdrawing={unstaking} />
        </div>
        <div className="w-[640px] flex flex-col items-center gap-[10px]">
          <div className="box w-full">
            <Table
              dataSource={pools}
              rowKey="pool_id"
              size="small"
              pagination={false}
              columns={[
                { title: "Pool", dataIndex: "name", key: "name" },
                { title: "APR", dataIndex: "apr", key: "apr", render: (text) => <span className="font-bold">{text}%</span> },
                { title: "Staked", dataIndex: "cur_staking", key: "cur_staking", render: (text) => <span className="font-bold">{formatApus(text)}</span> },
                { title: "Capacity", dataIndex: "staking_capacity", key: "staking_capacity", render: (text) => <span className="font-bold">{formatApus(text)}</span> },
              ]}
            />
          </div>
          <div className="box w-full flex flex-col items-center gap-[10px]">
            <Select placeholder="Select a pool" className="w-full mb-[15px]" value={poolID} onChange={(value) => setPoolID(value)}>
              {
                pools.map((pool) => (
                  <Select.Option key={pool.pool_id} value={pool.pool_id}>
                    {pool.name}
                  </Select.Option>
                ))
              }
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
          <Spin spinning={transfering}><div className="btn-mainblue font-semibold px-4 h-12" onClick={() => {
            stake((BigInt(balance) * BigInt(percent) / BigInt(100)).toString());
          }}>Stake {formatApus((BigInt(balance) * BigInt(percent) / BigInt(1e2)).toString())} APUS</div></Spin>
          </div>
        </div>
      </div>
    </main>
  );
}
