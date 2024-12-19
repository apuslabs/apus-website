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
    path: "https://yoiqojo25iwvlwjsftpnv5jvzvtqvaguciaeewl4cfe5b7inqpnq.arweave.net/w5EHJdrqLVXZMize2vU1zWcKgNQSAEJZfBFJ0P0Ng9s",
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
