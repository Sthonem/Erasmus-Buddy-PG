"use client";

import { supabase } from "@/lib/supabase";

const FEATURES = [
  { icon: "✅", text: "Task checklist — PESEL, bank, ZUS, OLA" },
  { icon: "📅", text: "Interactive timetable + .ics export" },
  { icon: "🏛️", text: "Campus offices with hours & contacts" },
  { icon: "📍", text: "Shops, transport & essentials nearby" },
];

export default function Home() {
  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <main className="min-h-screen flex flex-col overflow-hidden" style={{ background: "var(--pg-navy)" }}>

      {/* Decorative background blobs */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,93,170,0.5) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: 60, left: -100,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,165,147,0.18) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", top: "40%", left: "50%",
          width: 600, height: 1, transform: "translateX(-50%)",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
        }} />
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-6 relative">

        {/* Logo */}
        <div className="relative mb-8">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.07))",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            <span style={{ fontSize: 44 }}>🎓</span>
          </div>
          {/* Online indicator */}
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{
              background: "var(--pg-teal)",
              border: "2px solid var(--pg-navy)",
              boxShadow: "0 0 0 3px rgba(0,166,147,0.3)",
            }}
          >
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <h1
          className="text-white text-center mb-1"
          style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.8px", lineHeight: 1.15 }}
        >
          ErasmusBuddy
        </h1>
        <p className="text-center mb-1" style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 500 }}>
          Gdańsk University of Technology
        </p>
        <p className="text-center mb-10" style={{ color: "rgba(255,255,255,0.28)", fontSize: 11, letterSpacing: "0.5px" }}>
          POLITECHNIKA GDAŃSKA
        </p>

        {/* Feature card */}
        <div
          className="w-full rounded-3xl p-5"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 10, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>
            Everything you need to settle in
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {FEATURES.map((f) => (
              <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 16, flexShrink: 0, width: 24, textAlign: "center" }}>{f.icon}</span>
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.4 }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-7 pb-10 pt-2 relative">
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 mb-5"
          style={{
            background: "white",
            color: "var(--pg-navy)",
            fontWeight: 700,
            fontSize: 15,
            padding: "16px 24px",
            borderRadius: 18,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 24px rgba(0,0,0,0.25), 0 1px 4px rgba(0,0,0,0.15)",
            letterSpacing: "-0.1px",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.6 4.8C9.8 39.7 16.4 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.7 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continue with Google
        </button>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-4">
          {["🔒 Secure", "⚡ Free", "📱 Works offline"].map(t => (
            <span key={t} style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>
    </main>
  );
}
