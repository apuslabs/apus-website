import { useCallback, useEffect, useState } from "react";
import { useWallet } from "./anpm";
import { useAO } from "../../../utils/ao";
import { ANPM_DEFAULT_POOL, ANPM_POOL_MGR, APUS_ADDRESS } from "../../../utils/config";

interface StakeResponse {
    pool_id: string;
    current_stake: string;
}

interface PoolStakeResponse {
    pool_id: string;
    total_stake: string;
    capacity: string;
}

export function useStake() {
    const { activeAddress } = useWallet();
    const [poolID, setPoolID] = useState<string>(ANPM_DEFAULT_POOL.ID);
    const { execute: getStake, data: stakeRes } = useAO<StakeResponse>(ANPM_POOL_MGR, "Get-Staking", "dryrun");
    const {execute: getPoolStake, data: poolStakeRes } = useAO<PoolStakeResponse>(ANPM_POOL_MGR, "Get-Pool-Staking", "dryrun");
    const { execute: transferApus } = useAO<string>(APUS_ADDRESS.Mint, "Transfer", "message");

    const stake = useCallback((quantity: string) => {
        if (!activeAddress) return;
        return transferApus({
            Recipient: ANPM_POOL_MGR,
            Quantity: quantity,
            ["X-AN-Reason"]: "Stake",
            ["X-PoolId"]: poolID,
        });
    }, [activeAddress, transferApus, poolID]);
  
    useEffect(() => {
      if (!activeAddress) return;
      getStake({ Recipient: activeAddress, ["X-PoolId"]: poolID });
      getPoolStake({ ["X-PoolId"]: poolID });
    }, [activeAddress, getPoolStake, getStake, poolID]);

    return {
        staked: stakeRes?.current_stake || '0',
        poolTotalStaked: poolStakeRes?.total_stake || '0',
        poolCapacity: poolStakeRes?.capacity || '0',
        setPoolID,
        stake,
    }
}