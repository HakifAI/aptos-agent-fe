export type User = {
  id: string;
  name: string;
  address: string;
  email: string;
  isVerified: boolean;
  publicKey: string;
  systemWallet: SystemWallet;
};

export type SystemWallet = {
  id: string;
  address: string;
  publicKey: string;
};

export type AuthType = "twitter" | "wallet"

