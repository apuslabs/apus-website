import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { ethers, BigNumber } from "ethers";
import { AO_MINT_PROCESS, APUS_ADDRESS } from "../../utils/config";
import { getDataFromMessage, useAO, useEthMessage } from "../../utils/ao";
import { useConnectWallet } from "@web3-onboard/react";
import { useLocation } from "react-router-dom";
import Decimal from "decimal.js";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(duration);
dayjs.extend(relativeTime);

interface AllocationItem {
  Recipient: string;
  Amount: BigNumber;
}

type Allocation = AllocationItem[];

type TokenType = "stETH" | "DAI";

function multiplyBigNumberWithDecimal(bigNumber: BigNumber, decimal: number): BigNumber {
  return BigNumber.from(new Decimal(bigNumber.toString()).mul(new Decimal(decimal)).toFixed(0));
}

function divideBigNumbers(a: BigNumber, b: BigNumber): number {
  return new Decimal(a.toString()).div(new Decimal(b.toString())).toNumber();
}

function getBalanceOfAllocation(allocations?: Allocation, recipient?: string) {
  if (!recipient) {
    return allocations?.reduce((acc, a) => acc.add(BigNumber.from(a.Amount)), BigNumber.from(0)) || BigNumber.from(0);
  }
  return allocations?.find((a) => a.Recipient === recipient)?.Amount || BigNumber.from(0);
}

export function useParams() {
  const location = useLocation();
  const MintProcess = useMemo(
    () => new URLSearchParams(location.search).get("apus_process") || APUS_ADDRESS.Mint,
    [location],
  );
  const MirrorProcess = useMemo(
    () => new URLSearchParams(location.search).get("mirror_process") || APUS_ADDRESS.Mirror,
    [location],
  );
  const TGETime = useMemo(
    () => new URLSearchParams(location.search).get("tge_time") || "2024-12-12T09:00:00Z",
    [location],
  );
  return { MintProcess, MirrorProcess, TGETime };
}

export function useAOMint() {
  const { MintProcess, MirrorProcess } = useParams();
  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts?.[0]?.address;
  const {
    result: balanceResult,
    loading: balanceLoading,
    execute: getBalance,
  } = useAO(MintProcess, "User.Balance", "dryrun");
  const { result: recipientResult, execute: getRecipient } = useAO(MintProcess, "User.Get-Recipient", "dryrun");
  const {
    result: userEstimatedApus,
    execute: getUserEstimatedApus,
    loading: loadingUserEstimate,
  } = useAO(MirrorProcess, "User.Get-User-Estimated-Apus-Token", "dryrun");
  const {
    result: allocationResult,
    loading: allocationLoading,
    execute: getAllocation,
  } = useAO(AO_MINT_PROCESS, "User.Get-Allocation", "dryrun");

  const init = useCallback(async () => {
    if (walletAddress) {
      getBalance({ Recipient: ethers.utils.getAddress(walletAddress) });
      getRecipient({ User: ethers.utils.getAddress(walletAddress) });
      getUserEstimatedApus(
        {
          User: ethers.utils.getAddress(walletAddress),
        },
        dayjs().unix(),
      );
    }
  }, [getBalance, getRecipient, getUserEstimatedApus, walletAddress]);

  useEffect(() => {
    init();
  }, [init]);

  const { execute: sendUpdateRecipientMsg } = useEthMessage(MintProcess, "User.Update-Recipient");

  const updateRecipient = useCallback(
    async (recipient: string) => {
      sendUpdateRecipientMsg({ Recipient: recipient }, dayjs().unix());
      getRecipient({ User: ethers.utils.getAddress(walletAddress!) });
    },
    [getRecipient, sendUpdateRecipientMsg, walletAddress],
  );

  const [tokenType, setTokenType] = useState<TokenType>("stETH");
  const allocations = useMemo(() => {
    if (allocationResult) {
      const data: { Recipient: string; Amount: string }[] = JSON.parse(getDataFromMessage(allocationResult) || "[]");
      return data?.map((a) => ({
        Recipient: a.Recipient,
        Amount: BigNumber.from(a.Amount),
      }));
    }
    return [];
  }, [allocationResult]);
  const apusAllocationBalance = useMemo(
    () => getBalanceOfAllocation(allocations, MintProcess),
    [MintProcess, allocations],
  );
  const userAllocationBalance = useMemo(
    () => getBalanceOfAllocation(allocations).sub(getBalanceOfAllocation(allocations, MintProcess)),
    [MintProcess, allocations],
  );

  useEffect(() => {
    if (!walletAddress || !tokenType) {
      return;
    }
    getAllocation({ Owner: ethers.utils.getAddress(walletAddress), Token: tokenType });
  }, [getAllocation, walletAddress, tokenType]);

  const {
    result: estimatedApus,
    execute: getEstimatedApus,
    loading: loadingEstimate,
  } = useAO(MirrorProcess, "User.Get-Estimated-Apus-Token", "dryrun");

  useEffect(() => {
    if (tokenType) {
      getEstimatedApus(
        {
          Amount: (1e18).toString(),
          Token: tokenType,
        },
        dayjs().unix(),
      );
    }
  }, [getEstimatedApus, tokenType]);

  const { execute: updateAllocationsMsg } = useEthMessage(AO_MINT_PROCESS, "User.Update-Allocation");
  const updateAllocations = useCallback(
    async (newAllocations: Allocation) => {
      if (tokenType) {
        await updateAllocationsMsg(
          {
            Token: tokenType,
            _n: dayjs().unix().toFixed(0),
          },
          JSON.stringify(newAllocations.map((a) => ({ ...a, Amount: a.Amount.toString() }))),
        );
      }
    },
    [tokenType, updateAllocationsMsg],
  );

  const increaseApusAllocation = async (amount: BigNumber) => {
    if (amount.gt(userAllocationBalance)) {
      throw new Error("Insufficient balance");
    }
    const reduceRatio = divideBigNumbers(amount, userAllocationBalance);
    const userAllocations = allocations.filter((a) => a.Recipient !== MintProcess);
    let totalReduced = BigNumber.from(0);
    for (let i = 0; i < userAllocations.length; i++) {
      const a = userAllocations[i];
      const reduced = multiplyBigNumberWithDecimal(a.Amount, reduceRatio);
      totalReduced = totalReduced.add(reduced);
      a.Amount = a.Amount.sub(reduced);
    }
    const newAllocations = [
      ...userAllocations,
      { Recipient: MintProcess, Amount: apusAllocationBalance.add(totalReduced) },
    ];

    await updateAllocations(newAllocations);
    await getAllocation({ Owner: ethers.utils.getAddress(walletAddress!), Token: tokenType! });
  };

  const decreaseApusAllocation = async (amount: BigNumber) => {
    if (amount.gt(apusAllocationBalance)) {
      throw new Error("Insufficient balance");
    }
    const userAllocations = allocations.filter((a) => a.Recipient !== MintProcess);
    const increaseRatio = divideBigNumbers(amount, userAllocationBalance);
    let totalIncreased = BigNumber.from(0);
    for (let i = 0; i < userAllocations.length; i++) {
      const a = userAllocations[i];
      const increased = multiplyBigNumberWithDecimal(BigNumber.from(a.Amount), increaseRatio);
      totalIncreased = totalIncreased.add(increased);
      a.Amount = a.Amount.add(increased);
    }
    const newAllocations = [
      ...userAllocations,
      { Recipient: MintProcess, Amount: apusAllocationBalance.sub(totalIncreased) },
    ];
    await updateAllocations(newAllocations);
    await getAllocation({ Owner: ethers.utils.getAddress(walletAddress!), Token: tokenType! });
  };

  return {
    apus: getDataFromMessage<number>(balanceResult) || 0,
    balanceLoading,
    recipient: getDataFromMessage<string>(recipientResult),
    updateRecipient,
    getBalance,
    tokenType,
    setTokenType,
    apusAllocationBalance,
    userAllocationBalance,
    increaseApusAllocation,
    decreaseApusAllocation,
    allocationLoading,
    userEstimatedApus: getDataFromMessage<string>(userEstimatedApus) || "0",
    getUserEstimatedApus,
    loadingEstimate,
    estimatedApus: getDataFromMessage<string>(estimatedApus) || "0",
    loadingUserEstimate,
  };
}

export function useCountDate(date: string) {
  const [diff, setDiff] = useState(0);
  const day = useMemo(() => Math.floor(diff / 86400), [diff]);
  const hour = useMemo(() => Math.floor((diff % 86400) / 3600), [diff]);
  const minute = useMemo(() => Math.floor((diff % 3600) / 60), [diff]);
  const second = useMemo(() => Math.floor(diff % 60), [diff]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      const target = dayjs(date);
      const diff = target.diff(now, "second");
      setDiff(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

  return { day, hour, minute, second, duration: dayjs.duration(diff, "seconds").humanize() };
}
