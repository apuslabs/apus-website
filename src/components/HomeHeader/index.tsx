import { FC, useState } from "react";
import { ImgHomepage } from "../../assets/image";
import { useNavigate, Link } from "react-router-dom";
import { useBreakpoint } from "../../utils/react-use";
import { HeaderMenuList } from "../../config/menu";

const HomeHeader: FC<{ showUserInfo?: boolean }> = ({
  showUserInfo = false,
}) => {
  const breakpoint = useBreakpoint();
  const isTablet = breakpoint === "mobile";
  const [menuShow, setMenuShow] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div
      className="h-16 md:h-[100px] w-full
      fixed t-0 l-0 r-0 px-5 md:px-12
      flex items-center justify-between
      md:border-b border-solid border-black
      backdrop-blur-3xl z-20"
      style={{
        background: menuShow
          ? "#4c4c4c"
          : !isTablet
            ? "linear-gradient(to bottom, rgba(74,34,235,25%) 0%, rgba(74,34,235,0) 100%)"
            : "#ffffff",
      }}
    >
      <div className="h-full flex items-center" onClick={() => navigate("/")}>
        <img
          src={
            menuShow
              ? ImgHomepage.LogoHorizonalWhite
              : ImgHomepage.LogoHorizonal
          }
          alt="Apus Logo"
          className="h-6 md:h-12"
        />
      </div>
      {!showUserInfo ? (
        <div
          className={`fixed top-16 left-0 right-0 flex-1 h-screen md:h-full md:top-0 md:relative
            ${isTablet ? "bg-[rgba(0,0,0,0.5)] backdrop-blur-3xl" : ""}
            md:text-[#333333] text-white`}
          style={isTablet ? (menuShow ? {} : { display: "none" }) : {}}
          onClick={() => {
            setMenuShow(false);
          }}
        >
          <ul
            className="flex-col justify-center items-center gap-12
            font-semibold text-xl
            md:h-full md:flex md:flex-row bg-[#4c4c4c] md:bg-transparent
            z-20"
          >
            {HeaderMenuList.map((item) => (
              <Link key={item.name} to={item.path}>
                <li className="menu-colorful" key={item.name}>
                  {item.name}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      ) : null}

      {!isTablet ? (
        <div
          className="btn-main btn-colorful"
          onClick={() => {
            navigate("/console/competition/");
          }}
        >
          {"Console"}
        </div>
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
