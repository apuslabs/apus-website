import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useCallback } from "react"


export function useConnect() {
  const {connected} = useWallet()
  const {setVisible} = useWalletModal()
  const checkConnect = useCallback(() => {
    if (!connected) {
      setVisible(true)
    }
  }, [connected])
  return {
    check: checkConnect,
    connected
  }
}