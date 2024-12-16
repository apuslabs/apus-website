import { Divider, Input, notification, Modal, Select, Slider, Spin, Tabs, Tooltip } from "antd";
import "./index.css";
import { ImgMint } from "../../assets";
import { useEffect, useState } from "react";
import { useAOMint, useParams, useRecipientModal, useSignatureModal } from "./contexts";
import { BigNumber, ethers } from "ethers";
import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import HomeFooter from "../../components/HomeFooter";
import HomeHeader from "../../components/HomeHeader";
import MintUserbox from "../../components/MintUserbox";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(duration);
dayjs.extend(relativeTime);
import { useConnectWallet } from "@web3-onboard/react";
import { formatBigNumber, splitBigNumber } from "./utils";
import { PRE_TGE_TIME, TGE_TIME } from "../../utils/config";
import { useCountDate } from "../../utils/react-use";

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
      <div className="w-full flex gap-5">
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
          className="text-right"
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
        className="w-full max-w-[31rem]"
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
      <div className="w-full max-w-[31rem] text-right -mt-5 -mr-8">
        <span className="font-bold text-[#091dff]">
          {amount} {tab} ({percent}%)
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
  const { MintProcess, MirrorProcess } = useParams();
  const duration = useCountDate(PRE_TGE_TIME);
  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts?.[0]?.address;
  const {
    tokenType,
    setTokenType,
    apus,
    apusStETH,
    apusDAI,
    apusToken,
    otherToken,
    apusStETHEstimatedApus,
    apusDAIEstimatedApus,
    tokenEstimatedApus,
    userEstimatedApus,
    loadingApus,
    loadingTokenAllocation,
    loadingTokenEstimatedApus,
    loadingUserEstimatedApus,
    loadingUpdateAllocation,
    increaseApusAllocation,
    decreaseApusAllocation,
  } = useAOMint({
    wallet: walletAddress,
    MintProcess,
    MirrorProcess,
  });
  const { integer: apusInteger, decimal: apusDecimal } = splitBigNumber(apus, 12);
  const {
    modalOpen,
    closeModal,
    setModalOpen,
    arweaveAddress,
    setArweaveAddress,
    recipient,
    loadingRecipient,
    loadingUpdateRecipient,
    submitRecipient,
  } = useRecipientModal({
    wallet: walletAddress,
    MintProcess,
  });
  const {
    modalOpen: tipModalOpen,
    closeModal: closeTipModal,
    title: tipModalTitle,
    showSigTip,
    closeAndNotAskAgain,
  } = useSignatureModal();
  const [tab, setTab] = useState<"increase" | "decrease">("increase");
  const [amount, setAmount] = useState<string>("0");
  const estimatedApus = ethers.utils.parseUnits(amount, 18).mul(tokenEstimatedApus).div(BigNumber.from(10).pow(18));

  const canApprove = amount !== "0" && dayjs().isAfter(PRE_TGE_TIME);

  const approve = async () => {
    if (!canApprove) {
      return;
    }
    if (!recipient) {
      notification.warning({ message: "Please set recipient first" });
      setModalOpen(true);
      return;
    }
    try {
      if (tab === "increase") {
        await showSigTip("Allocating assets");
        await increaseApusAllocation(ethers.utils.parseUnits(amount, 18));
      } else {
        await showSigTip("Removing assets");
        await decreaseApusAllocation(ethers.utils.parseUnits(amount, 18), recipient);
      }
      setAmount("0");
      notification.success({ message: "Approve successfully" });
    } catch (e: unknown) {
      if (e instanceof Error) {
        notification.error({ message: e.message, duration: 0 });
      } else {
        notification.error({ message: "Failed to approve", duration: 0 });
      }
    }
  };

  const switchTab = (key: string) => {
    setTab(key as "increase" | "decrease");
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
          <div className="flex-grow-1 flex-shrink-0 w-1/2 flex flex-col gap-3 p-7 items-center">
            <div className="card-caption w-full">DASHBOARD</div>
            <div className="text-gray90">
              Your APUS
              <InfoCircleOutlined className="pl-1" />
            </div>
            <div className="font-medium text-gray21 text-[30px] leading-none">
              <Spin indicator={<LoadingOutlined spin />} size="small" spinning={loadingApus}>
                <span className="text-[30px]">{apusInteger}</span>
                <span>.</span>
                <span className="text-[20px]">{apusDecimal}</span>
              </Spin>
            </div>
            <Divider orientation="center" className="m-0" />
            <div className="text-gray90">30 Day Projection</div>
            <div className="flex items-center font-medium text-gray21 text-[30px] leading-none">
              <span className="text-[#03C407] font-normal mr-2 text-[40px]">+</span>
              <LoadingNumber loading={loadingUserEstimatedApus}>
                {formatBigNumber(userEstimatedApus, 12, 4)}
              </LoadingNumber>
            </div>
            <table className="table-assets">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Allocation</th>
                  <th>30 Day Projection</th>
                </tr>
              </thead>
              <tbody>
                {!loadingUserEstimatedApus &&
                  [
                    {
                      asset: "stETH",
                      allocation: apusStETH,
                      projection: apusStETHEstimatedApus,
                    },
                    {
                      asset: "DAI",
                      allocation: apusDAI,
                      projection: apusDAIEstimatedApus,
                    },
                  ].map((item) => (
                    <tr key={item.asset}>
                      <td>{item.asset}</td>
                      <td>
                        <LoadingNumber loading={false}>{formatBigNumber(item.allocation, 18, 4)}</LoadingNumber>
                      </td>
                      <td>
                        <LoadingNumber loading={false}>{formatBigNumber(item.projection, 12, 4)}</LoadingNumber>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <Divider type="vertical" className="h-64 my-auto" />
          <div className="flex-grow-1 flex-shrink-0 w-1/2 flex flex-col gap-5 p-7">
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
            className="w-full mt-8"
            type="card"
            defaultActiveKey="1"
            centered
            activeKey={tab}
            onChange={switchTab}
            items={[
              {
                key: "increase",
                label: "Allocate",
                children: (
                  <div
                    className="w-full mx-auto p-5 flex flex-col gap-5 items-center
                  text-gray21"
                  >
                    <div className="w-full flex justify-between">
                      <div className="flex">
                        <span className="font-bold text-[#091dff] mr-1">
                          <LoadingNumber hide={tokenType === undefined} loading={loadingTokenAllocation}>
                            {`${formatBigNumber(apusToken, 18, 4)} ${tokenType}`}
                          </LoadingNumber>
                        </span>
                        Allocated
                      </div>
                      <div className="text-right flex">
                        <span className="font-bold text-[#091dff] mr-1">
                          <LoadingNumber hide={tokenType === undefined} loading={loadingTokenAllocation}>
                            {`${formatBigNumber(otherToken, 18, 4)} ${tokenType}`}
                          </LoadingNumber>
                        </span>{" "}
                        Available To Mint APUS
                      </div>
                    </div>
                    <TokenSlider
                      totalAmount={otherToken}
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
                      <LoadingNumber loading={loadingTokenEstimatedApus}>
                        <div className="text-[40px] font-medium text-gray21 leading-none">
                          <span className="text-[#03c407]">+</span> {formatBigNumber(estimatedApus, 12, 4)}
                        </div>
                      </LoadingNumber>
                      <img src={ImgMint.ChevronRight} className="rotate-180" />
                    </div>
                    {tokenType && (
                      <div className="flex">
                        <span className="font-bold mr-1">1</span>
                        {tokenType + "="}
                        <LoadingNumber hide={tokenType === undefined} loading={loadingTokenEstimatedApus}>
                          <span className="font-bold mx-1">{formatBigNumber(tokenEstimatedApus, 12, 4)}</span>
                        </LoadingNumber>
                        APUS
                      </div>
                    )}
                    <Spin spinning={!recipient ? loadingRecipient : loadingUpdateAllocation}>
                      <div
                        className={`btn-primary ${!recipient ? "warning" : ""} ${canApprove ? "" : "disabled"}`}
                        onClick={approve}
                      >
                        {!recipient ? "Set Recipient" : "Add Allocation"}
                      </div>
                      <div className="mt-2 text-xs">
                        {dayjs().isBefore(dayjs(PRE_TGE_TIME)) ? (
                          <div>
                            Allocation opened in <span className="text-[#091dff]">{`${duration}`}</span>
                          </div>
                        ) : null}
                        {dayjs().isAfter(PRE_TGE_TIME) && dayjs().isBefore(TGE_TIME) ? (
                          <div>
                            Allocation opened in <span className="text-[#091dff]">{`${duration}`}</span>
                          </div>
                        ) : null}
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
                    className="w-full mx-auto p-5 flex flex-col gap-5 items-center
              text-gray21"
                  >
                    <div className="w-full text-right flex">
                      <span className="font-bold text-[#091dff]">
                        <LoadingNumber hide={tokenType === undefined} loading={loadingTokenAllocation}>
                          {`${formatBigNumber(apusToken, 18, 4)} ${tokenType}`}
                        </LoadingNumber>
                      </span>{" "}
                      Allocated
                    </div>
                    <TokenSlider
                      totalAmount={apusToken}
                      tab="decrease"
                      amount={amount}
                      setAmount={setAmount}
                      tokenType={tokenType}
                      setTokenType={switchToken}
                    />
                    <Divider className="min-w-0 w-[21rem] my-5 border-grayd8" />
                    <Spin spinning={!recipient ? loadingRecipient : loadingUpdateAllocation}>
                      <div
                        className={`btn-primary ${!recipient ? "warning" : ""} ${canApprove ? "" : "disabled"}`}
                        onClick={approve}
                      >
                        {!recipient ? "Set Recipient" : "Remove Allocation"}
                      </div>
                    </Spin>
                  </div>
                ),
              },
            ]}
          ></Tabs>
        </div>
        <Modal open={modalOpen} onClose={closeModal} onCancel={closeModal} title={null} footer={null}>
          <div className="mb-10 text-gray21 font-semibold text-3xl text-center">RECEIVE APUS</div>
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
          <Spin spinning={loadingUpdateRecipient || loadingRecipient}>
            <div
              className="w-32 btn-primary mx-auto"
              onClick={async () => {
                try {
                  await showSigTip("Setting recipient");
                  await submitRecipient();
                  notification.success({ message: "Recipient updated successfully" });
                } catch (e: unknown) {
                  if (e instanceof Error) {
                    notification.error({ message: e.message, duration: 0 });
                  } else {
                    notification.error({ message: "Failed to update recipient", duration: 0 });
                  }
                }
              }}
            >
              Submit
            </div>
          </Spin>
        </Modal>
        <Modal open={tipModalOpen} onClose={closeTipModal} onCancel={closeTipModal} title={null} footer={null}>
          <div className="mb-10 text-gray21 font-semibold text-xl text-center">You are {tipModalTitle}</div>
          <div className="mt-5 text-xs">
            * Please note that Metamask may not display the message correctly - we are are aware of this issue and will
            correct it soon. There is no risk!
          </div>
          <Divider className="mx-auto min-w-0 w-[21rem] my-5 border-grayd8" />
          <div className="flex justify-center gap-5">
            <div className="btn-primary" onClick={closeTipModal}>
              Continue
            </div>
            <div className="btn-primary btn-outline" onClick={closeAndNotAskAgain}>
              I'm Good! No More Tips!
            </div>
          </div>
        </Modal>
      </div>
      <HomeFooter />
    </>
  );
}
