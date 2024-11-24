/// <reference types="vite/client" />=

interface NavigationMenuType {
  name: string;
  path: string;
  icon?: string;
  onClick?: () => void;
}

// window.ethereum
declare interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum: any;
}
