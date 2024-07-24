import { PermissionType } from 'arconnect';
import ao from "@permaweb/aoconnect";
import React, { useContext, useEffect, useState } from 'react';


const ArweaveContext = React.createContext<ReturnType<typeof useArweave>>(null as any);

const PROCESS_ID = "1x2lsMZVr67txPJVZ0OQT7qOGYVP-w9EWqcfF57d0Dc"

const initialPermissions: PermissionType[] = ['ACCESS_ADDRESS', 'SIGN_TRANSACTION'];

function useArweave() {
  const [permissions, setPermissions] = useState(initialPermissions)
  const [walletLoaded, setWalletLoaded] = useState(false)
  const [activeAddress, setActiveAddress] = useState<string>()
  const [balance, setBalance] = useState<number>()
  useEffect(() => {
    window.addEventListener('arweaveWalletLoaded', async () => {
      setWalletLoaded(walletLoaded)
      const userPermissions = await window.arweaveWallet.getPermissions();
      setPermissions(userPermissions);
      init();
    })
  }, [])

  const connectWallet = async () => {
    await window.arweaveWallet.connect(initialPermissions);
    await init()
  }

  const init = async () => {
    const address = await window.arweaveWallet.getActiveAddress();
    setActiveAddress(address)
    // await fetchBalance()
  }

  const fetchBalance = async () => {
    try {
      // const { Messages } = await messageResult({ Action: 'MarketBalances' }, {})
      // if (Messages?.[0]?.Data) {
      //   setBalance(Messages?.[0]?.Data)
      // }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    hasWallet: () => window.arweaveWallet != null,
    permissions,
    init,
    connectWallet,
    fetchBalance,
    activeAddress,
    balance,
    disconnect: async () => { await window.arweaveWallet.disconnect(); setActiveAddress(undefined)},
  }
}

function errToString(err: any): string {
  if (err instanceof Error) {
    return err.message
  }
  try {
    const errMsg = JSON.stringify(err)
    return errMsg
  } catch {
    try {
      return err?.toString()
    } catch {
      return "Unknown Error"
    }
  }
}

export {
  ArweaveContext,
  useArweave,
}
export const useArweaveContext = () => useContext(ArweaveContext);

// export async function messageResult(tags: Record<string, string>, data?: Record<string, any>) {
//   const messageId = await ao.message({
//     process: PROCESS_ID,
//     tags: Object.entries(tags).map(([name, value]) => ({ name, value })),
//     signer: ao.createDataItemSigner(window.arweaveWallet),
//     data: data ? JSON.stringify(data) : undefined,
//   });

//   const messageReturn = await ao.result({
//     // the arweave TXID of the message
//     message: messageId,
//     // the arweave TXID of the process
//     process: PROCESS_ID,
//   });

//   return messageReturn
// }

// export async function dryrunResult(tags: Record<string, string>, data?: Record<string, any>) {
//   const dryrunResult = await ao.dryrun({
//     process: PROCESS_ID,
//     tags: Object.entries(tags).map(([name, value]) => ({ name, value })),
//     signer: ao.createDataItemSigner(window.arweaveWallet),
//     data: data ? JSON.stringify(data) : undefined,
//   });

//   return dryrunResult
// }