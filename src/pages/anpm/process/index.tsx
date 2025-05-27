import { useContext, useEffect, useState } from "react";
import BalanceSection from "../components/BalanceSection";
import { Breadcrumb, Input, Modal, Select, Table } from "antd";
import dayjs from "dayjs";
import { ShortAddress } from "../../../utils/ao";
import { BalanceButton } from "../components/BalanceButton";
import { BalanceContext } from "../contexts/balance";


function useModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [poolID, setPoolID] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [processID, setProcessID] = useState<string>("");
  const onSubmit = () => {
    // Handle the submission logic here
    if (!poolID || !name || !processID) {
      console.error("Please fill in all fields.");
      return;
    }
    console.log("Submitting:", { poolID, name, processID });
    setIsModalOpen(false);
  };
  const canSubmit = !!(poolID && name && processID);
  return {
    isModalOpen,
    openModal,
    closeModal,
    poolID,
    setPoolID,
    name,
    setName,
    processID,
    setProcessID,
    onSubmit,
    canSubmit,
  };
}

const processes = [
  {
    pool_id: "pool1",
    name: "Pool 1",
    process_id: "weiv3UgCyhc387fkgQ13bi43m8sqbl3Td1nOgJ2Frsc",
    created_at: 1748362744,
    last_used: 1748362744,
  },
  {
    pool_id: "pool2",
    name: "Pool 2",
    process_id: "weiv3UgCyhc387fkgQ13bi43m8sqbl3Td1nOgJ2Frsc",
    cur_staking: 1748362744,
    staking_capacity: 1748362744,
  },
];

export function Component() {
  const { pools } = useContext(BalanceContext);
  const {
    isModalOpen,
    openModal,
    closeModal,
    poolID,
    setPoolID,
    name,
    setName,
    processID,
    setProcessID,
    onSubmit,
    canSubmit,
  } = useModal();
  useEffect(() => {
    if (pools.length) {
      setPoolID(pools[0].pool_id);
    }
  }, [pools, setPoolID])
  return (
    <main className="pt-[148px] pb-[90px] bg-[#F9FAFB]">
      <div className="content-area mb-[40px]">
        <Breadcrumb
          items={[
            {
              title: "Dashboard",
              path: "/anpm/console",
            },
            {
              title: "Buy CREDIT",
            },
          ]}
        />
      </div>
      <div className="max-w-[1200px] mx-auto p-5 flex gap-10">
        <div className="w-[250px]">
          <BalanceSection />
        </div>
        <div className="box w-[640px] flex flex-col items-center gap-[10px]">
          <div className="w-full flex justify-end mb-[26px]">
            <BalanceButton name="+ Add New Process" onClick={() => openModal()} />
          </div>
          <Table
            dataSource={processes}
            rowKey="pool_id"
            size="small"
            className="w-full"
            pagination={false}
            columns={[
              { title: "Pool ID", dataIndex: "pool_id", key: "pool_id" },
              { title: "Name", dataIndex: "name", key: "name" },
              { title: "Process ID", dataIndex: "process_id", key: "process_id", render: (text) => ShortAddress(text) },
              {
                title: "Created At",
                dataIndex: "created_at",
                key: "created_at",
                render: (text) => dayjs(text * 1000).format("YYYY/MM/DD"),
              },
              {
                title: "Last Used",
                dataIndex: "last_used",
                key: "last_used",
                render: (text) => dayjs(text * 1000).format("YYYY/MM/DD"),
              },
            ]}
          />
        </div>
      </div>
      <Modal
        footer={null}
        title={null}
        open={isModalOpen}
        onClose={() => {
          closeModal();
        }}
        onCancel={() => {
          closeModal();
        }}
      >
        <div className="flex flex-col gap-[25px]">
          <div className="text-xl font-bold">Add New Progress ID</div>
          <div className="text-sm font-bold -mb-[15px]">Pool</div>
          <Select placeholder="Select a pool" className="w-full" value={poolID} onChange={(value) => setPoolID(value)}>
            {pools.map((pool) => (
              <Select.Option key={pool.pool_id} value={pool.pool_id}>
                {pool.name}
              </Select.Option>
            ))}
          </Select>
          <div className="text-sm font-bold -mb-[15px]">Name</div>
          <Input placeholder="Enter process name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="text-sm font-bold -mb-[15px]">Process ID</div>
          <Input placeholder="Enter process ID" value={processID} onChange={(e) => setProcessID(e.target.value)} />
          <div className="flex gap-4">
            <button
              className={`flex items-center gap-2  text-[#121212] border border-solid border-[#121212] text-sm px-[15px] py-2 rounded-lg transition-colors bg-white`}
              onClick={closeModal}
            >
              Cancel
            </button>
            <BalanceButton name="Add Process ID" active={canSubmit} onClick={onSubmit} />
          </div>
        </div>
      </Modal>
    </main>
  );
}
