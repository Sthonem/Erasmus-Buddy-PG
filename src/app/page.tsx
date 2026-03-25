"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--pg-navy)" }}>

      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🎓</div>
        <h1 className="text-3xl font-bold text-white mb-2">ErasmusBuddy</h1>
        <p className="text-blue-200 text-sm">Gdańsk University of Technology</p>
      </div>

      <div className="w-full max-w-sm">
        <p className="text-center text-white text-sm mb-6">
          Your step-by-step guide to life in Gdańsk
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-3"
          style={{ background: "var(--pg-white)", color: "var(--pg-navy)" }}>
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.6 4.8C9.8 39.7 16.4 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.7 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continue with Google
        </button>
        <p className="text-center text-blue-200 text-xs mt-6">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </main>
  );
}