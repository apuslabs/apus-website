import { notification } from "antd";

const DocLink = "https://apus-network.gitbook.io/apus-console-docs/";

export const HomeHeaderMenuList: NavigationMenuType[] = [
  {
    name: "TEAM",
    path: "/team",
  },
  // {
  //   name: "Mint",
  //   path: "/mint",
  // },
  {
    name: "ROADMAP",
    path: "/?anchor=roadmap",
  },
  {
    name: "DOCS",
    path: DocLink,
  },
  {
    name: "LITEPAPER",
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
