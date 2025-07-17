"use client";

import { motion } from "framer-motion";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import {
    useArtifactOpen,
} from "../thread/artifact";
import { Header } from "./header";
import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
const ThreadHistory = dynamic(() => import("../thread/history"), { ssr: false });

const SIDEBAR_WIDTH = 320;

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
    const isLargeScreen = useMediaQuery("(min-width: 1024px)");
    const [chatHistoryOpen, setChatHistoryOpen] = useQueryState(
        "chatHistoryOpen",
        parseAsBoolean.withDefault(false),
    );
    const [artifactOpen] = useArtifactOpen();

    useEffect(() => {
        if (isLargeScreen) {
            setChatHistoryOpen(true);
        }
    }, [isLargeScreen, setChatHistoryOpen]);

    return (
        <section>
            <div className="flex h-screen w-full overflow-hidden">
                <div className="relative hidden lg:flex">
                    <motion.div
                        className="absolute z-20 h-full overflow-hidden border-r border-blue-80"
                        style={{ width: SIDEBAR_WIDTH }}
                        animate={
                            isLargeScreen
                                ? { x: chatHistoryOpen ? 0 : -SIDEBAR_WIDTH }
                                : { x: chatHistoryOpen ? 0 : -SIDEBAR_WIDTH }
                        }
                        initial={{ x: -SIDEBAR_WIDTH }}
                        transition={
                            isLargeScreen
                                ? { type: "spring", stiffness: 300, damping: 30 }
                                : { duration: 0 }
                        }
                    >
                        <div
                            className="relative h-full px-5"
                            style={{ width: SIDEBAR_WIDTH }}
                        >
                            <Suspense fallback={<div>Loading...</div>}>
                                <ThreadHistory />
                            </Suspense>
                        </div>
                    </motion.div>
                </div>

                <div
                    className={cn(
                        "grid w-full grid-cols-[1fr_0fr] transition-all duration-500",
                        artifactOpen && "grid-cols-[3fr_2fr]",
                    )}
                >
                    <motion.div
                        className={cn(
                            "relative flex min-w-0 flex-1 flex-col overflow-hidden",
                        )}
                        layout={isLargeScreen}
                        animate={{
                            marginLeft: chatHistoryOpen ? (isLargeScreen ? SIDEBAR_WIDTH : 0) : 0,
                            width: chatHistoryOpen
                                ? isLargeScreen
                                    ? `calc(100% - ${SIDEBAR_WIDTH}px)`
                                    : "100%"
                                : "100%",
                        }}
                        transition={
                            isLargeScreen
                                ? { type: "spring", stiffness: 300, damping: 30 }
                                : { duration: 0 }
                        }
                    >
                        <Header />
                        {children}
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default HomeLayout;