import { Divider, Dropdown, Form, Input, Modal, Spin, Tooltip } from "antd";
import { ToastContainer, Bounce } from "react-toastify";
import "./mint.css";
import { ImgMint } from "../../assets";
import { useEffect, useState } from "react";
import { useAOMint } from "./contexts";
import { BigNumber } from "ethers";
import { LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import HomeFooter from "../../components/HomeFooter";
import HomeHeader from "../../components/HomeHeader";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(duration);
dayjs.extend(relativeTime);
import { splitBigNumber } from "./utils";
import { APUS_ADDRESS } from "../../utils/config";
import FlipNumbers from "react-flip-numbers";
import { useLocalStorage } from "react-use";
import { ConnectButton, useActiveAddress, useConnection } from "arweave-wallet-kit";

export const GrayDivider = ({ className }: { className?: string }) => (
  <Divider className={`min-w-0 w-[21rem] my-5 ${className} border-grayd8`} />
);

export function Component() {
  const { disconnect } = useConnection();
  const activeAddress = useActiveAddress();
  const [apusWallet, setApusWallet] = useLocalStorage<string>("apus-wallet");
  const { apusDynamic, loadingApus } = useAOMint({
    apusWallet,
    wallet: activeAddress,
    MintProcess: APUS_ADDRESS.Mint,
    // MirrorProcess: APUS_ADDRESS.Mirror,
  });
  const { integer: apusInteger, decimal: apusDecimal } = splitBigNumber(apusDynamic || BigNumber.from(0), 12);

  const [recipientModal, setRecipientModal] = useState(false);
  const [recipient, setRecipient] = useState("");
  useEffect(() => {
    if (apusWallet) {
      setRecipient(apusWallet);
    }
  }, [apusWallet]);

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
              <ConnectButton
                profileModal={false}
                showBalance={false}
                onClickCapture={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              />
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
            <div className="text-gray90 mt-10">
              <span className="mr-2">Your APUS</span>
              <Tooltip
                title={
                  <div>
                    <div>Why $APUS is 0 while already delegated?</div>
                    <ul className="pl-4 list-disc">
                      <li>
                        APUS mint according to AO Mint Report, your delegation is not react on AO Mint Report Yet(usally
                        24 hours)
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
            {/* <Divider orientation="center" className="my-8" />
            <div className="text-gray90">30 Day Projection</div>
            <div className="flex gap-2 items-center leading-none">
              <span className="text-[#03C407] text-[40px] -mt-[6px]">+</span>
              <LoadingNumber loading={loadingUserEstimatedApus}>
                <span className="font-medium text-gray21 text-[40px]">{formatBigNumber(userEstimatedApus, 12, 4)}</span>
              </LoadingNumber>
            </div> */}
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
            </ol>
            <div className="flex items-center gap-5">
              <img src={ImgMint.TokenomicsPie} className="w-[8.5rem] h-[8.5rem]" />
              <ol className="pie-legend-list">
                <li>
                  <div className="pie-legend-square bg-black" /> Community: <span>92%</span>
                </li>
                <li>
                  <div className="pie-legend-square bg-primary" /> Ecosystem: <span>7% (TGE 100%)</span>
                </li>
                <li>
                  <div className="pie-legend-square bg-[#3CDCE5]" /> Liquidity: <span>1% (TGE 100%)</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
        <div className="card flex-col p-7">
          <h2 className="font-semibold text-gray33 text-lg mb-7">How to get $APUS?</h2>
          <h3 className="card-caption mb-4">
            1. Open{" "}
            <a href="https://ao.arweave.net/#/delegate/" className="text-mainblue underline">
              AO Delegate
            </a>
          </h3>
          <div className="mb-7 border border-solid border-grayd8 rounded-lg overflow-hidden">
            <img src={ImgMint.DelegationGuide1} className="w-full" />
          </div>
          <h3 className="card-caption mb-4">2. Connect Your wallet</h3>
          <div className="mb-7 border border-solid border-grayd8 rounded-lg overflow-hidden">
            <img src={ImgMint.DelegationGuide2} className="w-full" />
          </div>
          <h3 className="card-caption mb-4">3. Add APUS to your delegation list</h3>
          <div className="mb-7 border border-solid border-grayd8 rounded-lg overflow-hidden">
            <img src={ImgMint.DelegationGuide3} className="w-full" />
          </div>
          <h3 className="card-caption mb-4">4. Confirm and receive your APUS tokens (within ~24 hours)</h3>
          <div className="mb-7 border border-solid border-grayd8 rounded-lg overflow-hidden">
            <img src={ImgMint.DelegationGuide4} className="w-full" />
          </div>
        </div>
      </div>
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
