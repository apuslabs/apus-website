import { PermissionType } from "arconnect";
import React, { useContext, useEffect, useState } from "react";

const ArweaveContext = React.createContext<ReturnType<typeof useArweave>>(null as any);

const initialPermissions: PermissionType[] = ["ACCESS_ADDRESS", "SIGN_TRANSACTION"];

function useArweave() {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [walletLoaded, setWalletLoaded] = useState(false);
  const [activeAddress, setActiveAddress] = useState<string>();
  const [onInit, setOnInit] = useState<((address?: string) => void) | undefined>();

  useEffect(() => {
    window.addEventListener("arweaveWalletLoaded", async () => {
      setWalletLoaded(walletLoaded);
      const userPermissions = await window.arweaveWallet.getPermissions();
      setPermissions(userPermissions);
      if (userPermissions.includes("ACCESS_ADDRESS")) {
        init();
      } else {
        onInit?.();
      }
    });
  }, [onInit]);

  const connectWallet = async () => {
    if (!window.arweaveWallet) {
      window.open("https://www.arconnect.io/download", "_blank");
    }
    await window.arweaveWallet.connect(initialPermissions);
    await init();
  };

  const init = async () => {
    const address = await window.arweaveWallet.getActiveAddress();
    setActiveAddress(address);
    onInit?.(address);
  };

  return {
    hasWallet: () => window.arweaveWallet != null,
    permissions,
    init,
    connectWallet,
    activeAddress,
    setOnInit,
    disconnect: async () => {
      await window.arweaveWallet.disconnect();
      setActiveAddress(undefined);
    },
  };
}

export { ArweaveContext, useArweave };
export const useArweaveContext = () => useContext(ArweaveContext);
