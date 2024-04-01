import { useWallet } from '@solana/wallet-adapter-react'
import axios from 'axios'
import qs from 'qs'
import useSWR from 'swr'

export const solApiFetcher = axios.create({
    baseURL: 'https://solapi.apus.network',
    // baseURL: 'http://localhost:3000',
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
        refreshInterval: 5000,
    })
    return [gpuNodeList?.data ?? []]
}

export function useAgentList() {
    const {data: agentList} = useSWR<any>(`/agents`, solApiFetcher.get)
    return [agentList?.data ?? []]
}