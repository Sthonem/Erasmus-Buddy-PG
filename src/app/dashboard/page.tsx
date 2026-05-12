"use client";
export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TASKS } from "@/lib/tasks-data";
import BottomNav from "@/components/shared/BottomNav";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return "Good night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// ── Journey stages ──────────────────────────────────────────────────────────
const STAGES = [
  { key: "landed",    emoji: "🛬", label: "Just Landed",      msg: "Welcome to Gdańsk! Let's get you settled." },
  { key: "started",   emoji: "📋", label: "Getting Started",   msg: "You're figuring things out — nice!" },
  { key: "settling",  emoji: "🏠", label: "Settling In",       msg: "Bureaucracy? Done. Now the fun begins!" },
  { key: "student",   emoji: "📚", label: "Student Life",      msg: "You're officially a PG student!" },
  { key: "explorer",  emoji: "🌍", label: "Gdańsk Explorer",   msg: "You're basically a local now 😎" },
];

function getStage(completedCount: number, totalCount: number, criticalDone: boolean) {
  const pct = completedCount / totalCount;
  if (pct === 1) return 4;          // Explorer
  if (pct >= 0.7) return 3;          // Student Life
  if (criticalDone) return 2;        // Settling In
  if (completedCount > 0) return 1;  // Getting Started
  return 0;                           // Just Landed
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
  { title: "Biedronka",         sub: "Cheapest grocery chain",    icon: "🛒", tip: "Closest to PG",    color: "#FDE68A", accent: "#78350F", border: "#FBD34D" },
  { title: "Kebab spots",       sub: "Late night go-to food",     icon: "🌯", tip: "ul. Rajska area",  color: "#BBF0CC", accent: "#14522A", border: "#88E0A4" },
  { title: "Stacja Food Hall",  sub: "Many cuisines, one place",  icon: "🍕", tip: "Great for groups", color: "#C5D8F8", accent: "#002A6B", border: "#9BBDEF" },
];

const QUICK_ACCESS = [
  { title: "Explore",   sub: "Guides & places",      bg: "#C5D8F8", accent: "#002A6B", border: "#9BBDEF", icon: "🧭", href: "/places"    },
  { title: "Timetable", sub: "Build your schedule",   bg: "#B2F0E8", accent: "#006B5A", border: "#7DE0D2", icon: "📅", href: "/timetable" },
  { title: "Tasks",     sub: "Your to-do list",       bg: "#FDE68A", accent: "#78350F", border: "#FBD34D", icon: "✅", href: "/tasks"     },
];

const FUN_TIPS = [
  { emoji: "🚃", text: "Get a ZTM monthly pass — it covers trams, buses, and SKM trains to Sopot & Gdynia!" },
  { emoji: "🍺", text: "Thursday is the unofficial Erasmus party night in Gdańsk. Check ESN events!" },
  { emoji: "🏖️", text: "Stogi beach is just 20 min by tram — perfect for summer sunsets." },
  { emoji: "🎵", text: "Oliwa Cathedral has free organ concerts — one of Gdańsk's hidden gems." },
  { emoji: "🛍️", text: "Galeria Bałtycka is the biggest shopping mall near PG. 5 min walk!" },
  { emoji: "⚽", text: "Lechia Gdańsk matches at Stadion Energa are super cheap with a student ID." },
];

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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

  // Refetch every time user navigates to dashboard
  useEffect(() => {
    loadData();
  }, [pathname, loadData]);

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--pg-light)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "2.5px solid var(--pg-blue)", borderTopColor: "transparent",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ color: "var(--text-tertiary)", fontSize: 13 }}>Loading…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );

  const completedCount = TASKS.filter(t => completedSlugs.includes(t.slug)).length;
  const progress = Math.round((completedCount / TASKS.length) * 100);
  const priorityTasks = TASKS.filter(t => !completedSlugs.includes(t.slug)).slice(0, 2);
  const criticalDone = TASKS.filter(t => t.critical).every(t => completedSlugs.includes(t.slug));
  const stageIdx = getStage(completedCount, TASKS.length, criticalDone);
  const stage = STAGES[stageIdx];

  // Pick a random fun tip based on today's date
  const tipIdx = new Date().getDate() % FUN_TIPS.length;
  const tip = FUN_TIPS[tipIdx];

  // Motivational sub-text
  const progressMsg = progress === 0 ? "Let's start your Gdańsk adventure!" :
    progress < 50 ? `${completedCount} down, ${TASKS.length - completedCount} to go — you got this! 💪` :
    progress < 100 ? `More than halfway there! Almost sorted 🎉` :
    "You're all set! Time to explore Gdańsk 🌍";

  return (
    <main className="min-h-screen" style={{ background: "var(--pg-light)", paddingBottom: 90 }}>

      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(165deg, #001a4d 0%, #002e75 40%, #003580 100%)",
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
              Gdańsk University of Technology
            </p>
          </div>
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

        {/* ── Journey Progress Card — Stepper ── */}
        <div style={{
          background: "rgba(255,255,255,0.09)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20,
          padding: 18,
          backdropFilter: "blur(8px)",
        }}>
          {/* Title row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <p style={{ color: "white", fontSize: 13, fontWeight: 600 }}>
                {stage.emoji} Your Gdańsk Journey
              </p>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 2 }}>
                {stage.msg}
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
            {STAGES.map((s, i) => {
              const isPast = i < stageIdx;
              const isActive = i === stageIdx;
              const isLast = i === STAGES.length - 1;
              return (
                <div key={s.key} style={{ display: "contents" }}>
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
            {STAGES.map((s, i) => (
              <span key={s.key} style={{
                opacity: i === stageIdx ? 1 : i < stageIdx ? 0.5 : 0.3,
                transition: "opacity 0.3s",
              }}>{s.emoji}</span>
            ))}
          </div>

          {/* Active stage label */}
          <p style={{
            fontSize: 13.5, fontWeight: 700, color: "white",
            textAlign: "center", letterSpacing: "-0.2px",
          }}>
            {stage.label}
          </p>
        </div>
      </div>

      {/* ── WHAT'S NEXT ── */}
      {priorityTasks.length > 0 && (
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.1px" }}>
              What&apos;s next on your list
            </p>
            <Link href="/tasks">
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--pg-blue)" }}>See all →</span>
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
                      {task.title}
                    </p>
                    <p style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 1 }}>{task.desc}</p>
                  </div>
                  <span className="badge" style={{
                    background: task.critical ? "#FEF3C7" : "#F0F1F8",
                    color: task.critical ? "#D97706" : "#6E7891",
                    flexShrink: 0,
                  }}>
                    {task.critical ? "⚡ Do first" : task.badge}
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
          <div style={{ background: "#E5F7F5", border: "1px solid #b2ebe5", borderRadius: 16, padding: "18px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 32, marginBottom: 6 }}>🎉</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#00856f" }}>You&apos;re all sorted!</p>
            <p style={{ fontSize: 12, color: "#555", marginTop: 3 }}>Time to explore Gdańsk and enjoy your Erasmus 🌍</p>
          </div>
        </div>
      )}

      {/* ── EXPLORE GDAŃSK ── */}
      <div style={{ padding: "20px 0 0" }}>
        <div style={{ padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.1px" }}>
            🌍 Explore Gdańsk
          </p>
          <Link href="/places">
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--pg-blue)" }}>Explore all →</span>
          </Link>
        </div>
        <div style={{
          display: "flex", gap: 10, overflowX: "auto",
          paddingLeft: 20, paddingRight: 20, paddingBottom: 4,
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}>
          {EXPLORE.map((item) => (
            <div key={item.title} style={{
              minWidth: 150, maxWidth: 150,
              background: item.color,
              border: `1.5px solid ${item.border}`,
              borderRadius: 16,
              padding: "14px 14px 12px",
              scrollSnapAlign: "start",
              flexShrink: 0,
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
      <div style={{ padding: "16px 0 0" }}>
        <div style={{ padding: "0 20px", marginBottom: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.1px" }}>
            🍕 Student Eats & Shopping
          </p>
        </div>
        <div style={{
          display: "flex", gap: 10, overflowX: "auto",
          paddingLeft: 20, paddingRight: 20, paddingBottom: 4,
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}>
          {EATS.map((item) => (
            <div key={item.title} style={{
              minWidth: 150, maxWidth: 150,
              background: item.color,
              border: `1.5px solid ${item.border}`,
              borderRadius: 16,
              padding: "14px 14px 12px",
              scrollSnapAlign: "start",
              flexShrink: 0,
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

      {/* ── QUICK ACCESS (3 items now) ── */}
      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12, letterSpacing: "-0.1px" }}>
          Jump to...
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {QUICK_ACCESS.map((item) => (
            <Link key={item.title} href={item.href}>
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
                  {item.title}
                </p>
                <p style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 2 }}>{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── FUN TIP ── */}
      <div style={{ padding: "16px 20px 8px" }}>
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 16, padding: "13px 16px", display: "flex", gap: 12, boxShadow: "var(--shadow-xs)" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{tip.emoji}</span>
          <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Did you know?</span>{" "}
            {tip.text}
          </p>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
