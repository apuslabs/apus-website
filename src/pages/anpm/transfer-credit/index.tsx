import BalanceSection from "../components/BalanceSection";
import { Breadcrumb, InputNumber, Select } from "antd";
import { arrowLeftIcon, transferBigIcon } from "../assets";
import { useContext, useEffect, useState } from "react";
import { BalanceContext } from "../contexts/balance";
import { useAO } from "../../../utils/ao";
import { ANPM_DEFAULT_POOL, ANPM_POOL_MGR } from "../../../utils/config";
import { useWallet } from "../contexts/anpm";


interface CreditBalanceResponse {
  user: string;
  balance: string;
}

export function Component() {
  const { activeAddress } = useWallet();
  const { credits, refetchCredits } = useContext(BalanceContext);
  const { execute: getCreditBalance, data: creditBalanceRes } = useAO<CreditBalanceResponse>(
    ANPM_DEFAULT_POOL.ProcessID,
    "Credit-Balance",
    "dryrun",
  );
  const { execute: charge } = useAO<string>(
    ANPM_POOL_MGR,
    "Add-Credit",
    "message",
  );
  const { execute: withdraw } = useAO<string>(
    ANPM_DEFAULT_POOL.ProcessID,
    "Transfer-Credits",
    "message",
  );
  useEffect(() => {
    if (!activeAddress) return;
    getCreditBalance({ Recipient: activeAddress });
  }, [getCreditBalance, activeAddress]);

  const [toCharge, setToCharge] = useState<number>(0);
  const [toWithdraw, setToWithdraw] = useState<number>(0);

  const onCharge = async () => {
    if (toCharge > 0) {
      await charge({ Quantity: toCharge.toString() });
      setToCharge(0);
      refetchCredits();
    }
  }
  
  const onWithdraw = async () => {
    if (toWithdraw > 0) {
      await withdraw({ Quantity: toWithdraw.toString() });
      setToWithdraw(0);
      getCreditBalance({ Recipient: activeAddress! });
    }
  }
  
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
          <div className="mb-[50px] text-center text-wrap text-sm leading-snug">Transfer CREDIT between Balance and Pools. CREDIT can be<br/> withdrawn from Pool at any time.</div>
          <div className="flex gap-[10px] items-center">
            <div className="flex-1 box flex flex-col items-center">
                <div className="text-base leading-tight mb-[6px] mt-[6px]">CREDIT Balance</div>
                <div className="mb-[10px] text-[30px]">{credits}</div>
                <div className="mb-[5px] text-sm">Amount to transfer:</div>
                <InputNumber className="mb-[10px] w-full" min={0} max={Number(credits)} step={1} value={toCharge} defaultValue={0} onChange={v => v && setToCharge(v)} />
                <div className="btn-mainblue w-[100px] h-12" onClick={onCharge}>
                    <img className="w-[35px] h-[35px] rotate-180" src={arrowLeftIcon} />
                </div>
            </div>
            <img src={transferBigIcon} className="w-[50px] h-[50px] text-[#262626]" />
            <div className="flex-1 box flex flex-col items-center">
                <Select placeholder="Select a pool" className="w-full mb-[5px]" defaultValue={"1"}>
                    <Select.Option value="1">AI Inference</Select.Option>
                </Select>
                <div className="mb-[10px] text-[30px]">{creditBalanceRes?.balance}</div>
                <div className="mb-[5px] text-sm">Amount to transfer:</div>
                <InputNumber className="mb-[10px] w-full" min={0} max={Number(creditBalanceRes?.balance) || 0} step={1} value={toWithdraw} defaultValue={0} onChange={v => v && setToWithdraw(v)} />
                <div className="btn-mainblue w-[100px] h-12" onClick={onWithdraw}>
                    <img className="w-[35px] h-[35px]" src={arrowLeftIcon} />
                </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
