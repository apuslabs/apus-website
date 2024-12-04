import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { ethers, BigNumber } from "ethers";
import { AO_MINT_PROCESS, APUS_MINT_PROCESS } from "../../utils/config";
import { getDataFromMessage, useAO, useEthMessage } from "../../utils/ao";
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

function getBalanceOfAllocation(allocations?: Allocation, recipient?: string) {
  if (!recipient) {
    return allocations?.reduce((acc, a) => acc.add(BigNumber.from(a.Amount)), BigNumber.from(0)) || BigNumber.from(0);
  }
  return allocations?.find((a) => a.Recipient === recipient)?.Amount || BigNumber.from(0);
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
  // const { data: userEstimatedApus, execute: getUserEstimatedApus, loading: loadingEstimate } = useEthMessage(TOKEN_MIRROR_PROCESS, "User.Get-Estimated-Apus-Token");

  useEffect(() => {
    if (walletAddress) {
      getBalance({ Recipient: walletAddress });
      getRecipient({ User: ethers.utils.getAddress(walletAddress) });
      // getUserEstimatedApus({}, {
      //   user: ethers.utils.getAddress(walletAddress),
      // });
    }
  }, [getBalance, getRecipient, walletAddress]);
  const { execute: sendUpdateRecipientMsg } = useEthMessage(APUS_MINT_PROCESS, "User.Update-Recipient");

  const updateRecipient = useCallback(
    async (recipient: string) => {
      sendUpdateRecipientMsg({ Recipient: recipient }, dayjs().unix());
    },
    [sendUpdateRecipientMsg],
  );

  const [tokenType, setTokenType] = useState<TokenType>();
  const {
    data: allocationsData,
    loading: allocationsLoading,
    execute: fetchAllocationsMsg,
  } = useEthMessage<string>(AO_MINT_PROCESS, "User.Get-Allocation");
  const allocations = useMemo(() => {
    if (allocationsData) {
      return JSON.parse(allocationsData).map((a: { Recipient: string; Amount: string }) => ({
        Recipient: a.Recipient,
        Amount: BigNumber.from(a.Amount),
      }));
    }
    return [];
  }, [allocationsData]);
  const apusAllocationBalance = useMemo(() => getBalanceOfAllocation(allocations, APUS_MINT_PROCESS), [allocations]);
  const userAllocationBalance = useMemo(
    () => getBalanceOfAllocation(allocations).sub(getBalanceOfAllocation(allocations, APUS_MINT_PROCESS)),
    [allocations],
  );

  const fetchAllocations = useCallback(async () => {
    if (tokenType) {
      fetchAllocationsMsg({ Token: tokenType }, dayjs().unix().toFixed(0));
    }
  }, [fetchAllocationsMsg, tokenType]);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

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

  const increaseApusAllocation = useCallback(
    async (amount: BigNumber) => {
      if (amount.gt(userAllocationBalance)) {
        throw new Error("Insufficient balance");
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
        throw new Error("Insufficient balance");
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
    allocationsLoading,
    // userEstimatedApus,
    // getUserEstimatedApus,
    // loadingEstimate,
  };
}
