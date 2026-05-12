"use client";
export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TASKS } from "@/lib/tasks-data";
import BottomNav from "@/components/shared/BottomNav";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useI18n, type TranslationKey } from "@/lib/i18n";

// ── Journey stages ──────────────────────────────────────────────────────────
const STAGE_KEYS = ["landed", "started", "settling", "student", "explorer"] as const;
const STAGE_EMOJIS = ["🛬", "📋", "🏠", "📚", "🌍"];

function getStage(completedCount: number, totalCount: number, criticalDone: boolean) {
  const pct = completedCount / totalCount;
  if (pct === 1) return 4;
  if (pct >= 0.7) return 3;
  if (criticalDone) return 2;
  if (completedCount > 0) return 1;
  return 0;
}

// ── Explore Gdańsk data ─────────────────────────────────────────────────────
const EXPLORE = [
  { title: "Sopot Pier",        sub: "Longest wooden pier in Europe", icon: "🏖️", dist: "25 min by SKM", color: "#B2F0E8", accent: "#006B5A", border: "#7DE0D2" },
  { title: "Długi Targ",        sub: "The heart of old town Gdańsk",  icon: "🏛️", dist: "15 min by tram", color: "#C5D8F8", accent: "#002A6B", border: "#9BBDEF" },
  { title: "Oliwa Park",        sub: "Cathedral organ concerts",      icon: "🌿", dist: "10 min by tram", color: "#BBF0CC", accent: "#14522A", border: "#88E0A4" },
  { title: "Hel Peninsula",     sub: "Beach day trip paradise",       icon: "⛱️", dist: "2h by ferry",    color: "#FDE68A", accent: "#78350F", border: "#FBD34D" },
  { title: "Westerplatte",      sub: "WWII memorial & views",        icon: "🚢", dist: "Ferry from town", color: "#DDD6FE", accent: "#4C1D95", border: "#C4B5FD" },
  { title: "Gdynia Waterfront", sub: "Modern city by the sea",       icon: "⚓", dist: "30 min by SKM",  color: "#BFDBFE", accent: "#1E3A8A", border: "#93C5FD" },
];

const EATS = [
  { title: "Pierogarnia Mandu", sub: "Best pierogi in town",     icon: "🥟", tip: "Student favorite",  color: "#FDE68A", accent: "#78350F", border: "#FBD34D" },
  { title: "Biedronka",         sub: "Cheapest grocery chain",    icon: "🛒", tip: "Closest to PG",    color: "#FED7AA", accent: "#9A3412", border: "#FDBA74" },
  { title: "Kebab spots",       sub: "Late night go-to food",     icon: "🌯", tip: "ul. Rajska area",  color: "#BBF0CC", accent: "#14522A", border: "#88E0A4" },
  { title: "Stacja Food Hall",  sub: "Many cuisines, one place",  icon: "🍕", tip: "Great for groups", color: "#C5D8F8", accent: "#002A6B", border: "#9BBDEF" },
];

const QUICK_ACCESS: { titleKey: TranslationKey; subKey: TranslationKey; bg: string; accent: string; border: string; icon: string; href: string }[] = [
  { titleKey: "quick.explore",   subKey: "quick.explore.sub",   bg: "#C5D8F8", accent: "#002A6B", border: "#9BBDEF", icon: "🧭", href: "/places"    },
  { titleKey: "quick.timetable", subKey: "quick.timetable.sub", bg: "#B2F0E8", accent: "#006B5A", border: "#7DE0D2", icon: "📅", href: "/timetable" },
  { titleKey: "quick.tasks",     subKey: "quick.tasks.sub",     bg: "#FDE68A", accent: "#78350F", border: "#FBD34D", icon: "✅", href: "/tasks"     },
];

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { t, lang } = useI18n();

  const loadData = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) { router.push("/"); return; }
    setUser({ name: data.user.user_metadata?.full_name?.split(" ")[0] || "Student" });
    const { data: tasks } = await supabase
      .from("user_tasks").select("task_slug")
      .eq("user_id", data.user.id).eq("completed", true);
    setCompletedSlugs(tasks ? tasks.map((t: { task_slug: string }) => t.task_slug) : []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadData();
  }, [pathname, loadData]);

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 5)  return t("greeting.night");
    if (h < 12) return t("greeting.morning");
    if (h < 18) return t("greeting.afternoon");
    return t("greeting.evening");
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--pg-light)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "2.5px solid var(--pg-blue)", borderTopColor: "transparent",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ color: "var(--text-tertiary)", fontSize: 13 }}>{t("dashboard.loading")}</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );

  const completedCount = TASKS.filter(t => completedSlugs.includes(t.slug)).length;
  const progress = Math.round((completedCount / TASKS.length) * 100);
  const priorityTasks = TASKS.filter(t => !completedSlugs.includes(t.slug)).slice(0, 2);
  const criticalDone = TASKS.filter(t => t.critical).every(t => completedSlugs.includes(t.slug));
  const stageIdx = getStage(completedCount, TASKS.length, criticalDone);
  const stageKey = STAGE_KEYS[stageIdx];
  const stageEmoji = STAGE_EMOJIS[stageIdx];
  const stageLabel = t(`stage.${stageKey}` as TranslationKey);
  const stageMsg = t(`stage.${stageKey}.msg` as TranslationKey);

  // Pick a random fun tip based on today's date
  const tipIdx = new Date().getDate() % 6;
  const tipEmojis = ["🚃", "🍺", "🏖️", "🎵", "🛍️", "⚽"];
  const tipText = t(`tip.${tipIdx}` as TranslationKey);

  // Motivational sub-text
  const progressMsg = progress === 0 ? (lang === "tr" ? "Gdańsk macerana başlayalım!" : lang === "es" ? "¡Comencemos tu aventura en Gdańsk!" : lang === "pl" ? "Rozpocznijmy twoją przygodę w Gdańsku!" : "Let's start your Gdańsk adventure!") :
    progress < 50 ? `${completedCount} ✓ · ${TASKS.length - completedCount} left 💪` :
    progress < 100 ? (lang === "tr" ? "Yarıdan fazlasını tamamladın! 🎉" : lang === "es" ? "¡Más de la mitad hecho! 🎉" : lang === "pl" ? "Ponad połowa zrobiona! 🎉" : "More than halfway there! 🎉") :
    t("dashboard.allSortedSub");

  return (
    <main className="min-h-screen" style={{ background: "var(--pg-light)", paddingBottom: 90 }}>

      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(165deg, var(--header-from) 0%, var(--header-mid) 40%, var(--header-to) 100%)",
        padding: "52px 20px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div aria-hidden style={{
          position: "absolute", top: -60, right: -60,
          width: 220, height: 220, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,93,170,0.4) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 500, marginBottom: 3 }}>
              {getGreeting()} 👋
            </p>
            <h1 style={{ color: "white", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.2 }}>
              {user?.name}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2 }}>
              {t("dashboard.university")}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/settings"
              style={{
                width: 36, height: 36, borderRadius: "50%", border: "none",
                background: "rgba(255,255,255,0.10)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              title="Settings"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
                  stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <button
              onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
              style={{
                width: 36, height: 36, borderRadius: "50%", border: "none",
                background: "rgba(255,255,255,0.10)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
              title="Sign out"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                  stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Journey Progress Card — Stepper ── */}
        <div style={{
          background: "rgba(255,255,255,0.09)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20,
          padding: 18,
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <p style={{ color: "white", fontSize: 13, fontWeight: 600 }}>
                {stageEmoji} {t("dashboard.journey")}
              </p>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 2 }}>
                {stageMsg}
              </p>
            </div>
            <p style={{
              color: "white", fontSize: 28, fontWeight: 800,
              letterSpacing: "-1px", lineHeight: 1,
            }}>
              {progress}<span style={{ fontSize: 14, fontWeight: 500, opacity: 0.5 }}>%</span>
            </p>
          </div>

          {/* Stepper */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
            {STAGE_KEYS.map((s, i) => {
              const isPast = i < stageIdx;
              const isActive = i === stageIdx;
              const isLast = i === STAGE_KEYS.length - 1;
              return (
                <div key={s} style={{ display: "contents" }}>
                  {isActive ? (
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: "white", border: "3px solid #00E5D2",
                      boxShadow: "0 0 0 4px rgba(0,229,210,0.2)",
                      flexShrink: 0,
                    }} />
                  ) : isPast ? (
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: "#00E5D2",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="#001540" strokeWidth="1.8"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : (
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: "rgba(255,255,255,0.15)",
                      flexShrink: 0,
                    }} />
                  )}
                  {!isLast && (
                    <div style={{
                      flex: 1, height: 3,
                      background: i < stageIdx
                        ? "#00E5D2"
                        : i === stageIdx
                          ? "linear-gradient(90deg,#00E5D2,rgba(255,255,255,0.15))"
                          : "rgba(255,255,255,0.15)",
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Emoji row */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: 13, padding: "0 1px", marginBottom: 8,
          }}>
            {STAGE_EMOJIS.map((emoji, i) => (
              <span key={i} style={{
                opacity: i === stageIdx ? 1 : i < stageIdx ? 0.5 : 0.3,
                transition: "opacity 0.3s",
              }}>{emoji}</span>
            ))}
          </div>

          {/* Active stage label */}
          <p style={{
            fontSize: 13.5, fontWeight: 700, color: "white",
            textAlign: "center", letterSpacing: "-0.2px",
          }}>
            {stageLabel}
          </p>
        </div>
      </div>

      {/* ── WHAT'S NEXT ── */}
      {priorityTasks.length > 0 && (
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.1px" }}>
              {t("dashboard.whatsNext")}
            </p>
            <Link href="/tasks">
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--pg-blue)" }}>{t("dashboard.seeAll")}</span>
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {priorityTasks.map((task) => (
              <Link key={task.slug} href="/tasks">
                <div className="card-interactive" style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                    border: `1.5px solid ${task.critical ? "#D97706" : "#D0D5DD"}`,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>
                      {t(`task.${task.slug}` as TranslationKey)}
                    </p>
                    <p style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 1 }}>{t(`task.${task.slug}.desc` as TranslationKey)}</p>
                  </div>
                  <span className="badge" style={{
                    background: task.critical ? "#FEF3C7" : "#F0F1F8",
                    color: task.critical ? "#D97706" : "#6E7891",
                    flexShrink: 0,
                  }}>
                    {task.critical ? t("dashboard.doFirst") : task.badge}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── ALL DONE CELEBRATION ── */}
      {priorityTasks.length === 0 && (
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "18px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 32, marginBottom: 6 }}>🎉</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#00856f" }}>{t("dashboard.allSorted")}</p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 3 }}>{t("dashboard.allSortedSub")}</p>
          </div>
        </div>
      )}

      {/* ── EXPLORE GDAŃSK ── */}
      <div style={{ padding: "24px 0 0" }}>
        <div style={{ padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.1px" }}>
            🌍 {t("dashboard.explore")}
          </p>
          <Link href="/places">
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--pg-blue)" }}>{t("dashboard.exploreAll")}</span>
          </Link>
        </div>
        <div style={{
          display: "flex", gap: 10, overflowX: "auto",
          paddingBottom: 4,
          scrollSnapType: "x mandatory",
          scrollPaddingLeft: 20,
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}>
          {EXPLORE.map((item, idx) => (
            <div key={item.title} style={{
              minWidth: 150, maxWidth: 150,
              background: item.color,
              border: `1.5px solid ${item.border}`,
              borderRadius: 16,
              padding: "14px 14px 12px",
              scrollSnapAlign: "start",
              flexShrink: 0,
              marginLeft: idx === 0 ? 20 : 0,
              marginRight: idx === EXPLORE.length - 1 ? 20 : 0,
            }}>
              <p style={{ fontSize: 28, marginBottom: 8, lineHeight: 1 }}>{item.icon}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: item.accent, lineHeight: 1.3 }}>{item.title}</p>
              <p style={{ fontSize: 10.5, color: "var(--text-secondary)", marginTop: 3, lineHeight: 1.4 }}>{item.sub}</p>
              <p style={{ fontSize: 9.5, color: item.accent, marginTop: 6, fontWeight: 600, opacity: 0.7 }}>
                📍 {item.dist}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── STUDENT EATS ── */}
      <div style={{ padding: "20px 0 0" }}>
        <div style={{ padding: "0 20px", marginBottom: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.1px" }}>
            🍕 {t("dashboard.eats")}
          </p>
        </div>
        <div style={{
          display: "flex", gap: 10, overflowX: "auto",
          paddingBottom: 4,
          scrollSnapType: "x mandatory",
          scrollPaddingLeft: 20,
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}>
          {EATS.map((item, idx) => (
            <div key={item.title} style={{
              minWidth: 150, maxWidth: 150,
              background: item.color,
              border: `1.5px solid ${item.border}`,
              borderRadius: 16,
              padding: "14px 14px 12px",
              scrollSnapAlign: "start",
              flexShrink: 0,
              marginLeft: idx === 0 ? 20 : 0,
              marginRight: idx === EATS.length - 1 ? 20 : 0,
            }}>
              <p style={{ fontSize: 28, marginBottom: 8, lineHeight: 1 }}>{item.icon}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: item.accent, lineHeight: 1.3 }}>{item.title}</p>
              <p style={{ fontSize: 10.5, color: "var(--text-secondary)", marginTop: 3, lineHeight: 1.4 }}>{item.sub}</p>
              <p style={{ fontSize: 9.5, color: item.accent, marginTop: 6, fontWeight: 600, opacity: 0.7 }}>
                ⭐ {item.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK ACCESS ── */}
      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12, letterSpacing: "-0.1px" }}>
          {t("dashboard.jumpTo")}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {QUICK_ACCESS.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                style={{
                  background: item.bg,
                  border: `1.5px solid ${item.border}`,
                  borderRadius: 16,
                  padding: "14px 12px 12px",
                  cursor: "pointer",
                  transition: "transform 0.15s",
                  textAlign: "center",
                }}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.96)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                onTouchStart={e => (e.currentTarget.style.transform = "scale(0.96)")}
                onTouchEnd={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div style={{ fontSize: 24, marginBottom: 6, lineHeight: 1 }}>{item.icon}</div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
                  {t(item.titleKey)}
                </p>
                <p style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 2 }}>{t(item.subKey)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── FUN TIP ── */}
      <div style={{ padding: "16px 20px 8px" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "13px 16px", display: "flex", gap: 12, boxShadow: "var(--shadow-xs)" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{tipEmojis[tipIdx]}</span>
          <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{t("dashboard.didYouKnow")}</span>{" "}
            {tipText}
          </p>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
