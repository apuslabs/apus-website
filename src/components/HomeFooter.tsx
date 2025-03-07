import { ImgHomepage } from "../assets";
import { Link } from "react-router-dom";
import { SocialMediaList } from "./SocialMediaList";
import { useBreakpoint } from "../utils/react-use";
import { FeedbackFish } from "@feedback-fish/react";

const HomeFooterMenuList: NavigationMenuType[] = [
  {
    name: "Docs",
    path: "https://apus-network.gitbook.io/apus-console-docs/",
  },
  {
    name: "Brand Kits",
    path: "https://apusnetwork.notion.site/c8a7f84bf0814822b917cd3178fe048c?v=e95ed9ee42cd4bf6983490181969fc79&pvs=4",
  },
];

function HomeFooterMobile() {
  return (
    <div className="flex flex-col items-center py-10 gap-10 bg-[#191919] text-white">
      <img src={ImgHomepage.LogoHorizonal} className="invert h-[25px]" />
      <div className="flex flex-col gap-4">
        <div style={{ color: "rgba(255,255,255,0.5)" }}>Navigation</div>
        {HomeFooterMenuList.map(({ name, path }) => (
          <Link to={path} className="text-white" key={name}>
            {name}
          </Link>
        ))}
        <FeedbackFish projectId="bbf0e91842cb41">
          <div className="text-white">Feedback</div>
        </FeedbackFish>
      </div>
      <SocialMediaList className="invert small" />
      <div
        style={{
          color: "rgba(255,255,255,0.5)",
        }}
      >
        Copyright © Apus.Network 2024. All rights reserved
      </div>
    </div>
  );
}

function HomeFooter() {
  const breakpoint = useBreakpoint();
  const isTablet = breakpoint === "mobile";
  if (isTablet) {
    return <HomeFooterMobile />;
  }
  return (
    <div className="px-[268px] pt-[64px] pb-[44px] bg-[#191919] text-white">
      <div className="flex mb-[120px]">
        <img src={ImgHomepage.LogoHorizonal} className="invert h-[30px] mr-[100px]" />
        <div>
          <div className="mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            Navigation
          </div>
          <div className="flex flex-col gap-4">
            {HomeFooterMenuList.map(({ name, path }) => (
              <Link to={path} className="text-white" key={name}>
                {name}
              </Link>
            ))}
            <FeedbackFish projectId="bbf0e91842cb41">
              <div className="text-white cursor-pointer">Feedback</div>
            </FeedbackFish>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Copyright © Apus.Network 2024. All rights reserved
        </div>
        <SocialMediaList className="invert" />
      </div>
    </div>
  );
}

export default HomeFooter;
