import { Modal } from "antd";

export default function SubmitSuccessfulModal({ visible, onCancel }: { visible: boolean; onCancel: () => void }) {
  return (
    <Modal title={null} open={visible} onCancel={onCancel} onOk={onCancel} footer={null}>
      <div className="pt-28 flex flex-col items-center">
        <div className="text-2xl font-semibold mb-6 text-black text-center">Submitted Successfully!</div>
        <div className="text-base text-black50 w-80 text-center">
          Your ranking will be updated after 1 hour, please refresh the page after 1 hour.
        </div>
        <div className="mt-16 flex justify-end w-full">
          <div className="w-32 btn-gradient3" onClick={onCancel}>
            OK
          </div>
        </div>
      </div>
    </Modal>
  );
}
