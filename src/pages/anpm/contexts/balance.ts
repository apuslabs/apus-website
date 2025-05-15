import { createContext, useCallback, useEffect } from "react";
import { useWallet } from "./anpm";
import { useAO } from "../../../utils/ao";
import { ANPM_POOL_MGR, APUS_ADDRESS } from "../../../utils/config";

export const BalanceContext = createContext<{
    balance: string;
    credits: string;
    pools: Pool[];
    defaultPool: Pool | null;
    refetchBalance: () => void;
    refetchCredits: () => void;
    refetchPoolList: () => void;
}>(null as never);

export interface Pool {
    name: string;
    staking_capacity: string;
    created_at: string;
    creator: string;
    started_at: string;
    pool_id: string;
    image_url: string;
    description: string;
    rewards_amount: string;
    apr: number;
    cur_staking: string;
}

export function useBalance() {
    const { activeAddress } = useWallet();
    const { execute: getPoolList, data: poolList } = useAO<{pools: Record<string, Pool>}>(ANPM_POOL_MGR, "Get-Pool-List", "dryrun", {});
    const { execute: getBalance, data: balance } = useAO<string>(APUS_ADDRESS.Mint, "Balance", "dryrun", {});
    const { execute: getUndistributedCredits, data: credits } = useAO<{
        user: string;
        balance: string;
    }>(ANPM_POOL_MGR, "Get-Undistributed-Credits", "dryrun", {});
  
    useEffect(() => {
      if (!activeAddress) return;
      getBalance({ Recipient: activeAddress });
      getUndistributedCredits({ Recipient: activeAddress });
      getPoolList({ Recipient: activeAddress });
    }, [activeAddress, getBalance, getPoolList, getUndistributedCredits]);

    const pools = Object.values(poolList?.pools || {})

    const refetchBalance = useCallback(() => {
        if (!activeAddress) return;
        getBalance({ Recipient: activeAddress });
    }, [activeAddress, getBalance]);

    const refetchCredits = useCallback(() => {
        if (!activeAddress) return;
        getUndistributedCredits({ Recipient: activeAddress });
    }, [activeAddress, getUndistributedCredits]);

    const refetchPoolList = useCallback(() => {
        if (!activeAddress) return;
        getPoolList({ Recipient: activeAddress });
    }, [activeAddress, getPoolList]);

    return {
        balance: balance || '0',
        credits: credits?.balance || '0',
        refetchBalance,
        refetchCredits,
        pools: pools,
        refetchPoolList,
        defaultPool: pools.length > 0 ? pools[0] : null,
    }
}