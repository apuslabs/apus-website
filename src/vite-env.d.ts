/// <reference types="vite/client" />=

interface NavigationMenuType {
  name: string;
  path: string;
  icon?: string;
}

// .riv extension
declare module '*.riv' {
  const content: string;
  export default content;
}

// window.ethereum
declare interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setApusContract: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMirrorContract: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gtag: any;
}
