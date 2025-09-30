import { useEffect, useState } from "react";
import { ethers, BigNumber } from "ethers";
// import { AO_MINT_PROCESS, APUS_ADDRESS } from "../../utils/config";
import { useAO } from "../../utils/ao";

// interface SetDelegation {
//   walletFrom: string
//   walletTo: string
//   factor: number
// }

// interface DelegationPrefItem {
//   walletTo: string
//   factor: number
//   timestamp: number
// }

// interface GetDelegationResponse {
//   wallet: string
//   delegationPrefs: DelegationPrefItem[]
//   totalFactor: number
//   lastUpdate: number
// }

// const DefaultSplitDelegations = {
//   apusFactor: 0,
//   aoFactor: 100,
// }

function toBigNumber(value: string | undefined) {
  return value ? BigNumber.from(value) : undefined;
}

export function useAOMint({
  apusWallet,
  wallet,
  MintProcess,
  // MirrorProcess,
}: {
  apusWallet?: string;
  wallet?: string;
  MintProcess: string;
  // MirrorProcess: string;
}) {
  const {
    data: apus,
    loading: loadingApus,
    execute: getApus,
  } = useAO<string>(MintProcess, "Balance", "dryrun");
  // const {
  //   data: userEstimatedApus,
  //   loading: loadingUserEstimatedApus,
  //   execute: getUserEstimatedApus,
  // } = useAO<string>(MirrorProcess, "User.Get-User-Estimated-Apus-Token", "dryrun");
  const [apusDynamic, setApusDynamic] = useState<BigNumber>();
  // const {
  //   data: delegationsData,
  //   loading: loadingDelegations,
  //   execute: getDelegations,
  // } = useAO<GetDelegationResponse>(AO_MINT_PROCESS, "Get-Delegations", "dryrun", { checkStatus: false });

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
  }, [apusWallet, wallet, getApus]);

  // useEffect(() => {
  //   if(wallet) {
      // getDelegations({ Wallet: wallet })
  //     getUserEstimatedApus({ User: wallet })
  //   }
  // }, [wallet, getDelegations, getUserEstimatedApus])

  // const { loading: loadingUpdateDelegation, execute: updateDelegationMsg } = useAO(
  //   AO_MINT_PROCESS,
  //   "Set-Delegation",
  //   "message",
  //   {
  //     checkStatus: false,
  //   }
  // );
  // const updateDelegation = useCallback(
  //   async (factor: number) => {
  //     if (wallet) {
  //       const { delegationPrefs, totalFactor, apusFactor, aoFactor } = splitDelegationFactor(wallet, delegationsData!)
  //       // Convert factor to the correct scale (0-10000)
  //       const newApusFactor = Math.floor(factor * 100);
  //       if (newApusFactor > 10000) {
  //         throw new Error("Delegation factor cannot exceed 10000");
  //       }

  //       // Calculate difference (positive means increase, negative means decrease)
  //       const factorDiff = newApusFactor - apusFactor;

  //       if (factorDiff === 0) return; // No change needed

  //       const tobeDecreaseDelegations: SetDelegation[] = [];
  //       const tobeIncreaseDelegations: SetDelegation[] = [];

  //       if (factorDiff === 0) {
  //         return;
  //       } else if (factorDiff < 0) {
  //         tobeDecreaseDelegations.push({
  //           walletFrom: wallet,
  //           walletTo: APUS_ADDRESS.Recipient,
  //           factor: newApusFactor,
  //         })
  //         tobeIncreaseDelegations.push({
  //           walletFrom: wallet,
  //           walletTo: wallet,
  //           factor: aoFactor - factorDiff,
  //         })
  //       } else {
  //         tobeIncreaseDelegations.push({
  //           walletFrom: wallet,
  //           walletTo: APUS_ADDRESS.Recipient,
  //           factor: newApusFactor,
  //         })
  //         if (500 <= aoFactor - factorDiff) {
  //           tobeDecreaseDelegations.push({
  //             walletFrom: wallet,
  //             walletTo: wallet,
  //             factor: aoFactor - factorDiff,
  //           })
  //         } else {
  //           let factorTobeDecrease = factorDiff
  //           const otherDelegations = delegationPrefs.filter(v => v.walletTo !== APUS_ADDRESS.Recipient)
  //           tobeDecreaseDelegations.push(...otherDelegations.map(v => {
  //             const share = (v.factor / (totalFactor - apusFactor))
  //             const targetFactor = Math.ceil(share * factorTobeDecrease)
  //             const factor = v.factor - targetFactor
  //             return {
  //               walletFrom: wallet,
  //               walletTo: v.walletTo,
  //               factor: factor >= 500 ? factor : 0,
  //             }
  //           }))
  //           factorTobeDecrease -= otherDelegations.reduce((acc, v) => acc + v.factor, 0)
  //           const userDelegation = tobeDecreaseDelegations.find(v => v.walletTo === wallet)
  //           if (userDelegation !== undefined && factorTobeDecrease > 0) {
  //             userDelegation.factor = userDelegation.factor + factorTobeDecrease
  //           } else if (userDelegation === undefined && factorTobeDecrease >= 500) {
  //             tobeDecreaseDelegations.push({
  //               walletFrom: wallet,
  //               walletTo: wallet,
  //               factor: factorTobeDecrease,
  //             })
  //           }
  //           if (factorTobeDecrease >= 0) {
  //             console.warn("factorLeft", factorTobeDecrease)
  //           }
  //         }
  //       }
  //       console.info("tobeDecreaseDelegations", tobeDecreaseDelegations)
  //       console.info("tobeIncreaseDelegations", tobeIncreaseDelegations)
  //       if (tobeDecreaseDelegations.length > 0) {
  //         await Promise.all(tobeDecreaseDelegations.map(v => updateDelegationMsg({}, v)));
  //       }
  //       if (tobeIncreaseDelegations.length > 0) {
  //         await Promise.all(tobeIncreaseDelegations.map(v => updateDelegationMsg({}, v)));
  //       }
  //       getDelegations({ Wallet: wallet })
  //     }
  //   },
  //   [updateDelegationMsg, getDelegations, wallet, delegationsData],
  // );

  // animate apus balance change
  useEffect(() => {
    if (loadingApus || !apus) {
      return;
    }
    // const bigApus = toBigNumber(apus)
    // const bigUserEstimatedApus = toBigNumber(userEstimatedApus)
    // if (
      // loadingUserEstimatedApus ||
      // !userEstimatedApus ||
      // !bigApus || !bigUserEstimatedApus ||
      // bigApus?.isZero() ||
      // bigUserEstimatedApus?.isZero()
    // ) {
      setApusDynamic(toBigNumber(apus));
    //   return;
    // }
    // const step = bigUserEstimatedApus.div(30 * 24 * 3600);
    // const interval = setInterval(() => {
    //   setApusDynamic((v) => {
    //     if (!v || v?.isZero()) {
    //       return toBigNumber(apus)
    //     } else if (v) {
    //       return v.add(step)
    //     }
    //   });
    // }, 1000);
    // return () => clearInterval(interval);
  }, [apus, loadingApus]);

  // const delegations = useMemo(() => {
  //   if (delegationsData) {
  //     return splitDelegationFactor(wallet, delegationsData)
  //   }
  //   return DefaultSplitDelegations
  // }, [delegationsData, wallet])

  return {
    apusDynamic,
    loadingApus,
    // userEstimatedApus: toBigNumber(userEstimatedApus),
    // loadingUserEstimatedApus,
    // apusFactor: delegations.apusFactor / 100,
    // loadingDelegations,
    // loadingUpdateDelegation,
    // updateDelegation,
  };
}

// function splitDelegationFactor(wallet: string | undefined, { delegationPrefs, totalFactor }: GetDelegationResponse = {delegationPrefs: [], totalFactor: 0, wallet: "", lastUpdate: 0}) {
//   const apusFactor = delegationPrefs?.find(v => v.walletTo === APUS_ADDRESS.Recipient)?.factor || 0
//   const userFactor = delegationPrefs?.find(v => v.walletTo === wallet)?.factor || 0
//   const aoFactor = 10000 - totalFactor + userFactor // unspecified factor + user factor
//   return {
//     apusFactor: apusFactor,
//     aoFactor: aoFactor,
//     otherFactor: totalFactor - apusFactor - userFactor,
//     delegationPrefs,
//     totalFactor: totalFactor,
//   }
// }