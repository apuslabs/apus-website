import { FC } from "react";
import { ImgHomepage } from "../assets";
import { Link } from "react-router-dom";
import "./headerfooter.css";

const HomeHeader: FC<{ Userbox?: React.ReactNode }> = ({ Userbox }) => {
  return (
    <div className="fixed top-0 left-0 right-0 w-full h-[120px] bg-white border-b-1 border-b-[#d9d9d9] font-space-mono z-20">
      <div className="content-area flex justify-between items-center gap-4">
        <Link to="/">
          <img src={ImgHomepage.LogoHorizonal} className="w-[146px] cursor-pointer" alt="Apus Logo" />
        </Link>
        <ul className="flex gap-12 text-lg nav">
          <Link to="/team">
            <li>Team</li>
          </Link>
          <Link to="/mint">
            <li>Mint</li>
          </Link>
          <Link to="/#roadmap">
            <li>Roadmap</li>
          </Link>
          <Link to="https://mirror.xyz/0xE84A501212d68Ec386CAdAA91AF70D8dAF795C72" target="_blank">
            <li>Blog</li>
          </Link>
          <Link
            to="https://r2krpzvyn24gq75rtedeo56vpiyxvcya2xsntoeaz7ursparocea.arweave.net/jpUX5rhuuGh_sZkGR3fVejF6iwDV5Nm4gM_pGTwRcIg"
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
        </ul>

        {Userbox || (
          <Link to="/console/competitions">
            <div className="flex items-center justify-center px-5 py-4 bg-[#3242f5] text-white cursor-pointer rounded-lg hover:bg-[#1e30c9]">
              {"Competition Pools"}
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomeHeader;
