import { ImgCommon } from "../../assets";
const { IconDiscord, IconMedium, IconTelegram, IconX, IconLinkedin } = ImgCommon;

export const FooterSocialMediaList: NavigationMenuType[] = [
  {
    name: "Twitter",
    path: "https://twitter.com/intent/follow?screen_name=apus_network",
    icon: IconX,
  },
  {
    name: "Telegram",
    path: "https://t.me/apus_network",
    icon: IconTelegram,
  },
  {
    name: "Discord",
    path: "https://discord.gg/NVqpWB2m8k",
    icon: IconDiscord,
  },
  {
    name: "LinkedIn",
    path: "https://sg.linkedin.com/company/apus-network",
    icon: IconLinkedin,
  },
  {
    name: "Medium",
    path: "https://medium.com/@apusnetwork",
    icon: IconMedium,
  },
];
