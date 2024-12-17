import { Input, notification, Spin } from "antd";
import { useParams, useRecipientModal, useSignatureModal } from "./contexts";
import { GrayDivider, SigModal } from "./mint";
import { useConnectWallet } from "@web3-onboard/react";
import { ImgMint } from "../../assets";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import MintUserbox from "../../components/MintUserbox";

export default function Recipient() {
  const { MintProcess } = useParams();
  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts?.[0]?.address;
  const {
    modalOpen: tipModalOpen,
    closeModal: closeTipModal,
    title: tipModalTitle,
    showSigTip,
    closeAndNotAskAgain,
  } = useSignatureModal();
  const {
    goToRecipient,
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
  return (
    <>
      <HomeHeader Userbox={<MintUserbox onRecipient={goToRecipient} />} />
      <div id="mint" className="pt-[100px] flex items-center">
        <div className="card my-5 py-[30px] px-[46px] flex-col items-center">
          <div className="mb-10 text-gray21 text-3xl text-center">RECEIVE APUS ADDRESS</div>
          <img src={ImgMint.IconRecipient} className="w-[200px]" />
          <div className="w-full text-gray21 mb-2">Selected Arweave Address:</div>
          <div className="w-full text-[#091dff] font-semibold mb-5">{recipient || ""}</div>
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
          <GrayDivider />
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
        </div>
        <SigModal
          open={tipModalOpen}
          close={closeTipModal}
          closeAndNotAskAgain={closeAndNotAskAgain}
          title={tipModalTitle}
        />
      </div>
      <HomeFooter />
    </>
  );
}
