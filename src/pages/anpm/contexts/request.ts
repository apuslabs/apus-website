import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { ANPM_DEFAULT_POOL, ANPM_POOL_MGR, APUS_ADDRESS } from "../../../utils/config";
import { getHBCache, handleApusMessage, requestHB } from "../../../utils/hb";
import dayjs from "dayjs";

export function buyCredit(quantity: string): Promise<MessageResult> {
    return requestHB<MessageResult>(APUS_ADDRESS.Mint, {
        Action: "Transfer",
        Recipient: ANPM_POOL_MGR,
        Quantity: quantity,
        ["X-An-Reason"]: "Buy-Credit",
    })
}

export function chargeCredit(quantity: string, pool_id = ANPM_DEFAULT_POOL): Promise<unknown> {
    return requestHB<MessageResult>(ANPM_POOL_MGR, {
        Action: "Add-Credit",
        Poolid: pool_id,
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
        ["X-An-Reason"]: "Stake",
        ["X-Poolid"]: pool_id,
    })
}

export function unstake(quantity: string, pool_id = ANPM_DEFAULT_POOL): Promise<unknown> {
    return requestHB<MessageResult>(ANPM_POOL_MGR, {
        Action: "UnStake",
        Poolid: pool_id,
        Quantity: quantity,
    }).then(handleApusMessage);
}

export function addProcess(name: string, process_id: string): Promise<MessageResult> {
    return requestHB<MessageResult>(ANPM_DEFAULT_POOL, {
        Action: "Add-Processid",
    }, {
        process_id,
        name,
    });
}

export function removeProcess(process_id: string): Promise<MessageResult> {
    return requestHB<MessageResult>(ANPM_DEFAULT_POOL, {
        Action: "Remove-Processid",
    }, {
        process_id,
    });
}

export function getBalance(user: string): Promise<string> {
    return getHBCache<Record<string, string>>(APUS_ADDRESS.Mint, "balances").then(balanceMap => balanceMap[user] || "0");
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

export function getInterest(user: string): Promise<string> {
    return getHBCache<Record<string, string>>(ANPM_POOL_MGR, "distributed_interest").then(interestMap => interestMap[user] || "0");
}

interface Process {
    name: string;
    created_at: string;
    last_used: string;
    created_by: string;
}
export function getProcesses(user: string): Promise<(Process & { process_id: string })[]> {
    return getHBCache<Record<string, Process>>(ANPM_DEFAULT_POOL, "process_ids").then(processes => {
        return Object.entries(processes).filter(([, value]) => value.created_by === user).map(([key, value]) => (Object.assign(value, { process_id: key })));
    });
}

export interface Pool {
    name: string;
    description: string;
    pool_id: string;
    creator: string;
    rewards_amount: string;
    created_at: string;
    staking_start: string;
    staking_end: string;
    staking_capacity: string;
    cur_staking: string;
    apr: number;
    min_apr: string;
    image_url: string;
}

export function getPoolList(): Promise<Pool[]> {
    return getHBCache<Record<string, Pool>>(ANPM_POOL_MGR, "pools").then(res => Object.values(res))
}


export function addTask(prompt: string): Promise<string> {
    const ref = dayjs().valueOf().toString()
    return requestHB<MessageResult>(ANPM_DEFAULT_POOL, {
        Action: "Add-Task",
        ["X-Reference"]: ref,
    }, { prompt }).then(handleApusMessage).then(() => ref);
}

export interface AITask {
    ref: string;
    submitter: string;
    status: 'pending' | 'processing' | 'done';
    prompt: string;
    config?: string;
    resolve_node?: string;
    output?: string;
    created_at: string;
    updated_at: string;
}

export function getTask(ref: string): Promise<AITask | null> {
    if (!ref) return Promise.resolve(null);
    return getHBCache<AITask[]>(ANPM_DEFAULT_POOL, "tasks").then(tasks => {
        return tasks.find(task => task.ref === ref) ?? null;
    });
}
