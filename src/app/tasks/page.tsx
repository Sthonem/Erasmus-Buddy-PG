"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TASKS, type Task } from "@/lib/tasks-data";
import BottomNav from "@/components/shared/BottomNav";
import { useRouter } from "next/navigation";

export default function Tasks() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { router.push("/"); return; }
      setUserId(data.user.id);
      const { data: tasks } = await supabase
        .from("user_tasks").select("task_slug")
        .eq("user_id", data.user.id).eq("completed", true);
      if (tasks) setCompleted(tasks.map((t: { task_slug: string }) => t.task_slug));
      setLoading(false);
    }
    load();
  }, [router]);

  async function toggleTask(slug: string) {
    if (!userId) return;
    const isDone = completed.includes(slug);
    if (isDone) {
      const prev = completed;
      setCompleted(c => c.filter(s => s !== slug));
      const { error } = await supabase.from("user_tasks").delete()
        .eq("user_id", userId).eq("task_slug", slug);
      if (error) { console.error("Toggle OFF error:", error); setCompleted(prev); }
    } else {
      const prev = completed;
      setCompleted(c => [...c, slug]);
      const { error } = await supabase.from("user_tasks").upsert(
        { user_id: userId, task_slug: slug, completed: true, completed_at: new Date().toISOString() },
        { onConflict: "user_id,task_slug" }
      );
      if (error) { console.error("Toggle ON error:", error); setCompleted(prev); }
    }
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--pg-light)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", border: "2.5px solid var(--pg-blue)", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "var(--text-tertiary)", fontSize: 13 }}>Loading tasks…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );

  const critical = TASKS.filter(t => t.critical && !completed.includes(t.slug));
  const upcoming = TASKS.filter(t => !t.critical && !completed.includes(t.slug));
  const done     = TASKS.filter(t => completed.includes(t.slug));
  const progress = Math.round((done.length / TASKS.length) * 100);
  const criticalDone = TASKS.filter(t => t.critical).every(t => completed.includes(t.slug));
  const criticalCount = TASKS.filter(t => t.critical).length;
  const criticalCompleted = TASKS.filter(t => t.critical && completed.includes(t.slug)).length;
  const academicCount = TASKS.filter(t => !t.critical).length;
  const academicCompleted = TASKS.filter(t => !t.critical && completed.includes(t.slug)).length;

  // Journey stage for tasks
  const stage = progress === 100 ? { emoji: "🌍", label: "All sorted!", msg: "You're basically a local now 😎" }
    : criticalDone ? { emoji: "📚", label: "Academic setup", msg: "Bureaucracy done! Now set up your studies." }
    : done.length > 0 ? { emoji: "📋", label: "Getting started", msg: "Nice progress — keep going! 💪" }
    : { emoji: "🛬", label: "Just landed", msg: "Let's get you settled in Gdańsk!" };

  return (
    <main className="min-h-screen" style={{ background: "var(--pg-light)", paddingBottom: 90 }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(165deg, #001a4d 0%, #002e75 40%, #003580 100%)",
        padding: "52px 20px 24px", position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,93,170,0.4), transparent 70%)", pointerEvents: "none" }} />

        <h1 style={{ color: "white", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>My Tasks</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 3 }}>Your first 2 weeks — one step at a time 💪</p>

        {/* Journey Progress Card */}
        <div style={{ marginTop: 16, background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: "14px 16px" }}>
          {/* Stage + percentage */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div>
              <p style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{stage.emoji} {stage.label}</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>{stage.msg}</p>
            </div>
            <p style={{ color: "white", fontSize: 24, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1 }}>
              {progress}<span style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>%</span>
            </p>
          </div>

          {/* Two-section milestone bar */}
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            {/* Critical section */}
            <div style={{ flex: criticalCount, height: 5, background: "rgba(255,255,255,0.12)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 99,
                width: `${criticalCount > 0 ? (criticalCompleted / criticalCount) * 100 : 0}%`,
                background: criticalDone ? "var(--pg-teal)" : "linear-gradient(90deg, #F59E0B, #FBBF24)",
                boxShadow: criticalCompleted > 0 ? "0 0 8px rgba(245,158,11,0.5)" : "none",
                transition: "width 0.5s ease",
              }} />
            </div>
            {/* Academic section */}
            <div style={{ flex: academicCount, height: 5, background: "rgba(255,255,255,0.12)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 99,
                width: `${academicCount > 0 ? (academicCompleted / academicCount) * 100 : 0}%`,
                background: "linear-gradient(90deg, #00c4b4, #00e5d2)",
                boxShadow: academicCompleted > 0 ? "0 0 8px rgba(0,196,180,0.5)" : "none",
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>

          {/* Section labels */}
          <div style={{ display: "flex", gap: 4 }}>
            <p style={{ flex: criticalCount, fontSize: 9.5, color: criticalDone ? "rgba(0,228,210,0.7)" : "rgba(251,191,36,0.7)", fontWeight: 600 }}>
              ⚡ {criticalCompleted}/{criticalCount} essentials
            </p>
            <p style={{ flex: academicCount, fontSize: 9.5, color: academicCompleted > 0 ? "rgba(0,228,210,0.7)" : "rgba(255,255,255,0.3)", fontWeight: 600 }}>
              📚 {academicCompleted}/{academicCount} academic
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {critical.length > 0 && (
          <Section label="⚡ First week essentials" labelColor="#D97706" dot="#D97706">
            {critical.map(t => <TaskCard key={t.slug} task={t} done={false} onToggle={toggleTask} />)}
          </Section>
        )}
        {upcoming.length > 0 && (
          <Section label="📚 Academic setup" labelColor="var(--text-tertiary)" dot="#D0D5DD">
            {upcoming.map(t => <TaskCard key={t.slug} task={t} done={false} onToggle={toggleTask} />)}
          </Section>
        )}
        {done.length > 0 && (
          <Section label="✅ Done — nice work!" labelColor="#00856f" dot="#00A693">
            {done.map(t => <TaskCard key={t.slug} task={t} done={true} onToggle={toggleTask} />)}
          </Section>
        )}
        {critical.length === 0 && upcoming.length === 0 && (
          <div style={{ marginTop: 24, background: "#E5F7F5", border: "1px solid #b2ebe5", borderRadius: 18, padding: "24px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 36, marginBottom: 8 }}>🎉</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#00856f" }}>You&apos;re all sorted!</p>
            <p style={{ fontSize: 12.5, color: "#555", marginTop: 4 }}>Time to explore Gdańsk and enjoy your Erasmus 🌍</p>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}

function Section({ label, labelColor, dot, children }: { label: string; labelColor: string; dot: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: dot, flexShrink: 0 }} />
        <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase", color: labelColor }}>{label}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

function TaskCard({ task, done, onToggle }: { task: Task; done: boolean; onToggle: (s: string) => void }) {
  return (
    <div
      onClick={() => onToggle(task.slug)}
      className="card-interactive"
      style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, opacity: done ? 0.55 : 1 }}
    >
      {/* Checkbox */}
      <div style={{
        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: done ? "var(--pg-teal)" : "transparent",
        border: done ? "none" : `1.5px solid ${task.critical ? "#D97706" : "#D0D5DD"}`,
        boxShadow: done ? "0 2px 8px rgba(0,166,147,0.35)" : "none",
      }}>
        {done && (
          <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>
          {task.title}
        </p>
        <p style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2 }}>{task.desc}</p>
      </div>

      {/* Badge */}
      <span className="badge" style={{
        background: done ? "#E5F7F5" : task.critical ? "#FEF3C7" : "#F3F4F8",
        color: done ? "#00856f" : task.critical ? "#D97706" : "var(--text-tertiary)",
        flexShrink: 0,
      }}>
        {done ? "Done" : task.badge}
      </span>
    </div>
  );
}
