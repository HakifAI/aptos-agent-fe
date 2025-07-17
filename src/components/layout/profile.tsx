import {
    Sheet,
    SheetContent,
    SheetTitle,
} from "@/components/ui/sheet";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { Button } from "../ui/button";
import { truncateAddress, useWallet } from "@aptos-labs/wallet-adapter-react";
import { CookieStorage } from "@/lib/cookie-storage";
import ProfileSlider, { ProfileSliderContent } from "../ui/profile-slider";
import { useCallback, useState } from "react";
import { useAuthContext } from "@/providers/AuthProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import UserIcon from "../icons/user-icon";
import AptosLogoIcon from "../icons/aptos-logo-icon";
import Copy from "../ui/copy";
import AssetTab from "../asset-tab";
import BoxIcon from "../icons/box-icon";
import WalletIcon from "../icons/wallet-icon";

type IProfileTab = "account" | "assets";

const Profile = () => {
    const [profileOpen, setProfileOpen] = useQueryState("profileOpen", parseAsBoolean.withDefault(false));
    const isMobile = useMediaQuery("(max-width: 640px)");
    const { disconnect } = useWallet();
    const {
        logout: authLogout,
        user
    } = useAuthContext();

    const authType = CookieStorage.getAuthType();

    const [profileTab, setProfileTab] = useQueryState("profileTab", parseAsString.withDefault("account"));

    const tabs = [
        {
            label: (
                <>
                    <UserIcon className="size-[18px]" />
                    <span>Account</span>
                </>
            ),
            value: "account",
        },
        {
            label: (
                <>
                    <BoxIcon className="size-[18px]" />
                    <span>Assets</span>
                </>
            ),
            value: "assets",
        },
    ];

    const handleProfileTabChange = (value: string) => {
        console.log("value", value);
        setProfileTab(value as IProfileTab);
    };

    const handleDisconnect = useCallback(() => {
        authLogout(); // Clear auth first
        disconnect(); // Then disconnect wallet
        setProfileOpen(false);  // Close the sheet
    }, [authLogout, disconnect, setProfileOpen]);

    return (
        <div>
            <Button className="sm:p-3 h-[40px] sm:h-[50px] gap-x-0 sm:gap-x-2" variant="outline" onClick={() => setProfileOpen((p) => !p)}>
                <WalletIcon className="size-6 text-blue-50" />
                <span className="text-blue-40">
                    {truncateAddress(user?.systemWallet?.address || "")}
                </span>
            </Button>
            <Sheet
                open={!!profileOpen}
                onOpenChange={(open) => {
                    setProfileOpen(open);
                }}
            >
                <SheetContent
                    side={isMobile ? "bottom" : "right"}
                    className="w-full sm:w-auto sm:min-w-[480px] flex pt-[56px] px-10 bg-blue-150/80 box-shadow-medium border-l border-blue-80"
                    closeButtonClassName="top-8 right-[56px]"
                >
                    <SheetTitle className="sr-only">Sidebar</SheetTitle>
                    <div className="mt-6 mb-8 sm:mb-0">
                        <ProfileSlider className="mt-8" value={profileTab} options={tabs} onValueChange={handleProfileTabChange} >
                            <ProfileSliderContent className="mt-8 pb-10 overflow-y-auto h-[calc(100vh-297px)]" value="account">
                                <div className="py-4">
                                    <div className="flex items-center gap-x-2 text-base leading-[22px] text-blue-40 p-3 bg-blue-100">
                                        {authType === "twitter" ? <UserIcon className="size-6 text-blue-50" /> : <WalletIcon className="size-6 text-blue-50" />}
                                        {authType === "twitter" ? user?.name : truncateAddress(user?.address || "") ||
                                            "Unknown"}
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-x-2.5">
                                            <AptosLogoIcon className="size-6" />
                                            <span className="text-base leading-[19px] text-blue-10">Aptos</span>
                                        </div>
                                        <div className="flex items-center gap-x-2.5">
                                            <span className="text-base leading-[19px] text-blue-20">
                                                {truncateAddress(user?.systemWallet?.address || "---")}
                                            </span>
                                            <Copy value={user?.systemWallet?.address || "---"} />
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={handleDisconnect} variant="outline" className="w-full mt-16 text-base leading-[19px] py-3">
                                    Disconnect
                                </Button>
                            </ProfileSliderContent>
                            <ProfileSliderContent className="mt-8 py-4" value="assets">
                                <AssetTab />
                            </ProfileSliderContent>
                        </ProfileSlider>

                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default Profile;