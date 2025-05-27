import { useContext, useEffect, useState } from "react";
import BalanceSection from "../components/BalanceSection";
import { Breadcrumb, Select, Spin, Table } from "antd";
import StakeSection from "./StakeSection";
import { BalanceContext } from "../contexts/balance";
import { formatApus } from "../../../utils/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserStake, stake, unstake } from "../contexts/request";
import { useWallet } from "../contexts/anpm";
import { BalanceSldier } from "../buy-credit/BalanceSlider";
import { BalanceButton } from "../components/BalanceButton";
import { stakeApusIcon, withdrawIcon } from "../assets";

export function Component() {
  const { balance, defaultPool, pools, refetchPoolList, refetchBalance } = useContext(BalanceContext);
  const { activeAddress } = useWallet();
  const [poolID, setPoolID] = useState<string>("");
  const userStakeQuery = useQuery({
    queryKey: ["userStake", activeAddress, poolID],
    queryFn: () => getUserStake(activeAddress || "", poolID),
    enabled: !!(activeAddress && poolID),
  });
  const staked = userStakeQuery.data || "0";
  const [inputApus, setInputApus] = useState(0);
  const [tab, setTab] = useState<"Stake" | "Withdraw">("Stake");
  const stakeMutation = useMutation({
    mutationFn: () => stake((inputApus * 1e12).toFixed(0)),
    onSuccess: async () => {
      refetchBalance();
      refetchPoolList();
      userStakeQuery.refetch();
    },
  });
  const unstakeMutation = useMutation({
    mutationFn: () => unstake((inputApus * 1e12).toFixed(0)),
    onSuccess: async () => {
      refetchBalance();
      refetchPoolList();
      userStakeQuery.refetch();
    },
  });
  const currentPool = pools.find((pool) => pool.pool_id === poolID);

  useEffect(() => {
    if (defaultPool) {
      setPoolID(defaultPool.pool_id);
    }
  }, [defaultPool, setPoolID]);
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
        </div>
        <div className="w-[640px] flex flex-col items-center gap-[10px]">
          <StakeSection staked={staked} interest={"0"} {...currentPool} />
          <div className="box w-full flex flex-col items-center gap-[10px]">
            <div className="flex justify-center gap-4">
            <BalanceButton
              name="Stake"
              icon={stakeApusIcon}
              onClick={() => {setTab("Stake"); setInputApus(0);}}
              active={tab === "Stake"}
            />
            <BalanceButton
              name="Withdraw"
              icon={withdrawIcon}
              onClick={() => {setTab("Withdraw"); setInputApus(0);}}
              active={tab === "Withdraw"}
            />
            </div>
            <Select
              placeholder="Select a pool"
              className="w-full mb-[15px]"
              value={poolID}
              onChange={(value) => setPoolID(value)}
            >
              {pools.map((pool) => (
                <Select.Option key={pool.pool_id} value={pool.pool_id}>
                  {pool.name}
                </Select.Option>
              ))}
            </Select>
            <div className="box w-[280px] text-center text-[#262626] text-base gap-[15px]">
              <div>
                Staked APUS = <span className="font-bold">{formatApus(staked)}</span>
              </div>
              <div>
                Available APUS = <span className="font-bold">{formatApus(balance)}</span>
              </div>
            </div>
            <BalanceSldier max={tab ==="Stake" ? Number((BigInt(balance) - BigInt(staked)).toString()) / 1e12 : Number(staked) / 1e12} value={inputApus} onChange={setInputApus} />
            <Spin spinning={stakeMutation.isPending}>
              <div
                className="btn-mainblue font-semibold px-4 h-12"
                onClick={() => {
                  if (tab === "Withdraw") {
                    unstakeMutation.mutate();
                  } else {
                    stakeMutation.mutate();
                  }
                }}
              >
                {tab} {inputApus.toFixed(2)} APUS
              </div>
            </Spin>
          </div>
          <div className="box w-full">
            <Table
              dataSource={pools}
              rowKey="pool_id"
              size="small"
              pagination={false}
              columns={[
                { title: "Pool", dataIndex: "name", key: "name" },
                {
                  title: "APR",
                  dataIndex: "apr",
                  key: "apr",
                  render: (text) => <span className="font-bold">{text}%</span>,
                },
                {
                  title: "Staked",
                  dataIndex: "cur_staking",
                  key: "cur_staking",
                  render: (text) => <span className="font-bold">{formatApus(text)}</span>,
                },
                {
                  title: "Capacity",
                  dataIndex: "staking_capacity",
                  key: "staking_capacity",
                  render: (text) => <span className="font-bold">{formatApus(text)}</span>,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
