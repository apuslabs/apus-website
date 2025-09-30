import BalanceSection from "../components/BalanceSection";
import ModelCard from "./ModelCard";
import { useContext } from "react";
import { BalanceContext } from "../contexts/balance";
import { Skeleton } from "antd";

export function Component() {
  const { pools, poolListQuery } = useContext(BalanceContext);
  return (
    <main className="pt-[210px] pb-[90px] bg-[#F9FAFB]">
      <div className="max-w-[1200px] mx-auto p-5 flex gap-10">
        <div className="w-[250px]">
          <BalanceSection />
        </div>
        <div className="flex-1 space-y-10">
          {poolListQuery.isFetching ? <Skeleton active /> : pools.map((model, index) => (
            <ModelCard
              key={index}
              {...model}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
