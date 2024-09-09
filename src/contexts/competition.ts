import { useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // ES 2015
import { useArweaveContext } from "./arconnect";
import { dryrunWrapper, messageWrapper } from "../utils/ao";
import { POOL_PROCESS, EMBEDDING_PROCESS } from "../config/process";
import { message } from "antd";
dayjs.extend(relativeTime);

export interface PoolInfo {
  title: string;
  reward_pool: number;
  // TODO: end_time, start_time
  metadata: {
    competition_time: {
      start: number;
      end: number;
    };
    description: string;
    dataset: string;
    video: string;
  };
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
  }),
};

export interface Dashboard {
  participants: number;
  granted_reward: number;
  rank: number;
  rewarded_tokens: number;
}

const DefaultDashboard = {
  participants: -1,
  granted_reward: -1,
  rank: -1,
  rewarded_tokens: -1,
};

export interface Leaderboard {
  rank: number;
  dataset_hash: string;
  dataset_name: string;
  created_at: number;
  score: number;
  author: string;
  reward: number;
  progress: number;
}

const useBenchmarkMessage = messageWrapper(POOL_PROCESS);
const useBenchmarkDryrun = dryrunWrapper(POOL_PROCESS);

function resortLeaderboard(leaderboard: Leaderboard[], activeAddress?: string) {
  return leaderboard.sort((a, b) => {
    if (a.author === activeAddress) return -1;
    if (b.author === activeAddress) return 1;
    return b.score - a.score;
  });
}

export function useCompetitionPool(
  poolID: string | undefined,
  onJoinPool: () => void,
) {
  const { activeAddress } = useArweaveContext();

  const {
    result: poolInfoResult,
    loading: poolInfoLoading,
    msg: getPool,
  } = useBenchmarkDryrun("Get-Competition");
  const {
    result: dashboardResult,
    loading: dashboardLoading,
    msg: getDashboard,
  } = useBenchmarkDryrun("Get-Dashboard");
  const {
    result: leaderboardResult,
    loading: leaderboardLoading,
    msg: getLeaderboard,
  } = useBenchmarkDryrun("Get-Leaderboard");
  const { msg: joinPool } = useBenchmarkMessage("Join-Pool");

  useEffect(() => {
    if (!poolID) return;
    getPool({}, poolID);
    getLeaderboard({ FromAddress: activeAddress ?? "" }, poolID);
    getDashboard({ FromAddress: activeAddress ?? "" }, poolID);
  }, [activeAddress, poolID]);

  const poolInfoMsg =
    poolInfoResult?.Messages?.[0]?.Data || JSON.stringify(DefaultPoolInfo);
  const dashboardMsg =
    dashboardResult?.Messages?.[0]?.Data || JSON.stringify(DefaultDashboard);
  const leaderboardMsg = leaderboardResult?.Messages?.[0]?.Data || "[]";

  const poolInfo: PoolInfo = JSON.parse(poolInfoMsg);
  const dashboard: Dashboard = JSON.parse(dashboardMsg);
  const leaderboard: Leaderboard[] = JSON.parse(leaderboardMsg);

  // TODO: remove this
  poolInfo.metadata = JSON.parse(
    (poolInfo.metadata as any) || DefaultPoolInfo.meta_data,
  );

  const startTime = dayjs.unix(poolInfo.metadata.competition_time.start);
  const endTime = dayjs.unix(poolInfo.metadata.competition_time.end);
  const isPoolStarted = startTime.isBefore(Date.now());
  const poolStartCountdown = startTime.fromNow(true);
  const isPoolEnded = endTime.isBefore(Date.now());
  const poolEndCountdown = endTime.fromNow(true);
  const poolOpening = isPoolStarted && !isPoolEnded;
  const hasSubmitted = leaderboard.some(
    (item) => item.author === activeAddress,
  );

  const quickBtnText = poolOpening
    ? hasSubmitted
      ? "Submitted"
      : "Join Competition"
    : isPoolEnded
      ? "Competition Completed"
      : `Starts in ${poolStartCountdown}`;
  const timeTips = !isPoolStarted
    ? `Starts in ${poolStartCountdown}`
    : poolOpening
      ? `Ends in ${poolEndCountdown}`
      : `Ends in ${poolEndCountdown} ago`;

  const stage = !isPoolStarted
    ? "Unplayed"
    : poolOpening
      ? "Active"
      : "Completed";

  let isQuickBtnDisabled =
    !poolOpening ||
    hasSubmitted ||
    leaderboardLoading ||
    dashboardLoading ||
    poolInfoLoading;
  const quickBtnOnClick = (
    setJoinCompetitionModalVisible: (visible: boolean) => void,
  ) => {
    if (isQuickBtnDisabled) return;
    setJoinCompetitionModalVisible(true);
  };

  const joinPoolRefresh = async (
    tags: Record<string, string>,
    data: Record<string, any>,
  ) => {
    if (leaderboard?.some((item) => item.dataset_name === data.dataset_name)) {
      message.error("Dataset name already exists");
      return;
    }
    await joinPool(tags, data);
    onJoinPool();
    if (activeAddress) {
      getDashboard({ FromAddress: activeAddress }, poolID);
      getLeaderboard({ FromAddress: activeAddress }, poolID);
    }
  };

  return {
    dashboard: dashboard,
    isPoolStarted,
    isQuickBtnDisabled,
    joinPool: joinPoolRefresh,
    leaderboard: resortLeaderboard(leaderboard, activeAddress),
    leaderboardLoading,
    poolInfo,
    quickBtnOnClick,
    quickBtnText,
    stage,
    timeTips: poolInfoLoading ? "" : timeTips,
  };
}

const useEmbeddingMessage = messageWrapper(EMBEDDING_PROCESS);

interface DatasetItem {
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: Record<string, any>;
}

export function useEmbedding() {
  const {
    result: createDatasetResult,
    loading: createDatasetLoading,
    error: createDatasetError,
    msg,
  } = useEmbeddingMessage("Create-Dataset");

  const createDataset = (hash: string, list: DatasetItem[]) =>
    msg({}, { hash, list });

  return {
    createDatasetResult,
    createDatasetLoading,
    createDatasetError,
    createDataset,
  };
}
