"use client";

import {
    AboutAptosConnect,
    AboutAptosConnectEducationScreen,
    AdapterNotDetectedWallet,
    AdapterWallet,
    WalletItem,
    isInstallRequired,
    groupAndSortWallets,
    useWallet,
    WalletReadyState,
    AptosStandardSupportedWallet
} from "@aptos-labs/wallet-adapter-react";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import HomeSmileIcon from "../icons/home-smile-icon";
import ShieldKeyholeLineIcon from "../icons/shield-keyhole-line-icon";

function renderEducationScreen(screen: AboutAptosConnectEducationScreen) {

    return (
        <>
            <DialogHeader className="grid grid-cols-[1fr_4fr_1fr] items-center space-y-0">
                <Button variant="outline" size="icon" onClick={screen.cancel}>
                    <ArrowLeft />
                </Button>
                <DialogTitle className="leading-snug text-base text-center">
                    About Aptos Connect
                </DialogTitle>
            </DialogHeader>

            <div className="flex h-[162px] pb-3 items-end justify-center">
                <screen.Graphic />
            </div>
            <div className="flex flex-col gap-2 text-center pb-4">
                <screen.Title className="text-xl" />
                <screen.Description className="text-sm text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a]:text-foreground" />
            </div>

            <div className="grid grid-cols-3 items-center">
                {/* <Button
                    size="sm"
                    variant="outline"
                    onClick={screen.back}
                    className="justify-self-start"
                >
                    Back
                </Button> */}
                <div className="flex items-center gap-2 place-self-center">
                    {screen.screenIndicators.map((ScreenIndicator, i) => (
                        <ScreenIndicator key={i} className="py-4">
                            <div className="h-0.5 w-6 transition-colors bg-muted [[data-active]>&]:bg-foreground" />
                        </ScreenIndicator>
                    ))}
                </div>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={screen.next}
                    className="gap-2 justify-self-end"
                >
                    {screen.screenIndex === screen.totalScreens - 1 ? "Finish" : "Next"}
                    <ArrowRight size={16} />
                </Button>
            </div>
        </>
    );
};

interface ConnectWalletDialogProps {
    onSignin: () => void;
};

interface WalletRowProps {
    wallet: AdapterWallet | AdapterNotDetectedWallet;
    onActive: (wallet: AdapterWallet | AdapterNotDetectedWallet) => void;
    active: boolean;
};

const WalletRow = ({ wallet, onActive, active }: WalletRowProps) => {
    const isMobile = useMediaQuery("(max-width: 640px)");
    console.log("wallet", wallet);
    return (
        <div
            className={cn("flex items-center justify-between p-2 bg-transparent border border-transparent text-blue-50 hover:border-blue-50 active:text-blue-20 active:bg-blue-50/20 hover:cursor-pointer",
                active && !isMobile && "border-blue-50",
                active && isMobile && "text-blue-20 bg-blue-50/20"
            )}
        >
            <button onClick={() => onActive(wallet)} className="flex items-center gap-x-4 w-full">
                <div className="flex items-center justify-center rounded-corner-3 bg-white p-2">
                    <img src={wallet.icon} alt={wallet.name} className="h-[40px] w-[40px]" />
                </div>
                <h3 className="text-base leading-[22px] font-medium" >{wallet.name}</h3>
            </button>
        </div>
    );
};

const WalletContent = ({ onSignin }: { onSignin: () => void }) => {
    const [walletActive, setWalletActive] = useState<AdapterWallet | AdapterNotDetectedWallet | null>(null);
    const [currentScreen, setCurrentScreen] = useState<'list' | 'detail'>('list');
    const handleSelectWallet = (wallet: AdapterWallet | AdapterNotDetectedWallet | AptosStandardSupportedWallet) => {
        setWalletActive(wallet);
        if (window.innerWidth < 640) {
            setCurrentScreen('detail');
        }
    };
    const { wallets = [], notDetectedWallets = [] } = useWallet();
    const {
        availableWallets, installableWallets } =
        groupAndSortWallets([...wallets, ...notDetectedWallets]);

    const requiredWallets = [...availableWallets, ...installableWallets];

    const onConnect = (wallet: AdapterWallet | AdapterNotDetectedWallet | AptosStandardSupportedWallet) => {
        switch (wallet.name) {
            case "Petra":
                {
                    const deeplink = (wallet as any)?.deeplinkProvider || "https://petra.app/explore?link=";
                    window.open(`${deeplink}${encodeURIComponent(window.location.href)}?ref=${encodeURIComponent(window.location.origin)}`, "_blank");
                    return;
                }

            // case "Pontem Wallet":
            //     window.open(`https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(window.location.href)}`, "_blank");
            //     return;
            case "OKX Wallet": {
                const encodedDappUrl = encodeURIComponent(window.location.href);

                const deepLink = "okx://wallet/dapp/url?dappUrl=" + encodedDappUrl;
                const encodedUrl = "https://www.okx.com/download?deeplink=" + encodeURIComponent(deepLink);
                window.open(encodedUrl, "_blank");
                return;
            } case "Nightly": {
                const deeplink = (wallet as any)?.deeplinkProvider || "nightly://v1?network=aptos&url=";
                window.open(`${deeplink}${encodeURIComponent(window.location.href)}?ref=${encodeURIComponent(window.location.origin)}`, "_blank");
                return;
            }
            default:
                return
        }
    };

    return (
        <div className="relative h-[350px] sm:h-[378px] sm:flex sm:items-center sm:divide-x sm:divide-blue-80">
            {/* Mobile View - Slide Effect */}
            <div className="sm:hidden h-full overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {currentScreen === 'list' ? (
                        <motion.div
                            key="list"
                            initial={{ x: 0 }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ duration: 0.3 }}
                            className="absolute top-0 left-0 w-full h-full"
                        >
                            <div className="px-4 py-5 space-y-1 h-full overflow-auto">
                                {requiredWallets.map((wallet) => (
                                    <WalletRow
                                        key={wallet.name}
                                        wallet={wallet}
                                        active={walletActive?.name === wallet.name}
                                        onActive={handleSelectWallet}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="detail"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.3 }}
                            className="absolute top-0 left-0 w-full h-full"
                        >
                            <div className="pt-4 px-6 pb-4 h-full">
                                <div className="bg-blue-50/20 h-full">
                                    {walletActive ? (
                                        walletActive.readyState === WalletReadyState.Installed ? (
                                            <div className="flex items-center justify-between h-full">
                                                <WalletItem
                                                    wallet={walletActive}
                                                    onConnect={onSignin}
                                                    className="flex flex-col items-center justify-center w-full h-full"
                                                >
                                                    <div className="flex items-center justify-center rounded-corner-3 bg-white p-2">
                                                        <WalletItem.Icon className="h-[42px] w-[42px]" />
                                                    </div>
                                                    <WalletItem.Name className="text-base leading-[23px] mt-3" />
                                                    {isInstallRequired(walletActive) ? (
                                                        <Button size="sm" asChild>
                                                            <WalletItem.InstallLink />
                                                        </Button>
                                                    )
                                                        : (
                                                            <WalletItem.ConnectButton className="mt-4" asChild>
                                                                <Button className="p-4 h-[42px]" size="default">Connect Wallet</Button>
                                                            </WalletItem.ConnectButton>
                                                        )
                                                    }
                                                </WalletItem>
                                            </div>
                                        ) : (
                                            <div
                                                className="flex flex-col items-center justify-center w-full h-full"
                                            >
                                                <div className="flex items-center justify-center rounded-corner-3 bg-white p-2">
                                                    <img src={walletActive.icon} alt={walletActive.name} className="h-[40px] w-[40px]" />
                                                </div>
                                                <h3 className="text-base leading-[23px] mt-3" >{walletActive.name}</h3>
                                                <Button onClick={() => onConnect(walletActive)} className="mt-6" size="sm">
                                                    Connect
                                                </Button>
                                            </div>
                                        )
                                    ) : (
                                        <div className="flex flex-col items-center justify-center gap-y-4 h-full">
                                            <h3>Select wallet to connect</h3>
                                            <Button disabled>Connect Wallet</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Desktop View - Grid Columns */}
            <div className="hidden sm:block space-y-1 h-full w-[240px] p-4">
                {requiredWallets.map((wallet) => {
                    return (
                        <WalletRow
                            key={wallet.name}
                            wallet={wallet}
                            active={walletActive?.name === wallet.name}
                            onActive={setWalletActive}
                        />
                    )
                })}
            </div>
            <div className="hidden sm:block h-full flex-1">
                {walletActive ? (
                    walletActive.readyState === WalletReadyState.Installed ? (
                        <div className="flex items-center justify-between h-full">
                            <WalletItem
                                wallet={walletActive}
                                onConnect={onSignin}
                                className="flex flex-col items-center justify-center w-full h-full"
                            >
                                <div className="flex items-center justify-center rounded-corner-3 bg-white p-2">
                                    <WalletItem.Icon className="h-[42px] w-[42px]" />
                                </div>
                                <WalletItem.Name className="text-lg leading-[22px] mt-3 text-gray-20" />
                                {isInstallRequired(walletActive) ? (
                                    <Button size="sm" asChild>
                                        <WalletItem.InstallLink />
                                    </Button>
                                )
                                    : (
                                        <WalletItem.ConnectButton className="mt-4" asChild>
                                            <Button className="p-4 h-[42px]" size="default">Connect Wallet</Button>
                                        </WalletItem.ConnectButton>
                                    )
                                }
                            </WalletItem>
                        </div>
                    ) : (
                        <WalletItem
                            wallet={walletActive}
                            className="flex flex-col items-center justify-center w-full h-full"
                        >
                            <div className="flex items-center justify-center rounded-corner-3 bg-white p-2">
                                <WalletItem.Icon className="h-[42px] w-[42px]" />
                            </div>
                            <WalletItem.Name className="text-base leading-[23px] mt-3" />
                            <Button className="mt-6" size="sm">
                                <WalletItem.InstallLink />
                            </Button>
                        </WalletItem>
                    )

                ) : (
                    <div className="flex flex-col items-center justify-center h-full pt-6 pb-10 px-10 font-inter">
                        <h3 className="text-base font-medium text-blue-20">What is a wallet?</h3>
                        <div className="mt-10 space-y-6">
                            <div className="flex items-center gap-x-[14px]">
                                <HomeSmileIcon className="size-10 text-blue-60" />
                                <div className="flex flex-col items-start gap-y-1 flex-1">
                                    <h4 className="text-blue-30 text-sm font-medium">
                                        A Home for your Digital Assets
                                    </h4>
                                    <p className="text-xs text-blue-50">
                                        Wallets are used to send, receive, store, and display digital assets like Ethereum and NFTs.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-x-[14px]">
                                <ShieldKeyholeLineIcon className="size-10 text-blue-60" />
                                <div className="flex flex-col items-start gap-y-1 flex-1">
                                    <h4 className="text-blue-30 text-sm font-medium">A New Way to Log In</h4>
                                    <p className="text-xs text-blue-50">
                                        Instead of creating new accounts and passwords on every website, just connect your wallet.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ConnectWalletDialog = ({ onSignin }: ConnectWalletDialogProps) => {
    return (
        <DialogContent className="max-h-screen sm:min-w-[640px] overflow-auto p-0 gap-0" showCloseButton={false}>
            <DialogTitle />
            <AboutAptosConnect renderEducationScreen={renderEducationScreen}>
                <DialogHeader>
                    <DialogTitle className="text-base text-blue-20 font-medium text-center py-4 font-inter mt-4 sm:mt-0">
                        Connect a wallet
                    </DialogTitle>
                </DialogHeader>

                <div className="sm:border-t sm:border-blue-80">
                    <WalletContent onSignin={onSignin} />
                </div>
            </AboutAptosConnect>
        </DialogContent>
    );
};

export default ConnectWalletDialog;