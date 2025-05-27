import { createContext, useCallback, useEffect } from "react";
import { useWallet } from "./anpm";
import { useAO } from "../../../utils/ao";
import { APUS_ADDRESS } from "../../../utils/config";
import { useQuery } from "@tanstack/react-query";
import { getPoolList, getUserCredit, Pool } from "./request";

export const BalanceContext = createContext<{
    balance: string;
    credits: string;
    pools: Pool[];
    defaultPool: Pool | null;
    refetchBalance: () => void;
    refetchCredits: () => void;
    refetchPoolList: () => void;
}>(null as never);

export function useBalance() {
    const { activeAddress } = useWallet();
    const poolListQuery = useQuery({ 
        queryKey: ['poolList'], 
        queryFn: () => getPoolList()
    });
    const creditQuery = useQuery({ 
        queryKey: ['credit', activeAddress || ""], 
        queryFn: () => getUserCredit(activeAddress || ""), 
        enabled: activeAddress !== undefined
    });
    const { execute: getBalance, data: Balance } = useAO<string>(APUS_ADDRESS.Mint, "Balance", "dryrun", {});
  
    useEffect(() => {
      if (!activeAddress) return;
      getBalance({ Recipient: activeAddress });
    }, [activeAddress, getBalance]);

    const refetchBalance = useCallback(() => {
        if (!activeAddress) return;
        getBalance({ Recipient: activeAddress });
    }, [activeAddress, getBalance]);

    const pools = poolListQuery.data || []

    return {
        balance: Balance || '0',
        credits: creditQuery.data || '0',
        refetchBalance,
        refetchCredits: creditQuery.refetch,
        pools,
        refetchPoolList: poolListQuery.refetch,
        defaultPool: pools?.[0] || null,
    }
}