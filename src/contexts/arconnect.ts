import { PermissionType } from "arconnect";
import React, { useContext, useEffect, useState } from "react";

const ArweaveContext = React.createContext<ReturnType<typeof useArweave>>(
  null as any
);

const initialPermissions: PermissionType[] = [
  "ACCESS_ADDRESS",
  "SIGN_TRANSACTION",
];

function useArweave() {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [walletLoaded, setWalletLoaded] = useState(false);
  const [activeAddress, setActiveAddress] = useState<string>();

  useEffect(() => {
    window.addEventListener("arweaveWalletLoaded", async () => {
      setWalletLoaded(walletLoaded);
      const userPermissions = await window.arweaveWallet.getPermissions();
      setPermissions(userPermissions);
      init();
    });
  }, []);

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
  };


  return {
    hasWallet: () => window.arweaveWallet != null,
    permissions,
    init,
    connectWallet,
    activeAddress,
    disconnect: async () => {
      await window.arweaveWallet.disconnect();
      setActiveAddress(undefined);
    },
  };
}

export { ArweaveContext, useArweave };
export const useArweaveContext = () => useContext(ArweaveContext);
