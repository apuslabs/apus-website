import { Suspense } from "react";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import { Outlet } from "react-router-dom";
import { ConnectButton, useActiveAddress, useConnection } from "arweave-wallet-kit";
import { Dropdown } from "antd";
import { BalanceContext, useBalance } from "./contexts/balance";

export default function ANPM() {
  const { disconnect } = useConnection();
  const activeAddress = useActiveAddress();
  const balanceCtx = useBalance();
  return (
    <>
      <HomeHeader
        hideMenu={true}
        Userbox={
          activeAddress ? (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "disconnect",
                    label: (
                      <div
                        onClick={() => {
                          disconnect();
                        }}
                      >
                        Disconnect Wallet
                      </div>
                    ),
                  },
                ],
              }}
            >
              <ConnectButton
                profileModal={false}
                showBalance={false}
                onClickCapture={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              />
            </Dropdown>
          ) : (
            <ConnectButton profileModal={false} showBalance={false} />
          )
        }
      />
      <Suspense>
        <BalanceContext.Provider value={balanceCtx}><Outlet /></BalanceContext.Provider>
      </Suspense>
      <HomeFooter />
    </>
  );
}
