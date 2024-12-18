import { scrollToAnchor } from "../utils/scroll";

const DocLink = "https://apus-network.gitbook.io/apus-console-docs/";

export const HomeHeaderMenuList: NavigationMenuType[] = [
  {
    name: "TEAM",
    path: "/team",
  },
  // {
  //   name: "MINT",
  //   path: "/mint",
  // },
  {
    name: "ROADMAP",
    path: "/roadmap",
    onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      scrollToAnchor("roadmap");
    },
  },
  {
    name: "DOCS",
    path: DocLink,
  },
  {
    name: "LITEPAPER",
    path: "https://r2krpzvyn24gq75rtedeo56vpiyxvcya2xsntoeaz7ursparocea.arweave.net/jpUX5rhuuGh_sZkGR3fVejF6iwDV5Nm4gM_pGTwRcIg",
  },
  {
    name: "TOKENOMICS",
    path: "https://3csodbzc3eweix6qkukrbfzr42v3stx7rh6xpg5vlkebap4p6eza.arweave.net/2KThhyLZLERf0FUVEJcx5qu5Tv-J_XebtVqIED-P8TI",
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
