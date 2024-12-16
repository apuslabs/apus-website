/// <reference types="vite/client" />=

interface NavigationMenuType {
  name: string;
  path: string;
  icon?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

// window.ethereum
declare interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setApusContract: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMirrorContract: any;
}
