import { FC } from "react";
import { ImgHomepage } from "../assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ConsoleHeaderMenuList } from "./constants";
import { ShortAddress } from "../utils/ao";
import { useArweaveContext } from "../contexts/arconnect";
import { Dropdown } from "antd";
import "./headerfooter.css";

export const UserInfo: FC = function () {
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
    <div className="btn-main btn-colorful" onClick={connectWallet}>
      Connect Wallet
    </div>
  );
};

export default function ConsoleHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header
      className="header-container md:h-20 gap-4 bg-transparent backdrop-blur-3xl"
    >
      <div className="h-full flex items-center cursor-pointer" onClick={() => navigate("/")}>
        <img src={ImgHomepage.LogoHorizonal} alt="Apus Logo" className="md:w-40" />
      </div>
      <nav className={`fixed md:relative md:h-full md:top-0 md:text-gray21 text-white`}>
        <ul
          className="flex-col justify-center items-center gap-12
          font-medium text-base
          md:h-full md:flex md:flex-row md:justify-start bg-[#4c4c4c] md:bg-transparent
          z-20"
        >
          {ConsoleHeaderMenuList.map(({name, path}) => (
            <Link key={name} to={path}>
              <li key={name} className={`${location.pathname === path ? "text-gradient bg-blueToPink135" : ""}`}>{name}</li>
            </Link>
          ))}
        </ul>
      </nav>
      <UserInfo />
    </header>
  );
}
