import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { ethers, BigNumber } from "ethers";
import { AO_MINT_PROCESS, APUS_ADDRESS } from "../../utils/config";
import { getDataFromMessage, useAO, useEthMessage } from "../../utils/ao";
import { useLocation } from "react-router-dom";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { useLocalStorage } from "react-use";
dayjs.extend(duration);
dayjs.extend(relativeTime);

interface AllocationItem {
  Recipient: string;
  Amount: BigNumber;
}

type Allocation = AllocationItem[];

type TokenType = "stETH" | "DAI";

function getBalanceOfAllocation(allocations: Allocation, recipient?: string) {
  if (!recipient) {
    return allocations.reduce((acc, a) => acc.add(a.Amount), BigNumber.from(0));
  }
  return allocations.find((a) => a.Recipient === recipient)?.Amount || BigNumber.from(0);
}

function getAllocationFromMessage(message?: MessageResult): Allocation {
  try {
    const data: { Recipient: string; Amount: string }[] = JSON.parse(getDataFromMessage(message) || "[]");
    return data.map((a) => ({
      Recipient: a.Recipient,
      Amount: BigNumber.from(a.Amount),
    }));
  } catch {
    console.error("Failed to parse allocation message", message);
    return [];
  }
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

function getApusAllocation(msg?: MessageResult) {
  return getBalanceOfAllocation(getAllocationFromMessage(msg), APUS_ADDRESS.Recipient);
}

function getOtherAllocation(msg?: MessageResult) {
  return getBalanceOfAllocation(getAllocationFromMessage(msg)).sub(getApusAllocation(msg));
}

function getEstimatedApus(
  stETHEstimatedApus: BigNumber,
  daiEstimatedApus: BigNumber,
  apusStETHAllocation: BigNumber,
  apusDAIAllocation: BigNumber,
) {
  const stETHApus = apusStETHAllocation.mul(stETHEstimatedApus).div(BigNumber.from(10).pow(18));
  const daiApus = apusDAIAllocation.mul(daiEstimatedApus).div(BigNumber.from(10).pow(18));
  return {
    user: stETHApus.add(daiApus),
    stETH: stETHApus,
    dai: daiApus,
  };
}

export function useAOMint({
  wallet,
  MintProcess,
  MirrorProcess,
}: {
  wallet?: string;
  MintProcess: string;
  MirrorProcess: string;
}) {
  const [tokenType, setTokenType] = useState<TokenType>("stETH");
  const { data: apus, loading: loadingApus, execute: getApus } = useAO<string>(MintProcess, "User.Balance", "dryrun");
  // const {
  //   data: userEstimatedApus,
  //   loading: loadingUserEstimateApus,
  //   execute: getUserEstimatedApus,
  // } = useAO<string>(MirrorProcess, "User.Get-User-Estimated-Apus-Token", "dryrun");
  const {
    data: stETHEstimatedApus,
    loading: loadingStETHEstimatedApus,
    execute: getStETHEstimatedApus,
  } = useAO<string>(MirrorProcess, "User.Get-Estimated-Apus-Token", "dryrun");
  const {
    data: daiEstimatedApus,
    loading: loadingDaiEstimatedApus,
    execute: getDaiEstimatedApus,
  } = useAO<string>(MirrorProcess, "User.Get-Estimated-Apus-Token", "dryrun");
  const {
    result: stETHAllocationResult,
    loading: loadingStETHAllocation,
    execute: getStETHAllocation,
  } = useAO<string>(AO_MINT_PROCESS, "User.Get-Allocation", "dryrun");
  const {
    result: daiAllocationResult,
    loading: loadingDaiAllocation,
    execute: getDaiAllocation,
  } = useAO<string>(AO_MINT_PROCESS, "User.Get-Allocation", "dryrun");

  useEffect(() => {
    if (wallet) {
      getApus({ Recipient: ethers.utils.getAddress(wallet) });
      // getUserEstimatedApus({ User: ethers.utils.getAddress(wallet) }, dayjs().unix());
      getStETHAllocation({ Owner: ethers.utils.getAddress(wallet), Token: "stETH" });
      getDaiAllocation({ Owner: ethers.utils.getAddress(wallet), Token: "DAI" });
      getStETHEstimatedApus({ Amount: (1e18).toString(), Token: "stETH" }, dayjs().unix());
      getDaiEstimatedApus({ Amount: (1e18).toString(), Token: "DAI" }, dayjs().unix());
    }
  }, [getApus, getDaiAllocation, getDaiEstimatedApus, getStETHAllocation, getStETHEstimatedApus, wallet]);

  const { loading: loadingUpdateAllocation, execute: updateAllocationMsg } = useEthMessage(
    AO_MINT_PROCESS,
    "User.Update-Allocation",
  );
  const updateAllocation = useCallback(
    async (newAllocations: Allocation) => {
      if (tokenType) {
        await updateAllocationMsg(
          { Token: tokenType, _n: dayjs().unix().toFixed(0) },
          JSON.stringify(newAllocations.map((a) => ({ ...a, Amount: a.Amount.toString() }))),
        );
      }
    },
    [tokenType, updateAllocationMsg],
  );

  const refreshAfterAllocation = async () => {
    if (tokenType === "stETH") {
      await getStETHAllocation({ Owner: ethers.utils.getAddress(wallet!), Token: "stETH" });
    } else {
      await getDaiAllocation({ Owner: ethers.utils.getAddress(wallet!), Token: "DAI" });
    }
  };
  const getCurrentAllocation = async () => {
    const allocationResult = tokenType === "stETH" ? stETHAllocationResult : daiAllocationResult;
    return {
      allocation: getAllocationFromMessage(allocationResult),
      apus: getApusAllocation(allocationResult),
      other: getOtherAllocation(allocationResult),
    };
  };
  const increaseApusAllocation = async (amount: BigNumber) => {
    const { allocation, apus, other } = await getCurrentAllocation();
    if (amount.gt(other) || amount.lte(0)) {
      throw new Error("Insufficient balance");
    }
    const otherAllocation = allocation.filter((a) => a.Recipient !== APUS_ADDRESS.Recipient);
    // reduce other allocations one by one, until amount is satisfied
    let remaining = amount;
    for (let i = 0; i < otherAllocation.length; i++) {
      const a = otherAllocation[i];
      if (remaining.lte(0)) {
        break;
      }
      const reduced = a.Amount.gte(remaining) ? remaining : a.Amount;
      remaining = remaining.sub(reduced);
      a.Amount = a.Amount.sub(reduced);
    }
    const newAllocations = [...otherAllocation, { Recipient: APUS_ADDRESS.Recipient, Amount: apus.add(amount) }];
    await updateAllocation(newAllocations);
    refreshAfterAllocation();
  };

  const decreaseApusAllocation = async (amount: BigNumber, recipient: string) => {
    if (!recipient) {
      throw new Error("Recipient not set");
    }
    const { allocation, apus } = await getCurrentAllocation();
    if (amount.gt(apus) || amount.lte(0)) {
      throw new Error("Insufficient balance");
    }
    const otherAllocation = allocation.filter((a) => ![APUS_ADDRESS.Recipient, recipient].includes(a.Recipient));
    let recipientAllocation = allocation.find((a) => a.Recipient === recipient);
    if (recipientAllocation) {
      recipientAllocation.Amount = recipientAllocation.Amount.add(amount);
    } else {
      recipientAllocation = { Recipient: recipient, Amount: amount };
    }
    const newAllocations = [
      ...otherAllocation,
      recipientAllocation,
      { Recipient: APUS_ADDRESS.Recipient, Amount: apus.sub(amount) },
    ];
    await updateAllocation(newAllocations);
    refreshAfterAllocation();
  };

  const apusStETH = getApusAllocation(stETHAllocationResult);
  const apusDAI = getApusAllocation(daiAllocationResult);
  const otherStETH = getOtherAllocation(stETHAllocationResult);
  const otherDAI = getOtherAllocation(daiAllocationResult);
  const {
    user: userEstimatedApus,
    stETH: apusStETHEstimatedApus,
    dai: apusDAIEstimatedApus,
  } = getEstimatedApus(
    BigNumber.from(stETHEstimatedApus || 0),
    BigNumber.from(daiEstimatedApus || 0),
    apusStETH,
    apusDAI,
  );

  return {
    tokenType,
    setTokenType,
    apus: BigNumber.from(apus || 0),
    // userEstimatedApus,
    stETHEstimatedApus: BigNumber.from(stETHEstimatedApus || 0),
    daiEstimatedApus: BigNumber.from(daiEstimatedApus || 0),
    tokenEstimatedApus: BigNumber.from((tokenType === "stETH" ? stETHEstimatedApus : daiEstimatedApus) || 0),
    stETHAllocationResult,
    daiAllocationResult,
    loadingApus,
    // loadingUserEstimateApus,
    loadingStETHEstimatedApus,
    loadingDaiEstimatedApus,
    loadingTokenEstimatedApus: tokenType === "stETH" ? loadingStETHEstimatedApus : loadingDaiEstimatedApus,
    loadingStETHAllocation,
    loadingDaiAllocation,
    loadingTokenAllocation: tokenType === "stETH" ? loadingStETHAllocation : loadingDaiAllocation,
    loadingUpdateAllocation,
    increaseApusAllocation,
    decreaseApusAllocation,
    apusStETH,
    apusDAI,
    apusToken: tokenType === "stETH" ? apusStETH : apusDAI,
    otherStETH,
    otherDAI,
    otherToken: tokenType === "stETH" ? otherStETH : otherDAI,
    apusStETHEstimatedApus,
    apusDAIEstimatedApus,
    loadingUserEstimatedApus:
      loadingStETHEstimatedApus || loadingDaiEstimatedApus || loadingStETHAllocation || loadingDaiAllocation,
    userEstimatedApus,
  };
}

export function useRecipientModal({ wallet, MintProcess }: { wallet?: string; MintProcess: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [arweaveAddress, setArweaveAddress] = useState("");

  const {
    data: recipient,
    loading: loadingRecipient,
    execute: getRecipient,
  } = useAO<string>(MintProcess, "User.Get-Recipient", "dryrun");
  const { loading: loadingUpdateRecipient, execute: updateRecipientMsg } = useEthMessage(
    MintProcess,
    "User.Update-Recipient",
  );

  useEffect(() => {
    if (wallet) {
      getRecipient({ User: ethers.utils.getAddress(wallet) });
    }
  }, [getRecipient, wallet]);

  const submitRecipient = async () => {
    if (!wallet) {
      return;
    }
    if (arweaveAddress.length !== 43) {
      throw new Error("Invalid Arweave Address");
    }
    await updateRecipientMsg({ Recipient: arweaveAddress }, dayjs().unix());
    await getRecipient({ User: ethers.utils.getAddress(wallet) });
    setModalOpen(false);
  };

  const closeModal = () => {
    if (loadingRecipient) {
      return;
    }
    setModalOpen(false);
  };

  return {
    modalOpen,
    setModalOpen,
    closeModal,
    arweaveAddress,
    setArweaveAddress,
    recipient,
    loadingRecipient,
    loadingUpdateRecipient,
    submitRecipient,
  };
}

export function useSignatureModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const modalOpenRef = useRef(modalOpen);
  const [title, setTitle] = useState("");
  const [notAskAgain, setNotAskAgain] = useLocalStorage("sig-not-ask-again", false);

  useEffect(() => {
    modalOpenRef.current = modalOpen;
  }, [modalOpen]);

  const showSigTip = (t: string) =>
    new Promise<void>((resolve) => {
      if (notAskAgain) {
        resolve();
      } else {
        setTitle(t);
        setModalOpen(true);
        setTitle("Signature Tip");

        const tipInterval = setInterval(() => {
          if (!modalOpenRef.current) {
            clearInterval(tipInterval);
            resolve();
          }
        }, 200);
      }
    });

  const closeModal = () => {
    setModalOpen(false);
  };

  const closeAndNotAskAgain = () => {
    setNotAskAgain(true);
    setModalOpen(false);
  };

  return { modalOpen, title, showSigTip, closeModal, closeAndNotAskAgain };
}
