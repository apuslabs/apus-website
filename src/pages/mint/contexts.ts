import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { message as messageUI } from "antd";
import dayjs from "dayjs";
import { ethers, BigNumber } from "ethers";
import { AO_MINT_PROCESS, APUS_MINT_PROCESS } from "../../utils/config";
import { EthWalletContext } from "../../contexts/ethwallet";
import { getDataFromMessage, useAO } from "../../utils/ao";
import { sendEthMessage } from "../../utils/ethHelpers";

interface AllocationItem {
  Recipient: string;
  Amount: BigNumber;
}

type Allocation = AllocationItem[];

type TokenType = "stETH" | "DAI";

function multiplyBigNumberWithDecimal(bigNumber: BigNumber, decimal: number, precision = 18) {
  const decimalInt = ethers.utils.parseUnits(decimal.toString(), precision);
  return bigNumber.mul(decimalInt).div(ethers.BigNumber.from(10).pow(precision));
}

function divideBigNumbers(a: BigNumber, b: BigNumber, precision = 18): number {
  return Number(ethers.utils.formatUnits(a, precision)) / Number(ethers.utils.formatUnits(b, precision));
}

function getBalanceOfAllocation(allocations: Allocation, recipient?: string) {
  if (!recipient) {
    return allocations.reduce((acc, a) => acc.add(BigNumber.from(a.Amount)), BigNumber.from(0));
  }
  return allocations.find((a) => a.Recipient === recipient)?.Amount || BigNumber.from(0);
}

export function useAOMint() {
  const { walletAddress } = useContext(EthWalletContext);
  const {
    result: balanceResult,
    loading: balanceLoading,
    execute: getBalance,
  } = useAO(APUS_MINT_PROCESS, "User.Balance", "dryrun");
  const {
    result: estimatedApusToken,
    loading: estimatedApusTokenLoading,
    execute: getEstimatedApusToken,
  } = useAO(APUS_MINT_PROCESS, "User.Get-Estimated-Apus-Token", "dryrun");
  const {
    result: userEstimatedApusToken,
    loading: userEstimatedApusTokenLoading,
    execute: getUserEstimatedApusToken,
  } = useAO(APUS_MINT_PROCESS, "User.Get-User-Estimated-Apus-Token", "dryrun");

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const fetchEstimatedApusToken = useCallback(
    (amount: BigNumber, tokenType: string) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        getEstimatedApusToken({
          Amount: amount.toString(),
          Token: tokenType,
        });
      }, 1000);
    },
    [getEstimatedApusToken, debounceTimeout],
  );

  useEffect(() => {
    if (walletAddress) {
      getBalance({ Recipient: walletAddress });
      getUserEstimatedApusToken({ Recipient: walletAddress });
    }
  }, [getBalance, getUserEstimatedApusToken, walletAddress]);

  const [tokenType, setTokenType] = useState<TokenType>();
  const [allocations, setAllocations] = useState<Allocation>([]);
  const apusAllocationBalance = useMemo(() => getBalanceOfAllocation(allocations, APUS_MINT_PROCESS), [allocations]);
  const userAllocationBalance = useMemo(
    () => getBalanceOfAllocation(allocations).sub(getBalanceOfAllocation(allocations, APUS_MINT_PROCESS)),
    [allocations],
  );

  const check = useCallback(
    (showError?: boolean) => {
      if (!walletAddress) {
        if (showError) {
          messageUI.error("Please connect your wallet");
        }
        return false;
      }
      if (!tokenType) {
        if (showError) {
          messageUI.error("Please select token type");
        }
        return false;
      }
      return true;
    },
    [tokenType, walletAddress],
  );

  const fetchAllocations = useCallback(async () => {
    if (!check()) {
      return;
    }
    const retMessage = await sendEthMessage(walletAddress!, {
      process: AO_MINT_PROCESS,
      tags: [
        { name: "Action", value: "User.Get-Allocation" },
        { name: "Token", value: tokenType! },
      ],
      data: dayjs().unix().toFixed(0),
    });
    const dataStr = getDataFromMessage<string>(retMessage);
    console.log("Allocations", dataStr);
    if (!dataStr) {
      setAllocations([]);
    } else {
      const data: Allocation = JSON.parse(dataStr);
      setAllocations(data.map((a) => ({ ...a, Amount: BigNumber.from(a.Amount) })));
    }
  }, [check, walletAddress, tokenType]);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  const updateAllocations = useCallback(
    async (newAllocations: Allocation) => {
      if (!check(true)) {
        return;
      }
      await sendEthMessage(walletAddress!, {
        process: AO_MINT_PROCESS,
        tags: [
          { name: "Action", value: "User.Update-Allocation" },
          { name: "Token", value: tokenType! },
        ],
        data: JSON.stringify(newAllocations.map((a) => ({ ...a, Amount: a.Amount.toString() }))),
      });
    },
    [check, walletAddress, tokenType],
  );

  const increaseStaking = useCallback(
    async (arAddress: string, increasedAmount: string, currentAmount: string) => {
      if (!check(true)) {
        return;
      }
      await sendEthMessage(walletAddress!, {
        process: APUS_MINT_PROCESS,
        tags: [
          { name: "Action", value: "User.Increase-Staking" },
          { name: "Token", value: tokenType! },
        ],
        data: JSON.stringify({ arAddress, increasedAmount, currentAmount }),
      });
    },
    [check, walletAddress, tokenType],
  );

  const decreaseStaking = useCallback(
    async (arAddress: string, decreasedAmount: string, currentAmount: string) => {
      if (!check(true)) {
        return;
      }
      await sendEthMessage(walletAddress!, {
        process: APUS_MINT_PROCESS,
        tags: [
          { name: "Action", value: "User.Decrease-Staking" },
          { name: "Token", value: tokenType! },
        ],
        data: JSON.stringify({ arAddress, decreasedAmount, currentAmount }),
      });
    },
    [check, walletAddress, tokenType],
  );

  const increaseApusAllocation = useCallback(
    async (amount: BigNumber, arAddress: string) => {
      if (amount.gt(userAllocationBalance)) {
        messageUI.error("Insufficient balance");
        return;
      }
      const reduceRatio = divideBigNumbers(amount, userAllocationBalance);
      const userAllocations = allocations.filter((a) => a.Recipient !== APUS_MINT_PROCESS);
      let totalReduced = BigNumber.from(0);
      for (let i = 0; i < userAllocations.length; i++) {
        const a = userAllocations[i];
        const reduced = multiplyBigNumberWithDecimal(BigNumber.from(a.Amount), reduceRatio);
        totalReduced = totalReduced.add(reduced);
        a.Amount = a.Amount.sub(reduced);
      }
      const newAllocations = [
        ...userAllocations,
        { Recipient: APUS_MINT_PROCESS, Amount: apusAllocationBalance.add(totalReduced) },
      ];

      await updateAllocations(newAllocations);
      await increaseStaking(arAddress, totalReduced.toString(), apusAllocationBalance.add(totalReduced).toString());
      await fetchAllocations();
      await getUserEstimatedApusToken();
    },
    [
      userAllocationBalance,
      allocations,
      apusAllocationBalance,
      updateAllocations,
      increaseStaking,
      fetchAllocations,
      getUserEstimatedApusToken,
    ],
  );

  const decreaseApusAllocation = useCallback(
    async (amount: BigNumber, arAddress: string) => {
      if (amount.gt(apusAllocationBalance)) {
        messageUI.error("Insufficient balance");
        return;
      }
      const userAllocations = allocations.filter((a) => a.Recipient !== APUS_MINT_PROCESS);
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
        { Recipient: APUS_MINT_PROCESS, Amount: apusAllocationBalance.sub(totalIncreased) },
      ];
      await updateAllocations(newAllocations);
      await decreaseStaking(arAddress, totalIncreased.toString(), apusAllocationBalance.sub(totalIncreased).toString());
      await fetchAllocations();
      await getUserEstimatedApusToken();
    },
    [
      apusAllocationBalance,
      allocations,
      userAllocationBalance,
      updateAllocations,
      decreaseStaking,
      fetchAllocations,
      getUserEstimatedApusToken,
    ],
  );

  return {
    apus: getDataFromMessage<number>(balanceResult),
    balanceLoading,
    getBalance,
    userEstimatedApusToken: getDataFromMessage<number>(userEstimatedApusToken),
    userEstimatedApusTokenLoading,
    getUserEstimatedApusToken,
    estimatedApus: getDataFromMessage<number>(estimatedApusToken),
    estimatedApusTokenLoading,
    fetchEstimatedApusToken,
    tokenType,
    setTokenType,
    apusAllocationBalance,
    userAllocationBalance,
    increaseApusAllocation,
    decreaseApusAllocation,
  };
}
