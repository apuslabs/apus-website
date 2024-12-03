import { message, result } from "@permaweb/aoconnect";
import { SendMessageArgs } from "@permaweb/aoconnect/dist/lib/message";
import { createData } from "@dha-team/arbundles";
import { EthereumSigner } from "../pages/mint/ethsigner";
import { message as messageUI } from "antd";
import { ethers } from "ethers";

const EthereumSignerMap = new Map<string, EthereumSigner>();

function getEthereumSigner(walletAddress: string) {
  if (!EthereumSignerMap.has(walletAddress)) {
    EthereumSignerMap.set(walletAddress, new EthereumSigner(walletAddress));
  }
  return EthereumSignerMap.get(walletAddress)!;
}

export async function sendEthMessage(walletAddress: string, args: Omit<SendMessageArgs, "signer">) {
  try {
    const ethSigner = getEthereumSigner(ethers.utils.getAddress(walletAddress));
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
    return await result({ process: args.process, message: messageId });
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof Error) {
      messageUI.error(e.message);
    } else {
      messageUI.error("Failed to send Ethereum message");
    }
  }
}
