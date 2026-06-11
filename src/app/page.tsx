"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useI18n, LANGUAGES } from "@/lib/i18n";

export default function Home() {
  const [mode, setMode] = useState<"idle" | "signin" | "signup" | "forgot">("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { t, lang, setLang } = useI18n();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const router = useRouter();

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function handleEmailSignIn() {
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/dashboard";
    }
    setLoading(false);
  }

  async function handleEmailSignUp() {
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Check your email to confirm your account, then sign in.");
      setMode("signin");
    }
    setLoading(false);
  }

  async function handleForgotPassword() {
    if (!email) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password reset link sent! Check your email.");
      setMode("signin");
    }
    setLoading(false);
  }

  function resetForm() {
    setEmail("");
    setPassword("");
    setName("");
    setError(null);
    setSuccess(null);
  }

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(170deg, #001233 0%, #002e75 55%, #003580 100%)",
        position: "relative",
      }}
    >
      {/* Language Picker */}
      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
        <button
          onClick={() => setShowLangPicker(!showLangPicker)}
          style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.15)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}
        >
          {LANGUAGES.find(l => l.code === lang)?.flag}
        </button>
        {showLangPicker && (
          <div style={{
            position: "absolute", top: 48, right: 0,
            background: "rgba(0,20,64,0.95)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 14, padding: 6,
            backdropFilter: "blur(12px)",
            display: "flex", flexDirection: "column", gap: 2,
            minWidth: 140,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setShowLangPicker(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", borderRadius: 10,
                  border: "none", cursor: "pointer",
                  background: lang === l.code ? "rgba(255,255,255,0.15)" : "transparent",
                  color: "white", fontSize: 13, fontWeight: lang === l.code ? 700 : 400,
                  textAlign: "left", width: "100%",
                }}
              >
                <span style={{ fontSize: 18 }}>{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-9 pt-16 pb-8 text-center">

        {/* Logo */}
        <div
          className="flex items-center justify-center mb-7"
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
        >
          <svg viewBox="0 0 96 96" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <polygon
                id="s"
                fill="#FFD700"
                points="0,-3.5 .82,-1.06 3.32,-1.02 1.36,.38 2.04,2.75 0,1.53 -2.04,2.75 -1.36,.38 -3.32,-1.02 -.82,-1.06"
              />
            </defs>
            {[
              [48,15],[64.5,19.4],[76.6,31.5],[81,48],
              [76.6,64.5],[64.5,76.6],[48,81],[31.5,76.6],
              [19.4,64.5],[15,48],[19.4,31.5],[31.5,19.4],
            ].map(([x,y], i) => (
              <use key={i} href="#s" transform={`translate(${x},${y})`} />
            ))}
            <polygon points="48,30 66,38 48,46 30,38" fill="white" />
            <path d="M34,43 L34,57 Q34,64 48,64 Q62,64 62,57 L62,43 Z" fill="white" />
            <line x1="66" y1="38" x2="70" y2="52" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="70" cy="55" r="3" fill="rgba(255,255,255,0.6)" />
            <g transform="translate(52,25) rotate(-28)">
              <polygon points="0,0 18,6.5 0,13 4.5,6.5" fill="white" />
              <polygon points="0,13 4.5,6.5 0,0" fill="white" opacity=".35" />
            </g>
          </svg>
        </div>

        <h1
          className="text-white mb-2"
          style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.6px", lineHeight: 1.2 }}
        >
          {t("login.title")}
        </h1>

        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, whiteSpace: "pre-line" }}>
          {t("login.subtitle")}
        </p>

        <span
          style={{
            display: "inline-block",
            marginTop: 12,
            fontSize: 11,
            fontWeight: 600,
            color: "rgba(255,255,255,0.28)",
            letterSpacing: "0.3px",
          }}
        >
          {t("login.tagline")}
        </span>
      </div>

      {/* CTA Sheet */}
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "28px 28px 0 0",
          padding: "28px 28px 48px",
        }}
      >
        {/* Success message */}
        {success && (
          <div
            className="mb-4 px-4 py-3 rounded-2xl text-sm"
            style={{ background: "#E0F5F3", color: "#00A693" }}
          >
            {success}
          </div>
        )}

        {/* Google button */}
        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: "#003580",
            color: "white",
            fontWeight: 700,
            fontSize: 15,
            padding: "16px",
            borderRadius: 14,
            border: "none",
            cursor: "pointer",
            letterSpacing: "-0.1px",
            boxShadow: "0 4px 16px rgba(0,53,128,0.3)",
            marginBottom: 14,
            fontFamily: "inherit",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.6 4.8C9.8 39.7 16.4 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.7 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          {t("login.google")}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "#B0B8CC", fontWeight: 500 }}>{t("login.or")}</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        {/* Email form toggle buttons */}
        {mode === "idle" && (
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { resetForm(); setMode("signin"); }}
              style={{
                flex: 1,
                padding: "13px",
                borderRadius: 14,
                border: "1.5px solid var(--border)",
                background: "var(--surface)",
                fontSize: 14,
                fontWeight: 600,
                color: "#003580",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {t("login.signIn")}
            </button>
            <button
              onClick={() => { resetForm(); setMode("signup"); }}
              style={{
                flex: 1,
                padding: "13px",
                borderRadius: 14,
                border: "1.5px solid #003580",
                background: "#F0F4FB",
                fontSize: 14,
                fontWeight: 600,
                color: "#003580",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {t("login.createAccount")}
            </button>
          </div>
        )}

        {/* Sign In form */}
        {mode === "signin" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{t("login.signIn")}</span>
              <button
                onClick={() => { resetForm(); setMode("idle"); }}
                style={{ fontSize: 20, color: "#B0B8CC", background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            {error && (
              <div className="mb-3 px-4 py-3 rounded-xl text-sm" style={{ background: "#FEF3C7", color: "#D97706" }}>
                {error}
              </div>
            )}
            <input
              type="email"
              placeholder={t("login.email")}
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder={t("login.password")}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEmailSignIn()}
              style={{ ...inputStyle, marginBottom: 6 }}
            />
            <div style={{ textAlign: "right", marginBottom: 14 }}>
              <button
                onClick={() => { setPassword(""); setError(null); setMode("forgot"); }}
                style={{ fontSize: 12, color: "#003580", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
              >
                {t("login.forgotPassword")}
              </button>
            </div>
            <button
              onClick={handleEmailSignIn}
              disabled={loading || !email || !password}
              style={{
                ...submitStyle,
                opacity: loading || !email || !password ? 0.5 : 1,
              }}
            >
              {loading ? t("login.signingIn") : t("login.signIn")}
            </button>
            <p style={{ textAlign: "center", fontSize: 13, color: "#B0B8CC", marginTop: 12 }}>
              {t("login.noAccount")}{" "}
              <button
                onClick={() => { resetForm(); setMode("signup"); }}
                style={{ color: "#003580", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}
              >
                {t("login.createOne")}
              </button>
            </p>
          </div>
        )}

        {/* Forgot Password form */}
        {mode === "forgot" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{t("login.resetPassword")}</span>
              <button
                onClick={() => { resetForm(); setMode("signin"); }}
                style={{ fontSize: 20, color: "#B0B8CC", background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            <p style={{ fontSize: 13, color: "#A0A8BB", marginBottom: 16, lineHeight: 1.5 }}>
              {t("login.resetSub")}
            </p>
            {error && (
              <div className="mb-3 px-4 py-3 rounded-xl text-sm" style={{ background: "#FEF3C7", color: "#D97706" }}>
                {error}
              </div>
            )}
            <input
              type="email"
              placeholder={t("login.email")}
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleForgotPassword()}
              style={{ ...inputStyle, marginBottom: 14 }}
            />
            <button
              onClick={handleForgotPassword}
              disabled={loading || !email}
              style={{
                ...submitStyle,
                opacity: loading || !email ? 0.5 : 1,
              }}
            >
              {loading ? t("login.sending") : t("login.sendReset")}
            </button>
            <p style={{ textAlign: "center", fontSize: 13, color: "#B0B8CC", marginTop: 12 }}>
              <button
                onClick={() => { resetForm(); setMode("signin"); }}
                style={{ color: "#003580", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}
              >
                {t("login.backToSignIn")}
              </button>
            </p>
          </div>
        )}

        {/* Sign Up form */}
        {mode === "signup" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{t("login.createAccount")}</span>
              <button
                onClick={() => { resetForm(); setMode("idle"); }}
                style={{ fontSize: 20, color: "#B0B8CC", background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            {error && (
              <div className="mb-3 px-4 py-3 rounded-xl text-sm" style={{ background: "#FEF3C7", color: "#D97706" }}>
                {error}
              </div>
            )}
            <input
              type="text"
              placeholder={t("login.name")}
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
            />
            <input
              type="email"
              placeholder={t("login.email")}
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder={t("login.passwordMin")}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEmailSignUp()}
              style={{ ...inputStyle, marginBottom: 14 }}
            />
            <button
              onClick={handleEmailSignUp}
              disabled={loading || !email || !password}
              style={{
                ...submitStyle,
                opacity: loading || !email || !password ? 0.5 : 1,
              }}
            >
              {loading ? t("login.creatingAccount") : t("login.createAccount")}
            </button>
            <p style={{ textAlign: "center", fontSize: 13, color: "#B0B8CC", marginTop: 12 }}>
              {t("login.haveAccount")}{" "}
              <button
                onClick={() => { resetForm(); setMode("signin"); }}
                style={{ color: "#003580", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}
              >
                {t("login.signIn")}
              </button>
            </p>
          </div>
        )}

        {/* Footer note */}
        {mode === "idle" && (
          <>
            <p
              style={{
                fontSize: 12,
                color: "#A0A8BB",
                textAlign: "center",
                lineHeight: 1.6,
                marginTop: 14,
              }}
            >
              {t("login.free")}
              <br />
              <span style={{ color: "#6E7891", fontWeight: 600 }}>
                {t("login.noRegistration")}
              </span>
            </p>

            {/* Guest Preview */}
            <button
              onClick={() => {
                localStorage.setItem("guest_mode", "true");
                router.push("/dashboard");
              }}
              style={{
                width: "100%",
                marginTop: 14,
                padding: "12px",
                borderRadius: 14,
                border: "1.5px dashed var(--border)",
                background: "transparent",
                fontSize: 13,
                fontWeight: 600,
                color: "#6E7891",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              👀 {t("guest.preview")}
            </button>
          </>
        )}
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: 12,
  border: "1.5px solid var(--border)",
  fontSize: 14,
  color: "var(--text-primary)",
  background: "var(--surface)",
  outline: "none",
  marginBottom: 10,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const submitStyle: React.CSSProperties = {
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
  letterSpacing: "-0.1px",
};
