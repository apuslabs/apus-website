import { useCallback, useContext, useEffect, useState } from "react";
import BalanceSection from "../components/BalanceSection";
import { Breadcrumb, Slider, Spin } from "antd";
import { sleep, useWallet } from "../contexts/anpm";
import { useAO } from "../../../utils/ao";
import { ANPM_POOL_MGR, APUS_ADDRESS } from "../../../utils/config";
import { BalanceContext } from "../contexts/balance";
import { formatApus } from "../../../utils/utils";

interface InfoResponse {
  process_id: string;
  owner: string;
  apus_token: string;
  credit_exchange_rate: string;
}

export function Component() {
  const { activeAddress } = useWallet();
  const { balance, refetchBalance, refetchCredits } = useContext(BalanceContext);
  const { execute: getPoolMgrInfo, data: infoRes } = useAO<InfoResponse>(ANPM_POOL_MGR, "Info", "dryrun")
  useEffect(() => {
    if (!activeAddress) return;
    getPoolMgrInfo();
  }, [getPoolMgrInfo, activeAddress]);
  const { execute: transferApus, loading: transfering } = useAO(APUS_ADDRESS.Mint, "Transfer", "message");
  const buyCredit = useCallback(async (quantity: string) => {
    if (!activeAddress) return;
    await transferApus({
      Recipient: ANPM_POOL_MGR,
      Quantity: quantity,
      ["X-AN-Reason"]: "Buy-Credit",
    });
  }, [activeAddress, transferApus]);
  const [percent, setPercent] = useState<number>(0);
  const onPercentChange = (value: number) => {
    setPercent(value);
  };
  const creditExchangeRate = infoRes?.credit_exchange_rate || '0';
  const toBuyCredit = formatApus((BigInt(balance) * BigInt(percent) * BigInt(creditExchangeRate) / BigInt(1e2)).toString());
  const onBuyCredit = async () => {
    if (percent > 0) {
      await buyCredit((BigInt(balance) * BigInt(percent) / BigInt(100)).toString());
      await sleep(1000);
      setPercent(0);
      refetchBalance();
      refetchCredits();
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
              title: "Buy CREDIT",
            },
          ]}
        />
      </div>
      <div className="max-w-[1200px] mx-auto p-5 flex gap-10">
        <div className="w-[250px]">
          <BalanceSection />
        </div>
        <div className="box w-[640px] flex flex-col items-center gap-[10px]">
          <div className="box w-[280px] text-center text-[#262626] text-base">
            <div className="mb-[15px]">
              1 CREDIT = <span className="font-bold">$0.01</span> (Fxied)
            </div>
            <div className="text-sm text-center">
              Current Exchange Rate:
              <br />1 APUS = <span className="font-bold">{creditExchangeRate} Credits</span> (Dynamic)
            </div>
          </div>
          <Slider
            className="w-full"
            marks={{ 0: <span className="font-bold">0%</span>, 100: <div className="font-bold">MAX</div> }}
            min={0}
            max={100}
            step={1}
            value={percent}
            onChange={(v) => onPercentChange(v)}
          />
          <Spin spinning={transfering}><div className="btn-mainblue font-semibold px-4 h-12" onClick={onBuyCredit}>Buy {toBuyCredit.toString()} CREDIT</div></Spin>
        </div>
      </div>
    </main>
  );
}
