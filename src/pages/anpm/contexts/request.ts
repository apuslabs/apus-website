import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { ANPM_DEFAULT_POOL, ANPM_POOL_MGR, APUS_ADDRESS } from "../../../utils/config";
import { getHBCache, handleApusMessage, requestHB } from "../../../utils/hb";

export function buyCredit(quantity: string): Promise<MessageResult> {
    return requestHB<MessageResult>(APUS_ADDRESS.Mint, {
        Action: "Transfer",
        Recipient: ANPM_POOL_MGR,
        Quantity: quantity,
        ["X-AN-Reason"]: "Buy-Credit",
    })
}

export function chargeCredit(quantity: string, pool_id = ANPM_DEFAULT_POOL): Promise<unknown> {
    return requestHB<MessageResult>(ANPM_POOL_MGR, {
        Action: "Add-Credit",
        PoolId: pool_id,
        Quantity: quantity,
    }).then(handleApusMessage)
}

export function withdrawCredit(quantity: string, pool_id = ANPM_DEFAULT_POOL): Promise<unknown> {
    return requestHB<MessageResult>(pool_id, {
        Action: "Transfer-Credits",
        Quantity: quantity,
    }).then(handleApusMessage)
}

export function stake(quantity: string, pool_id = ANPM_DEFAULT_POOL): Promise<MessageResult> {
    return requestHB(APUS_ADDRESS.Mint, {
        Action: "Transfer",
        Recipient: ANPM_POOL_MGR,
        Quantity: quantity,
        ["X-AN-Reason"]: "Stake",
        ["X-PoolId"]: pool_id,
    })
}

export function unstake(quantity: string, pool_id = ANPM_DEFAULT_POOL): Promise<unknown> {
    return requestHB<MessageResult>(ANPM_POOL_MGR, {
        Action: "UnStake",
        PoolId: pool_id,
        Quantity: quantity,
    }).then(handleApusMessage);
}

export function getUserCredit(user: string): Promise<string> {
    return getHBCache<Record<string, string>>(ANPM_DEFAULT_POOL, "credits").then(creditMap => creditMap[user] || "0");
}


export function getUserStake(user: string, pool_id: string): Promise<string> {
    return getHBCache<Record<string, Record<string, string>>>(ANPM_POOL_MGR, "stakers").then(stakeMap => stakeMap?.[user]?.[pool_id] || "0");
}

export function getPoolMgrInfo(): Promise<{
    credit_exchange_rate: string;
}> {
    return getHBCache<Record<string, string>>(ANPM_POOL_MGR, "process_info").then(info => {
        return {
            credit_exchange_rate: info.credit_exchange_rate || "0",
        };
    });
}

export interface Pool {
    pool_id: string;
    creator: string;
    staking_capacity: string;
    rewards_amount: string;
    created_at: string;
    started_at: string;
    cur_staking: string;
    name: string;
    apr: number;
    description: string;
    image_url: string;
}

export function getPoolList(): Promise<Pool[]> {
    return getHBCache<Record<string, Pool>>(ANPM_POOL_MGR, "pools").then(res => Object.values(res))
}
