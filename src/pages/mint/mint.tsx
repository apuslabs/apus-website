import { Divider, Dropdown, Form, Input, InputNumber, Modal, Slider, Spin, Tooltip } from "antd";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { Pie } from "@ant-design/plots";
import "./mint.css";
import { ImgMint } from "../../assets";
import { useEffect, useState } from "react";
import { useAOMint } from "./contexts";
import { BigNumber } from "ethers";
import { InfoCircleOutlined, LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import HomeFooter from "../../components/HomeFooter";
import HomeHeader from "../../components/HomeHeader";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(duration);
dayjs.extend(relativeTime);
import { formatBigNumber, splitBigNumber } from "./utils";
import { APUS_ADDRESS } from "../../utils/config";
import FlipNumbers from "react-flip-numbers";
import { useLocalStorage } from "react-use";
import { ConnectButton, useActiveAddress, useConnection } from "arweave-wallet-kit";

export const GrayDivider = ({ className }: { className?: string }) => (
  <Divider className={`min-w-0 w-[21rem] my-5 ${className} border-grayd8`} />
);

export function Component() {
  const { connect, disconnect } = useConnection();
  const activeAddress = useActiveAddress();
  const [apusWallet, setApusWallet] = useLocalStorage<string>("apus-wallet");
  const {
    apusDynamic,
    loadingApus,
    delegations: { apusFactor, otherFactor },
    userEstimatedApus,
    loadingUserEstimatedApus,
    loadingDelegations,
    loadingUpdateDelegation,
    updateDelegation,
  } = useAOMint({
    apusWallet,
    wallet: activeAddress,
    MintProcess: APUS_ADDRESS.Mint,
    MirrorProcess: APUS_ADDRESS.Mirror,
  });
  const maxFactorToApus = 100 - otherFactor;
  const { integer: apusInteger, decimal: apusDecimal } = splitBigNumber(apusDynamic || BigNumber.from(0), 12);

  const [percent, setPercent] = useState<number>(0);

  useEffect(() => {
    setPercent(apusFactor);
  }, [apusFactor]);

  const isPercentUpdated = percent !== apusFactor;
  const cannotApproveTip = !activeAddress ? "Please connect wallet" : !isPercentUpdated ? "Please Set Percent" : "";

  const approve = async () => {
    if (!activeAddress) {
      connect();
      return;
    }
    if (!isPercentUpdated) {
      return;
    }
    Modal.confirm({
      title: "Delegation Update Confirm",
      content:
        percent === 0
          ? `Remove ALL your delegation to $APUS`
          : `${percent > apusFactor ? "Increase" : "Decrease"} your delegation to $APUS from ${apusFactor}% to ${percent}%`,
      onOk: async () => {
        try {
          await updateDelegation(percent);
          toast.success(`Save Successful`);
        } catch (e: unknown) {
          if (e instanceof Error) {
            toast.error(e.message, { autoClose: false });
            setPercent(apusFactor);
          } else {
            toast.error(`Save Failed, Please Try Again.`, { autoClose: false });
          }
        }
      },
    });
  };

  const [recipientModal, setRecipientModal] = useState(false);
  const [recipient, setRecipient] = useState("");
  useEffect(() => {
    if (apusWallet) {
      setRecipient(apusWallet);
    }
  }, [apusWallet]);

  const onPercentChange = (v: number) => {
    if (v === 0) {
      setPercent(0);
    } else if (v < 5) {
      setPercent(5);
    } else if (v >= maxFactorToApus) {
      setPercent(maxFactorToApus);
    } else {
      setPercent(v);
    }
  };

  return (
    <>
      <HomeHeader
        Userbox={
          activeAddress ? (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "disconnect",
                    label: (
                      <div
                        onClick={() => {
                          disconnect();
                        }}
                      >
                        Disconnect Wallet
                      </div>
                    ),
                  },
                ],
              }}
            >
              <ConnectButton profileModal={false} showBalance={false} onClickCapture={e => {
                e.stopPropagation()
                e.preventDefault()
              }}/>
            </Dropdown>
          ) : (
            <ConnectButton profileModal={false} showBalance={false} />
          )
        }
      />
      <div id="mint" className="pt-20 z-10">
        <div className="card">
          <div className="flex-grow-1 flex-shrink-0 w-1/2 flex flex-col gap-3 p-7 items-center">
            <div className="card-caption w-full">DASHBOARD</div>
            <div className="text-gray90 mt-5">
              <span className="mr-2">Your APUS</span>
              <Tooltip
                title={
                  <div>
                    <div>Why $APUS is 0 while already delegated?</div>
                    <ul className="pl-4 list-disc">
                      <li>
                        APUS mint according to AO Mint Report, your delegation is not react on AO Mint Report Yet(usally
                        24 hours).
                      </li>
                      <li>
                        APUS has migarated to delegation from allocation, if you had set recipient before, please&nbsp;
                        <span
                          className="underline text-sky-200 cursor-pointer"
                          onClick={() => {
                            setRecipientModal(true);
                          }}
                        >
                          reconnect here
                        </span>
                      </li>
                    </ul>
                  </div>
                }
                overlayClassName="w-96 max-w-96"
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <div className="font-medium text-gray21 text-[30px] leading-none">
              <Spin indicator={<LoadingOutlined spin />} size="small" spinning={loadingApus}>
                <div className="flex items-end justify-center">
                  <FlipNumbers
                    height={40}
                    width={30}
                    color="#212121"
                    numberStyle={{
                      zoom: "101%",
                    }}
                    play
                    numbers={apusInteger}
                  />
                  <span>.</span>
                  <FlipNumbers height={30} width={20} color="#212121" play numbers={apusDecimal} />
                </div>
              </Spin>
            </div>
            <Divider orientation="center" className="my-8" />
            <div className="text-gray90">30 Day Projection</div>
            <div className="flex gap-2 items-center leading-none">
              <span className="text-[#03C407] text-[40px] -mt-[6px]">+</span>
              <LoadingNumber loading={loadingUserEstimatedApus}>
                <span className="font-medium text-gray21 text-[40px]">{formatBigNumber(userEstimatedApus, 12, 4)}</span>
              </LoadingNumber>
            </div>
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
          <div className="text-gray21 mb-8">
            Below represents how you are allocating your AO Yield
            <Tooltip
              title={
                <div>
                  Since APUS is built on the AO network, you must first
                  <Link to="https://ao.arweave.dev/#/mint" className="mx-1 text-blue underline">
                    Bridge To AO
                  </Link>
                  before allocating to APUS. The AO available for allocation includes all your bridged assets, including
                  and any allocations to other projects.
                </div>
              }
              placement="topRight"
              arrow={false}
              overlayInnerStyle={{
                backgroundColor: "white",
                color: "#0b0b0b",
                padding: "1rem",
                width: "26rem",
              }}
            >
              <InfoCircleOutlined className="pl-1" />
            </Tooltip>
          </div>
          <DemoPie
            aoFactor={Number((100 - otherFactor - percent).toFixed(2))}
            apusFactor={percent}
            otherFactor={otherFactor}
          />
          <div className="w-full mx-auto p-5 flex flex-col gap-5 items-center text-gray21">
            <div className="relative w-full px-[5px]">
              <div
                className="absolute left-0 top-[22px] h-[10px] bg-[#333333] rounded-[5px] z-10"
                style={{
                  width: `${5}%`,
                }}
              ></div>
              <div
                className="absolute right-0 top-[22px] h-[10px] bg-[#333333] rounded-[5px] z-10"
                style={{
                  width: `${otherFactor}%`,
                }}
              ></div>
              <Slider
                className="w-full"
                marks={{ 0: "0%", 5: "5%", [maxFactorToApus]: `${maxFactorToApus}%` }}
                min={0}
                max={100}
                step={1}
                tooltip={{
                  open: true,
                  formatter: (v) => (loadingDelegations ? <LoadingOutlined color="#f3f3f3" /> : `${v}%`),
                }}
                value={percent}
                onChange={onPercentChange}
              />
            </div>
            <div className="w-full flex flex-col items-end -mt-10">
              <div className="mb-2">
                <span className="text-mainblue font-semibold">{percent}%</span> allocated to Mint APUS
              </div>
              <InputNumber
                className="w-60"
                size="large"
                value={percent}
                max={maxFactorToApus}
                min={0}
                precision={2}
                step={1}
                onStep={onPercentChange}
                onPressEnter={(v) => {
                  const n = parseFloat((v.target as HTMLInputElement).value);
                  console.log(n);
                  if (!isNaN(n)) {
                    onPercentChange(n);
                  }
                }}
                onBlur={(v) => {
                  const n = parseFloat(v.target.value);
                  if (!isNaN(n)) {
                    onPercentChange(n);
                  }
                }}
              />
            </div>
            <Tooltip title={cannotApproveTip} color="#f85931" placement="bottom">
              <Spin spinning={loadingUpdateDelegation}>
                <div className={`btn-primary ${isPercentUpdated && activeAddress ? "" : "disabled"}`} onClick={approve}>
                  {activeAddress ? "Save Changes" : "Connect Wallet"}
                </div>
              </Spin>
            </Tooltip>
          </div>
        </div>
      </div>
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
      <Modal
        title="Connect Recipient Modal"
        open={recipientModal}
        onCancel={() => {
          setRecipientModal(false);
        }}
        onClose={() => {
          setRecipientModal(false);
        }}
        onOk={() => {
          setApusWallet(recipient);
          setRecipientModal(false);
        }}
      >
        <Form>
          <Form.Item label="Recipient Address">
            <Input value={recipient} onChange={(v) => setRecipient(v.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

function DemoPie({ apusFactor, otherFactor, aoFactor }: { apusFactor: number; otherFactor: number; aoFactor: number }) {
  return (
    <Pie
      data={[
        { type: "Apus", value: apusFactor },
        { type: "AO", value: aoFactor },
        { type: "Other", value: otherFactor },
      ]}
      width={400}
      height={340}
      paddingX={50}
      insetBottom={16}
      angleField="value"
      colorField="type"
      scale={{ color: { palette: ["#091DFF", "#F87D5E", "#212121"] } }}
      animate={{ update: { type: false }, enter: { type: false }, exit: { type: false } }}
      label={{
        text: "value",
        position: "outside",
      }}
      legend={{
        color: {
          layout: {
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          },
          position: "bottom",
          rowPadding: 5,
        },
      }}
    />
  );
}

function LoadingNumber({
  className,
  loading,
  children,
}: {
  className?: string;
  loading: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`${className ? className : ""} flex items-center`}>
      <Spin indicator={<LoadingOutlined spin />} size="small" spinning={loading}>
        {loading ? `--` : children}
      </Spin>
    </div>
  );
}
