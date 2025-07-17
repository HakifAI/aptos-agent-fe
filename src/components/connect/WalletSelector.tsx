"use client";

// Internal components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import {
  Loader2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useAuthContext } from "@/providers/AuthProvider";
import ConnectDialog from "./connect-dialog";
import ConnectWalletDialog from "./connect-wallet-dialog";
import SigninWalletDialog from "./signin-wallet-dialog";
import Profile from "../layout/profile";

export function WalletSelector() {
  const { connected } = useWallet();
  const [step, setStep] = useState<"connect" | "connect-wallet" | "signin">("connect");
  
  const {
    isAuthenticated,
    openConnectWallet,
    setOpenConnectWallet
  } = useAuthContext();

  const closeDialog = useCallback(() => {
    setOpenConnectWallet(false);
    setStep("connect");
  }, []);

  return (
    !isAuthenticated ? (
      <div className="flex items-center gap-3">
        <Dialog open={openConnectWallet} onOpenChange={() => {
          setOpenConnectWallet(!openConnectWallet);
          setStep("connect");
        }}>
          <DialogTrigger asChild>
            <Button className="text-base leading-[19px] h-[38px] sm:h-[50px] p-4" variant="outline">Connect wallet</Button>
          </DialogTrigger>
          {step === "connect" && <ConnectDialog onConnectWallet={() => setStep("connect-wallet")} />}
          {step === "connect-wallet" && <ConnectWalletDialog onSignin={() => setStep("signin")} />}
          {step === "signin" && connected && <SigninWalletDialog onClose={closeDialog} />}
        </Dialog>
      </div>
    ) : (
      <Profile />
    )
  )
};
