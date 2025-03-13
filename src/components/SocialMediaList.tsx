import { ImgCommon } from "../assets";

const FooterSocialMediaList: NavigationMenuType[] = [
  {
    name: "Twitter",
    path: "https://twitter.com/intent/follow?screen_name=apus_network",
    icon: ImgCommon.IconX,
  },
  {
    name: "Telegram",
    path: "https://t.me/apus_network",
    icon: ImgCommon.IconTelegram,
  },
  {
    name: "Discord",
    path: "https://discord.gg/NVqpWB2m8k",
    icon: ImgCommon.IconDiscord,
  },
  {
    name: "LinkedIn",
    path: "https://sg.linkedin.com/company/apus-network",
    icon: ImgCommon.IconLinkedin,
  },
  {
    name: "Medium",
    path: "https://medium.com/@apusnetwork",
    icon: ImgCommon.IconMedium,
  },
];

export function SocialMediaList({ className }: { className?: string }) {
  return (
    <div className={`social-media-container ${className}`}>
      {FooterSocialMediaList.map(({ name, path, icon }) => (
        <a href={path} key={name} target="__blank">
          <img src={icon} className="hero-social-media-icon" />
        </a>
      ))}
    </div>
  );
}
