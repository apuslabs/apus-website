import { Form, Input, Modal, Tooltip } from "antd";
import { useForm } from "antd/es/form/Form";
import { FC } from "react";
import { ImgCompetition } from "../../../assets/image";

export const JoinCompetitionModal: FC<{
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
}> = ({ visible, onCancel, onOk }) => {
  const [form] = useForm();
  return (
    <Modal
      title={
        <div className="font-bold text-black text-2xl">
          Submit Fine-tuned Model
        </div>
      }
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      footer={null}
    >
      <Form layout="vertical" form={form} className="my-10">
        <Form.Item
          name="modelName"
          label={<div className="text-xs text-black50">Model Name</div>}
        >
          <Input
            placeholder="Enter your model name (Example: AI model type A)"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="modelFile"
          label={
            <div className="text-xs text-black50 flex items-center gap-1">
              File Hash on Arweave
              <Tooltip
                title="A hash code is a digital fingerprint of an input data set, where the code is used to verify or identify the original document at a later time. A hash value is usually produced by applying a hashing function to an input value."
                overlayClassName="w-80"
                overlayInnerStyle={{
                  width: "20rem",
                }}
              >
                <img
                  src={ImgCompetition.IconInfoCircle}
                  className="w-3 h-3 cursor-pointer"
                />
              </Tooltip>
            </div>
          }
        >
          <Input placeholder="Enter your File Hash on Arweave " size="large" />
        </Form.Item>
      </Form>
      <div className="flex justify-end gap-4">
        <div
          className="btn-default w-32"
          onClick={() => {
            onCancel();
          }}
        >
          Cancel
        </div>
        <div
          className="btn-gradient3 w-32"
          onClick={() => {
            onOk();
          }}
        >
          Submit
        </div>
      </div>
    </Modal>
  );
};
