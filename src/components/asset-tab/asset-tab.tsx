import { useRootContext } from "@/providers/RootProvider";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useAuthContext } from "@/providers/AuthProvider";
import { TokenAptos } from "@/types/common.type";
import { formatAptosAmount, formatNumber } from "@/utils/helper";
import { cn } from "@/lib/utils";

const LIMIT = 10;

const AssetTabTab = () => {
    const { listTokens } = useRootContext();
    const [tokens, setTokens] = useState<TokenAptos[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthContext();
    const aptosConfig = new AptosConfig({ network: "mainnet" as Network });
    const aptos = new Aptos(aptosConfig);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastTokenRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    useEffect(() => {
        const fetchTokens = async () => {
            if (!user?.systemWallet.address) return;

            setLoading(true);
            const _tokens = await aptos.getAccountCoinsData({
                accountAddress: user.systemWallet.address,
                options: {
                    offset: page * LIMIT,
                    limit: LIMIT,
                }
            });

            if (_tokens) {
                const newTokens = _tokens as TokenAptos[];

                // Remove duplicates from API response itself
                const uniqueNewTokens = newTokens.filter((token, index, self) =>
                    index === self.findIndex(t => t.asset_type === token.asset_type)
                );

                setTokens((prev) => {
                    // Filter out duplicates based on asset_type
                    const existingAssetTypes = new Set(prev.map(t => t.asset_type));
                    const finalUniqueTokens = uniqueNewTokens.filter(token => !existingAssetTypes.has(token.asset_type));
                    return [...prev, ...finalUniqueTokens];
                });
                setHasMore(newTokens.length === LIMIT); // If less than limit, no more pages
            }
            setLoading(false);
        };

        fetchTokens();
    }, [page, user?.systemWallet.address]);

    const tokenList = useMemo(() => {
        return tokens.map((token) => {
            if (token.metadata.symbol.toUpperCase() === "APT") {
                return {
                    ...token,
                    logoUrl: "/images/logo-aptos-coin.png",
                }
            }
            const tokenInfo = listTokens.find((t) => t.faAddress === token.asset_type);
            return {
                ...token,
                logoUrl: tokenInfo?.logoUrl || "",
            }
        })
    }, [listTokens, tokens]);

    return (
        <div className={cn("flex flex-col", tokenList.length === 0 && "items-center justify-center h-full")}>
            {
               !loading && (tokenList.length > 0 ? tokenList.map((token, index) => {
                    const isLast = index === tokenList.length - 1;
                    const amountToken = formatAptosAmount(token.amount, token.metadata.decimals);
                    return (
                        <div
                            key={`${token.asset_type}-${index}`}
                            ref={isLast ? lastTokenRef : null}
                            className="flex items-center justify-between px-1 py-2.5"
                        >
                            <div className="flex items-center gap-x-2">
                                {token.logoUrl ? <img src={token.logoUrl} alt={token.metadata.name} className="size-10 rounded-full" /> : <div className="size-10 rounded-full bg-blue-20"></div>}
                                <div className="flex flex-col gap-y-1">
                                    <span className="text-base text-blue-20 font-semibold">{token.metadata.name}</span>
                                    <span className="text-xs text-blue-50">{token.metadata.symbol}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <span className="text-base text-blue-20 font-semibold">
                                    {formatNumber(amountToken, 4)}
                                </span>
                            </div>
                        </div>
                    );
                }) : <div className="flex items-center justify-center h-full">
                    <div className="text-center text-sm text-blue-10">
                        No assets available.
                    </div>
                </div>)
            }
            {loading && (
                <div className="text-center py-4 text-sm text-blue-10">Loading...</div>
            )}
        </div>
    )
}

export default AssetTabTab;