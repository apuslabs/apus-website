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
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard'
import Works from './pages/Works'
import AiAgents from './pages/AiAgents'
import WorkNew from './pages/Works/workNew'
import HomeIndex from './pages/HomeIndex'
import Ecosystem from './pages/Ecosystem'
import Task from './pages/Task'

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
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/home/index" replace />} />
                <Route path="/home" element={<Home />} >
                  <Route path="index" key="index" element={<HomeIndex />} />
                  <Route path="ecosystem" element={<Ecosystem />} />
                  <Route path="task" element={<Task />} />
                </Route>
                <Route path="/app" element={<App />}>
                  <Route path="account" key="account" element={<Dashboard />} />
                  <Route path="works">
                    <Route index element={<Works />}></Route>
                    <Route path='new' element={<WorkNew />} />
                  </Route>
                  <Route path="aiAgents" element={<AiAgents />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Main />);
