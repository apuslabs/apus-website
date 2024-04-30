import { FC } from "react";
import "./index.less";
import { Button } from "antd";
import { RightOutlined, TwitterOutlined } from "@ant-design/icons";
import { AbyssWorldLogo, ArweaveLogo, Dephy, FooterIcon, ImgHomepage, Lagrange, Novita, Omnilnfer, PPIOLogo, Punet, SolanaLogo, TelegramIcon, TwitterIcon } from "../../assets/image";
import { Link, useNavigate } from "react-router-dom";
import { FooterMenuList, FooterSocialMediaList } from "../../config/menu";
// import TelegramIcon from "../../assets/telegram-fill.svg";
// import TwitterIcon from "../../assets/twitter.svg";

interface HomeFooterProps {
  showCompany?: boolean;
}

const HomeFooter: FC<HomeFooterProps> = (props) => {
  const { showCompany } = props;
  const navigate = useNavigate()

  return (
    <div className="flex px-12 py-16" style={{
      backgroundColor: "#0B0B0B"
    }}>
      <div className="flex-1 flex flex-col justify-between">
        <img src={ImgHomepage.LogoHorizonalWhite} className="h-8 w-80" />
        <div className="text-base" style={{ color: "rgba(255,255,255,0.5)" }}>Copyright © Apus.Network 2024. All rights reserved</div>
      </div>
      <div>
        <div className="mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>Navigation</div>
        <div className="flex flex-col gap-4">
        {FooterMenuList.map(({ name, path }) => (
          <Link to={path} className="text-base" key={name}>{name}</Link>
        ))}
        </div>
      </div>
      <div className="ml-32">
        <div className="mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>Social Media</div>
        <div className="flex flex-col gap-4">
        {FooterSocialMediaList.map(({ name, path }) => (
          <Link to={path} className="text-base" key={name}>{name}</Link>
        ))}
        </div>
      </div>
    </div>
  );
};

HomeFooter.defaultProps = {
  showCompany: true,
};

export default HomeFooter;
