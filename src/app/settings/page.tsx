"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n, LANGUAGES, type TranslationKey } from "@/lib/i18n";

export default function Settings() {
  const [user, setUser] = useState<{ name: string; email: string; createdAt: string } | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t, lang, setLang } = useI18n();

  // Profile editing
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Email editing
  const [editingEmail, setEditingEmail] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingEmail, setSavingEmail] = useState(false);

  // Password change
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { router.push("/"); return; }
      const name = data.user.user_metadata?.full_name || "Student";
      setUser({
        name,
        email: data.user.email || "",
        createdAt: data.user.created_at || "",
      });
      setEditName(name);
      setEditEmail(data.user.email || "");

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

  async function handleSaveProfile() {
    if (!editName.trim()) return;
    setSavingProfile(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: editName.trim() },
    });
    if (!error) {
      setUser(prev => prev ? { ...prev, name: editName.trim() } : prev);
      setEditingProfile(false);
      setProfileMsg(t("settings.profileSaved"));
      setTimeout(() => setProfileMsg(null), 3000);
    }
    setSavingProfile(false);
  }

  async function handleChangeEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail)) {
      setEmailMsg({ type: "error", text: t("settings.invalidEmail") });
      return;
    }
    setSavingEmail(true);
    setEmailMsg(null);
    const { error } = await supabase.auth.updateUser({ email: editEmail });
    if (error) {
      setEmailMsg({ type: "error", text: error.message });
    } else {
      setEmailMsg({ type: "success", text: t("settings.emailUpdated") });
      setTimeout(() => { setEmailMsg(null); setEditingEmail(false); }, 4000);
    }
    setSavingEmail(false);
  }

  async function handleChangePassword() {
    if (!currentPassword) {
      setPasswordMsg({ type: "error", text: t("settings.currentPasswordRequired") });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: t("settings.passwordTooShort") });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: t("settings.passwordMismatch") });
      return;
    }
    setSavingPassword(true);
    setPasswordMsg(null);

    // Verify current password first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email || "",
      password: currentPassword,
    });
    if (signInError) {
      setPasswordMsg({ type: "error", text: t("settings.wrongCurrentPassword") });
      setSavingPassword(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordMsg({ type: "error", text: error.message });
    } else {
      setPasswordMsg({ type: "success", text: t("settings.passwordUpdated") });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => { setPasswordMsg(null); setShowPassword(false); }, 3000);
    }
    setSavingPassword(false);
  }

  const memberDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(
        lang === "tr" ? "tr-TR" : lang === "es" ? "es-ES" : lang === "pl" ? "pl-PL" : "en-GB",
        { month: "long", year: "numeric" }
      )
    : "";

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
        padding: "52px 20px 28px", position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,93,170,0.4), transparent 70%)", pointerEvents: "none" }} />
        <Link href="/dashboard">
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {t("settings.back")}
          </span>
        </Link>

        {/* Profile Avatar & Info in Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
            border: "2px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 800, color: "white",
            flexShrink: 0,
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ color: "white", fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.2 }}>
              {user?.name}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 3 }}>
              {t("settings.erasmusStudent")} · {t("dashboard.university")}
            </p>
            {memberDate && (
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2 }}>
                {t("settings.memberSince")} {memberDate}
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>

        {/* ── Account Section ── */}
        <SectionHeader dot="#003580" label={t("settings.account")} color="#003580" />
        <div style={cardStyle}>
          {/* Name row */}
          {!editingProfile ? (
            <>
              <div style={{ ...rowStyle, borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={iconCircle("#E8EEF7")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#003580" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="12" cy="7" r="4" stroke="#003580" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500 }}>{t("settings.fullName")}</p>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)", marginTop: 1 }}>{user?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingProfile(true)}
                  style={editBtnStyle}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#003580" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#003580" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              {/* Email row */}
              <div style={rowStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={iconCircle("#E8EEF7")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#003580" strokeWidth="1.5"/>
                      <path d="M2 7l10 7 10-7" stroke="#003580" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500 }}>{t("settings.email")}</p>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)", marginTop: 1 }}>{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setEditingEmail(true); setEditEmail(user?.email || ""); }}
                  style={editBtnStyle}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#003580" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#003580" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              {/* Email edit panel */}
              {editingEmail && (
                <div style={{ padding: "0 16px 16px", borderTop: "1px solid var(--border)" }}>
                  <div style={{ paddingTop: 14 }}>
                    <p style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500, marginBottom: 6 }}>{t("settings.newEmail")}</p>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      placeholder="new@email.com"
                      onKeyDown={e => e.key === "Enter" && handleChangeEmail()}
                      style={inputStyle}
                      autoFocus
                    />
                    {emailMsg && (
                      <div style={{
                        marginTop: 10, padding: "9px 12px", borderRadius: 10,
                        background: emailMsg.type === "success" ? "#E5F7F5" : "#FEF3C7",
                        display: "flex", alignItems: "center", gap: 8,
                      }}>
                        <span style={{ fontSize: 13 }}>{emailMsg.type === "success" ? "✅" : "⚠️"}</span>
                        <p style={{ fontSize: 12, fontWeight: 600, color: emailMsg.type === "success" ? "#00856f" : "#D97706" }}>
                          {emailMsg.text}
                        </p>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button
                        onClick={() => { setEditingEmail(false); setEmailMsg(null); }}
                        style={{ ...actionBtnStyle, background: "var(--pg-light)", color: "var(--text-secondary)", border: "1px solid var(--border)", flex: 1 }}
                      >
                        {t("settings.cancel")}
                      </button>
                      <button
                        onClick={handleChangeEmail}
                        disabled={savingEmail || !editEmail.trim()}
                        style={{ ...actionBtnStyle, background: "#003580", color: "white", flex: 1, opacity: savingEmail ? 0.6 : 1 }}
                      >
                        {savingEmail ? t("settings.updating") : t("settings.updateEmail")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Edit mode */
            <div style={{ padding: "16px" }}>
              <p style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500, marginBottom: 6 }}>{t("settings.fullName")}</p>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                style={inputStyle}
                autoFocus
              />
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button
                  onClick={() => { setEditingProfile(false); setEditName(user?.name || ""); }}
                  style={{ ...actionBtnStyle, background: "var(--pg-light)", color: "var(--text-secondary)", border: "1px solid var(--border)", flex: 1 }}
                >
                  {t("settings.cancel")}
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile || !editName.trim()}
                  style={{ ...actionBtnStyle, background: "#003580", color: "white", flex: 1, opacity: savingProfile ? 0.6 : 1 }}
                >
                  {savingProfile ? "..." : t("settings.saveProfile")}
                </button>
              </div>
            </div>
          )}
        </div>
        {profileMsg && (
          <div style={{ marginTop: 8, padding: "10px 14px", borderRadius: 10, background: "#E5F7F5", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>✅</span>
            <p style={{ fontSize: 12.5, color: "#00856f", fontWeight: 600 }}>{profileMsg}</p>
          </div>
        )}

        {/* ── Security Section ── */}
        <SectionHeader dot="#D97706" label={t("settings.security")} color="#D97706" />
        <div style={cardStyle}>
          <div
            onClick={() => setShowPassword(!showPassword)}
            style={{ ...rowStyle, cursor: "pointer" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={iconCircle("#FEF3C7")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#D97706" strokeWidth="1.5"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{t("settings.changePassword")}</p>
            </div>
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              style={{ transform: showPassword ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s" }}
            >
              <path d="M6 4l4 4-4 4" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          {showPassword && (
            <div style={{ padding: "0 16px 16px", borderTop: "1px solid var(--border)" }}>
              <div style={{ paddingTop: 14 }}>
                <p style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500, marginBottom: 6 }}>{t("settings.currentPassword")}</p>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
                />
                <div style={{ height: 1, background: "var(--border)", margin: "14px 0" }} />
                <p style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500, marginBottom: 6 }}>{t("settings.newPassword")}</p>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
                />
                <p style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500, marginBottom: 6, marginTop: 10 }}>{t("settings.confirmPassword")}</p>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  onKeyDown={e => e.key === "Enter" && handleChangePassword()}
                  style={inputStyle}
                />
                {passwordMsg && (
                  <div style={{
                    marginTop: 10, padding: "9px 12px", borderRadius: 10,
                    background: passwordMsg.type === "success" ? "#E5F7F5" : "#FEF3C7",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ fontSize: 13 }}>{passwordMsg.type === "success" ? "✅" : "⚠️"}</span>
                    <p style={{ fontSize: 12, fontWeight: 600, color: passwordMsg.type === "success" ? "#00856f" : "#D97706" }}>
                      {passwordMsg.text}
                    </p>
                  </div>
                )}
                <button
                  onClick={handleChangePassword}
                  disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                  style={{
                    ...actionBtnStyle,
                    width: "100%", marginTop: 12,
                    background: "#D97706", color: "white",
                    opacity: savingPassword || !currentPassword || !newPassword || !confirmPassword ? 0.5 : 1,
                  }}
                >
                  {savingPassword ? t("settings.updating") : t("settings.updatePassword")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Appearance Section ── */}
        <SectionHeader dot="#00A693" label={t("settings.appearance")} color="#00A693" />
        <div style={cardStyle}>
          {/* Dark Mode */}
          <div style={{ ...rowStyle, borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={iconCircle("#E5F7F5")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" stroke="#00A693" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{t("settings.darkMode")}</p>
            </div>
            <button
              onClick={toggleDarkMode}
              style={{
                width: 48, height: 28, borderRadius: 99, border: "none", cursor: "pointer",
                background: darkMode ? "#00A693" : "#E5E7EB",
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
          <div style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={iconCircle("#E5F7F5")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#00A693" strokeWidth="1.5"/>
                  <path d="M3.5 9h17M3.5 15h17" stroke="#00A693" strokeWidth="1.2"/>
                  <ellipse cx="12" cy="12" rx="4" ry="9" stroke="#00A693" strokeWidth="1.3"/>
                </svg>
              </div>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{t("settings.language")}</p>
            </div>
            <div style={{ display: "flex", gap: 6, paddingLeft: 38 }}>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 10,
                    border: lang === l.code ? "1.5px solid #00A693" : "1.5px solid var(--border)",
                    background: lang === l.code ? "#E5F7F5" : "transparent",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: lang === l.code ? 700 : 500,
                    color: lang === l.code ? "#00856f" : "var(--text-secondary)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {l.flag} {l.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── About Section ── */}
        <SectionHeader dot="#6366F1" label={t("settings.about")} color="#6366F1" />
        <div style={cardStyle}>
          <div style={{ ...rowStyle, borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={iconCircle("#EEF2FF")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#6366F1" strokeWidth="1.5"/>
                  <path d="M12 16v-4M12 8h.01" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-primary)" }}>{t("settings.version")}</p>
            </div>
            <span style={{
              padding: "4px 10px", borderRadius: 8,
              background: "#EEF2FF", fontSize: 12, fontWeight: 600, color: "#6366F1",
            }}>
              1.0.0
            </span>
          </div>
          <div style={rowStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={iconCircle("#EEF2FF")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="9" cy="7" r="4" stroke="#6366F1" strokeWidth="1.5"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-primary)" }}>{t("settings.madeBy")}</p>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>David, Joel & Erdem</p>
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
              fontFamily: "inherit",
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

/* ── Helper Components ── */
function SectionHeader({ dot, label, color }: { dot: string; label: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 24, marginBottom: 10 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: dot }} />
      <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase", color }}>{label}</p>
    </div>
  );
}

/* ── Shared Styles ── */
const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  borderRadius: 16,
  border: "1px solid var(--border)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  overflow: "hidden",
};

const rowStyle: React.CSSProperties = {
  padding: "14px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1.5px solid var(--border)",
  fontSize: 14,
  color: "var(--text-primary)",
  background: "var(--surface-raised, var(--pg-light))",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const actionBtnStyle: React.CSSProperties = {
  padding: "11px 16px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  fontFamily: "inherit",
};

const editBtnStyle: React.CSSProperties = {
  width: 34, height: 34, borderRadius: 10,
  background: "#E8EEF7",
  border: "none",
  cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
};

function iconCircle(bg: string): React.CSSProperties {
  return {
    width: 32, height: 32, borderRadius: 10,
    background: bg,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  };
}
