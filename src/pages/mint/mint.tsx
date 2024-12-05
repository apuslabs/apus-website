import { Divider, Input, message, Modal, Select, Slider, Spin, Tabs, Tooltip } from "antd";
import "./index.css";
import { ImgMint } from "../../assets";
import { useEffect, useState } from "react";
import { useAOMint } from "./contexts";
import { BigNumber, ethers } from "ethers";
import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import HomeFooter from "../../components/HomeFooter";
import HomeHeader from "../../components/HomeHeader";
import MintUserbox from "../../components/MintUserbox";
import Decimal from "decimal.js";

function TokenSlider({
  totalAmount,
  tab,
  amount,
  setAmount,
  tokenType,
  setTokenType,
}: {
  totalAmount: BigNumber;
  tab: "increase" | "decrease";
  amount: string;
  setAmount: (v: string) => void;
  tokenType?: "stETH" | "DAI";
  setTokenType: (v: "stETH" | "DAI") => void;
}) {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    if (amount === "0") {
      setPercent(0);
    }
  }, [amount, setPercent]);
  return (
    <>
      <div className="flex gap-5">
        <Select
          size="large"
          className="w-[9rem] font-medium text-sm"
          value={tokenType}
          placeholder={"Select Token"}
          onChange={(v) => {
            setTokenType(v as "stETH" | "DAI");
            setAmount("0");
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
          disabled={tokenType === undefined || totalAmount.isZero()}
          value={amount}
          onChange={(v) => {
            if (v !== null) {
              const numericValue = v.target.value.replace(/[^0-9.]/g, "");
              const bigAmount = ethers.utils.parseUnits(numericValue, 18);
              if (bigAmount.gt(totalAmount)) {
                setAmount(ethers.utils.formatUnits(totalAmount, 18));
                setPercent(100);
                return;
              }
              setAmount(numericValue);
              setPercent(Math.round(bigAmount.mul(100).div(totalAmount).toNumber()));
            }
          }}
        />
      </div>
      {tab === "increase" && (
        <div className="w-full text-right">
          <Link to="https://ao.arweave.dev/#/mint" className="mr-2 text-blue underline">
            Bridge To AO
          </Link>
          <Tooltip
            title="Since APUS is built on the AO network, you must first bridge assets to AO before allocating to APUS. The stETH available for allocation includes all your bridged assets, including and any allocations to other projects."
            arrow={false}
            overlayInnerStyle={{
              backgroundColor: "white",
              color: "#0b0b0b",
              padding: "1rem",
              width: "30rem",
            }}
          >
            <InfoCircleOutlined className="pl-1" />
          </Tooltip>
        </div>
      )}
      <Slider
        className="w-[31rem]"
        disabled={tokenType === undefined || totalAmount.isZero()}
        marks={{ 0: "0%", 100: "100%" }}
        min={0}
        max={100}
        step={1}
        value={percent}
        onChange={(v) => {
          setPercent(v);
          setAmount(ethers.utils.formatUnits(totalAmount.mul(v).div(100), 18));
        }}
      />
      <div className="w-full text-right -mt-5">
        <span className="font-bold text-[#091dff]">
          {Number(amount).toFixed(4)} {tab} ({percent}%)
        </span>{" "}
        Will Be Allocated
        {tab == "increase" ? <br /> : " "}
        To Mint {tab === "increase" ? "APUS" : "AO"}
      </div>
    </>
  );
}

function LoadingNumber({ hide, loading, children }: { hide?: boolean; loading: boolean; children?: React.ReactNode }) {
  return (
    <Spin indicator={<LoadingOutlined spin />} size="small" spinning={loading}>
      {hide || loading ? `--` : children}
    </Spin>
  );
}

export default function Mint() {
  const {
    apus,
    balanceLoading,
    recipient,
    updateRecipient,
    tokenType,
    setTokenType,
    increaseApusAllocation,
    decreaseApusAllocation,
    apusAllocationBalance,
    userAllocationBalance,
    allocationsLoading,
    userEstimatedApus,
    estimatedApus,
    loadingEstimate,
    loadingUserEstimate,
  } = useAOMint();
  const [tab, setTab] = useState<"increase" | "decrease">("increase");
  const [amount, setAmount] = useState<string>("0");

  const [modalOpen, setModalOpen] = useState(false);
  const [arweaveAddress, setArweaveAddress] = useState("");

  const [loading, setLoading] = useState(false);

  const approve = async () => {
    if (!recipient) {
      message.warning("Please set recipient first");
      setModalOpen(true);
      return;
    }
    try {
      setLoading(true);
      if (tab === "increase") {
        await increaseApusAllocation(ethers.utils.parseUnits(amount, 18));
      } else {
        await decreaseApusAllocation(ethers.utils.parseUnits(amount, 18));
      }
      setAmount("0");
      message.success("Approve successfully");
    } catch (e: unknown) {
      if (e instanceof Error) {
        message.error(e.message);
      } else {
        message.error("Failed to approve");
      }
    } finally {
      setLoading(false);
    }
  };

  const [loadingRecipient, setLoadingRecipient] = useState(false);
  const onSubmitRecipient = async () => {
    if (arweaveAddress.length === 43) {
      if (loadingRecipient) {
        return;
      }
      try {
        setLoadingRecipient(true);
        await updateRecipient(arweaveAddress);
        message.success("Update recipient successfully");
        setModalOpen(false);
      } catch (e: unknown) {
        if (e instanceof Error) {
          message.error(e.message);
        } else {
          message.error("Failed to update recipient");
        }
      } finally {
        setLoadingRecipient(false);
      }
    } else {
      message.error("Invalid Arweave Address");
    }
  };

  const switchTab = (key: "increase" | "decrease") => {
    setTab(key);
    setAmount("0");
  };

  const switchToken = (key: "stETH" | "DAI") => {
    setTokenType(key);
    setAmount("0");
  };

  return (
    <>
      <HomeHeader
        Userbox={
          <MintUserbox
            onRecipient={() => {
              setModalOpen(true);
            }}
          />
        }
      />
      <div id="mint" className="pt-20">
        <div className="card">
          <div className="flex-1 flex flex-col gap-5 p-7 items-center">
            <div className="card-caption h-10 w-full">DASHBOARD</div>
            <div className="text-gray90">
              Your APUS
              <InfoCircleOutlined className="pl-1" />
            </div>
            <div className="font-medium text-gray21 text-[40px]">
              <Spin indicator={<LoadingOutlined spin />} size="small" spinning={balanceLoading}>
                {ethers.utils.formatUnits(apus, 12)}
              </Spin>
            </div>
            <Divider orientation="center" className="m-0" />
            <div className="text-gray90">30 Day Projection</div>
            <div className="flex font-medium text-gray21 text-[40px]">
              <span className="text-[#03C407] font-normal">+</span>{" "}
              <LoadingNumber loading={loadingUserEstimate}>
                {new Decimal(userEstimatedApus).div(1e12).toFixed(4)}
              </LoadingNumber>
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
            <div className="w-full text-right underline underline-offset-2 text-gray21 font-medium cursor-pointer">
              Learn More
            </div>
          </div>
        </div>
        <div className="card flex-col items-center p-12">
          <div className="card-caption">ALLOCATE</div>
          <div className="text-gray21">Allocating Assets will trigger the APUS minting mechanism.</div>
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
                label: "Allocate",
                children: (
                  <div
                    className="w-[35rem] mx-auto p-5 flex flex-col gap-5 items-center
                  text-gray21"
                  >
                    <div className="w-full flex justify-between">
                      <div className="flex">
                        <span className="font-bold text-[#091dff] mr-1">
                          <LoadingNumber hide={tokenType === undefined} loading={allocationsLoading}>
                            {Number(ethers.utils.formatUnits(apusAllocationBalance, 18)).toFixed(4) + ` ${tokenType}`}
                          </LoadingNumber>
                        </span>
                        Allocated
                      </div>
                      <div className="text-right flex">
                        <span className="font-bold text-[#091dff] mr-1">
                          <LoadingNumber hide={tokenType === undefined} loading={allocationsLoading}>
                            {Number(ethers.utils.formatUnits(userAllocationBalance, 18)).toFixed(4) + ` ${tokenType}`}
                          </LoadingNumber>
                        </span>{" "}
                        Available To Mint APUS
                      </div>
                    </div>
                    <TokenSlider
                      totalAmount={userAllocationBalance}
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
                      <LoadingNumber loading={loadingUserEstimate}>
                        <div className="text-[40px] font-medium text-gray21 leading-none">
                          <span className="text-[#03c407]">+</span>{" "}
                          {new Decimal(amount).mul(estimatedApus).div(1e12).toFixed(4)}
                        </div>
                      </LoadingNumber>
                      <img src={ImgMint.ChevronRight} className="rotate-180" />
                    </div>
                    {tokenType && (
                      <div className="flex">
                        <span className="font-bold mr-1">1</span>
                        {tokenType + "="}
                        <LoadingNumber hide={tokenType === undefined} loading={loadingEstimate}>
                          <span className="font-bold mx-1">{new Decimal(estimatedApus).div(1e12).toFixed(4)}</span>
                        </LoadingNumber>
                        APUS
                      </div>
                    )}
                    <Spin spinning={loading}>
                      <div className="btn-primary" onClick={approve}>
                        Approve
                      </div>
                    </Spin>
                  </div>
                ),
              },
              {
                key: "decrease",
                label: "Remove",
                children: (
                  <div
                    className="w-[35rem] mx-auto p-5 flex flex-col gap-5 items-center
              text-gray21"
                  >
                    <div className="w-full text-right flex">
                      <span className="font-bold text-[#091dff]">
                        <LoadingNumber hide={tokenType === undefined} loading={allocationsLoading}>
                          {apusAllocationBalance.div(1e14).toNumber() / 1e4} {tokenType}
                        </LoadingNumber>
                      </span>{" "}
                      Allocated
                    </div>
                    <TokenSlider
                      totalAmount={apusAllocationBalance}
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
          title={null}
          footer={null}
        >
          <div className="mb-10 text-gray21 font-semibold text-3xl">RECEIVE APUS</div>
          <div className="text-gray21 mb-2">Selected Arweave Address:</div>
          <div className="text-[#091dff] font-semibold mb-5">{recipient || ""}</div>
          <Input
            size="large"
            placeholder="Input Arweave Address"
            value={arweaveAddress}
            onChange={(v) => setArweaveAddress(v.target.value)}
          />
          <div className="mt-5 text-xs">
            <div className="font-bold">TIPS:</div>
            <ul className="list-disc pl-5">
              <li>Note: Minted APUS will be sent to the Arweave address provided above.</li>
              <li>If you submit a new Arweave address, all future APUS yield will be Minted to the updated address.</li>
            </ul>
          </div>
          <Divider className="mx-auto min-w-0 w-[21rem] my-5 border-grayd8" />
          <Spin spinning={loading}>
            <div className="w-32 btn-primary mx-auto" onClick={onSubmitRecipient}>
              Submit
            </div>
          </Spin>
        </Modal>
      </div>
      <HomeFooter />
    </>
  );
}
