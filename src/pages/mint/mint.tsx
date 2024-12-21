import { Divider, Input, Modal, Select, Slider, Spin, Tabs, Tooltip } from "antd";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "./mint.css";
import { ImgMint } from "../../assets";
import { useEffect, useRef, useState } from "react";
import { useAOMint, useRecipientModal, useSignatureModal } from "./contexts";
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
import { APUS_ADDRESS, PRE_TGE_TIME } from "../../utils/config";
import FlipNumbers from "react-flip-numbers";
import Recipient from "./recipient";

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
  const amountStr = amount.toString();
  useEffect(() => {
    if (amountStr === "" || amountStr === "0") {
      setPercent(0);
    }
  }, [amountStr, setPercent]);
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
            setAmount("");
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
              if (numericValue === "") {
                setAmount("");
                setPercent(0);
                return;
              }
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
      {tab === "increase" ? (
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
      ) : null}
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
          {amount || "0"} {tokenType} ({percent}%)
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

export const GrayDivider = ({ className }: { className?: string }) => (
  <Divider className={`min-w-0 w-[21rem] my-5 ${className} border-grayd8`} />
);

function SigTips() {
  return (
    <>
      <GrayDivider className="my-0" />
      <div className="text-xs">
        <div className="font-bold">TIPS:</div>
        <ul className="list-disc pl-5">
          <li>Signatures are made on the AO network and do not affect Ethereum assets.</li>
          <li>MetaMask may show some garbled text, but it will be fixed soon.</li>
        </ul>
      </div>
    </>
  );
}

export function SigModal({
  open,
  close,
  closeAndNotAskAgain,
  title,
}: {
  open: boolean;
  close: () => void;
  closeAndNotAskAgain: () => void;
  title: string;
}) {
  return (
    <Modal open={open} maskClosable={false} onCancel={close} closeIcon={null} title={null} footer={null}>
      <div className="mb-10 text-gray21 font-semibold text-xl text-center">{title}</div>
      <div className="mt-5 text-xs">
        * Please note that messages may appear garbled on MetaMask. The messages are signed on AO and will not effect
        Ethereum assets - do not worry!
      </div>
      <GrayDivider />
      <div className="flex justify-center gap-5">
        <div className="btn-primary" onClick={close}>
          Continue
        </div>
        <div className="btn-primary btn-outline" onClick={closeAndNotAskAgain}>
          I'm Good! No More Tips!
        </div>
      </div>
    </Modal>
  );
}

function useRemoveRecipientModal({ recipient }: { recipient?: string }) {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState(recipient);
  const closeModal = () => {
    setOpen(false);
  };
  const addressRef = useRef<string>();
  useEffect(() => {
    addressRef.current = address;
  }, [address]);
  const openRef = useRef(false);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  const getRemoveRecipient = (): Promise<string> => {
    setOpen(true);
    setAddress(recipient);
    return new Promise((resolve) => {
      const waitInterval = setInterval(() => {
        if (openRef.current === false) {
          clearInterval(waitInterval);
          resolve(addressRef.current!);
        }
      }, 1000);
    });
  };
  const onSubmit = () => {
    if (address?.length !== 43) {
      toast.error("Invalid Arweave Address", { autoClose: false });
      return;
    }
    closeModal();
    setAddress(address);
  };
  return { open, closeModal, onSubmit, address, setAddress, getRemoveRecipient };
}

function RemoveRecipientModal({
  open,
  onClose,
  address,
  setAddress,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  address?: string;
  setAddress: (v: string) => void;
}) {
  return (
    <Modal open={open} maskClosable={false} onCancel={onClose} closeIcon={null} title={null} footer={null}>
      <div className="flex flex-col items-center">
        <div className="mb-10 text-gray21 font-semibold text-xl text-center">Check Recipient Address</div>
        <Input
          size="large"
          placeholder="Input Arweave Address"
          value={address}
          onChange={(v) => setAddress(v.target.value)}
        />
        <div className="mt-5 text-xs">* Your removed assets will be returned to this wallet.</div>
        <GrayDivider />
        <div className="flex justify-center gap-5">
          <div className="btn-primary" onClick={onSubmit}>
            Continue
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function Mint() {
  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts?.[0]?.address;
  const {
    tokenType,
    setTokenType,
    apusDynamic,
    apusStETH,
    apusDAI,
    apusToken,
    otherToken,
    apusStETHEstimatedApus,
    apusDAIEstimatedApus,
    biTokenEstimatedApus,
    userEstimatedApus,
    loadingApus,
    loadingTokenAllocation,
    loadingTokenEstimatedApus,
    loadingUserEstimatedApus,
    loadingUpdateAllocation,
    increaseApusAllocation,
    decreaseApusAllocation,
    refreshAfterAllocation,
  } = useAOMint({
    wallet: walletAddress,
    MintProcess: APUS_ADDRESS.Mint,
    MirrorProcess: APUS_ADDRESS.Mirror,
  });
  const recipientModal = useRecipientModal({
    wallet: walletAddress,
    MintProcess: APUS_ADDRESS.Mint,
  });
  const { recipientVisible, setRecipientVisible, recipient, loadingRecipient } = recipientModal;
  const { integer: apusInteger, decimal: apusDecimal } = splitBigNumber(apusDynamic, 12);

  const {
    modalOpen: tipModalOpen,
    closeModal: closeTipModal,
    title: tipModalTitle,
    showSigTip,
    closeAndNotAskAgain,
  } = useSignatureModal();
  const [tab, setTab] = useState<"allocate" | "remove">("allocate");
  const [amount, setAmount] = useState<string>("");
  const bigAmount = ethers.utils.parseUnits(amount || "0", 18);
  const estimatedApus = bigAmount.mul(biTokenEstimatedApus).div(BigNumber.from(10).pow(18));

  const isAmountValid = amount !== "" && amount !== "0";
  const isBeforePRETGE = dayjs().isBefore(PRE_TGE_TIME);
  const canApprove = isAmountValid && !isBeforePRETGE;
  const cannotApproveTip = isBeforePRETGE
    ? `Pre TGE starts in ${dayjs().to(PRE_TGE_TIME)}`
    : !isAmountValid
      ? "Please Select Amount"
      : "";

  const approve = async () => {
    if (!canApprove) {
      return;
    }
    if (!recipient) {
      setRecipientVisible(true);
      return;
    }
    try {
      if (tab === "allocate") {
        await showSigTip("Notice");
        await increaseApusAllocation(bigAmount);
      } else {
        const removeRecipient = await getRemoveRecipient();
        await showSigTip("Notice");
        await decreaseApusAllocation(bigAmount, removeRecipient);
      }
      setAmount("");
      toast.success(`${tab === "allocate" ? "Allocate" : "Remove"} Successful`);
    } catch (e: unknown) {
      console.log(e);
      if (e instanceof Error) {
        toast.error(e.message, { autoClose: false });
        refreshAfterAllocation();
        setAmount("");
      } else {
        toast.error(`${tab === "allocate" ? "Allocate" : "Remove"} Failed, Please Try Again.`, { autoClose: false });
      }
    }
  };

  const switchTab = (key: string) => {
    setTab(key as "allocate" | "remove");
    setAmount("");
  };

  const switchToken = (key: "stETH" | "DAI") => {
    setTokenType(key);
    setAmount("");
  };

  const {
    open: removeRecipientModalOpen,
    closeModal: closeRemoveRecipientModal,
    onSubmit: removeRecipient,
    address: removeRecipientAddress,
    setAddress: setRemoveRecipientAddress,
    getRemoveRecipient,
  } = useRemoveRecipientModal({ recipient });

  const AllocateButton = (btnName: string) => (
    <Tooltip title={cannotApproveTip} color="#f85931" placement="bottom">
      <Spin spinning={!recipient ? loadingRecipient : loadingUpdateAllocation}>
        <div className={`btn-primary ${!recipient ? "warning" : ""} ${canApprove ? "" : "disabled"}`} onClick={approve}>
          {!recipient ? "Submit Recipient Address" : btnName}
        </div>
      </Spin>
    </Tooltip>
  );

  return (
    <>
      <HomeHeader Userbox={<MintUserbox setRecipientVisible={setRecipientVisible} />} />
      <div
        id="mint"
        className="pt-20 z-10"
        style={{
          opacity: recipientVisible ? 0 : 1,
        }}
      >
        <div className="card">
          <div className="flex-grow-1 flex-shrink-0 w-1/2 flex flex-col gap-3 p-7 items-center">
            <div className="card-caption w-full">DASHBOARD</div>
            <div className="text-gray90">Your APUS</div>
            <div className="font-medium text-gray21 text-[30px] leading-none">
              <Spin indicator={<LoadingOutlined spin />} size="small" spinning={loadingApus}>
                <div className="flex items-end justify-center">
                  <FlipNumbers
                    height={30}
                    width={20}
                    color="#212121"
                    numberStyle={{
                      zoom: "101%",
                    }}
                    play
                    numbers={apusInteger}
                  />
                  <span>.</span>
                  <FlipNumbers height={20} width={14} color="#212121" play numbers={apusDecimal} />
                </div>
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
                  <div className="pie-legend-square bg-[#3CDCE5]" /> Liquidity: <span>1% (TGE 100%)</span>
                </li>
              </ol>
            </div>
            <Link
              to="https://mirror.xyz/0xE84A501212d68Ec386CAdAA91AF70D8dAF795C72/CzMaS-eHBqfinh5HzrNle12-5UvO54Glj3NlEnX1mmY"
              target="_blank"
            >
              <div className="w-full text-right underline underline-offset-2 text-gray21 font-medium cursor-pointer">
                Learn More
              </div>
            </Link>
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
                key: "allocate",
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
                    {tokenType && !biTokenEstimatedApus.isZero() && (
                      <div className="flex">
                        <span className="font-bold mr-1">1</span>
                        {tokenType + "="}
                        <LoadingNumber hide={tokenType === undefined} loading={loadingTokenEstimatedApus}>
                          <span className="font-bold mx-1">{formatBigNumber(biTokenEstimatedApus, 12, 4)}</span>
                        </LoadingNumber>
                        APUS
                      </div>
                    )}
                    {AllocateButton("Allocate")}
                    <SigTips />
                  </div>
                ),
              },
              {
                key: "remove",
                label: "Remove",
                children: (
                  <div
                    className="w-full mx-auto p-5 flex flex-col gap-5 items-center
              text-gray21"
                  >
                    <div className="w-full text-right flex">
                      <span className="font-bold text-[#091dff] mr-1">
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
                    {AllocateButton("Remove Allocation")}
                    <SigTips />
                  </div>
                ),
              },
            ]}
          ></Tabs>
        </div>
        <SigModal
          open={tipModalOpen}
          close={closeTipModal}
          closeAndNotAskAgain={closeAndNotAskAgain}
          title={tipModalTitle}
        />
        <RemoveRecipientModal
          open={removeRecipientModalOpen}
          onClose={closeRemoveRecipientModal}
          address={removeRecipientAddress}
          setAddress={setRemoveRecipientAddress}
          onSubmit={removeRecipient}
        />
      </div>
      <Recipient showSigTip={showSigTip} {...recipientModal} />
      <HomeFooter />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </>
  );
}
