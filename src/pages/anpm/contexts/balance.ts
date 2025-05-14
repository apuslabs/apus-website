import { createContext, useEffect } from "react";
import { useWallet } from "./anpm";
import { useAO } from "../../../utils/ao";
import { ANPM_POOL_MGR, APUS_ADDRESS } from "../../../utils/config";

export const BalanceContext = createContext<{
    balance: string;
    credits: string;
    refetchBalance: () => void;
    refetchCredits: () => void;
}>(null as never);

export function useBalance() {
    const { activeAddress } = useWallet();
    const { execute: getBalance, data: balance } = useAO<string>(APUS_ADDRESS.Mint, "Balance", "dryrun");
    const { execute: getUndistributedCredits, tags: creditsTags } = useAO(ANPM_POOL_MGR, "Get-Undistributed-Credits", "dryrun");
  
    useEffect(() => {
      if (!activeAddress) return;
      getBalance({ Recipient: activeAddress });
      getUndistributedCredits({ Recipient: activeAddress });
    }, [activeAddress, getBalance, getUndistributedCredits]);

    return {
        balance: balance || '0',
        credits: creditsTags?.Balance || '0',
        refetchBalance: () => getBalance({ Recipient: activeAddress! }),
        refetchCredits: () => getUndistributedCredits({ Recipient: activeAddress! }),
    }
}