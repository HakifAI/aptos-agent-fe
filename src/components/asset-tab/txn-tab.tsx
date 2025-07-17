import { TransactionAptos } from "@/types/common.type";
import { useAuthContext } from "@/providers/AuthProvider";
import { useEffect, useState, useRef, useCallback } from "react";
import { Network, truncateAddress } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import Copy from "../ui/copy";
import Link from "next/link";
import { EXPLORER_APTOSLABS_URL } from "@/constants/configs";
import { cn } from "@/lib/utils";
import { decodeFunctionName } from "@/utils/helper";
import { SWAP_FUNCTION_NAME, TRANSFER_FUNCTION_NAME } from "@/utils/constants";

const LIMIT = 10;

const TxnTab = () => {
    const { user } = useAuthContext();
    const [listTransactions, setListTransactions] = useState<TransactionAptos[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadMore, setLoadMore] = useState(false);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastTxnRef = useCallback(
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
    console.log("listTransactions: ", listTransactions);

    const aptosConfig = new AptosConfig({ network: "mainnet" as Network });
    const aptos = new Aptos(aptosConfig);
    
    useEffect(() => {
        const fetchInitialTransactions = async () => {
            if (!user?.systemWallet.address) return;

            setLoading(true);
            const _transactions = await aptos.getAccountTransactions({
                accountAddress: user.systemWallet.address,
                options: {
                    offset: 0,
                    limit: LIMIT,
                },
            });

            const txs = _transactions as TransactionAptos[];
            setListTransactions(txs);
            setHasMore(txs.length === LIMIT);
            setPage(1); // Đã fetch page đầu
            setLoading(false);
        };

        fetchInitialTransactions();
    }, [user?.systemWallet.address]);

    useEffect(() => {
        const fetchMoreTransactions = async () => {
            if (!user?.systemWallet.address || !hasMore || page === 0) return;

            setLoadMore(true);
            const _transactions = await aptos.getAccountTransactions({
                accountAddress: user.systemWallet.address,
                options: {
                    offset: page * LIMIT,
                    limit: LIMIT,
                },
            });

            const txs = _transactions as TransactionAptos[];
            setListTransactions((prev) => [...prev, ...txs]);
            setHasMore(txs.length === LIMIT);
            setLoadMore(false);
        };

        if (page > 0) {
            fetchMoreTransactions();
        }
    }, [page]);

    // useEffect(() => {
    //     const fetchTransactions = async () => {
    //         if (!user?.systemWallet.address) return;

    //         setLoading(true);
    //         const _transactions = await aptos.getAccountTransactions({
    //             // accountAddress: user.systemWallet.address,
    //             accountAddress: "0x063150a3b48bde6c7d839aa333ac414d333b9e1a5e87585d1be61571e9b6bd90",
    //             options: {
    //                 offset: page * LIMIT,
    //                 limit: LIMIT,
    //             },
    //         });

    //         const txs = _transactions as TransactionAptos[];
    //         setListTransactions((prev) => [...prev, ...txs]);
    //         setHasMore(txs.length === LIMIT); // If less than limit, no more pages
    //         setLoading(false);
    //     };

    //     fetchTransactions();
    // }, [page, user?.systemWallet.address]);

    const isSwap = (functionName: string) => {
        return (functionName === SWAP_FUNCTION_NAME.swap_batch_coin_entry || functionName === SWAP_FUNCTION_NAME.router_entry || functionName.includes("swap"));
    }
    const isTransfer = (functionName: string) => {
        return (functionName === TRANSFER_FUNCTION_NAME.transfer_coins || functionName === TRANSFER_FUNCTION_NAME.transfer || functionName === TRANSFER_FUNCTION_NAME.batch_transfer_coins || functionName.includes("transfer"));
    }

    return (
        <div className={cn("flex flex-col", listTransactions.length === 0 && "items-center justify-center h-full")}>
            {loading ? (
                <div className="text-center py-4 text-sm text-blue-10">Loading...</div>
            ) : listTransactions.length > 0 ? (
                listTransactions.map((transaction, index) => {
                    const isLast = index === listTransactions.length - 1;
                    const { functionName } = decodeFunctionName(transaction.payload);
                    return (
                        <div
                            key={index}
                            ref={isLast ? lastTxnRef : null}
                            className="flex items-center gap-x-[58px] p-1"
                        >
                            <div className="flex items-center w-20">
                                <div className="py-1 px-2 rounded-corner-4 bg-blue-60/30 text-xs leading-[17px] text-blue-50 font-normal">
                                    {isSwap(functionName) ? "SWAP" : isTransfer(functionName) ? "TRANSFER" : "UNKNOWN"}
                                </div>
                            </div>
                            <div className="flex items-center gap-x-3">
                                <Link
                                    href={`${EXPLORER_APTOSLABS_URL}/txn/${transaction.hash}`}
                                    target="_blank"
                                    className="text-base leading-[19px] text-blue-20 hover:underline"
                                >
                                    {truncateAddress(transaction.hash)}
                                </Link>
                                <Copy className="text-blue-50" value={transaction.hash || ""} />
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center text-sm text-blue-10">No transactions available.</div>
            )}
            {loadMore && (
                <div className="text-center py-4 text-sm text-blue-10">Loading more...</div>
            )}
        </div>
    );
};

export default TxnTab;
