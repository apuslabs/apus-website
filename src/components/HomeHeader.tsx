import { FC, useLayoutEffect, useState } from "react";
import { ImgHomepage } from "../assets";
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

const HomeHeader: FC<{ Userbox?: React.ReactNode }> = ({ Userbox }) => {
  const breakpoint = useBreakpoint();
  const isTablet = breakpoint === "mobile";
  const [menuShow, setMenuShow] = useState<boolean>(false);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const realpath = window.location.hash.replace("#", "").split("?")[1];
    const params = new URLSearchParams(realpath);
    const anchor = params.get("anchor");
    if (anchor) {
      scrollToAnchor(anchor);
    }
  }, []);

  return (
    <div
      className="header-container"
      style={{
        background: menuShow ? "#4c4c4c" : "rgba(255,255,255,0.33)",
      }}
    >
      <div className="h-full flex items-center cursor-pointer" onClick={() => navigate("/")}>
        <img
          src={menuShow ? ImgHomepage.LogoHorizonalWhite : ImgHomepage.LogoHorizonal}
          alt="Apus Logo"
          className="md:w-40"
        />
      </div>
      <div
        className={`fixed top-16 left-0 right-0 flex-1 h-screen md:h-full md:top-0 md:relative
          ${isTablet ? "bg-[rgba(0,0,0,0.5)] backdrop-blur-3xl" : ""}
          md:text-gray21 text-white`}
        style={isTablet ? (menuShow ? {} : { display: "none" }) : {}}
        onClick={() => {
          setMenuShow(false);
        }}
      >
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
              <li className="menu-colorful" key={item.name}>
                {item.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>

      {!isTablet ? (
        Userbox || (
          <div
            className="btn-main btn-colorful"
            onClick={() => {
              navigate("/console/competitions");
            }}
          >
            {"Competition Pools"}
          </div>
        )
      ) : (
        <img
          src={!menuShow ? ImgHomepage.IconMenu : ImgHomepage.IconMenuWhite}
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
