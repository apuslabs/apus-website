import { useContext, useState } from "react";
import BalanceSection from "../components/BalanceSection";
import { Breadcrumb, Spin, Tooltip } from "antd";
import { sleep, useWallet } from "../contexts/anpm";
import { BalanceContext } from "../contexts/balance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { buyCredit, getPoolMgrInfo } from "../contexts/request";
import { BalanceSldier } from "./BalanceSlider";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { NumberBox } from "../components/NumberBox";

export function Component() {
  const { activeAddress } = useWallet();
  const { balance, refetchBalance, refetchCredits } = useContext(BalanceContext);
  const [toBuyCredit, setToBuyCredit] = useState<number>(0);
  const poolMgrInfoQuery = useQuery({ queryKey: ["poolMgrInfo"], queryFn: getPoolMgrInfo });
  const buyCreditMutation = useMutation({
    mutationFn: () => buyCredit((toBuyCredit * 1e12).toFixed(0)),
    onSuccess: async () => {
      await sleep(500); // wait for the transaction to be processed
      refetchBalance();
      refetchCredits();
      setToBuyCredit(0);
    },
  });
  const creditExchangeRate = poolMgrInfoQuery.data?.credit_exchange_rate || "0";
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
          <div className="text-black text-lg font-bold mb-[10px]">Buy CREDIT</div>
          <div className="box w-[280px] text-center text-[#262626] text-base">
            <div className="mb-[15px]">
              1 CREDIT = <span className="font-bold">$0.0001</span> (Fxied)
            </div>
            <div className="text-sm text-center">
              Current Exchange Rate:
              <br />1 APUS =
              <span className="font-bold">
                <NumberBox
                  value={creditExchangeRate}
                  precision={0}
                  loading={poolMgrInfoQuery.isFetching}
                  skeleton={{ width: 20 }}
                />
                Credits
              </span>
              (Dynamic)
            </div>
          </div>
          <BalanceSldier
            label="Credit"
            max={Number(balance) / 1e12}
            value={toBuyCredit}
            onChange={(v) => {
              if (v !== null) {
                setToBuyCredit(v);
              }
            }}
          />
          <div className="mt-4 w-full flex justify-center items-center gap-4">
            <Spin spinning={buyCreditMutation.isPending}>
              <div
                className="btn-mainblue font-semibold px-4 h-12"
                onClick={() => {
                  if (activeAddress && toBuyCredit > 0) {
                    buyCreditMutation.mutate();
                  }
                }}
              >
                Buy {toBuyCredit.toFixed(2)} CREDIT
              </div>
            </Spin>
            <Tooltip
              title={
                <div>
                  If you just want to try out Verifiable AI, you can purchase a small amount of Credits.
                  <br />
                  If you’re a developer, you can apply for a grant by submitting a{" "}
                  <Link to="https://www.notion.so/1f80787b399c8012ac38df8ae091dc35?pvs=25" className="text-sky-300">
                    Google Form
                  </Link>
                  . <br />
                  For approved projects, we will distribute APUS tokens.
                </div>
              }
              overlayInnerStyle={{ width: "320px" }}
            >
              <InfoCircleOutlined />
            </Tooltip>
          </div>
        </div>
      </div>
    </main>
  );
}
