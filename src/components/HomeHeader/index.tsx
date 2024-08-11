import { FC, useState } from "react";
import { ImgHomepage } from "../../assets/image";
import { useNavigate, Link } from "react-router-dom";
import { useBreakpoint } from "../../utils/react-use";
import { HeaderMenuList } from "../../config/menu";
import { useArweaveContext } from "../../contexts/arconnect";

const HomeHeader: FC<{ showUserInfo?: boolean }> = ({
  showUserInfo = false,
}) => {
  const breakpoint = useBreakpoint();
  const isTablet = breakpoint === "mobile";
  const [menuShow, setMenuShow] = useState<boolean>(false);
  const navigate = useNavigate();
  const { activeAddress, connectWallet } = useArweaveContext();

  return (
    <div
      className="h-20 w-full fixed t-0 l-0 r-0 px-5 md:px-12 flex items-center justify-between backdrop-blur-3xl z-20"
      style={{
        backgroundColor: menuShow ? "#111111" : "rgba(0,0,0,0.5)",
      }}
    >
      <div className="h-full flex items-center" onClick={() => navigate("/")}>
        <img src={ImgHomepage.LogoHorizonal} alt="Apus Logo" className="h-6" />
      </div>
      {!showUserInfo ? (
        <div
          className={`fixed top-20 left-0 right-0 flex-1 h-screen md:h-full md:top-0 md:relative bg-[rgba(0,0,0,0.8)] md:bg-transparent`}
          style={isTablet ? (menuShow ? {} : { display: "none" }) : {}}
          onClick={() => {
            setMenuShow(false);
          }}
        >
          <ul className="flex-col justify-center items-center gap-12 md:h-full md:flex md:flex-row bg-[#111111] md:bg-transparent z-20">
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
            navigate("/console/competition/")
          }}
        >
          {"Console"}
        </div>
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
