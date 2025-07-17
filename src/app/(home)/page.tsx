"use client";

import { ArtifactProvider } from "@/components/thread/artifact";
import { StreamProvider } from "@/providers/Stream";
import { ThreadProvider } from "@/providers/Thread";
import { Toaster } from "@/components/ui/sonner";
import React from "react";
import HomeLayout from "@/components/layout";
import { Thread } from "@/components/thread";
import ScreenLoading from "@/components/layout/screen-loading";


export default function HomePage() {
  return (
    <React.Suspense fallback={<ScreenLoading />}>
      <Toaster />
      {/* <AuthProtected> */}
      <ThreadProvider>
        <StreamProvider>
          <ArtifactProvider>
            <HomeLayout>
              <Thread />
            </HomeLayout>
          </ArtifactProvider>
        </StreamProvider>
      </ThreadProvider>
      {/* </AuthProtected> */}
    </React.Suspense>       
  );
}
