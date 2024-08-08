import { useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime' // ES 2015
import { useArweaveContext } from "./arconnect";
import { useDryrunWrapper, useMessageWrapper } from "../utils/ao";
import { BENCHMARK_PROCESS, EMBEDDING_PROCESS } from "../config/process";
dayjs.extend(relativeTime);

export interface PoolInfo {
  title: string
  prize_pool: number
  // TODO: end_time, start_time
  meta_data: {
    competition_time: {
      start: number
      end: number
    }
    fine_tuning_tutorial_link: string
    description: string
    video: string
  }
}

const DefaultPoolInfo = {
  title: "",
  prize_pool: 0,
  meta_data: JSON.stringify({
    // TODO: update
    competition_time: {
      start: 0,
      end: 0,
    },
    fine_tuning_tutorial_link: "",
    description: "",
    video: "",
  })
}

export interface Dashboard {
  participants: number
  granted_reward: number
  my_rank: number
  my_reward: number
}

const DefaultDashboard = {
  participants: -1,
  granted_reward: -1,
  my_rank: -1,
  my_reward: -1,
}

export interface Leaderboard {
  rank: number
  dataset_id: number
  dataset_name: string
  dataset_upload_time: number
  score: number
  author: string
  granted_reward: number
}

const useBenchmarkMessage = useMessageWrapper(BENCHMARK_PROCESS)
const useBenchmarkDryrun = useDryrunWrapper(BENCHMARK_PROCESS)

export function useCompetitionPool() {
  const { activeAddress } = useArweaveContext()

  const { result: poolInfoResult, loading: poolInfoLoading, error: poolInfoError, msg: getPool } = useBenchmarkDryrun("Get-Pool")
  // TODO: useDryrun
  const { result: dashboardResult, loading: dashboardLoading, error: dashboardError, msg: getDashboard } = useBenchmarkDryrun("Get-Dashboard")
  // TODO: useDryrun
  const { result: leaderboardResult, loading: leaderboardLoading, error: leaderboardError, msg: getLeaderboard } = useBenchmarkDryrun("Get-Leaderboard")
  const { result: joinPoolResult, loading: joinPoolLoading, error: joinPoolError, msg: joinPool } = useBenchmarkMessage("Join-Pool")

  useEffect(() => {
    getPool({}, { pool_id: 1})
    if (activeAddress) {
      getDashboard({ FromAddress: activeAddress })
      getLeaderboard({ FromAddress: activeAddress })
    }
  }, [activeAddress])

  const poolInfoMsg = poolInfoResult?.Messages?.[0]?.Data || JSON.stringify(DefaultPoolInfo)
  const dashboardMsg = dashboardResult?.Messages?.[0]?.Data || JSON.stringify(DefaultDashboard)
  const leaderboardMsg = leaderboardResult?.Messages?.[0]?.Data || "[]"

  const poolInfo: PoolInfo = JSON.parse(poolInfoMsg)
  const dashboard: Dashboard = JSON.parse(dashboardMsg)
  const leaderboard: Leaderboard[] = JSON.parse(leaderboardMsg)

  // TODO: remove this
  poolInfo.meta_data = JSON.parse(poolInfo.meta_data as any || DefaultPoolInfo.meta_data)
  
  const startTime= dayjs.unix(poolInfo.meta_data.competition_time.start)
  const endTime = dayjs.unix(poolInfo.meta_data.competition_time.end)
  const isPoolStarted = startTime.isBefore(Date.now())
  const poolStartCountdown = dayjs.unix(poolInfo.meta_data.competition_time.start).fromNow(true)
  const isPoolEnded = endTime.isBefore(Date.now())
  const poolEndCountdown = dayjs.unix(poolInfo.meta_data.competition_time.end).fromNow(true)
  const poolOpening = isPoolStarted && !isPoolEnded

  const quickBtnText = poolOpening ? "Join Competition" : isPoolEnded ? "Competition Completed" : `Starts in ${poolStartCountdown}`
  const timeTips = !isPoolStarted ? `Starts in ${poolStartCountdown}` : poolOpening ? `Ends in ${poolEndCountdown}` : `Ends in ${poolEndCountdown} ago`

  const stage = !isPoolStarted ? "Unplayed" : poolOpening ? "Active" : "Completed"

  const quickBtnOnClick = (setJoinCompetitionModalVisible: (visible: boolean) => void) => {
    if (!poolOpening) return
    setJoinCompetitionModalVisible(true)
  }

  return {
    poolInfo,
    poolInfoLoading,
    poolInfoError,
    getPool,
    dashboard,
    dashboardLoading,
    dashboardError,
    getDashboard,
    leaderboard,
    leaderboardLoading,
    leaderboardError,
    getLeaderboard,
    joinPoolResult,
    joinPoolLoading,
    joinPoolError,
    joinPool,
    isPoolStarted,
    isPoolEnded,
    poolOpening,
    quickBtnText,
    quickBtnOnClick,
    timeTips: poolInfoLoading ? "" : timeTips,
    stage,
  }
}

const useEmbeddingMessage = useMessageWrapper(EMBEDDING_PROCESS)

interface DatasetItem {
  content: string
  meta?: Record<string, any>
}

export function useEmbedding() {
  const { result: createDatasetResult, loading: createDatasetLoading, error: createDatasetError, msg } = useEmbeddingMessage("Create-Dataset")

  const createDataset = (hash: string, list: DatasetItem[]) => msg({}, {hash, list})

  return {
    createDatasetResult,
    createDatasetLoading,
    createDatasetError,
    createDataset
  }
}