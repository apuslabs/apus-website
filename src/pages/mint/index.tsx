import { Divider, Form, Input, message, Modal, Select, Slider, Spin, Tabs } from "antd";
import "./index.css";
import { ImgMint } from "../../assets";
import { useEffect, useState } from "react";
import { useAOMint } from "./contexts";
import { ethers } from "ethers";

function TokenSlider({
  totalAmount,
  tab,
  amount,
  setAmount,
  tokenType,
  setTokenType,
}: {
  totalAmount: number;
  tab: "increase" | "decrease";
  amount: number;
  setAmount: (v: number) => void;
  tokenType?: "stETH" | "DAI";
  setTokenType: (v: "stETH" | "DAI") => void;
}) {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    if (amount === 0) {
      setPercent(0);
    }
  }, [amount, setPercent]);
  return (
    <>
      <div className="flex gap-5">
        <Select
          size="large"
          className="w-[8rem] font-medium text-sm"
          value={tokenType}
          onChange={(v) => {
            setTokenType(v as "stETH" | "DAI");
            setAmount(0);
            setPercent(0);
          }}
        >
          <Select.Option key="stETH">
            <div className="flex items-center gap-2">
              <img src={ImgMint.StethLogo} className="w-8 h-8" />
              <span>stETH</span>
            </div>
          </Select.Option>
          <Select.Option key="DAI">
            <div className="flex items-center gap-2">
              <img src={ImgMint.DaiLogo} className="w-8 h-8" />
              <span>DAI</span>
            </div>
          </Select.Option>
        </Select>
        <Input
          size="large"
          className="w-[23.25rem] text-right"
          value={amount}
          onChange={(v) => {
            setAmount(Number(parseFloat(v.target.value).toFixed(8)));
            setPercent(Math.round((parseFloat(v.target.value) / totalAmount) * 100));
          }}
        />
      </div>
      <Slider
        className="w-[31rem]"
        marks={{ 0: "0%", 100: "100%" }}
        min={0}
        max={100}
        step={1}
        value={percent}
        onChange={(v) => {
          setPercent(v);
          setAmount(Number(((v * totalAmount) / 100).toFixed(8)));
        }}
      />
      <div className="w-full text-right -mt-5">
        <span className="font-bold text-[#091dff]">
          {amount} {tab} ({percent}%)
        </span>{" "}
        Will Be Redelegated
        <br />
        To Mint {tab === "increase" ? "APUS" : "AO"}
      </div>
    </>
  );
}

function sleep() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}

export default function Mint() {
  const {
    apus,
    tokenType,
    setTokenType,
    increaseApusAllocation,
    decreaseApusAllocation,
    apusAllocationBalance,
    userAllocationBalance,
  } = useAOMint();
  const [tab, setTab] = useState<"increase" | "decrease">("increase");
  const [amount, setAmount] = useState<number>(0);

  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [arweaveAddress, setArweaveAddress] = useState("");

  const approve = async () => {
    setLoading(true);
    await sleep();
    if (tab === "increase") {
      await increaseApusAllocation(ethers.utils.parseUnits(amount.toString(), 18), arweaveAddress);
    } else {
      await decreaseApusAllocation(ethers.utils.parseUnits(amount.toString(), 18), arweaveAddress);
    }
    setAmount(0);
    message.success("Approve successfully");
    setLoading(false);
  };

  const switchTab = (key: "increase" | "decrease") => {
    setTab(key);
    setAmount(0);
  };

  const switchToken = (key: "stETH" | "DAI") => {
    setTokenType(key);
    setAmount(0);
  };

  return (
    <div id="mint" className="pt-20">
      <div className="card">
        <div className="flex-1 flex flex-col gap-5 p-7 items-center">
          <div className="card-caption h-10 w-full">DASHBOARD</div>
          <div className="text-gray90">Your APUS</div>
          <div className="font-medium text-gray21 text-[40px]">{apus}</div>
          <Divider orientation="center" className="m-0" />
          <div className="text-gray90">30 Day Projection</div>
          <div className="font-medium text-gray21 text-[40px]">
            <span className="text-[#03C407] font-normal">+</span> {0}
          </div>
        </div>
        <Divider type="vertical" className="h-64 my-auto" />
        <div className="flex-1 flex flex-col gap-5 p-7">
          <div className="card-caption">APUS Community Launch Tokenomics</div>
          <ol className="token-features-list">
            <li>
              <span>1 Billion</span> Tokens
            </li>
            <li>
              <span>25%</span> Released In The First Year
            </li>
            <li>
              <span>100%</span> Community Launch
            </li>
            <li>
              <span>AO yield</span> from <span>stETH in AO</span> for APUS
            </li>
          </ol>
          <div className="flex items-center gap-5">
            <img src={ImgMint.TokenomicsPie} className="w-[8.5rem] h-[8.5rem]" />
            <ol className="pie-legend-list">
              <li>
                <div className="pie-legend-square bg-black" /> Community: <span>92%</span>
              </li>
              <li>
                <div className="pie-legend-square bg-[#091DFF]" /> Ecosystem: <span>7% (TGE 100%)</span>
              </li>
              <li>
                <div className="pie-legend-square bg-[#3CDCE5]" /> Liquidity: <span>1%</span>
              </li>
            </ol>
          </div>
          <div className="w-full text-right underline underline-offset-2 text-gray21 font-medium">Learn More</div>
        </div>
      </div>
      <div className="card flex-col items-center p-12">
        <div className="card-caption">REDELEGATE</div>
        <div className="text-gray21">Redelegating assets will trigger the APUS Minting Mechanism</div>
        <Tabs
          className="w-full"
          type="card"
          defaultActiveKey="1"
          centered
          activeKey={tab}
          onChange={(key) => {
            switchTab(key as "increase" | "decrease");
          }}
          items={[
            {
              key: "increase",
              label: "Increase",
              children: (
                <div
                  className="w-[35rem] mx-auto p-5 flex flex-col gap-5 items-center
                  text-gray21"
                >
                  <div className="w-full text-right">
                    <span className="font-bold text-[#091dff]">
                      {ethers.utils.formatUnits(userAllocationBalance, 18)} {tokenType}
                    </span>{" "}
                    Available To Mint APUS
                  </div>
                  <TokenSlider
                    totalAmount={Number(ethers.utils.formatUnits(userAllocationBalance, 18))}
                    tab="increase"
                    amount={amount}
                    setAmount={setAmount}
                    tokenType={tokenType}
                    setTokenType={switchToken}
                  />
                  <Divider className="min-w-0 w-[21rem] my-5 border-grayd8" />
                  <div>Next 30 Days Receivable APUS Projection</div>
                  <div className="flex items-center gap-5">
                    <img src={ImgMint.ChevronRight} />
                    <div className="text-[40px] font-medium text-gray21 leading-none">
                      <span className="text-[#03c407]">+</span> {amount}
                    </div>
                    <img src={ImgMint.ChevronRight} className="rotate-180" />
                  </div>
                  <Spin spinning={loading}>
                    <div className="btn-primary" onClick={() => setModalOpen(true)}>
                      Approve
                    </div>
                  </Spin>
                </div>
              ),
            },
            {
              key: "decrease",
              label: "Decrease",
              children: (
                <div
                  className="w-[35rem] mx-auto p-5 flex flex-col gap-5 items-center
              text-gray21"
                >
                  <div className="w-full text-right">
                    <span className="font-bold text-[#091dff]">
                      {ethers.utils.formatUnits(apusAllocationBalance, 18)} {tokenType}
                    </span>{" "}
                    Available To Mint APUS
                  </div>
                  <TokenSlider
                    totalAmount={Number(ethers.utils.formatUnits(apusAllocationBalance, 18))}
                    tab="decrease"
                    amount={amount}
                    setAmount={setAmount}
                    tokenType={tokenType}
                    setTokenType={switchToken}
                  />
                  <Divider className="min-w-0 w-[21rem] my-5 border-grayd8" />
                  <Spin spinning={loading}>
                    <div className="btn-primary" onClick={approve}>
                      Approve
                    </div>
                  </Spin>
                </div>
              ),
            },
          ]}
        ></Tabs>
      </div>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        title={<div className="font-semibold text-2xl">Receive APUS</div>}
        okText="Confirm"
        onOk={() => {
          if (arweaveAddress === "") {
            message.warning("Please input the Arweave Address");
            return;
          }
          approve();
          setModalOpen(false);
        }}
        okButtonProps={{
          size: "large",
          style: {
            backgroundColor: "#091DFF",
          },
        }}
        cancelButtonProps={{
          style: { display: "none" },
        }}
      >
        <Form layout="vertical" className="my-10">
          <Form.Item label="Arweave Address">
            <Input size="large" value={arweaveAddress} onChange={(v) => setArweaveAddress(v.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
