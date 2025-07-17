// import QrIcon from "@/components/icons/qr-icon";
// import { Button } from "@/components/ui/button";
// import Copy from "@/components/ui/copy";
// import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { useAuthContext } from "@/providers/AuthProvider";


// type DepositCryptoDialogProps = {
//     closeDialog: () => void;
//     walletAddress: string | undefined;
// }

// const DepositCryptoDialog = ({ closeDialog, walletAddress = "" }: DepositCryptoDialogProps) => {

//     const { user } = useAuthContext();
//     const address = user?.systemWallet?.address;
//     const walletAddressDeposit = walletAddress || address;

//     return (
//         <DialogContent className="max-h-screen overflow-auto pt-10 px-5 pb-5 sm:px-[52px] sm:py-10 gap-0" showCloseButton={false}>
//             <DialogTitle />
//             <DialogHeader>
//                 <DialogTitle className="font-figtree text-2xl text-blue-10 font-normal text-center">
//                     Deposit Crypto
//                 </DialogTitle>
//             </DialogHeader>
//             <p className="text-blue-50 text-center mt-6">Deposit funds by transferring crypto from
//                 another wallet or account</p>
//             <div className="flex flex-col mt-8">
//                 <h4 className="text-sm">Deposit Address</h4>
//                 {walletAddressDeposit && (
//                     <div className="mt-1 pl-3 pr-2.5 py-2.5 flex items-center gap-x-4 border border-blue-80">
//                         <span className="text-blue-20">{walletAddressDeposit.slice(0, 30)}...{walletAddressDeposit.slice(-4)}</span>
//                         <div className="flex items-center gap-x-2">
//                             <Copy value={walletAddressDeposit} size="md" className='p-0 h-auto text-blue-60' message="Copied wallet address to clipboard" />
//                             <Button variant="ghost" className="p-0 h-auto">
//                                 <QrIcon className="size-6 text-blue-60" />
//                             </Button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//             <Button onClick={closeDialog} className="w-full mt-8 h-10">
//                 Close
//             </Button>
//         </DialogContent>
//     );
// };

// export default DepositCryptoDialog;

import ArrowIcon from "@/components/icons/arrow-icon";
import QrIcon from "@/components/icons/qr-icon";
import { Button } from "@/components/ui/button";
import Copy from "@/components/ui/copy";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuthContext } from "@/providers/AuthProvider";
import { useState } from "react";
import QRCode from "react-qr-code";

type DepositCryptoDialogProps = {
    closeDialog: () => void;
    walletAddress: string | undefined;
};

const DepositCryptoDialog = ({ closeDialog, walletAddress = "" }: DepositCryptoDialogProps) => {
    const { user } = useAuthContext();
    const address = user?.systemWallet?.address;
    const walletAddressDeposit = walletAddress || address || "";

    const [showQr, setShowQr] = useState(false);
    const isMobile = useMediaQuery("(max-width: 640px)");

    return (
        <DialogContent className="max-h-screen overflow-auto pt-10 px-5 pb-5 sm:px-[52px] sm:py-10 gap-0" showCloseButton={false}>
            <DialogTitle />
            <DialogHeader>
                <DialogTitle className="font-figtree text-2xl text-blue-10 font-normal text-center">
                    {showQr ? "" : "Deposit Crypto"}
                </DialogTitle>
            </DialogHeader>

            {showQr ? (
                <div className="flex flex-col items-center mt-6 space-y-6">
                    <div className="flex items-center gap-y-2.5">
                        <Button variant="ghost" onClick={() => setShowQr(false)} className="h-10 w-full">
                            <ArrowIcon className="size-6 text-blue-60" />
                        </Button>
                        <span className="text-blue-50 text-center">{walletAddressDeposit.slice(0, isMobile ? 16 : 36)}...{walletAddressDeposit.slice(-4)}</span>
                    </div>
                    <QRCode bgColor="transparent" fgColor="var(--blue-20)" value={walletAddressDeposit} size={160} />
                </div>
            ) : (
                <>
                    <p className="text-blue-50 text-center mt-6">
                        Deposit funds by transferring crypto from another wallet or account
                    </p>
                    <div className="flex flex-col mt-8">
                        <h4 className="text-sm">Deposit Address</h4>
                        {walletAddressDeposit && (
                            <div className="mt-1 pl-3 pr-2.5 py-2.5 flex items-center gap-x-4 border border-blue-80">
                                <span className="text-blue-20">
                                    {walletAddressDeposit.slice(0, isMobile ? 16 : 28)}...{walletAddressDeposit.slice(-4)}
                                </span>
                                <div className="flex items-center gap-x-2">
                                    <Copy
                                        value={walletAddressDeposit}
                                        size="md"
                                        className="p-0 h-auto text-blue-60"
                                        message="Copied wallet address to clipboard"
                                    />
                                    <Button variant="ghost" className="p-0 h-auto" onClick={() => setShowQr(true)}>
                                        <QrIcon className="size-6 text-blue-60" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </>

            )}
            <Button onClick={closeDialog} className="w-full mt-8 h-10">
                Close
            </Button>
        </DialogContent>
    );
};

export default DepositCryptoDialog;
