"use client";

import { APTOS_API_KEY, NETWORK } from "@/constants/configs";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import type { PropsWithChildren } from "react";
import { toast } from "sonner";

export function WalletProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      optInWallets={['Petra', 'OKX Wallet', 'Pontem Wallet', 'Nightly']}
      dappConfig={{ network: NETWORK, aptosApiKeys: { [NETWORK]: APTOS_API_KEY } }}
      onError={(error) => {
        toast.error("Error", {
          description: error || "Unknown wallet error",
        });
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
