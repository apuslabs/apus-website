import { init } from "@web3-onboard/react";
import injectedModule, { ProviderLabel } from "@web3-onboard/injected-wallets";
import trezorModule from "@web3-onboard/trezor";
import walletConnectModule from "@web3-onboard/walletconnect";
import safeModule from "@web3-onboard/gnosis";
import torusModule from "@web3-onboard/torus";

const { MetaMask, Trust, Coinbase, Brave } = ProviderLabel;
const injected = injectedModule({
  displayUnavailable: [Coinbase, Brave, MetaMask, Trust],
});
const safe = safeModule();
const torus = torusModule();
const trezorOptions = {
  email: "jax@apus.com",
  appUrl: "https://www.blocknative.com",
};

const trezor = trezorModule(trezorOptions);
const walletConnect = walletConnectModule({
  projectId: "1854ae39b9f92e1c56b858cb425e9a7e",
});

const appMetadata = {
  name: "Apus Network",
  icon: `<svg width="13" height="9" viewBox="0 0 52 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M50.1019 6.76303C50.1019 10.2683 47.2396 13.1081 43.7066 13.1081C40.1735 13.1081 37.3112 10.2683 37.3112 6.76303C37.3112 3.25777 40.1735 0.417969 43.7066 0.417969C47.2396 0.417969 50.1019 3.25777 50.1019 6.76303ZM26.6888 11.7385C26.6732 11.8391 26.6498 11.9397 26.6342 12.0403L26.0336 15.5533C25.8777 16.4509 26.0882 17.3717 26.6264 18.1145C27.1567 18.8573 27.9678 19.3603 28.8725 19.5151L33.0997 20.2269H33.1075C34.5113 20.5519 35.7904 21.2716 36.7887 22.3007C37.787 23.3298 38.4577 24.6221 38.7229 26.0303C38.9881 27.4309 38.8321 28.8856 38.2705 30.1933C37.709 31.5088 36.7809 32.6308 35.5798 33.4278C34.3865 34.2248 32.9827 34.6503 31.5399 34.6581C30.1048 34.6658 28.6932 34.2635 27.4843 33.4819C26.2754 32.7081 25.3239 31.6016 24.7468 30.2939C24.1696 28.9862 23.9903 27.5392 24.232 26.1309L24.8872 22.3239C25.0431 21.4263 24.8248 20.5055 24.2944 19.7627C23.7641 19.0198 22.953 18.5169 22.0483 18.3621L18.5776 17.774C17.1192 17.5961 15.7387 16.9925 14.6312 16.033C13.516 15.0735 12.7204 13.8122 12.3383 12.4039C11.9561 10.9957 12.0107 9.50224 12.4943 8.1249C12.9778 6.74755 13.8591 5.54044 15.0368 4.66606C16.2145 3.79168 17.6339 3.28872 19.1002 3.21908C20.5664 3.14944 22.0249 3.52086 23.2805 4.27917C24.5362 5.03748 25.5345 6.15948 26.1428 7.48265C26.7512 8.81357 26.9461 10.2915 26.7044 11.7307M51.1002 24.4363C51.1002 26.8119 49.1582 28.7386 46.7638 28.7386C44.3695 28.7386 42.4275 26.8119 42.4275 24.4363C42.4275 22.0608 44.3695 20.1341 46.7638 20.1341C49.1582 20.1341 51.1002 22.0608 51.1002 24.4363ZM14.717 28.4755C14.717 32.507 11.4258 35.7801 7.35462 35.7801C3.28345 35.7801 0 32.507 0 28.4755C0 24.4441 3.29905 21.171 7.36242 21.171C11.4258 21.171 14.7248 24.4363 14.7248 28.4755" fill="#212121"/></svg>`,
  description: "Apus Network",
  recommendedInjectedWallets: [{ name: "MetaMask", url: "https://metamask.io" }],
};

const onboard = init({
  wallets: [injected, trezor, walletConnect, torus, safe],
  chains: [
    {
      id: "0x1",
      token: "ETH",
      label: "Ethereum Mainnet",
      rpcUrl: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    },
  ],
  appMetadata,
  connect: {
    autoConnectLastWallet: true,
  },
});

setInterval(() => {
  console.log(onboard.state.get().wallets.length);
}, 10000);
