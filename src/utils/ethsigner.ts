import { WalletState } from "@web3-onboard/core";
import { Buffer } from "buffer";
import { ethers } from "ethers";

export class EthereumSigner {
  private walletAddress: string;
  private pk: string;
  private signer: ethers.Signer;

  public signatureLength = 65;
  public ownerLength = 65;
  public signatureType = 3;

  constructor(wallet: WalletState) {
    if (!window.ethereum) {
      throw new Error("Ethereum provider not found");
    }
    this.walletAddress = wallet.accounts[0]?.address;
    this.pk = "";
    const provider = new ethers.providers.Web3Provider(wallet.provider);
    this.signer = provider.getSigner(this.walletAddress);
  }

  async getPublicKey() {
    if (!this.pk) {
      const messageHash = ethers.utils.hashMessage("Get public key");
      const sig = await this.signer.signMessage("Get public key");
      const recoveredPublickKey = ethers.utils.recoverPublicKey(messageHash, sig);
      this.pk = recoveredPublickKey;
    }
  }

  get publicKey(): Buffer {
    return Buffer.from(this.pk.slice(2), "hex");
  }

  async sign(message: Uint8Array): Promise<Uint8Array> {
    try {
      if (this.signer !== undefined) {
        console.log("message", Buffer.from(message).toString("hex"));
        const sig = await this.signer?.signMessage(message);
        // const sig = await this.signer._signTypedData(
        //   {
        //     name: "Bundlr",
        //     version: "1",
        //   },
        //   {
        //     Bundlr: [
        //       // { name: "Transaction hash", type: "bytes" },
        //       // { name: "address", type: "address" },
        //       { name: "content", type: "bytes" },
        //     ],
        //   },
        //   {
        //     // address: this.walletAddress,
        //     // "Transaction hash": message,
        //     content: message,
        //   },
        // );
        console.log(sig);
        return Uint8Array.from(Buffer.from(sig.slice(2), "hex"));
      }
      throw new Error("Signer not initialized");
    } catch (error) {
      throw new Error(`Failed to sign message: ${(error as Error).message}`);
    }
  }

  static async verify(): Promise<boolean> {
    throw new Error("Verify not supported for browser-based signing.");
  }
}
