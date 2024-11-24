import { Dropdown } from "antd";
import { EthWalletContext } from "../contexts/ethwallet";
import { useContext } from "react";

function shortenAddress(address?: string): string {
  if (!address) {
    return "";
  }
  return address.substring(0, 6) + "..." + address.substring(address.length - 4);
}

export default function EthUserbox() {
  const { walletAddress, connectWallet, disconnectWallet } = useContext(EthWalletContext);

  return walletAddress ? (
    <Dropdown
      placement="bottomRight"
      menu={{
        items: [{ key: "logout", label: "Disconnect Wallet" }],
        onClick: ({ key }) => {
          if (key === "logout") {
            disconnectWallet();
          }
        },
      }}
    >
      <div className="btn-default">{shortenAddress(walletAddress)}</div>
    </Dropdown>
  ) : (
    <div className="btn-blueToPink135" onClick={connectWallet}>
      Connect Wallet
    </div>
  );
}
