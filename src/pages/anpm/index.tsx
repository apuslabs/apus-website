import { Suspense } from "react";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import { Link, Outlet } from "react-router-dom";
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
          <div className="flex items-center gap-4">
            <Link
              className="cursor-pointer w-[180px] h-[51px] bg-[#222222] text-white rounded-2xl text-center leading-[51px] hover:bg-[#111111] hover:-translate-y-[2px] transition-all"
              to="https://apus-network-1.gitbook.io/apus-network"
            >
              Deveoper
            </Link>
            {activeAddress ? (
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
            )}
          </div>
        }
      />
      <Suspense>
        <BalanceContext.Provider value={balanceCtx}>
          <Outlet />
        </BalanceContext.Provider>
      </Suspense>
      <HomeFooter />
    </>
  );
}
