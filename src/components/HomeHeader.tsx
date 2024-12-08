import { FC, useLayoutEffect, useState } from "react";
import { ImgCommon, ImgHomepage } from "../assets";
import { useNavigate, Link } from "react-router-dom";
import { useBreakpoint } from "../utils/react-use";
import { HomeHeaderMenuList } from "./constants";
import "./headerfooter.css";

function scrollToAnchor(anchor: string) {
  if (!anchor) return;
  const target = document.querySelector("#" + anchor);
  if (target) {
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 80,
      behavior: "smooth",
    });
  }
}

function HomeHeaderMobile() {
  const [menuShow, setMenuShow] = useState<boolean>(false);
  return (
    <>
      <div className="header-container bg-white">
        <img src={ImgCommon.IconMenu} onClick={() => setMenuShow(!menuShow)} />
        <Link to="/">
          <img src={ImgCommon.IconLogo} />
        </Link>
        <img src={ImgCommon.IconWallet} />
      </div>
      <div
        className={`fixed top-[60px] left-0 right-0 flex-1 h-screen`}
        style={{
          display: menuShow ? "block" : "none",
          background: "rgba(255,255,255,0.95)",
        }}
        onClick={() => {
          setMenuShow(false);
        }}
      >
        <ul className="flex-col justify-center items-center gap-12 font-medium z-20 bg-white border-t-1 border-solid border-grayd8">
          {HomeHeaderMenuList.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={
                item.onClick
                  ? item.onClick
                  : () => {
                      if (item.path.includes("?anchor")) {
                        const anchor = item.path.split("?anchor=")[1];
                        scrollToAnchor(anchor);
                      }
                    }
              }
            >
              <li className="h-[60px] px-5 leading-[60px] border-b-1 border-solid border-grayd8" key={item.name}>
                {item.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
}

const HomeHeader: FC<{ Userbox?: React.ReactNode }> = ({ Userbox }) => {
  const breakpoint = useBreakpoint();
  const isTablet = breakpoint === "mobile";
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const realpath = window.location.hash.replace("#", "").split("?")[1];
    const params = new URLSearchParams(realpath);
    const anchor = params.get("anchor");
    if (anchor) {
      scrollToAnchor(anchor);
    }
  }, []);

  if (isTablet) {
    return <HomeHeaderMobile />;
  }

  return (
    <div
      className="header-container"
      style={{
        background: "rgba(255,255,255,0.9)",
      }}
    >
      <div className="h-full flex items-center cursor-pointer" onClick={() => navigate("/")}>
        <img src={ImgHomepage.LogoHorizonal} alt="Apus Logo" className="md:w-40" />
      </div>
      <div className={`fixed md:h-full md:top-0 md:relative md:text-gray21 text-white`}>
        <ul
          className="flex-col justify-center items-center gap-12
          font-medium text-base
          md:h-full md:flex md:flex-row bg-[#4c4c4c] md:bg-transparent
          z-20"
        >
          {HomeHeaderMenuList.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={
                item.onClick
                  ? item.onClick
                  : () => {
                      if (item.path.includes("?anchor")) {
                        const anchor = item.path.split("?anchor=")[1];
                        scrollToAnchor(anchor);
                      }
                    }
              }
            >
              <li key={item.name}>{item.name}</li>
            </Link>
          ))}
        </ul>
      </div>

      {Userbox || (
        <div
          className="btn-main btn-colorful"
          onClick={() => {
            navigate("/console/competitions");
          }}
        >
          {"Competition Pools"}
        </div>
      )}
    </div>
  );
};

export default HomeHeader;
