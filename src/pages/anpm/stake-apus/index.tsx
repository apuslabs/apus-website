import { useContext, useEffect, useState } from "react";
import BalanceSection from "../components/BalanceSection";
import { Breadcrumb, Select, Spin, Table, Tooltip } from "antd";
import StakeSection from "./StakeSection";
import { BalanceContext } from "../contexts/balance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getInterest, getUserStake, stake, unstake } from "../contexts/request";
import { useWallet } from "../contexts/anpm";
import { BalanceSldier } from "../buy-credit/BalanceSlider";
import { BalanceButton } from "../components/BalanceButton";
import { stakeApusIcon, withdrawIcon } from "../assets";
import { InfoCircleOutlined } from "@ant-design/icons";
import { formatNumber, NumberBox } from "../components/NumberBox";
import dayjs from "dayjs";
import { useConnection } from "arweave-wallet-kit";

export function Component() {
  const { activeAddress } = useWallet();
  const { connect } = useConnection();
  const { balance, defaultPool, pools, poolListQuery, balanceQuery, refetchPoolList, refetchBalance } =
    useContext(BalanceContext);
  const pool_start_time = dayjs(Number(poolListQuery.data?.[0]?.pre_staking_time || "0"));
  const pool_end_time = dayjs(Number(poolListQuery.data?.[0]?.staking_end || "0"));
  const [poolID, setPoolID] = useState<string>("");
  const userStakeQuery = useQuery({
    queryKey: ["userStake", activeAddress, poolID],
    queryFn: () => getUserStake(activeAddress || "", poolID),
    enabled: !!(activeAddress && poolID),
  });
  const userInterestQuery = useQuery({
    queryKey: ["userInterest", activeAddress],
    queryFn: () => getInterest(activeAddress || ""),
    enabled: !!activeAddress,
  });
  const staked = userStakeQuery.data || "0";
  const [inputApus, setInputApus] = useState(0);
  const [tab, setTab] = useState<"Stake" | "Unstake">("Stake");
  const stakeMutation = useMutation({
    mutationFn: () => stake((inputApus * 1e12).toFixed(0)),
    onSuccess: async () => {
      refetchBalance();
      refetchPoolList();
      userStakeQuery.refetch();
      setInputApus(0);
    },
  });
  const unstakeMutation = useMutation({
    mutationFn: () => unstake((inputApus * 1e12).toFixed(0)),
    onSuccess: async () => {
      refetchBalance();
      refetchPoolList();
      userStakeQuery.refetch();
      setInputApus(0);
    },
  });
  const currentPool = pools.find((pool) => pool.pool_id === poolID);

  useEffect(() => {
    if (defaultPool) {
      setPoolID(defaultPool.pool_id);
    }
  }, [defaultPool, setPoolID]);

  const stakeQuota = (function () {
    if (!currentPool) return 0;
    if (!currentPool.staking_capacity || !currentPool.cur_staking) return 0;
    const quota = Number(BigInt(currentPool.staking_capacity) - BigInt(currentPool.cur_staking));
    if (quota < 0) return 0;
    return quota;
  })();
  const canStake =
    inputApus > 0 &&
    ((tab === "Stake" && inputApus * 1e12 <= stakeQuota) || tab === "Unstake") &&
    pool_start_time.isBefore(dayjs()) &&
    pool_end_time.isAfter(dayjs());
  const buttonTip = () => {
    if (!pool_start_time.isBefore(dayjs())) {
      return `Staking starts in ${dayjs().to(pool_start_time)}`;
    }
    if (!pool_end_time.isAfter(dayjs())) {
      return `Staking has ended in ${pool_end_time.from(dayjs())}`;
    }
    if (inputApus <= 0) {
      return "Please select apus to " + tab.toLowerCase();
    }
    if (tab === "Stake" && inputApus * 1e12 > stakeQuota) {
      return `You can only stake up to ${formatNumber(stakeQuota / 1e12, { fixed: 2 })} APUS`;
    }
    return "";
  };
  const StakeButton = (
    <Spin spinning={stakeMutation.isPending || unstakeMutation.isPending}>
      <div
        className={`btn-mainblue font-semibold px-4 h-12 ${canStake ? "" : "disabled"}`}
        onClick={() => {
          if (!activeAddress) {
            connect();
            return;
          }
          if (!canStake) return;
          if (tab === "Unstake") {
            unstakeMutation.mutate();
          } else {
            stakeMutation.mutate();
          }
        }}
      >
        {tab} {inputApus.toFixed(2)} APUS
      </div>
    </Spin>
  );
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
          <StakeSection
            loading={userStakeQuery.isFetching || poolListQuery.isFetching || userInterestQuery.isFetching}
            staked={staked}
            interest={userInterestQuery.data || "0"}
            {...currentPool}
          />
          <div className="box w-full flex flex-col items-center gap-[10px]">
            <div className="flex justify-center gap-4">
              <BalanceButton
                name="Stake"
                icon={stakeApusIcon}
                onClick={() => {
                  setTab("Stake");
                  setInputApus(0);
                }}
                active={tab === "Stake"}
              />
              <BalanceButton
                name="Unstake"
                icon={withdrawIcon}
                onClick={() => {
                  setTab("Unstake");
                  setInputApus(0);
                }}
                active={tab === "Unstake"}
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
                Staked APUS ={" "}
                <span className="font-bold">
                  <NumberBox
                    value={staked}
                    fixed={6}
                    loading={userStakeQuery.isFetching}
                    fontSize={16}
                    lineHeight={24}
                  />
                </span>
              </div>
              <div>
                Available APUS ={" "}
                <span className="font-bold">
                  <NumberBox
                    value={balance}
                    fixed={6}
                    loading={balanceQuery.isFetching}
                    fontSize={16}
                    lineHeight={24}
                  />
                </span>
              </div>
              <div className="text-sm"></div>
            </div>
            <BalanceSldier
              max={tab === "Stake" ? Math.min(Number(balance), stakeQuota) / 1e12 : Number(staked) / 1e12}
              disabled={userStakeQuery.isFetching || balanceQuery.isFetching}
              value={inputApus}
              onChange={setInputApus}
            />
            <div className="w-full flex justify-center items-center gap-4">
              {canStake ? (
                StakeButton
              ) : (
                <Tooltip color="#f85931" title={buttonTip()}>
                  {StakeButton}
                </Tooltip>
              )}
              <Tooltip
                title={
                  <div>
                    To earn interest, you must stake for at least 24 hours. Interest is distributed every 24 hours.
                    <br />
                    To receive interest in the first round, stake early — the first payout will be made 24 hours after
                    the Staking Start Date.
                    <br />
                    You can withdraw at any time, but doing so will reset your staking timer.
                  </div>
                }
                overlayInnerStyle={{ width: "320px" }}
              >
                <InfoCircleOutlined />
              </Tooltip>
            </div>
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
                  render: (text) => <span className="font-bold">{formatNumber(text, { precision: -2 })}%</span>,
                },
                {
                  title: "Staked",
                  dataIndex: "cur_staking",
                  key: "cur_staking",
                  render: (text) => <span className="font-bold">{formatNumber(text, { fixed: 6 })}</span>,
                },
                {
                  title: "Capacity",
                  dataIndex: "staking_capacity",
                  key: "staking_capacity",
                  render: (text) => <span className="font-bold">{formatNumber(text, { fixed: 0 })}</span>,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
