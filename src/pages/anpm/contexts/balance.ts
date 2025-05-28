import { createContext } from "react";
import { useWallet } from "./anpm";
import { useQuery } from "@tanstack/react-query";
import { getBalance, getPoolList, getUserCredit, Pool } from "./request";

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
    const balanceQuery = useQuery({
        queryKey: ["balances", activeAddress],
        queryFn: () => getBalance(activeAddress || ""),
        enabled: !!(activeAddress),
    });

    const pools = poolListQuery.data || []

    return {
        balance: balanceQuery.data || '0',
        credits: creditQuery.data || '0',
        refetchBalance: balanceQuery.refetch,
        refetchCredits: creditQuery.refetch,
        pools,
        refetchPoolList: poolListQuery.refetch,
        defaultPool: pools?.[0] || null,
    }
}