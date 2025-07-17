"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { authAPI, AuthAPI, type VerifyResponse } from "@/apis";
import { CookieStorage } from "@/lib/cookie-storage";
import { addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";
import { User } from "@/types/user.type";

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    address: string | null;
    isLoading: boolean;
}

const prepareSignMessage = (address: string) => {
    return `Welcome to Aptos AI Agent!\n\nPlease sign this message to authenticate your wallet.\n\nWallet: ${address}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.`
}

export function useAuth() {
    const { account, connected, signMessage, disconnect, isLoading: isWalletLoading } = useWallet();
    const { push, replace } = useRouter();
    const [_, _setThreadId] = useQueryState("threadId");
    const [__, _setNewThread] = useQueryState("newThread", parseAsBoolean.withDefault(false));
    const [___, _setChatHistoryOpen] = useQueryState("chatHistoryOpen");
    const [user, setUser] = useState<User | null>(null);
    const [openConnectWallet, setOpenConnectWallet] = useState(false)
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        token: null,
        address: null,
        isLoading: true,
    });

    const hasTriedAutoAuth = useRef(false);

    const authenticateTwitter = (token: string) => {
        const expiresAt = addDays(new Date(), 7);
        CookieStorage.setAuthType("twitter", expiresAt)
        CookieStorage.setAuthToken(token, expiresAt);
        setAuthState({
            isAuthenticated: true,
            token,
            address: null,
            isLoading: false,
        });

        // if (token) {
        //     const fetchUser = async () => {
        //         const user = await authAPI.getUser();
        //         setUser(user);
        //     }
        //     fetchUser();
        // }
        replace("/")
        push("/")
    }

    const authenticate = useCallback(async () => {
        if (!account?.address || !signMessage || !account?.publicKey) {
            toast.error("Wallet not connected or missing required data");
            return false;
        }

        setAuthState(prev => ({ ...prev, isLoading: true }));

        try {
            const address = account.address.toString();
            const publicKey = Array.isArray(account.publicKey)
                ? account.publicKey[0]
                : account.publicKey.toString();

            // Step 1: Request nonce from backend
            const { nonce } = await authAPI.requestNonce({
                address,
                publicKey,
            });
            const message = prepareSignMessage(address);
            // Step 2: Sign the message with wallet
            const signedMessage = await signMessage({
                message,
                nonce,
            });

            // Step 3: Verify signature with backend
            const authResponse: VerifyResponse = await authAPI.verifySignature({
                address,
                signature: signedMessage.signature.toString(),
                message: signedMessage.fullMessage, // Use fullMessage, not just message
                nonce,
                publicKey,
            });
            const expiresAt = addDays(new Date(), 7);
            // Step 4: Store auth data in cookies
            CookieStorage.setAuthType("wallet", expiresAt)
            CookieStorage.setAuthToken(authResponse.accessToken, expiresAt);
            CookieStorage.setAuthAddress(address, expiresAt);

            setAuthState({
                isAuthenticated: true,
                token: authResponse.accessToken,
                address,
                isLoading: false,
            });

            toast.success("Authentication successful!");
            return true;
        } catch (error) {
            console.error("Authentication error:", error);
            toast.error(error instanceof Error ? error.message : "Authentication failed");

            // If auto-authentication failed, disconnect wallet
            if (hasTriedAutoAuth.current) {
                toast.error("Auto authentication failed. Disconnecting wallet...");
                disconnect();
            }

            setAuthState(prev => ({
                ...prev,
                isLoading: false,
            }));

            return false;
        }
    }, [account, signMessage]);

    // Load token from cookies on mount
    useEffect(() => {
        const savedToken = CookieStorage.getAuthToken();
        const savedAddress = CookieStorage.getAuthAddress();
        const authType = CookieStorage.getAuthType()

        if (savedToken && CookieStorage.isTokenValid()) {
            if (authType === "twitter") {
                setAuthState({
                    isAuthenticated: true,
                    token: savedToken,
                    address: null,
                    isLoading: false,
                });
            } else if (authType === "wallet" && savedAddress) {
                setAuthState({
                    isAuthenticated: true,
                    token: savedToken,
                    address: savedAddress,
                    isLoading: false,
                });
            }
        } else {
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
            }));
        }
    }, []);

    // Auto authenticate when wallet connects
    useEffect(() => {
        const authType = CookieStorage.getAuthType()
        if (authType === "wallet" && connected && account && !authState.isAuthenticated && !hasTriedAutoAuth.current) {
            hasTriedAutoAuth.current = true;

            // Check if we have valid stored auth for this address
            const savedAddress = CookieStorage.getAuthAddress();
            const currentAddress = account.address.toString();

            if (savedAddress === currentAddress && CookieStorage.isTokenValid()) {
                // Already authenticated for this address
                const savedToken = CookieStorage.getAuthToken();
                setAuthState({
                    isAuthenticated: true,
                    token: savedToken,
                    address: savedAddress,
                    isLoading: false,
                });
            } else {
                // Need to authenticate
                authenticate();
            }
        }
    }, [connected, account, authState.isAuthenticated, authenticate]);

    // Reset auto auth flag when wallet disconnects
    useEffect(() => {
        const authType = CookieStorage.getAuthType()
        if (authType === "wallet" && !connected && !isWalletLoading) {
            hasTriedAutoAuth.current = false;
            logout();
        }
    }, [connected, isWalletLoading]);

    useEffect(() => {
        if (authState.isAuthenticated) {
            const fetchUser = async () => {
                const user = await authAPI.getUser();
                setUser(user);
            }
            fetchUser();
        }
    }, [authState.isAuthenticated]);
    // Listen for auth events from axios interceptor
    useEffect(() => {
        const handleAuthLogout = (event: CustomEvent) => {
            const reason = event.detail?.reason;
            console.log(`🔒 [Auth] Auto logout triggered by API: ${reason}`);

            // Clear local auth state
            setAuthState({
                isAuthenticated: false,
                token: null,
                address: null,
                isLoading: false,
            });

            // Show appropriate message based on reason
            if (reason === 'token_expired') {
                toast.warning("Session expired. Please authenticate again.");
            } else if (reason === 'unauthorized') {
                toast.error("Authentication failed. Please sign in again.");
            }

            // Reset auth flag so user can try again
            hasTriedAutoAuth.current = false;
        };

        // Add event listener
        window.addEventListener('auth:logout', handleAuthLogout as EventListener);

        // Cleanup
        return () => {
            window.removeEventListener('auth:logout', handleAuthLogout as EventListener);
        };
    }, []);

    const clearAuthData = useCallback(() => {
        CookieStorage.clearAuth();
    }, []);



    const logout = useCallback(() => {
        _setThreadId(null)
        _setNewThread(false)
        _setChatHistoryOpen(null)
        clearAuthData();
        setAuthState({
            isAuthenticated: false,
            token: null,
            address: null,
            isLoading: false,
        });
        toast.success("Logged out successfully");
    }, [clearAuthData]);

    const getAuthHeaders = useCallback(() => {
        return AuthAPI.getAuthHeaders(authState.token);
    }, [authState.token]);

    return {
        ...authState,
        user,
        authenticate,
        authenticateTwitter,
        logout,
        getAuthHeaders,
        // Helper to check if current wallet matches authenticated address
        isWalletMatched: account?.address.toString() === authState.address,
        // Check if wallet has required data for auth
        canAuthenticate: !!(account?.address && account?.publicKey && signMessage),
        isWalletLoading,
        openConnectWallet,
        setOpenConnectWallet
    };
} 