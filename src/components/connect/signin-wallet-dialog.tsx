import { truncateAddress, useWallet } from "@aptos-labs/wallet-adapter-react";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useAuthContext } from "@/providers/AuthProvider";

const SigninWalletDialog = ({ onClose }: { onClose: () => void }) => {
    const { account } = useWallet();
    const { authenticate } = useAuthContext();
    return (
        <DialogContent className="max-h-screen overflow-auto pt-10 px-5 pb-5 sm:px-[52px] sm:py-10 gap-0" showCloseButton={false}>
            <DialogTitle />
            <DialogHeader>
            </DialogHeader>

            <div className="flex flex-col">
                <h3 className="text-blue-10 text-lg leading-[22px] font-semibold">
                    {account?.address && truncateAddress(account.address.toString()) ||
                        "Unknown"}
                </h3>
                <p className="text-blue-40 text-base leading-[22px] mt-3">
                    Sign below to verify your account. This digital signature is used to confirm your identity and ensure the security of your account. It will not initiate any transactions or incur any fees.
                </p>
                <div className="flex justify-center mt-10 sm:mt-12">
                    <Button onClick={() => {
                        authenticate();
                        onClose();
                    }} variant="outline" className="w-full text-base leading-[19px] py-4">
                        Sign
                    </Button>
                </div>
            </div>
        </DialogContent>
    );
};

export default SigninWalletDialog;