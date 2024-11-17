import { useEffect } from "react";
import { getDataFromMessage, useAO } from "../../utils/ao";
import { AO_MINT_PROCESS, TOKEN_PROCESS } from "../../utils/config";
import { useArweaveContext } from "../../contexts/arconnect";

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
  const { activeAddress } = useArweaveContext();
  const {
    result: balanceResult,
    loading: balanceLoading,
    execute: getBalance,
  } = useAO(TOKEN_PROCESS, "Balance", "dryrun");
  const {
    result: allocationsResult,
    loading: allocationLoading,
    execute: getAllocations,
  } = useAO(AO_MINT_PROCESS, "Deposit.Get-Allocations", "message");

  useEffect(() => {
    getBalance();
    getAllocations({ Token: "DAI" });
  }, [getBalance, getAllocations]);
  return {
    apus: getDataFromMessage(balanceResult),
    monthlyProjection: 10.1,
    allocations: getDataFromMessage(allocationsResult),
  };

  // const { result, execute } = useAO(activeAddress || "", "Eval", "dryrun");
  // useEffect(() => {
  //   if (activeAddress) {
  //     execute({}, "Inbox[#Inbox]");
  //   }
  // }, [activeAddress, execute]);
  // console.log(result);
}
