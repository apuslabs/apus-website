import { FC, useState } from "react";
import { ImgHomepage } from "../../assets/image";
import { useNavigate, Link } from "react-router-dom";
import "./index.less";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useBreakpoint } from "../../utils/react-use";
import { HeaderMenuList } from "../../config/menu";

const ShortAddress: FC<{ address: string }> = ({ address }) => {
  const isLongerThen8Chars = address.length > 8;
  const firstPart = address.slice(0, 4);
  const lastPart = address.slice(-4);
  const shortAddress = `${firstPart}...${lastPart}`;
  return (
      <div title={address} data-tip={address}>
          {isLongerThen8Chars ? shortAddress : address}
      </div>
  );
};

const HomeHeader: FC<{ showUserInfo?: boolean }> = ({
  showUserInfo = false,
}) => {
  const breakpoint = useBreakpoint();
  const isTablet = breakpoint === "mobile";
  const [menuShow, setMenuShow] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div
      className="h-20 w-full fixed t-0 l-0 r-0 px-5 md:px-12 flex items-center justify-between z-10"
      style={{
        // backgroundColor: "rgba(17, 17, 17, 0.95)",
      }}
    >
      <div className="h-full flex items-center" onClick={() => navigate("/")}>
        <img src={ImgHomepage.LogoHorizonal} alt="Apus Logo" className="h-6" />
      </div>
      {!showUserInfo ? <div
        className={`absolute top-20 left-0 right-0 flex-1 h-screen md:h-full md:top-0 md:relative ${
          isTablet ? "bg-blur" : ""
        }`}
        style={isTablet ? (menuShow ? {} : { display: "none" }) : {}}
      >
        <ul className="bg-neutral-950 md:bg-inherit flex-col justify-center items-center gap-12 h-full md:flex md:flex-row">
          {HeaderMenuList.map((item) => (
            <li className="menu-colorful" key={item.name}>
              <Link to={item.path} onClick={() => {
                setMenuShow(false)
              }}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div> : null}

      {!isTablet ? (
        <div className="w-[15rem]"></div>
        // connected && showUserInfo ? (
        //   // <Dropdown menu={{ items: [
        //   //   {

        //   //     key: 'disconnect',
        //   //     label: <WalletDisconnectButton />
        //   //   }
        //   // ]}}>
        //     <ShortAddress address={publicKey?.toBase58() ?? ""}></ShortAddress>
        //   // </Dropdown>
        // ) : (
        //   <div
        //     className="btn-main btn-colorful"
        //     onClick={() => {
        //       if (!connected) {
        //         setVisible(true);
        //       } else {
        //         navigate("/app/account");
        //       }
        //     }}
        //   >
        //     {!connected ? "Connect Wallet" : "Console"}
        //   </div>
        // )
      ) : (
        <img
          src={ImgHomepage.IconMenu}
          className="w-6 h-6"
          onClick={() => {
            setMenuShow((show) => !show);
          }}
        />
      )}
    </div>
  );
};

export default HomeHeader;
