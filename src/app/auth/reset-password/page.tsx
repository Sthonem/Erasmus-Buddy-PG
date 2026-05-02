"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase sends the token as a fragment (#access_token=...) — it handles
    // session restoration automatically via onAuthStateChange when the page loads.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    // Also check if there's a code param (PKCE flow)
    const code = searchParams.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(() => setReady(true));
    }

    return () => subscription.unsubscribe();
  }, [searchParams]);

  async function handleReset() {
    if (!password || password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.replace("/dashboard");
    }
  }

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(170deg, #001233 0%, #002e75 55%, #003580 100%)" }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-9 pt-16 pb-8 text-center">
        <div
          className="flex items-center justify-center mb-6"
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="1.8"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="text-white mb-2" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>
          New Password
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
          Choose a strong password for your account
        </p>
      </div>

      <div style={{ background: "white", borderRadius: "28px 28px 0 0", padding: "28px 28px 48px" }}>
        {!ready ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: "#003580", borderTopColor: "transparent" }} />
            <p style={{ fontSize: 13, color: "#A0A8BB" }}>Verifying reset link…</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: "#FBEAED", color: "#C8102E" }}>
                {error}
              </div>
            )}
            <input
              type="password"
              placeholder="New password (min 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleReset()}
              style={{ ...inputStyle, marginBottom: 16 }}
            />
            <button
              onClick={handleReset}
              disabled={loading || !password || !confirm}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: 14,
                border: "none",
                background: "#003580",
                color: "white",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                opacity: loading || !password || !confirm ? 0.5 : 1,
              }}
            >
              {loading ? "Updating…" : "Set New Password"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--pg-navy)" }}>
        <p className="text-white text-sm">Loading…</p>
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: 12,
  border: "1.5px solid #E5E7EB",
  fontSize: 14,
  color: "#1a1a2e",
  outline: "none",
  marginBottom: 10,
  fontFamily: "inherit",
  boxSizing: "border-box",
};
