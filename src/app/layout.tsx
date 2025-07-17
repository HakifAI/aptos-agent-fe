import type { Metadata } from "next";
import "./globals.css";
import { Inter, DM_Sans, Figtree } from "next/font/google";
import React, { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { WalletProvider } from "@/providers/WalletProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { murecho } from "@/configs";
import { RootProvider } from "@/providers/RootProvider";
import ScreenLoading from "@/components/layout/screen-loading";

const dmSans = DM_Sans({
  subsets: ["latin"],
  preload: true,
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  preload: true,
  display: "swap",
  variable: "--font-inter"
})

const figtree = Figtree({
  subsets: ["latin"],
  preload: true,
  display: "swap",
  variable: "--font-figtree"
})
export const metadata: Metadata = {
  title: "HakiAi",
  description: "HakifAi by Hakifi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(dmSans.className, murecho.variable, inter.variable, figtree.variable)}>
        <Suspense fallback={<ScreenLoading />}>
          <NuqsAdapter>
            <WalletProvider>
              <AuthProvider>
                <RootProvider>{children}</RootProvider>
              </AuthProvider>
            </WalletProvider>
          </NuqsAdapter>
        </Suspense>
      </body>
    </html>
  );
}
