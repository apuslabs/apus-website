import { useEffect, useState } from "react";
import { benchmarkDryrun, benchmarkMsg, toString } from "../utils/ao";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime' // ES 2015
import { useArweaveContext } from "./arconnect";
dayjs.extend(relativeTime);


interface MessageResult<M> {
  Output: any;
  Messages: [M];
  Spawns: any[];
  Error?: any;
}

export function useMessage<Message = any>(Action: string, tags: Record<string, string>  = {}, data?: string | number | Record<string, any>) {
  const [result, setResult] = useState<MessageResult<Message>>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const msg = async () => {
    setLoading(true)
    try {
      const result = await benchmarkMsg({ ...tags, Action }, data)
      if (result == null) {
        throw new Error("No result")
      }
      if (result.Error) {
        setError(toString(result.Error))
      }
      setResult(result as any)
    } catch (e) {
      setError(toString(e))
    } finally {
      setLoading(false)
    }
  }
  
  return {
    result,
    loading,
    error,
    msg,
  }
}

export function useDryrun<Message = any>(Action: string, tags: Record<string, string> = {}, data?: string | number | Record<string, any>) {
  const [result, setResult] = useState<MessageResult<Message>>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const msg = async () => {
    setLoading(true)
    try {
      const result = await benchmarkDryrun({ ...tags, Action }, data)
      if (result == null) {
        throw new Error("No result")
      }
      if (result.Error) {
        setError(toString(result.Error))
      }
      setResult(result as any)
    } catch (e) {
      setError(toString(e))
    } finally {
      setLoading(false)
    }
  }
  
  return {
    result,
    loading,
    error,
    msg,
  }
}

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

export function useCompetitionPool(
  setJoinCompetitionModalVisible: (visible: boolean) => void,
  setShowMore: (visible: boolean) => void,
) {
  const { activeAddress } = useArweaveContext()

  const { result: poolInfoResult, loading: poolInfoLoading, error: poolInfoError, msg: getPool } = useDryrun("Get-Pool", {}, { pool_id: 1})
  // TODO: useDryrun
  const { result: dashboardResult, loading: dashboardLoading, error: dashboardError, msg: getDashboard } = useMessage("Get-Dashboard")
  // TODO: useDryrun
  const { result: leaderboardResult, loading: leaderboardLoading, error: leaderboardError, msg: getLeaderboard } = useMessage("Get-Leaderboard")
  const { result: joinPoolResult, loading: joinPoolLoading, error: joinPoolError, msg: joinPool } = useMessage("Join-Pool")

  useEffect(() => {
    if (activeAddress) {
      getPool()
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

  const quickBtnOnClick = () => {
    if (!poolOpening) return
    setJoinCompetitionModalVisible(true)
  }

  useEffect(() => {
    if (!isPoolStarted) {
      setShowMore(true)
    }
  }, [isPoolStarted])

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