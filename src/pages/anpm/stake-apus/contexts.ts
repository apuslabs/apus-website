import { useCallback, useEffect, useState } from "react";
import { useWallet } from "../contexts/anpm";
import { useAO } from "../../../utils/ao";
import { ANPM_POOL_MGR, APUS_ADDRESS } from "../../../utils/config";

interface StakeResponse {
    pool_id: string;
    current_stake: string;
    total_interest: string;
}

interface PoolStakeResponse {
    pool_id: string;
    total_stake: string;
    capacity: string;
}

export function useStake(refetchPoolList: () => void, refetchBalance: () => void) {
    const { activeAddress } = useWallet();
    const [poolID, setPoolID] = useState<string>('');
    const { execute: getStake, data: stakeRes } = useAO<StakeResponse>(ANPM_POOL_MGR, "Get-Staking", "dryrun");
    const {execute: getPoolStake, data: poolStakeRes } = useAO<PoolStakeResponse>(ANPM_POOL_MGR, "Get-Pool-Staking", "dryrun");
    const { execute: transferApus, loading: transfering } = useAO<string>(APUS_ADDRESS.Mint, "Transfer", "message");
    const { execute: unstakeApus, loading: unstaking } = useAO<string>(ANPM_POOL_MGR, "UnStake", "message");
    const [percent, setPercent] = useState(0);
    const onPercentChange = (value: number) => {
        setPercent(value);
    };

    const stake = useCallback(async (quantity: string) => {
        if (!activeAddress) return;
        await transferApus({
            Recipient: ANPM_POOL_MGR,
            Quantity: quantity,
            ["X-AN-Reason"]: "Stake",
            ["X-PoolId"]: poolID,
        });
        setPercent(0);
        getPoolStake({ Recipient: activeAddress, ["X-PoolId"]: poolID });
        getStake({ Recipient: activeAddress, PoolId: poolID });
        refetchBalance();
        refetchPoolList();
    }, [activeAddress, transferApus, poolID, getPoolStake, getStake, refetchPoolList, refetchBalance]);

    const unstake = useCallback(async (quantity: string) => {
        if (!activeAddress) return;
        await unstakeApus({
            PoolId: poolID,
            Quantity: quantity,
        });
        getPoolStake({ Recipient: activeAddress, ["X-PoolId"]: poolID });
        getStake({ Recipient: activeAddress, PoolId: poolID });
        refetchBalance();
        refetchPoolList();
    }, [activeAddress, unstakeApus, poolID, getPoolStake, getStake, refetchPoolList, refetchBalance]);

    useEffect(() => {
        if (!activeAddress) return;
        getPoolStake({ Recipient: activeAddress, ["X-PoolId"]: poolID });
        getStake({ Recipient: activeAddress, PoolId: poolID });
    }, [activeAddress, getPoolStake, getStake, poolID]);


    return {
        staked: stakeRes?.current_stake || '0',
        interest: stakeRes?.total_interest || '0',
        poolTotalStaked: poolStakeRes?.total_stake || '0',
        poolCapacity: poolStakeRes?.capacity || '0',
        setPoolID,
        poolID,
        stake,
        unstake,
        unstaking,
        transfering,
        percent,
        onPercentChange,
    }
}