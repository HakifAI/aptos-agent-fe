"use client";

import { ReactNode } from "react";
import { useAuthContext } from "@/providers/AuthProvider";
import { WalletSelector } from "@/components/connect/WalletSelector";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import { CookieStorage } from "@/lib/cookie-storage";

interface AuthProtectedProps {
    children: ReactNode;
    fallback?: ReactNode;
    title?: string;
    description?: string;
}

export function AuthProtected({
    children,
    fallback,
    title = "Authentication Required",
    description = "Please connect your wallet and sign a message to access this feature."
}: AuthProtectedProps) {
    const {
        isAuthenticated,
        isLoading: authLoading,
        authenticate,
        canAuthenticate,
        isWalletLoading,
    } = useAuthContext();

    const authType = CookieStorage.getAuthType()

    // Show loading state while checking authentication
    if (authLoading || (authType === "wallet" && isWalletLoading)) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Checking authentication...</span>
                </div>
            </div>
        );
    }

    // If authenticated, render children
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // If custom fallback provided, use it
    if (fallback) {
        return <>{fallback}</>;
    }

    // Default authentication required UI
    return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
            <div className="max-w-md w-full">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <div className="text-xl">{title}</div>
                    <div className="text-center">
                        {description}
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex flex-col gap-3">
                        {/* Wallet Connection */}
                        <div className="flex justify-center">
                            <WalletSelector />
                        </div>

                        {/* Authentication Button (only show if wallet is connected but not authenticated) */}
                        {canAuthenticate && (
                            <div className="text-center space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Wallet connected! Now sign a message to authenticate.
                                </p>
                                <Button
                                    onClick={authenticate}
                                    className="w-full gap-2"
                                    disabled={authLoading}
                                >
                                    {authLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="h-4 w-4" />
                                            Sign Message to Authenticate
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="text-xs text-muted-foreground text-center space-y-1">
                        <p>• Connect your Aptos wallet</p>
                        <p>• Sign a message to verify ownership</p>
                        <p>• No transaction fees required</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 