import { Dropdown, Spin } from "antd";
import { useConnectWallet } from "@web3-onboard/react";
import "../contexts/ethwallet";

function shortenAddress(address?: string): string {
  if (!address) {
    return "";
  }
  return address.substring(0, 6) + "..." + address.substring(address.length - 4);
}

export default function EthUserbox({ setRecipientVisible }: { setRecipientVisible: (visible: boolean) => void }) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  return wallet?.accounts.length ? (
    <Dropdown
      placement="bottomRight"
      menu={{
        items: [
          { key: "update-recipient", label: "Recipient Address" },
          { key: "logout", label: "Disconnect Wallet" },
        ],
        onClick: ({ key }) => {
          if (key === "logout") {
            disconnect(wallet);
          } else if (key === "update-recipient") {
            setRecipientVisible(true);
          }
        },
      }}
    >
      <div className="btn-default">{shortenAddress(wallet.accounts[0].address)}</div>
    </Dropdown>
  ) : (
    <Spin spinning={connecting}>
      <div
        className="btn-blueToPink135"
        onClick={() => {
          connect();
        }}
      >
        Connect Wallet
      </div>
    </Spin>
  );
}
