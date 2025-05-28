import { useContext, useEffect, useState } from "react";
import BalanceSection from "../components/BalanceSection";
import { Breadcrumb, Input, Modal, Popconfirm, Select, Table } from "antd";
import dayjs from "dayjs";
import { ShortAddress } from "../../../utils/ao";
import { BalanceButton } from "../components/BalanceButton";
import { BalanceContext } from "../contexts/balance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useWallet } from "../contexts/anpm";
import { addProcess, getProcesses, removeProcess } from "../contexts/request";
import { deleteIcon } from "../assets";
import { ANPM_DEFAULT_POOL } from "../../../utils/config";

function useModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [poolID, setPoolID] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [processID, setProcessID] = useState<string>("");
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
    canSubmit,
  };
}

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
    canSubmit,
  } = useModal();
  useEffect(() => {
    if (pools.length) {
      setPoolID(pools[0].pool_id);
    }
  }, [pools, setPoolID]);

  const { activeAddress } = useWallet();
  const processesQuery = useQuery({
    queryKey: ["processes", activeAddress],
    queryFn: () => getProcesses(activeAddress || ""),
    enabled: !!activeAddress,
  });
  const addProcessMutation = useMutation({
    mutationFn: () => addProcess(name, processID),
    onSuccess: () => {
      processesQuery.refetch();
      closeModal();
    },
  });
  const removeProcessMutation = useMutation({
    mutationFn: (processId: string) => removeProcess(processId),
    onSuccess: () => {
      processesQuery.refetch();
      closeModal();
    },
  });
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
            dataSource={processesQuery.data}
            rowKey="pool_id"
            size="small"
            className="w-full"
            pagination={false}
            columns={[
              { title: "Pool ID", key: "pool_id", render: () => ShortAddress(ANPM_DEFAULT_POOL) },
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
                dataIndex: "last_updated",
                key: "last_updated",
                render: (text) => text ? dayjs(text * 1000).format("YYYY/MM/DD") : '-',
              },
              {
                title: "",
                key: "action",
                align: "right",
                render: (_, record) => (
                  <Popconfirm
                    title="Delete Process ID"
                    description="Are you sure you want to delete this process ID?"
                    onConfirm={() => removeProcessMutation.mutate(record.process_id)}
                  >
                    <img src={deleteIcon} className="w-6 h-6 cursor-pointer" />
                  </Popconfirm>
                ),
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
            <BalanceButton
              name="Add Process ID"
              active={!canSubmit}
              loading={addProcessMutation.isPending}
              onClick={() => {
                if (canSubmit) {
                  addProcessMutation.mutate();
                }
              }}
            />
          </div>
        </div>
      </Modal>
    </main>
  );
}
