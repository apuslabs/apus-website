import { message } from "antd";
import { createContext, useCallback, useEffect, useState } from "react";

export function useEthWallet() {
  const [isEthereumSupported, setIsEthereumSupported] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>();

  // 检查是否支持 Ethereum
  useEffect(() => {
    setIsEthereumSupported(typeof window.ethereum !== "undefined");
  }, []);

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      // 用户断开连接
      setWalletAddress(undefined);
    } else {
      // 更新账户地址
      setWalletAddress(accounts[0]);
    }
  }, []);

  // 检查是否支持 Ethereum
  useEffect(() => {
    setIsEthereumSupported(typeof window.ethereum !== "undefined");

    if (window.ethereum) {
      // 监听账户切换事件
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      // 监听网络切换事件（可选，根据需要）
      window.ethereum.on("chainChanged", () => {
        setWalletAddress(undefined); // 可清空当前状态，提示用户重新连接
      });
    }

    return () => {
      // 清理事件监听器
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, [handleAccountsChanged]);

  // 连接钱包
  const connectWallet = async () => {
    try {
      if (!isEthereumSupported) {
        // 跳转到下载页面
        message.error("Ethereum is not supported in this browser.");
        setTimeout(() => {
          window.location.href = "https://metamask.io/download.html";
        }, 1500);
        return;
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(err.message || "Failed to connect wallet.");
      } else {
        message.error("Failed to connect wallet.");
      }
    }
  };

  const disconnectWallet = useCallback(() => {
    setWalletAddress(undefined);
  }, []);

  // 使用钱包签名数据sign(message: Uint8Array): Promise<Uint8Array>;
  const signData = async (data: Uint8Array): Promise<Uint8Array> => {
    if (!walletAddress) {
      message.error("Wallet is not connected.");
      throw new Error("Wallet is not connected.");
    }

    // 调用 MetaMask 的签名方法
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [data, walletAddress], // 签名的数据和用户地址
    });

    return signature;
  };

  return { walletAddress, connectWallet, disconnectWallet, signData };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EthWalletContext = createContext<ReturnType<typeof useEthWallet>>({} as any);
