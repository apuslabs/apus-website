import BalanceSection from "../components/BalanceSection";
import { Breadcrumb, InputNumber, Select } from "antd";
import StakeSection from "../components/StakeSection";
import { arrowLeftIcon, transferBigIcon } from "../assets";


export function Component() {
  return (
    <main className="pt-[170px] pb-[90px] bg-[#F9FAFB]">
      <div className="content-area mb-[60px]">
        <Breadcrumb
          items={[
            {
              title: "Dashboard",
              path: "/anpm/console",
            },
            {
              title: "Stake APUS",
            },
          ]}
        />
      </div>
      <div className="max-w-[1200px] mx-auto flex gap-10">
        <div className="flex flex-col gap-10 w-[250px]">
          <BalanceSection />
          <StakeSection />
        </div>
        <div className="box w-[640px] h-full">
          <div className="mb-[50px] text-center text-wrap text-sm leading-snug">Transfer CREDIT between Balance and Pools. CREDIT can be<br/> withdrawn from Pool at any time.</div>
          <div className="flex gap-[10px] items-center">
            <div className="flex-1 box flex flex-col items-center">
                <div className="text-base leading-tight mb-[6px] mt-[6px]">CREDIT Balance</div>
                <div className="mb-[10px] text-[30px]">128</div>
                <div className="mb-[5px] text-sm">Amount to transfer:</div>
                <InputNumber className="mb-[10px] w-full" />
                <div className="btn-mainblue w-[100px] h-12">
                    <img className="w-[35px] h-[35px] rotate-180" src={arrowLeftIcon} />
                </div>
            </div>
            <img src={transferBigIcon} className="w-[50px] h-[50px] text-[#262626]" />
            <div className="flex-1 box flex flex-col items-center">
                <Select placeholder="Select a pool" className="w-full mb-[5px]">
                    <Select.Option value="pool1">Pool 1</Select.Option>
                    <Select.Option value="pool2">Pool 2</Select.Option>
                    <Select.Option value="pool3">Pool 3</Select.Option>
                    <Select.Option value="pool4">Pool 4</Select.Option>
                    <Select.Option value="pool5">Pool 5</Select.Option>
                </Select>
                <div className="mb-[10px] text-[30px]">1,282,483.53</div>
                <div className="mb-[5px] text-sm">Amount to transfer:</div>
                <InputNumber className="mb-[10px] w-full" />
                <div className="btn-mainblue w-[100px] h-12">
                    <img className="w-[35px] h-[35px]" src={arrowLeftIcon} />
                </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
