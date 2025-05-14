import { ethers } from "ethers";
import { useAO } from "../../../utils/ao";
import { ANPM_DEFAULT_POOL, ANPM_POOL_MGR } from "../../../utils/config";
import BalanceSection from "../components/BalanceSection";
import ModelCard from "./ModelCard";
import { useEffect } from "react";
import { useWallet } from "../contexts/anpm";

interface PoolStakingResponse {
  pool_id: string;
  total_stake: string;
  capacity: string;
}

interface CreditBalanceResponse {
  user: string;
  balance: string;
}

export function Component() {
  const { activeAddress } = useWallet();
  const { execute: getPoolStaking, data: poolStakingRes } = useAO<PoolStakingResponse>(
    ANPM_POOL_MGR,
    "Get-Pool-Staking",
    "dryrun",
  );
  const { execute: getCreditBalance, data: creditBalance } = useAO<CreditBalanceResponse>(
    ANPM_DEFAULT_POOL.ProcessID,
    "Credit-Balance",
    "dryrun",
  );
  useEffect(() => {
    if (!activeAddress) return;
    getPoolStaking({ PoolId: ANPM_DEFAULT_POOL.ID });
    getCreditBalance();
  }, [getPoolStaking, getCreditBalance, activeAddress]);
  const models = [
    {
      modelName: ANPM_DEFAULT_POOL.Name,
      description: ANPM_DEFAULT_POOL.Description,
      poolCredit: creditBalance?.balance || "0",
      totalStaked: ethers.utils.formatUnits(poolStakingRes?.total_stake || "0", 12),
      apr: ANPM_DEFAULT_POOL.APR,
    },
  ];
  return (
    <main className="pt-[210px] pb-[90px] bg-[#F9FAFB]">
      <div className="max-w-[1200px] mx-auto p-5 flex gap-10">
        <div className="w-[250px]">
          <BalanceSection />
        </div>
        <div className="flex-1 space-y-10">
          {models.map((model, index) => (
            <ModelCard key={index} {...model} />
          ))}
        </div>
      </div>
    </main>
  );
}
