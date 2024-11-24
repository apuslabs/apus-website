export function createHash(algorithm: string) {
  if (algorithm !== "sha256") {
    throw new Error(`Unsupported hash algorithm: ${algorithm}`);
  }

  return {
    data: new Uint8Array(),

    update(data: string | Uint8Array): this {
      if (typeof data === "string") {
        data = new TextEncoder().encode(data);
      }
      this.data = new Uint8Array([...this.data, ...data]);
      return this;
    },

    async digest(): Promise<Uint8Array> {
      const hashBuffer = await crypto.subtle.digest("SHA-256", this.data);
      return new Uint8Array(hashBuffer);
    },

    async digestHex(): Promise<string> {
      const hashArray = await this.digest();
      return Array.from(hashArray)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    },
  };
}

export const constants = {
  RSA_PKCS1_PADDING: 1,
  RSA_PKCS1_PSS_PADDING: 6,
  RSA_NO_PADDING: 3,
  RSA_PKCS1_OAEP_PADDING: 4,
  RSA_X931_PADDING: 5,
  RSA_PKCS1_SHA256: 12,
  RSA_PKCS1_SHA384: 13,
  RSA_PKCS1_SHA512: 14,
  // 添加其他需要的常量
};

export function createSign(algorithm: string) {
  if (!["RSA-SHA256", "ECDSA-SHA256"].includes(algorithm)) {
    throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  return {
    key: null as CryptoKey | null,
    data: new Uint8Array(),

    async update(data: string | Uint8Array): Promise<this> {
      if (typeof data === "string") {
        data = new TextEncoder().encode(data);
      }
      this.data = new Uint8Array([...this.data, ...data]);
      return this;
    },

    setPrivateKey(privateKey: CryptoKey) {
      this.key = privateKey;
    },

    async sign(privateKey: string | CryptoKey): Promise<ArrayBuffer> {
      if (!this.key && typeof privateKey === "string") {
        throw new Error("Private key must be a CryptoKey object.");
      }
      const key = this.key || privateKey;
      const algo = algorithm === "RSA-SHA256" ? "RSASSA-PKCS1-v1_5" : "ECDSA";
      const hash = { name: "SHA-256" };

      if (!(key instanceof CryptoKey)) {
        throw new Error("Invalid private key.");
      }

      return crypto.subtle.sign({ name: algo, hash }, key, this.data);
    },
  };
}
