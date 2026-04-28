"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TASKS } from "@/lib/tasks-data";
import BottomNav from "@/components/shared/BottomNav";
import { useRouter } from "next/navigation";
import Link from "next/link";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return "Good night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const QUICK_ACCESS = [
  { title: "Guides",    sub: "PESEL, bank, OLA",    bg: "#EEF3FB", accent: "#003580", icon: "📖", href: "/guides"    },
  { title: "Timetable", sub: "Build your schedule", bg: "#E5F7F5", accent: "#00856f", icon: "📅", href: "/timetable" },
  { title: "Offices",   sub: "PG buildings & hours",bg: "#EDECFD", accent: "#4B44C8", icon: "🏛️", href: "/offices"   },
  { title: "Places",    sub: "Shops & transport",   bg: "#FDF3E3", accent: "#7B4A00", icon: "📍", href: "/places"    },
];

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { router.push("/"); return; }
      setUser({ name: data.user.user_metadata?.full_name?.split(" ")[0] || "Student" });
      const { data: tasks } = await supabase
        .from("user_tasks").select("task_slug")
        .eq("user_id", data.user.id).eq("completed", true);
      setCompletedSlugs(tasks ? tasks.map((t: { task_slug: string }) => t.task_slug) : []);
      setLoading(false);
    }
    load();
  }, [router]);

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
  const priorityTasks = TASKS.filter(t => !completedSlugs.includes(t.slug)).slice(0, 3);
  const criticalLeft = TASKS.filter(t => t.critical && !completedSlugs.includes(t.slug)).length;

  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--pg-light)" }}>

      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(165deg, #001a4d 0%, #002e75 40%, #003580 100%)",
        padding: "52px 20px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decoration */}
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

        {/* Progress card */}
        <div style={{
          background: "rgba(255,255,255,0.09)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20,
          padding: "16px 18px",
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <p style={{ color: "white", fontSize: 13, fontWeight: 600 }}>Onboarding Progress</p>
              {criticalLeft > 0 ? (
                <p style={{ color: "#ff9aaa", fontSize: 11, marginTop: 2 }}>
                  {criticalLeft} critical task{criticalLeft > 1 ? "s" : ""} remaining
                </p>
              ) : (
                <p style={{ color: "rgba(0,200,170,0.9)", fontSize: 11, marginTop: 2 }}>
                  Critical tasks done ✓
                </p>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "white", fontSize: 28, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1 }}>
                {progress}<span style={{ fontSize: 14, fontWeight: 600, opacity: 0.7 }}>%</span>
              </p>
            </div>
          </div>

          {/* Track */}
          <div style={{ height: 6, background: "rgba(255,255,255,0.12)", borderRadius: 99, overflow: "hidden" }}>
            <div
              className="progress-bar"
              style={{
                height: "100%", borderRadius: 99,
                width: `${progress}%`,
                background: progress === 100
                  ? "var(--pg-teal)"
                  : "linear-gradient(90deg, #00c4b4, #00e5d2)",
                boxShadow: "0 0 12px rgba(0,196,180,0.6)",
              }}
            />
          </div>

          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 11, marginTop: 8 }}>
            {completedCount} / {TASKS.length} tasks complete
            {progress === 100 && "  🎉"}
          </p>
        </div>
      </div>

      {/* ── PRIORITY TASKS ── */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.1px" }}>
            {priorityTasks.length > 0 ? "Up Next" : "All done 🎉"}
          </p>
          <Link href="/tasks">
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--pg-blue)" }}>See all →</span>
          </Link>
        </div>

        {priorityTasks.length === 0 ? (
          <div style={{ background: "#E5F7F5", border: "1px solid #b2ebe5", borderRadius: 16, padding: "18px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 28, marginBottom: 6 }}>🎉</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#00856f" }}>All tasks completed!</p>
            <p style={{ fontSize: 12, color: "#555", marginTop: 3 }}>Enjoy your Erasmus at PG.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {priorityTasks.map((task) => (
              <Link key={task.slug} href="/tasks">
                <div className="card-interactive" style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                    border: `1.5px solid ${task.critical ? "#C8102E" : "#D0D5DD"}`,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>
                      {task.title}
                    </p>
                    <p style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 1 }}>{task.desc}</p>
                  </div>
                  <span className="badge" style={{
                    background: task.critical ? "#FBEAED" : "#F0F1F8",
                    color: task.critical ? "#C8102E" : "#6E7891",
                    flexShrink: 0,
                  }}>
                    {task.critical ? "Critical" : task.badge}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── QUICK ACCESS ── */}
      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12, letterSpacing: "-0.1px" }}>
          Quick Access
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {QUICK_ACCESS.map((item) => (
            <Link key={item.title} href={item.href}>
              <div
                style={{
                  background: item.bg,
                  border: `1px solid ${item.bg}`,
                  borderRadius: 18,
                  padding: "16px 16px 14px",
                  cursor: "pointer",
                  transition: "transform 0.15s",
                }}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.96)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                onTouchStart={e => (e.currentTarget.style.transform = "scale(0.96)")}
                onTouchEnd={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div style={{ fontSize: 26, marginBottom: 10, lineHeight: 1 }}>{item.icon}</div>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.1px" }}>
                  {item.title}
                </p>
                <p style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2 }}>{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── TIP ── */}
      <div style={{ padding: "16px 20px 8px" }}>
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 16, padding: "13px 16px", display: "flex", gap: 12, boxShadow: "var(--shadow-xs)" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Tip:</span>{" "}
            Get your PESEL first — you need it for bank, ZUS and most other registrations. City Hall is 20 min by tram.
          </p>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
