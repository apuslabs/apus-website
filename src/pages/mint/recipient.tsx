import { Input, Spin } from "antd";
import { toast } from "react-toastify";
import { useRecipientModal } from "./contexts";
import { GrayDivider } from "./mint";
import { ImgMint } from "../../assets";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function Recipient({
  recipientVisible,
  setRecipientVisible,
  showSigTip,
  recipient,
  arweaveAddress,
  setArweaveAddress,
  loadingUpdateRecipient,
  loadingRecipient,
  submitRecipient,
}: {
  showSigTip: (title: string) => Promise<void>;
} & ReturnType<typeof useRecipientModal>) {
  return (
    <div
      className="fixed top-[100px] left-0 right-0 bottom-0 z-50 bg-white"
      style={{
        display: recipientVisible ? "flex" : "none",
        minHeight: "calc(100vh - 100px)",
      }}
    >
      <div className="card my-5 py-[30px] px-[46px] flex-col items-center">
        <div className="w-full -mt-[20px] flex gap-5 mb-5">
          <div className="btn-primary btn-outline" onClick={() => setRecipientVisible(false)}>
            <ArrowLeftOutlined className="mr-2" />
            Back to Mint
          </div>
        </div>
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
                await showSigTip("Notice");
                await submitRecipient();
                setRecipientVisible(false);
                toast.success("Recipient Updated Successfully");
              } catch (e: unknown) {
                if (e instanceof Error) {
                  toast.error(e.message, { autoClose: false });
                } else {
                  toast.error("Update Recipient Failed! Please Trye Again!", { autoClose: false });
                }
              }
            }}
          >
            Submit
          </div>
        </Spin>
      </div>
    </div>
  );
}
