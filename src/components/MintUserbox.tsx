import { Dropdown, Spin } from "antd";
// import { useConnectWallet } from "@web3-onboard/react";
import "../contexts/ethwallet";
import { useArweaveContext } from "../contexts/arconnect";

function shortenAddress(address?: string): string {
  if (!address) {
    return "";
  }
  return address.substring(0, 6) + "..." + address.substring(address.length - 4);
}

export default function EthUserbox() {
  const { activeAddress, connectWallet, disconnect, connecting } = useArweaveContext();
  // const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  return activeAddress ? (
    <Dropdown
      placement="bottomRight"
      menu={{
        items: [
          // { key: "update-recipient", label: "Recipient Address" },
          { key: "logout", label: "Disconnect Wallet" },
        ],
        onClick: ({ key }) => {
          if (key === "logout") {
            disconnect();
          }
        },
      }}
    >
      <div className="btn-default">{shortenAddress(activeAddress)}</div>
    </Dropdown>
  ) : (
    <Spin spinning={connecting}>
      <div
        className="btn-blueToPink135"
        onClick={() => {
          connectWallet();
        }}
      >
        Connect Wallet
      </div>
    </Spin>
  );
}
