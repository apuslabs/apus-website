import { notification } from "antd";

const DocLink = "https://apus-network.gitbook.io/apus-console-docs/";

export const HomeHeaderMenuList: NavigationMenuType[] = [
  {
    name: "Team",
    path: "/team",
  },
  {
    name: "Mint",
    path: "/mint",
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
];

export const HomeFooterMenuList: NavigationMenuType[] = [
  {
    name: "Docs",
    path: "https://apus-network.gitbook.io/apus-console-docs/",
  },
  {
    name: "Brand Kits",
    path: "https://apusnetwork.notion.site/c8a7f84bf0814822b917cd3178fe048c?v=e95ed9ee42cd4bf6983490181969fc79&pvs=4",
  },
];

export const ConsoleHeaderMenuList: NavigationMenuType[] = [
  {
    name: "Competition Pools",
    path: "/console/competitions",
  },
  {
    name: "Playground",
    path: "/console/playground/1004",
  },
];
