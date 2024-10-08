import { FC } from "react";
import { ImgHomepage } from "../../assets/image";
import { Link } from "react-router-dom";
import { FooterMenuList, FooterSocialMediaList } from "../../config/menu";

interface HomeFooterProps {
  showCompany?: boolean;
}

const HomeFooter: FC<HomeFooterProps> = () => {
  return (
    <div
      className="flex px-5 py-28 md:px-12 md:py-16 md:justify-end gap-32 relative"
      style={{
        backgroundColor: "#4c4c4c",
      }}
    >
      <img
        src={ImgHomepage.LogoHorizonalWhite}
        className="absolute left-5 top-12 md:left-12 md:top-16 h-6 md:h-11 w-28 md:w-52"
      />
      <div
        className="absolute left-5 bottom-12 md:bottom-16 md:left-12 text-base"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        Copyright © Apus.Network 2024. All rights reserved
      </div>
      <div>
        <div className="mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
          Navigation
        </div>
        <div className="flex flex-col gap-4">
          {FooterMenuList.map(({ name, path }) => (
            <Link to={path} className="text-base text-white" key={name}>
              {name}
            </Link>
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
