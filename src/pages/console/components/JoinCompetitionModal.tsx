import { Form, Input, message, Modal, notification, Spin, Upload, UploadFile } from "antd";
import { useForm } from "antd/es/form/Form";
import { FC, useState } from "react";
import { DeleteOutlined, FileOutlined } from "@ant-design/icons";
import { useCompetitionPool, useEmbedding } from "../../../contexts/competition";
import { sha1 } from "../../../utils/utils";
import { useParams } from "react-router-dom";

export const JoinCompetitionModal: FC<{
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  joinPool: ReturnType<typeof useCompetitionPool>["joinPool"];
}> = ({ visible, onCancel, onOk, joinPool }) => {
  const [form] = useForm();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submiting, setSubmitting] = useState(false);

  const { createDataset } = useEmbedding();
  const { poolid } = useParams();

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = await form.validateFields();
      const hash = await sha1(formData.name);
      const fileContent = await formData.dataset[0].originFileObj.text();
      const jsonContent = JSON.parse(fileContent);
      if (!Array.isArray(jsonContent)) {
        throw new Error("Invalid JSON file: should be an array");
      }
      const contents = [];
      for (const i of jsonContent) {
        if (typeof i.content !== "string") {
          throw new Error("Invalid JSON file: content should be string");
        }
        contents.push(i.content);
      }
      if (contents.length === 0) {
        throw new Error("Invalid JSON file: empty content");
      }
      await createDataset(poolid!, hash, formData.name, contents);
      await joinPool({ PoolID: poolid! }, { dataset_hash: hash, dataset_name: formData.name });
      form.resetFields();
      setFileList([]);
      onOk();
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.message === "{}") {
          message.error("Unknown error, please try another dataset file or contact admin.");
        } else {
          notification.error({
            message: "Submit Failed",
            description: e.message,
          });
        }
      } else if (typeof e === "object" && e !== null && "errorFields" in e) {
        return;
      } else {
        message.error(JSON.stringify(e));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={<div className="font-bold text-black text-2xl">Submit Dataset</div>}
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      footer={null}
    >
      <Form layout="vertical" form={form} className="my-10">
        <Form.Item
          name="name"
          required
          rules={[{ required: true, message: "Please input your dataset name!" }]}
          label={<div className="text-xs text-black50">Dataset Name</div>}
        >
          <Input placeholder="Enter your dataset name (Example: Anna's Dataset)" size="large" />
        </Form.Item>
        <Form.Item
          name="dataset"
          required
          rules={[{ required: true, message: "Please upload your dataset file!" }]}
          label={<div className="text-xs text-black50 flex items-center gap-1">Dataset File</div>}
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload.Dragger
            name="file"
            multiple={false}
            fileList={fileList}
            maxCount={1}
            onRemove={() => {
              setFileList([]);
            }}
            beforeUpload={async (file) => {
              const isJSON = file.type === "application/json";
              if (!isJSON) {
                message.error(`${file.name} is not a json file`);
                return Upload.LIST_IGNORE;
              }
              const isLt512 = file.size / 1024 > 512;
              if (isLt512) {
                message.error("File must smaller than 512KB!");
                return Upload.LIST_IGNORE;
              }
              const fileContent = await file.text();
              try {
                const jsonData = JSON.parse(fileContent);
                if (!Array.isArray(jsonData) || !jsonData.length) {
                  message.error(`${file.name} is not a valid json file`);
                  return Upload.LIST_IGNORE;
                }
                if (typeof jsonData[0]["content"] !== "string") {
                  message.error(`${file.name} is not a valid json file`);
                  return Upload.LIST_IGNORE;
                }
                setFileList([file]);
                return false;
              } catch {
                message.error(`${file.name} is not a valid json file`);
                return Upload.LIST_IGNORE;
              }
            }}
            showUploadList={false}
          >
            {!fileList.length ? (
              <div className="h-14 bg-black5 border-black20 rounded-lg border border-solid flex justify-center items-center">
                <div className="text-black50">Drag Here or Click To Upload Dataset File</div>
              </div>
            ) : (
              <div className="h-14 px-4 flex bg-white items-center">
                <FileOutlined />
                <span className="flex-1 text-left ml-2">{fileList[0].name}</span>
                <DeleteOutlined
                  className="w-14 h-14 ml-2 flex justify-end text-red-700"
                  onClick={(e) => {
                    setFileList([]);
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                />
              </div>
            )}
          </Upload.Dragger>
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
        <Spin spinning={submiting}>
          <div className="btn-blueToPink135 w-32" onClick={onSubmit}>
            Submit
          </div>
        </Spin>
      </div>
    </Modal>
  );
};
