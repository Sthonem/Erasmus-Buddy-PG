"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function exchange() {
      const code = searchParams.get("code");
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }
      router.replace("/dashboard");
    }
    exchange();
  }, [searchParams, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: "var(--pg-navy)" }}>
      <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
      <p className="text-white text-sm font-medium">Signing in...</p>
    </main>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--pg-navy)" }}>
        <p className="text-white text-sm">Loading...</p>
      </main>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
