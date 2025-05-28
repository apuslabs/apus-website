import BalanceSection from "../components/BalanceSection";
import ModelCard from "./ModelCard";
import { useContext, useState } from "react";
import { Modal, Typography } from "antd";
import { BalanceContext } from "../contexts/balance";
import Markdown from "react-markdown";

export function Component() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { pools } = useContext(BalanceContext);
  const tutorial = `
1. Make sure you have enough credits in this pool.
2. Send Add Task to this pool. Each task cost 0.000000000001 credit.
    \`\`\`lua
    Send({ \n\t\tTarget = "${pools?.[0]?.pool_id || 'Pool'}", \n\t\tAction = "Add-Task", \n\t\tData  = '{"prompt":"Hello","config":"{\\"n_gpu_layers\\":32}"}' \n\t}).onReply(function (retMsg) \n\t\tprint(retMsg.Data) \n\tend)
    \`\`\`
3. Wait for the task to be completed. A Task-Response will be sent to the pool.
4. Or you can use the \`Get-Task-Response\` API to get the result.
    \`\`\`lua
    Send({ \n\t\tTarget = "${pools?.[0]?.pool_id || 'Pool'}", \n\t\tAction = "Get-Task-Response", \n\t\tData  = '<task_ref>' \n\t})
    \`\`\`
`
  return (
    <main className="pt-[210px] pb-[90px] bg-[#F9FAFB]">
      <div className="max-w-[1200px] mx-auto p-5 flex gap-10">
        <div className="w-[250px]">
          <BalanceSection />
        </div>
        <div className="flex-1 space-y-10">
          {pools.map((model, index) => (
            <ModelCard
              key={index}
              {...model}
            />
          ))}
        </div>
      </div>
      <Modal
        open={isModalOpen}
        title={<h2 className="text-lg font-bold">How to use this pool?</h2>}
        width={640}
        onCancel={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        footer={null}
      >
        <Typography.Paragraph>
          <Markdown>
            {tutorial}
          </Markdown>
        </Typography.Paragraph>
      </Modal>
    </main>
  );
}
