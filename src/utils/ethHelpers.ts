import { message, result } from "@permaweb/aoconnect";
import { SendMessageArgs } from "@permaweb/aoconnect/dist/lib/message";
import { createData } from "@dha-team/arbundles";
import { EthereumSigner } from "./ethsigner";
import { WalletState } from "@web3-onboard/core";

const EthereumSignerMap = new Map<string, EthereumSigner>();

function getEthereumSigner(wallet: WalletState) {
  const walletAddress = wallet.accounts[0]?.address;
  if (!EthereumSignerMap.has(walletAddress)) {
    EthereumSignerMap.set(walletAddress, new EthereumSigner(wallet));
  }
  return EthereumSignerMap.get(walletAddress)!;
}

export async function sendEthMessage(wallet: WalletState, args: Omit<SendMessageArgs, "signer">) {
  const ethSigner = getEthereumSigner(wallet);
  await ethSigner.getPublicKey();
  const messageId = await message({
    ...args,
    signer: async ({ data, tags, target, anchor }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dataItem = createData(data, ethSigner, { tags: tags as any, target, anchor });
      await dataItem.sign(ethSigner);
      return {
        id: dataItem.id,
        raw: await dataItem.getRaw(),
      };
    },
  });
  const ret = await result({ process: args.process, message: messageId });
  if (ret.Error) {
    throw new Error(ret.Error);
  }
  return ret;
}
