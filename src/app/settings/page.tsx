"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n, LANGUAGES } from "@/lib/i18n";

export default function Settings() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t, lang, setLang } = useI18n();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { router.push("/"); return; }
      setUser({
        name: data.user.user_metadata?.full_name || "Student",
        email: data.user.email || "",
      });

      // Load dark mode preference
      const saved = localStorage.getItem("erasmus-dark-mode");
      if (saved === "true") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      }
      setLoading(false);
    }
    load();
  }, [router]);

  function toggleDarkMode() {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("erasmus-dark-mode", String(next));
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--pg-light)" }}>
      <div style={{ width: 34, height: 34, borderRadius: "50%", border: "2.5px solid var(--pg-blue)", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );

  return (
    <main className="min-h-screen" style={{ background: "var(--pg-light)", paddingBottom: 90 }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(165deg, var(--header-from) 0%, var(--header-mid) 40%, var(--header-to) 100%)",
        padding: "52px 20px 24px", position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,93,170,0.4), transparent 70%)", pointerEvents: "none" }} />
        <Link href="/dashboard">
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {t("settings.back")}
          </span>
        </Link>
        <h1 style={{ color: "white", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>{t("settings.title")}</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 3 }}>{t("settings.subtitle")}</p>
      </div>

      <div style={{ padding: "0 16px" }}>

        {/* Profile Section */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#003580" }} />
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase", color: "#003580" }}>{t("settings.profile")}</p>
          </div>
          <div style={{
            background: "var(--surface)", borderRadius: 14, border: "1px solid var(--border)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden",
          }}>
            <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "linear-gradient(135deg, #003580, #005DAA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 16, fontWeight: 700,
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || "S"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{user?.name}</p>
                <p style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 1 }}>{user?.email}</p>
              </div>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: 13, color: "var(--text-primary)" }}>{t("settings.university")}</p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{t("dashboard.university")}</p>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D97706" }} />
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase", color: "#D97706" }}>{t("settings.appearance")}</p>
          </div>
          <div style={{
            background: "var(--surface)", borderRadius: 14, border: "1px solid var(--border)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden",
          }}>
            {/* Dark Mode */}
            <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{t("settings.darkMode")}</p>
              </div>
              <button
                onClick={toggleDarkMode}
                style={{
                  width: 48, height: 28, borderRadius: 99, border: "none", cursor: "pointer",
                  background: darkMode ? "#003580" : "#E5E7EB",
                  position: "relative", transition: "background 0.2s ease",
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", background: "white",
                  position: "absolute", top: 3,
                  left: darkMode ? 23 : 3,
                  transition: "left 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </button>
            </div>
            {/* Language */}
            <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#D97706" strokeWidth="1.5"/>
                  <path d="M3.5 9h17M3.5 15h17" stroke="#D97706" strokeWidth="1.2"/>
                  <ellipse cx="12" cy="12" rx="4" ry="9" stroke="#D97706" strokeWidth="1.3"/>
                </svg>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{t("settings.language")}</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 8,
                      border: lang === l.code ? "1.5px solid #003580" : "1.5px solid var(--border)",
                      background: lang === l.code ? "#E8EEF7" : "transparent",
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: lang === l.code ? 700 : 500,
                      color: lang === l.code ? "#003580" : "var(--text-secondary)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {l.flag} {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00A693" }} />
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase", color: "#00A693" }}>{t("settings.about")}</p>
          </div>
          <div style={{
            background: "var(--surface)", borderRadius: 14, border: "1px solid var(--border)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden",
          }}>
            <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: 13, color: "var(--text-primary)" }}>{t("settings.version")}</p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>1.0.0</p>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: 13, color: "var(--text-primary)" }}>{t("settings.madeBy")}</p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>David, Joel & Erdem</p>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <div style={{ marginTop: 24, marginBottom: 16 }}>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
            style={{
              width: "100%", padding: "14px", borderRadius: 14, border: "1.5px solid #FDA4AF",
              background: "#FFF1F2", cursor: "pointer",
              fontSize: 13, fontWeight: 600, color: "#9F1239",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="#9F1239" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t("settings.signOut")}
          </button>
        </div>
      </div>
    </main>
  );
}
