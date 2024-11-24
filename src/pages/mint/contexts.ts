import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getDataFromMessage, useAO } from "../../utils/ao";
import { AO_MINT_PROCESS, APUS_MINT_PROCESS, TOKEN_PROCESS } from "../../utils/config";
import { useArweaveContext } from "../../contexts/arconnect";
import { message, result } from "@permaweb/aoconnect";
import { EthWalletContext } from "../../contexts/ethwallet";
import { SendMessageArgs } from "@permaweb/aoconnect/dist/lib/message";
import { createData } from "@dha-team/arbundles";
import { EthereumSigner } from "./ethsigner";
import { message as messageUI } from "antd";
import dayjs from "dayjs";
import { ethers, BigNumber } from "ethers";

interface AllocationItem {
  Recipient: string;
  Amount: BigNumber;
}

type Allocation = AllocationItem[];

type TokenType = "stETH" | "DAI";

function multiplyBigNumberWithDecimal(bigNumber: BigNumber, decimal: number, precision = 18) {
  const decimalInt = ethers.utils.parseUnits(decimal.toString(), precision); // 小数转整数
  return bigNumber.mul(decimalInt).div(ethers.BigNumber.from(10).pow(precision)); // 整数运算后还原
}

function divideBigNumbers(a: BigNumber, b: BigNumber, precision = 18): number {
  return Number(ethers.utils.formatUnits(a, precision)) / Number(ethers.utils.formatUnits(b, precision));
}

export function useAOMint() {
  const { activeAddress } = useArweaveContext();
  const { walletAddress } = useContext(EthWalletContext);
  const {
    result: balanceResult,
    loading: balanceLoading,
    execute: getBalance,
  } = useAO(TOKEN_PROCESS, "Balance", "dryrun");
  const ethsigner = useMemo(() => {
    return new EthereumSigner(walletAddress || "");
  }, [walletAddress]);

  useEffect(() => {
    if (activeAddress) {
      getBalance();
    }
  }, [activeAddress, getBalance]);

  const ethMessage = useCallback(
    (args: Omit<SendMessageArgs, "signer">) => {
      if (!walletAddress) {
        throw new Error("Please connect your wallet");
      }
      return message({
        ...args,
        signer: async ({ data, tags, target, anchor }) => {
          console.log("EthRequest", tags, data);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dataItem = createData(data, ethsigner, { tags: tags as any, target, anchor });
          await dataItem.sign(ethsigner);
          return {
            id: dataItem.id,
            raw: await dataItem.getRaw(),
          };
        },
      });
    },
    [ethsigner, walletAddress],
  );

  const [tokenType, setTokenType] = useState<TokenType>();
  const [alloc, setAlloc] = useState<Allocation>([]);
  const apusAllocationBalance = useMemo(() => getBalanceOfAllocation(alloc, APUS_MINT_PROCESS), [alloc]);
  const userAllocationBalance = useMemo(
    () => getBalanceOfAllocation(alloc).sub(getBalanceOfAllocation(alloc, APUS_MINT_PROCESS)),
    [alloc],
  );

  const getAllocations = useCallback(async () => {
    if (!tokenType) {
      throw new Error("Please select token type");
    }
    try {
      await ethsigner.getPublicKey();
      const messageId = await ethMessage({
        process: AO_MINT_PROCESS,
        tags: [
          { name: "Action", value: "User.Get-Allocation" },
          { name: "Token", value: tokenType },
        ],
        data: dayjs().unix().toFixed(0),
      });
      const retMessage = await result({ process: AO_MINT_PROCESS, message: messageId });
      const dataStr = getDataFromMessage<string>(retMessage);
      console.log("Allocations", dataStr);
      if (!dataStr) {
        setAlloc([]);
      } else {
        const data: Allocation = JSON.parse(dataStr);
        setAlloc(data.map((a) => ({ ...a, Amount: BigNumber.from(a.Amount) })));
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        messageUI.error(e.message);
      } else {
        messageUI.error("Failed to get allocations");
      }
    }
  }, [ethMessage, ethsigner, tokenType]);

  useEffect(() => {
    getAllocations();
  }, [getAllocations]);

  const setAllocations = useCallback(
    async (allocations: Allocation) => {
      if (!tokenType) {
        throw new Error("Please select token type");
      }
      try {
        await ethsigner.getPublicKey();
        const messageId = await ethMessage({
          process: AO_MINT_PROCESS,
          tags: [
            { name: "Action", value: "User.Update-Allocation" },
            { name: "Token", value: tokenType },
          ],
          data: JSON.stringify(allocations.map((a) => ({ ...a, Amount: a.Amount.toString() }))),
        });
        await result({ process: AO_MINT_PROCESS, message: messageId });
      } catch (e: unknown) {
        if (e instanceof Error) {
          messageUI.error(e.message);
        } else {
          messageUI.error("Failed to update allocations");
        }
      }
    },
    [ethMessage, ethsigner, tokenType],
  );

  const increaseStaking = useCallback(
    async (ar_address: string, increased_amount: string, current_amount: string) => {
      if (!tokenType) {
        throw new Error("Please select token type");
      }
      try {
        await ethsigner.getPublicKey();
        const messageId = await ethMessage({
          process: APUS_MINT_PROCESS,
          tags: [
            { name: "Action", value: "User.Increase-Staking" },
            { name: "Token", value: tokenType },
          ],
          data: JSON.stringify({ ar_address, increased_amount, current_amount }),
        });
        await result({ process: APUS_MINT_PROCESS, message: messageId });
      } catch (e: unknown) {
        if (e instanceof Error) {
          messageUI.error(e.message);
        } else {
          messageUI.error("Failed to stake");
        }
      }
    },
    [ethMessage, ethsigner, tokenType],
  );

  const decreaseStaking = useCallback(
    async (ar_address: string, decreased_amount: string, current_amount: string) => {
      if (!tokenType) {
        throw new Error("Please select token type");
      }
      try {
        await ethsigner.getPublicKey();
        const messageId = await ethMessage({
          process: APUS_MINT_PROCESS,
          tags: [
            { name: "Action", value: "User.Decrease-Staking" },
            { name: "Token", value: tokenType },
          ],
          data: JSON.stringify({ ar_address, decreased_amount, current_amount }),
        });
        await result({ process: APUS_MINT_PROCESS, message: messageId });
      } catch (e: unknown) {
        if (e instanceof Error) {
          messageUI.error(e.message);
        } else {
          messageUI.error("Failed to unstake");
        }
      }
    },
    [ethMessage, ethsigner, tokenType],
  );

  const increaseApusAllocation = useCallback(
    async (amount: BigNumber, arAddress: string) => {
      if (amount.gt(userAllocationBalance)) {
        messageUI.error("Insufficient balance");
        return;
      }
      const reduceRatio = divideBigNumbers(amount, userAllocationBalance);
      // decrease user each allocation by ratio
      const userAllocations = alloc.filter((a) => a.Recipient !== APUS_MINT_PROCESS);
      let totalReduced = BigNumber.from(0);
      for (let i = 0; i < userAllocations.length; i++) {
        const a = userAllocations[i];
        const reduced = multiplyBigNumberWithDecimal(BigNumber.from(a.Amount), reduceRatio);
        totalReduced = totalReduced.add(reduced);
        a.Amount = a.Amount.sub(reduced);
      }
      const newAlloc = [
        ...userAllocations,
        { Recipient: APUS_MINT_PROCESS, Amount: apusAllocationBalance.add(totalReduced) },
      ];

      await setAllocations(newAlloc);
      await increaseStaking(arAddress, totalReduced.toString(), apusAllocationBalance.add(totalReduced).toString());
      await getAllocations();
    },
    [alloc, setAllocations, getAllocations, increaseStaking, userAllocationBalance, apusAllocationBalance],
  );

  const decreaseApusAllocation = useCallback(
    async (amount: BigNumber, arAddress: string) => {
      if (amount.gt(apusAllocationBalance)) {
        messageUI.error("Insufficient balance");
        return;
      }
      // return apus to user
      const userAllocations = alloc.filter((a) => a.Recipient !== APUS_MINT_PROCESS);
      const increaseRatio = divideBigNumbers(amount, userAllocationBalance);
      let totalIncreased = BigNumber.from(0);
      for (let i = 0; i < userAllocations.length; i++) {
        const a = userAllocations[i];
        const increased = multiplyBigNumberWithDecimal(BigNumber.from(a.Amount), increaseRatio);
        totalIncreased = totalIncreased.add(increased);
        a.Amount = a.Amount.add(increased);
      }
      const newAlloc = [
        ...userAllocations,
        { Recipient: APUS_MINT_PROCESS, Amount: apusAllocationBalance.sub(totalIncreased) },
      ];
      await setAllocations(newAlloc);
      await decreaseStaking(arAddress, totalIncreased.toString(), apusAllocationBalance.sub(totalIncreased).toString());
      await getAllocations();
    },
    [alloc, setAllocations, getAllocations, decreaseStaking, userAllocationBalance, apusAllocationBalance],
  );

  return {
    balanceLoading,
    apus: getDataFromMessage<number>(balanceResult),
    monthlyProjection: 10.1,
    getAllocations,
    setTokenType,
    tokenType,
    apusAllocationBalance: apusAllocationBalance,
    userAllocationBalance: userAllocationBalance,
    increaseApusAllocation,
    decreaseApusAllocation,
  };
}

function getBalanceOfAllocation(allocations: Allocation, recipient?: string) {
  if (!recipient) {
    return allocations.reduce((acc, a) => acc.add(BigNumber.from(a.Amount)), BigNumber.from(0));
  }
  return allocations.find((a) => a.Recipient === recipient)?.Amount || BigNumber.from(0);
}
