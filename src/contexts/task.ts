import { useWallet } from '@solana/wallet-adapter-react'
import { message } from 'antd'
import axios from 'axios'
import qs from 'qs'
import useSWR from 'swr'

console.log(import.meta.env)

export const solApiFetcher = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

solApiFetcher.interceptors.response.use(res => res, err => {
    if (!!err.response.data) {
        if (!!err.response.data.msg) {
            if (!!err.response.data.msg.message) {
                message.error(err.response.data.msg.message)
            } else {
                message.error(err.response.data.msg)
            }
        } else {
            message.error(err.response.data)
        }
    } else {
        message.error(err.response.statusText)
    }
})

export function useStatistics() {
    const {data: gpuCount} = useSWR<any>('/count-gpu-nodes', solApiFetcher.get, {
        refreshInterval: 5000,
        revalidateOnMount: false,
    })
    const {data: taskCount} = useSWR<any>('/count-tasks', solApiFetcher.get, {
        refreshInterval: 5000,
        revalidateOnMount: false,
    })
    const {data: agentCount} = useSWR<any>('/count-agents', solApiFetcher.get, {
        refreshInterval: 5000,
        revalidateOnMount: false,
    })
    const {data: payoutCount} = useSWR<any>('/count-payout', solApiFetcher.get, {
        refreshInterval: 5000,
        revalidateOnMount: false,
    })
    return {
        gpuCount: gpuCount?.data?.count ?? 0,
        taskCount: taskCount?.data?.count ?? 0,
        agentCount: agentCount?.data?.count ?? 0,
        payoutCount: payoutCount?.data?.payout ?? 0,
    }
}

export function useTaskList(taskId?: string) {
    const {data: taskList} = useSWR<any>(taskId ? `/tasks?task_id=${taskId}` : '/tasks', solApiFetcher.get)
    return [taskList?.data ?? []]
}

export function useGpuNodeList() {
    const {publicKey} = useWallet()
    const {data: gpuNodeList} = useSWR<any>(`/gpu-nodes?${qs.stringify({ owner: publicKey?.toBase58() })}`, solApiFetcher.get, {
        refreshInterval: 10000,
    })
    return [gpuNodeList?.data ?? []]
}

export function useAgentList() {
    const {data: agentList} = useSWR<any>(`/agents`, solApiFetcher.get)
    return [agentList?.data ?? []]
}