import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./utils/web-vitals";
import "./index.css";

import { ArweaveWalletKit } from "arweave-wallet-kit";
import { ApusLogo } from "./assets";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ArweaveWalletKit
      config={{
        permissions: [
          "ACCESS_ADDRESS",
          "SIGN_TRANSACTION",
          "DISPATCH"
        ],
        ensurePermissions: true,
        appInfo: {
          name: "APUS",
          logo: ApusLogo
        }
      }}
      theme={{
        accent: {r: 9, g: 29, b: 255}
      }}
    ><App /></ArweaveWalletKit>
  </StrictMode>,
);
