import { FC } from "react";
import { ImgCompetition } from "../assets/image";
import { Link, useLocation } from "react-router-dom";
import { ConsoleHeaderList } from "../config/menu";
import { ShortAddress } from "../utils/ao";
import { useArweaveContext } from "../contexts/arconnect";
import { Dropdown } from "antd";

const UserInfo: FC = function () {
  const { activeAddress, connectWallet, disconnect } = useArweaveContext();
  return activeAddress ? (
    <Dropdown
      placement="bottomRight"
      menu={{
        items: [{ key: "logout", label: "Disconnect Wallet" }],
        onClick: ({ key }) => {
          if (key === "logout") {
            disconnect();
          }
        },
      }}
    >
      <div className="btn-default">{ShortAddress(activeAddress)}</div>
    </Dropdown>
  ) : (
    <div className="btn-blueToPink135" onClick={connectWallet}>
      Connect Wallet
    </div>
  );
};

export default function ConsoleHeader() {
  const location = useLocation();

  return (
    <header className="bg-light h-20 w-full fixed top-0 left-0 right-0 px-10 flex items-center gap-10 z-20">
      <Link to="/" className="h-full flex-0 flex items-center">
        <img src={ImgCompetition.LogoHorizonalSimple} className="h-8" />
      </Link>
      <nav className="flex-1">
        <ul className="flex items-center gap-10">
          {ConsoleHeaderList.map(({ name, path }) => {
            return (
              <li
                key={name}
                className={`text-black50 font-medium ${location.pathname === path ? "text-gradient bg-blueToPink135" : ""}`}
              >
                <Link to={path}>{name}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <UserInfo />
    </header>
  );
}
