"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import ScreenLoading from "@/components/layout/screen-loading";

function Authenticate() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { authenticateTwitter } = useAuthContext();

  useEffect(() => {
    if (token) {
      authenticateTwitter(token);
    }
  }, [token]);

  return <ScreenLoading />;
}

export default function AuthenticatePage() {
  return (
    <Suspense fallback={<ScreenLoading />}>
      <Authenticate />
    </Suspense>
  );
}
