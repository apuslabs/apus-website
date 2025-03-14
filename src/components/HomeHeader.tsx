import { FC, useEffect, useState } from "react";
import { ImgCommon, ImgHomepage } from "../assets";
import { Link, useLocation } from "react-router-dom";
import "./headerfooter.css";
import { useBreakpoint } from "../utils/react-use";

const scrollToAnchor = (anchor: string) => {
  const el = document.getElementById(anchor);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block:"nearest" });
  }
};

function useAnchor() {
  const location = useLocation()
   useEffect(() => {
     const params = new URLSearchParams(location.search.slice(1));
     const anchor = params.get("anchor");
     console.log(anchor)
     if (anchor) {
       scrollToAnchor(anchor);
     } else {
        window.scrollTo(0, 0);
     }
   }, [location]);
  }

export const LIGHTPAPER_LINK = "https://r2krpzvyn24gq75rtedeo56vpiyxvcya2xsntoeaz7ursparocea.arweave.net/jpUX5rhuuGh_sZkGR3fVejF6iwDV5Nm4gM_pGTwRcIg"

const HomeHeader: FC<{ Userbox?: React.ReactNode }> = ({ Userbox }) => {
  useAnchor();
  const breakpoint = useBreakpoint()
  const [navHide, setNavHide] = useState(true);
  return (
    <div className="fixed top-0 left-0 right-0 w-full h-[80px] md:h-[120px] bg-white border-b-1 border-b-[#d9d9d9] font-space-mono z-30">
      <div className="content-area px-4 flex justify-between items-center gap-4">
        <Link to="/">
          <img src={breakpoint === "mobile" ? ImgCommon.IconLogo : ImgHomepage.LogoHorizonal} className="w-auto md:w-[146px] h-10 md:h-auto cursor-pointer" alt="Apus Logo" />
        </Link>
        <ul className="fixed md:relative top-[80px] md:top-0 left-0 md:h-auto w-screen md:w-auto flex flex-col justify-center md:flex-row md:gap-12 text-lg header-nav" style={{
          display: breakpoint === "mobile" && navHide ? "none" : "flex",
        }}>
          <Link to="/mint">
            <li>Mint</li>
          </Link>
          <Link to="/?anchor=roadmap" onClick={() => scrollToAnchor("roadmap")}>
            <li>Roadmap</li>
          </Link>
          <Link to="https://mirror.xyz/0xE84A501212d68Ec386CAdAA91AF70D8dAF795C72" target="_blank">
            <li>Blog</li>
          </Link>
          <Link
            to={LIGHTPAPER_LINK}
            target="_blank"
          >
            <li>Litepaper</li>
          </Link>
          <Link
            to="https://yoiqojo25iwvlwjsftpnv5jvzvtqvaguciaeewl4cfe5b7inqpnq.arweave.net/w5EHJdrqLVXZMize2vU1zWcKgNQSAEJZfBFJ0P0Ng9s"
            target="_blank"
          >
            <li>Tokenomics</li>
          </Link>
          <Link to="/team">
            <li>Team</li>
          </Link>
        </ul>

        {Userbox || (
          <>
          <Link to="/console/competitions">
            <div className="hidden md:flex items-center justify-center px-5 py-4 bg-[#3242f5] text-white cursor-pointer rounded-lg hover:bg-[#1e30c9]">
              {"Competition Pools"}
            </div>
          </Link>
          <img src={ImgCommon.IconMenu} className="block md:hidden w-6" onClick={() => {
            setNavHide(!navHide);
          }} />
          </>
        )}
      </div>
    </div>
  );
};

export default HomeHeader;
