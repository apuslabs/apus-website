import { notification } from "antd";
import {
  IconDiscord,
  IconMedium,
  IconTelegram,
  IconX,
  IconLinkedin,
} from "../assets/common/common";

interface menuType {
  name: string;
  path: string;
  icon?: string;
  onClick?: () => void;
}

export const DocLink = "https://apus-network.gitbook.io/apus-console-docs/";

export const HeaderMenuList: menuType[] = [
  {
    name: "Team",
    path: "/team",
  },
  {
    name: "Docs",
    path: DocLink,
  },
  {
    name: "Roadmap",
    path: "/?anchor=roadmap",
  },
  {
    name: "Litepaper",
    path: "",
    onClick: () => {
      notification.open({
        type: "info",
        message: "Coming Soon!",
        description: "Litepaper will be public soon.",
      });
    },
  },
  // {
  //   name: 'Task',
  //   path: '/home/task'
  // },
  // {
  //   name: 'Galxe Events',
  //   path: 'https://app.galxe.com/quest/8FWGXFwnzm3xkWkRiKzopd/GCUaQtzyws'
  // }
];

export const FooterMenuList: menuType[] = [
  // {
  //   name: 'Ecosystem',
  //   path: '/home/ecosystem'
  // },
  // {
  //   name: 'Playground',
  //   path: 'https://playground.apus.network/'
  // },
  // {
  //   name: 'Task',
  //   path: '/home/task'
  // },
  {
    name: "Docs",
    path: "https://apus-network.gitbook.io/apus-console-docs/",
  },
  // {
  //   name: 'Galxe Events',
  //   path: 'https://app.galxe.com/quest/8FWGXFwnzm3xkWkRiKzopd/GCUaQtzyws'
  // },
  {
    name: "Brand Kits",
    path: "https://apusnetwork.notion.site/c8a7f84bf0814822b917cd3178fe048c?v=e95ed9ee42cd4bf6983490181969fc79&pvs=4",
  },
];

export const FooterSocialMediaList: menuType[] = [
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

export const ConsoleHeaderList: menuType[] = [
  {
    name: "Competition Pools",
    path: "/console/competition/1003",
  },
  {
    name: "Playground",
    path: "/console/playground/1003",
  },
];
