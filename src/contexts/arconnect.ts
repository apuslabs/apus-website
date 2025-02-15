import { PermissionType } from "arconnect";
import React, { useCallback, useContext, useEffect, useState } from "react";

function useArweave() {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [walletLoaded, setWalletLoaded] = useState(false);
  const [activeAddress, setActiveAddress] = useState<string>();
  const [connecting, setConnecting] = useState<boolean>(false)
  const [onInit, setOnInit] = useState<((address?: string) => void) | undefined>();
  const init = useCallback(async () => {
    const address = await window.arweaveWallet.getActiveAddress();
    setActiveAddress(address);
    onInit?.(address);
  }, [onInit]);

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
  }, [onInit, init, walletLoaded]);

  const connectWallet = async () => {
    if (!window.arweaveWallet) {
      window.open("https://www.arconnect.io/download", "_blank");
    }
    try {
      setConnecting(true);
      await window.arweaveWallet.connect(initialPermissions);
      await init();
    } finally {
      setConnecting(false)
    }

  };

  return {
    hasWallet: () => window.arweaveWallet != null,
    permissions,
    init,
    connectWallet,
    connecting,
    activeAddress,
    setOnInit,
    disconnect: async () => {
      await window.arweaveWallet.disconnect();
      setActiveAddress(undefined);
    },
  };
}

type ArweaveContextType = ReturnType<typeof useArweave>;

const ArweaveContext = React.createContext<ArweaveContextType | undefined>(undefined);

const initialPermissions: PermissionType[] = ["ACCESS_ADDRESS", "SIGN_TRANSACTION"];

export { ArweaveContext, useArweave };
export const useArweaveContext = () => {
  const context = useContext(ArweaveContext);
  if (!context) {
    throw new Error("useArweaveContext must be used within a ArweaveProvider");
  }
  return context;
};
