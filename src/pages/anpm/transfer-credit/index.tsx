import BalanceSection from "../components/BalanceSection";
import { Breadcrumb, Input, Select, Spin } from "antd";
import { arrowLeftIcon, transferBigIcon } from "../assets";
import { useContext, useEffect, useState } from "react";
import { BalanceContext } from "../contexts/balance";
import { useAO } from "../../../utils/ao";
import { ANPM_DEFAULT_POOL, ANPM_POOL_MGR } from "../../../utils/config";
import { useWallet } from "../contexts/anpm";
import { formatApus, formatCredits } from "../../../utils/utils";

interface CreditBalanceResponse {
  user: string;
  balance: string;
}

export function Component() {
  const { activeAddress } = useWallet();
  const { credits, refetchCredits, pools } = useContext(BalanceContext);
  const [poolID, setPoolID] = useState<string>("");
  const { execute: getCreditBalance, data: creditBalanceRes } = useAO<CreditBalanceResponse>(
    ANPM_DEFAULT_POOL,
    "Credit-Balance",
    "dryrun",
  );
  const { execute: charge, loading: charging } = useAO<string>(ANPM_POOL_MGR, "Add-Credit", "message");
  const { execute: withdraw, loading: withdrawing } = useAO<string>(ANPM_DEFAULT_POOL, "Transfer-Credits", "message");
  useEffect(() => {
    if (!activeAddress) return;
    getCreditBalance({ Recipient: activeAddress });
  }, [getCreditBalance, activeAddress]);

  useEffect(() => {
    if (pools.length > 0) {
      setPoolID(pools[0].pool_id);
    }
  }, [pools]);

  const [toCharge, setToCharge] = useState<string>("");
  const [toWithdraw, setToWithdraw] = useState<string>("");

  const creditBalance = creditBalanceRes?.balance || "0";

  const refetchAll = () => {
    setToCharge("");
    setToWithdraw("");
    refetchCredits();
    getCreditBalance({ Recipient: activeAddress! });
  };

  const onCharge = async () => {
    if (toCharge != "" && toCharge != "0") {
      await charge({ Quantity: (Number(toCharge) * 1e12).toString(), PoolId: poolID });
      refetchAll();
    }
  };

  const onWithdraw = async () => {
    if (toWithdraw != "" && toWithdraw != "0") {
      await withdraw({ Quantity: (Number(toWithdraw) * 1e12).toString() });
      refetchAll();
    }
  };

  const handleInputNumber = (value: string, max: string, setNumber: (v: string) => void) => {
    if (value === "") {
      setNumber("");
    } else if (/^\d*\.?\d*$/.test(value)) {
      if (BigInt(Number(value) * 1e12) > BigInt(max)) {
        setNumber(formatApus(max));
      } else {
        setNumber(value);
      }
    } else {
      setNumber(value.slice(0, -1));
    }
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
        </div>
        <div className="box w-[640px] h-full">
          <div className="mb-[50px] text-center text-wrap text-sm leading-snug">
            Transfer CREDIT between Balance and Pools. CREDIT can be
            <br /> withdrawn from Pool at any time.
          </div>
          <div className="flex gap-[10px] items-center">
            <div className="flex-1 box flex flex-col items-center">
              <div className="text-base leading-tight mb-[21px] mt-[6px]">CREDIT Balance</div>
              <div className="mb-[10px] text-[30px]">{formatApus(credits)}</div>
              <div className="mb-[5px] text-sm">Amount to transfer:</div>
              <Input
                className="mb-[10px] w-full"
                min={0}
                max={Number(credits) / 1e12}
                value={toCharge}
                defaultValue={0}
                onChange={(v) => {
                  handleInputNumber(v.target.value, credits, setToCharge);
                }}
              />
              <Spin spinning={charging}>
                <div className="btn-mainblue w-[100px] h-12" onClick={onCharge}>
                  <img className="w-[35px] h-[35px] rotate-180" src={arrowLeftIcon} />
                </div>
              </Spin>
            </div>
            <img src={transferBigIcon} className="w-[50px] h-[50px] text-[#262626]" />
            <div className="flex-1 box flex flex-col items-center">
              <Select
                placeholder="Select a pool"
                className="w-full mb-[15px] h-[32px]"
                value={poolID}
                onChange={(value) => setPoolID(value)}
              >
                {pools.map((pool) => (
                  <Select.Option key={pool.pool_id} value={pool.pool_id}>
                    {pool.name}
                  </Select.Option>
                ))}
              </Select>
              <div className="mb-[10px] text-[30px]">{formatCredits(creditBalance)}</div>
              <div className="mb-[5px] text-sm">Amount to transfer:</div>
              <Input
                className="mb-[10px] w-full"
                value={toWithdraw}
                onChange={(v) => handleInputNumber(v.target.value, creditBalance, setToWithdraw)}
              />
              <Spin spinning={withdrawing}>
                <div className="btn-mainblue w-[100px] h-12" onClick={onWithdraw}>
                  <img className="w-[35px] h-[35px]" src={arrowLeftIcon} />
                </div>
              </Spin>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
