import { FC } from "react";
import "./index.less";
import { ImgHomepage } from "../../assets/image";
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
    <div className="flex px-5 py-28 md:px-12 md:py-16 md:justify-end gap-32 relative" style={{
      backgroundColor: "#0B0B0B"
    }}>
      <img src={ImgHomepage.LogoHorizonalWhite} className="absolute left-5 top-12 md:left-12 md:top-16 h-5 md:h-8 w-50 md:w-80" />
      <div className="absolute left-5 bottom-12 md:bottom-16 md:left-12 text-base" style={{ color: "rgba(255,255,255,0.5)" }}>Copyright © Apus.Network 2024. All rights reserved</div>
      <div>
        <div className="mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>Navigation</div>
        <div className="flex flex-col gap-4">
        {FooterMenuList.map(({ name, path }) => (
          <Link to={path} className="text-base" key={name}>{name}</Link>
        ))}
        </div>
      </div>
      <div>
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
