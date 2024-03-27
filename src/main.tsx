import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
// import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { ConfigProvider, theme } from 'antd'
import themeToken from './utils/theme.ts'
import "./index.css";
import { BrowserRouter } from 'react-router-dom';

import "@solana/wallet-adapter-react-ui/styles.css";

function Main() {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // const wallets = useMemo(
  //   () => [new PhantomWalletAdapter()],
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [network]
  // );
  return (
    <React.StrictMode>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, ...themeToken }}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ConfigProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Main />);
