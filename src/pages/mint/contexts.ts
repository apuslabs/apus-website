import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers, BigNumber } from "ethers";
import { AO_MINT_PROCESS, APUS_ADDRESS } from "../../utils/config";
import { useAO } from "../../utils/ao";

interface SetDelegation {
  walletFrom: string
  walletTo: string
  factor: number
}

interface DelegationPrefItem {
  walletTo: string
  factor: number
  timestamp: number
}

interface GetDelegationResponse {
  wallet: string
  delegationPrefs: DelegationPrefItem[]
  totalFactor: number
  lastUpdate: number
}

const DefaultSplitDelegations = {
  apusFactor: 0,
  otherFactor: 0,
  aoFactor: 100,
}

function toBigNumber(value: string | undefined) {
  return value ? BigNumber.from(value) : undefined;
}

export function useAOMint({
  apusWallet,
  wallet,
  MintProcess,
  MirrorProcess,
}: {
  apusWallet?: string;
  wallet?: string;
  MintProcess: string;
  MirrorProcess: string;
}) {
  const {
    data: apus,
    loading: loadingApus,
    execute: getApus,
  } = useAO<string>(MintProcess, "Balance", "dryrun");
  const {
    data: userEstimatedApus,
    loading: loadingUserEstimatedApus,
    execute: getUserEstimatedApus,
  } = useAO<string>(MirrorProcess, "User.Get-User-Estimated-Apus-Token", "dryrun");
  const [apusDynamic, setApusDynamic] = useState<BigNumber>();
  const {
    data: delegationsData,
    loading: loadingDelegations,
    execute: getDelegations,
  } = useAO<string>(AO_MINT_PROCESS, "Get-Delegations", "dryrun", { checkStatus: false });

  // get apus && refresh apus every 5 minutes
  useEffect(() => {
    if (wallet) {
      getApus({ Recipient: apusWallet || wallet });
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
  }, [apusWallet, wallet, getApus, getDelegations]);

  useEffect(() => {
    if(wallet) {
      getDelegations({ Wallet: wallet })
      getUserEstimatedApus({ User: wallet })
    }
  }, [wallet, getDelegations, getUserEstimatedApus])

  const { loading: loadingUpdateDelegation, execute: updateDelegationMsg } = useAO(
    AO_MINT_PROCESS,
    "Set-Delegation",
    "message",
    {
      checkStatus: false,
    }
  );
  const updateDelegation = useCallback(
    async (factor: number) => {
      if (wallet) {
        const params: SetDelegation = {
          walletFrom: wallet,
          walletTo: APUS_ADDRESS.Recipient,
          factor: Math.floor(factor * 100)
        }
        await updateDelegationMsg({}, params);
        getDelegations({ Wallet: wallet })
      }
    },
    [updateDelegationMsg, getDelegations, wallet],
  );

  // animate apus balance change
  useEffect(() => {
    if (loadingApus || !apus) {
      return;
    }
    const bigApus = toBigNumber(apus)
    const bigUserEstimatedApus = toBigNumber(userEstimatedApus)
    if (
      loadingUserEstimatedApus ||
      !userEstimatedApus ||
      !bigApus || !bigUserEstimatedApus ||
      bigApus?.isZero() ||
      bigUserEstimatedApus?.isZero()
    ) {
      setApusDynamic(toBigNumber(apus));
      return;
    }
    const step = bigUserEstimatedApus.div(30 * 24 * 3600);
    const interval = setInterval(() => {
      setApusDynamic((v) => {
        if (!v || v?.isZero()) {
          return toBigNumber(apus)
        } else if (v) {
          return v.add(step)
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [apus, userEstimatedApus, loadingApus, loadingUserEstimatedApus]);

  const delegations = useMemo(() => {
    if (delegationsData) {
      return splitDelegationFactor(JSON.parse(delegationsData))
    }
    return DefaultSplitDelegations
  }, [delegationsData])

  return {
    apusDynamic,
    loadingApus,
    userEstimatedApus: toBigNumber(userEstimatedApus),
    loadingUserEstimatedApus,
    delegations,
    loadingDelegations,
    loadingUpdateDelegation,
    updateDelegation,
  };
}

function splitDelegationFactor({ delegationPrefs, totalFactor }: GetDelegationResponse) {
  const apusFactor = delegationPrefs.find(v => v.walletTo === APUS_ADDRESS.Recipient)?.factor || 0
  const otherFactor = totalFactor - apusFactor
  const aoFactor = 10000 - totalFactor
  return {
    apusFactor: apusFactor / 100,
    otherFactor: otherFactor / 100,
    aoFactor: aoFactor / 100
  }
}