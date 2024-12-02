import { useCallback, useEffect, useMemo, useState } from "react";
import { message as messageUI } from "antd";
import dayjs from "dayjs";
import { ethers, BigNumber } from "ethers";
import { AO_MINT_PROCESS, APUS_MINT_PROCESS } from "../../utils/config";
import { getDataFromMessage, useAO } from "../../utils/ao";
import { sendEthMessage } from "../../utils/ethHelpers";
import { useConnectWallet } from "@web3-onboard/react";

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
  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts?.[0]?.address;
  const {
    result: balanceResult,
    loading: balanceLoading,
    execute: getBalance,
  } = useAO(APUS_MINT_PROCESS, "User.Balance", "dryrun");
  const { result: recipientResult, execute: getRecipient } = useAO(APUS_MINT_PROCESS, "User.Get-Recipient", "dryrun");
  const { execute: updateRecipient } = useAO(APUS_MINT_PROCESS, "User.Update-Recipient", "message");

  useEffect(() => {
    if (walletAddress) {
      getBalance({ Recipient: walletAddress });
      getRecipient({ User: walletAddress });
    }
  }, [getBalance, getRecipient, walletAddress]);

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

  const increaseApusAllocation = useCallback(
    async (amount: BigNumber) => {
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
      await fetchAllocations();
    },
    [userAllocationBalance, allocations, apusAllocationBalance, updateAllocations, fetchAllocations],
  );

  const decreaseApusAllocation = useCallback(
    async (amount: BigNumber) => {
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
      await fetchAllocations();
    },
    [apusAllocationBalance, allocations, userAllocationBalance, updateAllocations, fetchAllocations],
  );

  return {
    apus: getDataFromMessage<number>(balanceResult),
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
  };
}
