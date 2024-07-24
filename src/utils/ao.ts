export const ShortAddress = (address: string) =>
  `${address.substring(0, 4)}...${address.substring(
    address.length - 5,
    address.length - 1
  )}`;
