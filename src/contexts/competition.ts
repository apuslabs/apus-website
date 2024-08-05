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
  competition_time: {
    endTime: number
    startTime: number
  }
  fine_tuning_tutorial_link: string
  description: string
  video: string
}

const DefaultPoolInfo = {
  title: "",
  prize_pool: 0,
  // TODO: update
  competition_time: '{"endTime":0,"startTime":0}',
  fine_tuning_tutorial_link: "",
  description: "",
  video: "",
}

export interface Dashboard {
  participants: number
  granted_reward: number
  my_rank: number
  my_reward: number
}

const DefaultDashboard = {
  participants: 0,
  granted_reward: 0,
  my_rank: 0,
  my_reward: 0,
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
  const { result: dashboardResult, loading: dashboardLoading, error: dashboardError, msg: getDashboard } = useBenchmarkMessage("Get-Dashboard")
  // TODO: useDryrun
  const { result: leaderboardResult, loading: leaderboardLoading, error: leaderboardError, msg: getLeaderboard } = useBenchmarkMessage("Get-Leaderboard")
  const { result: joinPoolResult, loading: joinPoolLoading, error: joinPoolError, msg: joinPool } = useBenchmarkMessage("Join-Pool")

  useEffect(() => {
    if (activeAddress) {
      getPool({}, { pool_id: 1})
      getDashboard()
      getLeaderboard()
    }
  }, [activeAddress])

  const poolInfoMsg = poolInfoResult?.Messages?.[0]?.Data ?? JSON.stringify(DefaultPoolInfo)
  const dashboardMsg = dashboardResult?.Messages?.[0]?.Data ?? JSON.stringify(DefaultDashboard)
  const leaderboardMsg = leaderboardResult?.Messages?.[0]?.Data ?? "[]"

  const poolInfo: PoolInfo = JSON.parse(poolInfoMsg)
  const dashboard: Dashboard = JSON.parse(dashboardMsg)
  const leaderboard: Leaderboard[] = JSON.parse(leaderboardMsg)

  // TODO: remove this
  poolInfo.competition_time = JSON.parse(poolInfo.competition_time as any)

  const isPoolStarted = Date.now() > poolInfo.competition_time.startTime
  const poolStartCountdown = dayjs(poolInfo.competition_time.startTime).fromNow(true)
  const isPoolEnded = Date.now() > poolInfo.competition_time.endTime
  const poolEndCountdown = dayjs(poolInfo.competition_time.endTime).fromNow(true)
  const poolOpening = isPoolStarted && !isPoolEnded

  const quickBtnText = poolOpening ? "Join Competition" : isPoolEnded ? "Competition Completed" : `Starts in ${poolStartCountdown}`
  const timeTips = !isPoolStarted ? `Starts in ${poolStartCountdown}` : poolOpening ? `Ends in ${poolEndCountdown}` : `Ends in ${poolEndCountdown} ago`

  const stage = !isPoolStarted ? "Upcoming" : poolOpening ? "Active" : "Completed"

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
    timeTips,
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