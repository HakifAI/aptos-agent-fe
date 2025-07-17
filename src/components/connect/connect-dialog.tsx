"use client";

import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { BACKEND_API_BASE_URL } from "@/constants/configs";
import XIcon from "../icons/x-icon";
import WalletIcon from "../icons/wallet-icon";

interface ConnectDialogProps {
    onConnectWallet: () => void;
};


const ConnectDialog = ({ onConnectWallet }: ConnectDialogProps) => {
    const router = useRouter();

    const handleLoginTwitter = () => {
        const redirectURl = `${window.location.origin}/authenticate`
        router.push(`${BACKEND_API_BASE_URL}/auth/twitter?callbackUrl=${redirectURl}`)
    };

    return (
        <DialogContent className="max-h-screen overflow-auto pt-10 px-5 pb-5 sm:px-[52px] sm:py-10 gap-0" showCloseButton={false}>
            <DialogTitle />
            <DialogHeader>
                <DialogTitle className="text-2xl sm:text-[32px] sm:leading-[38px] text-blue-10 font-normal text-center font-figtree">
                    Welcome to HakifAI 👋
                </DialogTitle>
            </DialogHeader>
            <p className="text-base leading-[22px] text-blue-50 text-center mt-8">
                Register your account below. An account allows creation or import of hot wallets, giving AI Agents access to execute transactions on your command.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 sm:mt-16">
                <Button onClick={onConnectWallet} className="gap-x-1 leading-[19px] w-full" variant="outline" suffix={<WalletIcon className="text-blue-40" />} >
                    Connect Wallet
                </Button>
                <Button onClick={handleLoginTwitter} className="gap-x-1 leading-[19px] w-full" variant="outline" suffix={<XIcon className="text-blue-40" />} >
                    Use X Account
                </Button>
            </div>
        </DialogContent>
    );
};

export default ConnectDialog;