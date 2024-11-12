import { useEffect } from "react";
import { getDataFromMessage, useAO } from "../../utils/ao";
import { AO_MINT_PROCESS, TOKEN_PROCESS } from "../../utils/config";

async function mockGetEstilimitedAPUS({ type, amount }: { type: "stETH" | "DAI"; amount: number }) {
  if (type === "stETH") {
    return amount * 0.5;
  } else if (type === "DAI") {
    return amount * 0.1;
  } else {
    return 0;
  }
}

export function useAOMint() {
  const {
    result: balanceResult,
    loading: balanceLoading,
    execute: getBalance,
  } = useAO(TOKEN_PROCESS, "Balance", "dryrun");
  const {
    result: allocationsResult,
    loading: allocationLoading,
    execute: getAllocations,
  } = useAO(AO_MINT_PROCESS, "Get-Allocations", "dryrun");

  useEffect(() => {
    getBalance();
    getAllocations({ Token: "DAI" });
  }, [getBalance, getAllocations]);
  return {
    apus: getDataFromMessage(balanceResult),
    monthlyProjection: 10.1,
    allocations: getDataFromMessage(allocationsResult),
  };
}
