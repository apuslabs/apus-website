import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { ethers, BigNumber } from "ethers";
import { AO_MINT_PROCESS, APUS_ADDRESS } from "../../utils/config";
import { getDataFromMessage, useAO, useEthMessage } from "../../utils/ao";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { useLocalStorage } from "react-use";
import { toast } from "react-toastify";
import { formatBigNumber } from "./utils";

interface AllocationItem {
  Recipient: string;
  Amount: BigNumber;
}

type Allocation = AllocationItem[];

type TokenType = "stETH" | "DAI";

function getBalanceOfAllocation(allocations?: Allocation, recipient?: string) {
  if (!allocations) {
    return undefined;
  }
  if (!recipient) {
    return allocations.reduce((acc, a) => acc.add(a.Amount), BigNumber.from(0));
  }
  return allocations.find((a) => a.Recipient === recipient)?.Amount || BigNumber.from(0);
}

function getAllocationFromMessage(message?: MessageResult): Allocation | undefined {
  try {
    if (!message || !getDataFromMessage(message)) {
      return undefined;
    }
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

function getApusAllocation(msg?: MessageResult) {
  return getBalanceOfAllocation(getAllocationFromMessage(msg), APUS_ADDRESS.Recipient);
}

function getOtherAllocation(msg?: MessageResult) {
  const total = getBalanceOfAllocation(getAllocationFromMessage(msg))
  const apus = getApusAllocation(msg)
  if (!total || !apus) {
    return undefined;
  }
  return total.sub(apus);
}

function getEstimatedApus(
  stETHEstimatedApus: BigNumber,
  daiEstimatedApus: BigNumber,
  apusStETHAllocation?: BigNumber,
  apusDAIAllocation?: BigNumber,
) {
  const stETHApus = apusStETHAllocation?.mul(stETHEstimatedApus).div(BigNumber.from(10).pow(18));
  const daiApus = apusDAIAllocation?.mul(daiEstimatedApus).div(BigNumber.from(10).pow(18));
  const user = stETHApus ? daiApus ? stETHApus.add(daiApus) : stETHApus : daiApus;
  return {
    user,
    stETH: stETHApus,
    dai: daiApus,
  };
}

function notifyAllocationUpdate(tokenType: TokenType, allocation: BigNumber | undefined) {
  if (allocation) {
    toast.info(tokenType + " allocated to APUS has been updated to " + formatBigNumber(allocation, 18, 4));
  }
}
const notifyStethAllocationUpdate = (allocation: BigNumber | undefined) => notifyAllocationUpdate("stETH", allocation);
const notifyDaiAllocationUpdate = (allocation: BigNumber | undefined) => notifyAllocationUpdate("DAI", allocation);

function toBigNumber(value: string | undefined) {
  return value ? BigNumber.from(value) : undefined;
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
  const {
    data: apus,
    loading: loadingApus,
    execute: getApus,
  } = useAO<string>(MintProcess, "User.Balance", "dryrun", { loadingWhenFail: true });
  const [apusDynamic, setApusDynamic] = useState<BigNumber>();
  // const {
  //   data: userEstimatedApus,
  //   loading: loadingUserEstimateApus,
  //   execute: getUserEstimatedApus,
  // } = useAO<string>(MirrorProcess, "User.Get-User-Estimated-Apus-Token", "dryrun");
  const {
    data: stETHEstimatedApusLittle,
    loading: loadingStETHEstimatedApus,
    execute: getStETHEstimatedApus,
  } = useAO<string>(MirrorProcess, "User.Get-Estimated-Apus-Token", "dryrun", { loadingWhenFail: true });
  const {
    data: daiEstimatedApusLittle,
    loading: loadingDaiEstimatedApus,
    execute: getDaiEstimatedApus,
  } = useAO<string>(MirrorProcess, "User.Get-Estimated-Apus-Token", "dryrun", { loadingWhenFail: true });
  const {
    result: stETHAllocationResult,
    loading: loadingStETHAllocation,
    execute: getStETHAllocation,
  } = useAO<string>(AO_MINT_PROCESS, "User.Get-Allocation", "dryrun", { loadingWhenFail: true });
  const {
    result: daiAllocationResult,
    loading: loadingDaiAllocation,
    execute: getDaiAllocation,
  } = useAO<string>(AO_MINT_PROCESS, "User.Get-Allocation", "dryrun", { loadingWhenFail: true });

  const getStETHAllocationAndNotify = useCallback((tags: Record<string, string>, data?: unknown) => {
    return getStETHAllocation(tags, data).then((result) => {
      notifyStethAllocationUpdate(getApusAllocation(result));
      return result;
    });
  }, [getStETHAllocation, wallet]);
  const getDaiAllocationAndNotify = useCallback((tags: Record<string, string>, data?: unknown) => {
    return getDaiAllocation(tags, data).then((result) => {
      notifyDaiAllocationUpdate(getApusAllocation(result));
      return result;
    });
  }, [getDaiAllocation, wallet]);

  // get apus && refresh apus every 5 minutes
  useEffect(() => {
    if (wallet) {
      getApus({ Recipient: ethers.utils.getAddress(wallet) });
    }
    // refresh apus every 5 minutes
    const interval = setInterval(
      () => {
        if (wallet) {
          getApus({ Recipient: ethers.utils.getAddress(wallet) });
        }
      },
      5 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, [wallet, getApus]);

  // get estimated apus && refresh every 5 minutes if number is zero
  useEffect(() => {
    if (wallet) {
      getStETHEstimatedApus({ Amount: (1e15).toString(), Token: "stETH" }, dayjs().unix());
      getDaiEstimatedApus({ Amount: (1e15).toString(), Token: "DAI" }, dayjs().unix());
    }
  }, [getStETHEstimatedApus, getDaiEstimatedApus, wallet]);

  useEffect(() => {
    // refresh estimated apus every 5 minutes if number is zero
    const interval = setInterval(
      () => {
        if (wallet) {
          if (stETHEstimatedApusLittle === "0") {
            getStETHEstimatedApus({ Amount: (1e18).toString(), Token: "stETH" }, dayjs().unix());
          }
          if (daiEstimatedApusLittle === "0") {
            getDaiEstimatedApus({ Amount: (1e18).toString(), Token: "DAI" }, dayjs().unix());
          }
        }
      },
      5 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, [getStETHEstimatedApus, getDaiEstimatedApus, wallet, stETHEstimatedApusLittle, daiEstimatedApusLittle]);

  useEffect(() => {
    if (wallet) {
      getStETHAllocation({
        Owner: ethers.utils.getAddress(wallet),
        Token: "stETH",
      });
      getDaiAllocation({ Owner: ethers.utils.getAddress(wallet), Token: "DAI" });
    }
  }, [getDaiAllocation, getStETHAllocation, wallet]);

  const { loading: loadingUpdateAllocation, execute: updateAllocationMsg } = useEthMessage(
    AO_MINT_PROCESS,
    "User.Update-Allocation",
    {},
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
      await getStETHAllocationAndNotify({ Owner: ethers.utils.getAddress(wallet!), Token: "stETH" });
    } else {
      await getDaiAllocationAndNotify({ Owner: ethers.utils.getAddress(wallet!), Token: "DAI" });
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
    if (!allocation || !apus || !other || amount.gt(other) || amount.lte(0)) {
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
    try {
      await updateAllocation(newAllocations);
    } catch {
      throw new Error("AO Experiencing Congestion. Please Try Again.");
    } finally {
      refreshAfterAllocation();
    }
  };

  const decreaseApusAllocation = async (amount: BigNumber, recipient: string) => {
    if (!recipient) {
      throw new Error("Recipient not set");
    }
    const { allocation, apus } = await getCurrentAllocation();
    if (!allocation || !apus || amount.gt(apus) || amount.lte(0)) {
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
    try {
      await updateAllocation(newAllocations);
    } catch {
      throw new Error("AO Experiencing Congestion. Please Try Again.");
    } finally {
      refreshAfterAllocation();
    }
  };

  const apusStETH = useMemo(() => getApusAllocation(stETHAllocationResult), [stETHAllocationResult]);
  const apusDAI = useMemo(() => getApusAllocation(daiAllocationResult), [daiAllocationResult]);
  const otherStETH = useMemo(() => getOtherAllocation(stETHAllocationResult), [stETHAllocationResult]);
  const otherDAI = useMemo(() => getOtherAllocation(daiAllocationResult), [daiAllocationResult]);
  const {
    user: userEstimatedApus,
    stETH: apusStETHEstimatedApus,
    dai: apusDAIEstimatedApus,
  } = useMemo(
    () =>
      getEstimatedApus(
        BigNumber.from(stETHEstimatedApusLittle || 0).mul(1e3),
        BigNumber.from(daiEstimatedApusLittle || 0).mul(1e3),
        apusStETH,
        apusDAI,
      ),
    [stETHEstimatedApusLittle, daiEstimatedApusLittle, apusStETH, apusDAI],
  );
  const loadingUserEstimatedApus =
    loadingStETHEstimatedApus || loadingDaiEstimatedApus || loadingStETHAllocation || loadingDaiAllocation;

  // animate apus balance change
  useEffect(() => {
    if (loadingApus || !apus) {
      return;
    }
    if (
      loadingApus ||
      loadingUserEstimatedApus ||
      !apus ||
      !userEstimatedApus ||
      userEstimatedApus.isZero() ||
      userEstimatedApus.lte(apus)
    ) {
      setApusDynamic(toBigNumber(apus));
      return;
    }
    const diff = userEstimatedApus.sub(BigNumber.from(apus));
    const step = diff.div(30 * 24 * 3600);
    const interval = setInterval(() => {
      setApusDynamic((v) => {
        if (v) {
          return v.add(step)
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [apus, userEstimatedApus, loadingApus, loadingUserEstimatedApus]);

  const biStETHEstimatedApus = useMemo(
    () => stETHEstimatedApusLittle ? BigNumber.from(stETHEstimatedApusLittle).mul(1e3) : undefined,
    [stETHEstimatedApusLittle]
  );
  const biDaiEstimatedApus = useMemo(
    () => daiEstimatedApusLittle ? BigNumber.from(daiEstimatedApusLittle).mul(1e3) : undefined,
    [daiEstimatedApusLittle]
  );
  const biTokenEstimatedApus = useMemo(
    () => (tokenType === "stETH" ? biStETHEstimatedApus : biDaiEstimatedApus),
    [tokenType, biStETHEstimatedApus, biDaiEstimatedApus]
  );

  return {
    tokenType,
    setTokenType,
    apus: toBigNumber(apus),
    apusDynamic,
    // userEstimatedApus,
    biStETHEstimatedApus,
    biDaiEstimatedApus,
    biTokenEstimatedApus,
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
    refreshAfterAllocation,
    apusStETH,
    apusDAI,
    apusToken: tokenType === "stETH" ? apusStETH : apusDAI,
    otherStETH,
    otherDAI,
    otherToken: tokenType === "stETH" ? otherStETH : otherDAI,
    apusStETHEstimatedApus,
    apusDAIEstimatedApus,
    loadingUserEstimatedApus,
    userEstimatedApus,
  };
}

export function useRecipientModal({ wallet, MintProcess }: { wallet?: string; MintProcess: string }) {
  const [arweaveAddress, setArweaveAddress] = useState("");
  const [recipientVisible, setRecipientVisible] = useState(false);

  const {
    data: recipient,
    loading: loadingRecipient,
    execute: getRecipient,
  } = useAO<string>(MintProcess, "User.Get-Recipient", "dryrun", { loadingWhenFail: true });
  const { loading: loadingUpdateRecipient, execute: updateRecipientMsg } = useEthMessage(
    MintProcess,
    "User.Update-Recipient",
    {},
  );

  useEffect(() => {
    if (wallet) {
      getRecipient({ User: ethers.utils.getAddress(wallet) });
    }
  }, [getRecipient, wallet]);

  const submitRecipient = useCallback(async () => {
    if (!wallet) {
      return;
    }
    if (arweaveAddress.length !== 43) {
      throw new Error("Invalid Arweave Address");
    }
    try {
      await updateRecipientMsg({ Recipient: arweaveAddress }, dayjs().unix());
      setRecipientVisible(false);
    } catch {
      throw new Error("AO Experiencing Congestion. Please Try Again.");
    } finally {
      getRecipient({ User: ethers.utils.getAddress(wallet) });
    }
  }, [arweaveAddress, getRecipient, updateRecipientMsg, wallet]);

  return {
    recipientVisible,
    setRecipientVisible,
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

  const showSigTip = useCallback(
    (t: string) =>
      new Promise<void>((resolve) => {
        if (notAskAgain) {
          resolve();
        } else {
          setTitle(t);
          setModalOpen(true);

          const tipInterval = setInterval(() => {
            if (!modalOpenRef.current) {
              clearInterval(tipInterval);
              resolve();
            }
          }, 200);
        }
      }),
    [notAskAgain],
  );

  const closeModal = () => {
    setModalOpen(false);
  };

  const closeAndNotAskAgain = () => {
    setNotAskAgain(true);
    setModalOpen(false);
  };

  return { modalOpen, title, showSigTip, closeModal, closeAndNotAskAgain };
}
