import HakifiBrandIcon from "@/components/icons/hakifi-brand-icon";
import SafeIcon from "@/components/icons/safe-icon";
import SearchEyeLineIcon from "@/components/icons/search-eye-line-icon";
import { Button } from "@/components/ui/button";
import { EXPLORER_APTOSLABS_URL } from "@/constants/configs";
import { cn } from "@/lib/utils";
// import { useStreamContext } from "@/providers/Stream";
import { truncateAddress } from "@aptos-labs/ts-sdk";
import Link from "next/link";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import DepositCryptoDialog from "./DepositCryptoDialog";
import { useAuthContext } from "@/providers/AuthProvider";


type Token = {
    tokenAddress: string;
    balance: string;
    balanceInSmallestUnit: string;
    assetType: string;
    name: string;
    symbol: string;
    logoUrl: string;
};

type Props = {
    walletAddress: string;
    tokens: Token[];
    success: boolean;
    isAllToken: boolean;
};

const BalancesCard = ({ walletAddress, tokens, isAllToken }: Props) => {
    const [_profileOpen, setProfileOpen] = useQueryState("profileOpen", parseAsBoolean.withDefault(false));
    const [_profileTab, setProfileTab] = useQueryState("profileTab", parseAsString.withDefault("account"));
    const [_assetTab, setAssetTab] = useQueryState("assetTab", parseAsString.withDefault("assets"));
    const [openDepositCryptoDialog, setOpenDepositCryptoDialog] = useState(false);
    const { user } = useAuthContext();
    const address = user?.systemWallet?.address;
    const walletAddressDeposit = walletAddress || address;
    // const thread = useStreamContext();
    const renderTokens = () => {
        if (tokens?.length === 0)
            return (
                <div className="flex items-center justify-center h-full gap-x-3">
                    <SearchEyeLineIcon className="w-8 h-8 text-blue-50" />
                    <div className="text-blue-40">{isAllToken ?
                        "It looks like there are no tokens in your current balance." : "Token not found in your current balance."}
                    </div>
                </div>
            );
        return <>
            {tokens?.length > 0 ? (<>
                <div className="text-xs text-blue-60">TOKENS</div>
                <div className={cn("grid gap-x-6 gap-y-3 mt-4", tokens?.length >= 4 ? "grid-cols-2" : "grid-cols-1")}>
                    {tokens?.map((token) => (
                        <div key={token.tokenAddress}>
                            <div className="flex items-center">
                                <img src={token.logoUrl} alt={token.name} className="w-5 h-5 rounded-full mr-2" />
                                <span className="mr-1">{token.balance}</span>
                                <span className="text-xs text-blue-50">{token.symbol}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </>) :
                <div className="flex items-start justify-center gap-x-3">
                    <SearchEyeLineIcon className="w-8 h-8 text-blue-50" />
                    <span className="text-blue-40">It looks like there are no tokens in your current balance.</span>
                </div>}
        </>
    }

    // const handleDeposit = () => {
    //     thread?.submit({
    //         messages: [{
    //             type: "human",
    //             content: `Show me my address to deposit`,
    //         }]
    //     })
    // }

    const handleCheckTransactionHistory = () => {
        setProfileOpen(true);
        setProfileTab("assets");
        setAssetTab("txn");
    }

    return <div className="border border-blue-90 rounded-sm w-fit max-w-md">
        <div className="flex justify-between items-center gap-x-6 px-5 md:px-6 pt-5 md:pt-6">
            <div className="flex items-center text-sm p-1 rounded-sm text-blue-60 gap-x-2 border-blue-90 border bg-[#0A152780]">
                <SafeIcon className="w-4 h-4" />
                {walletAddressDeposit && (
                    <Link href={`${EXPLORER_APTOSLABS_URL}/account/${walletAddressDeposit}/coins`} target='_blank'>
                        <div className="max-w-32 truncate">
                            {truncateAddress(walletAddressDeposit)}
                        </div>
                    </Link>
                )}
            </div>
            <HakifiBrandIcon className='h-5 text-blue-60' />
        </div>
        <div className="p-5 md:px-6">
            {renderTokens()}
        </div>
        <div className="p-6 flex gap-x-6 border-t border-blue-90">
            <Dialog open={openDepositCryptoDialog} onOpenChange={() => {
                setOpenDepositCryptoDialog(!openDepositCryptoDialog);
            }}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        Deposit
                    </Button>
                </DialogTrigger>
                <DepositCryptoDialog walletAddress={walletAddress} closeDialog={() => setOpenDepositCryptoDialog(false)} />
            </Dialog>
            <Button variant="outline" className="w-full" onClick={handleCheckTransactionHistory}>
                Check Transaction History
            </Button>
        </div>
    </div>
}

export default BalancesCard;