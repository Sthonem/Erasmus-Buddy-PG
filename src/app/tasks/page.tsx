"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/shared/BottomNav";
import { useRouter } from "next/navigation";

const TASKS = [
  { slug: "pesel", title: "PESEL Application", desc: "Legal ID number", badge: "Day 1-3", critical: true },
  { slug: "bank", title: "Open Bank Account", desc: "PKO BP or Santander", badge: "Day 3-7", critical: true },
  { slug: "zus", title: "ZUS Registration", desc: "Health insurance", badge: "Day 1-7", critical: true },
  { slug: "sis-courses", title: "SIS Course Selection", desc: "Choose your courses", badge: "Week 2", critical: false },
  { slug: "student-id", title: "Student ID Card", desc: "Collect from dean's office", badge: "Week 2", critical: false },
  { slug: "email", title: "Email Setup", desc: "PG student email", badge: "Week 1", critical: false },
  { slug: "accommodation", title: "Accommodation Check-in", desc: "Dorm registration", badge: "Day 1", critical: false },
  { slug: "sis-login", title: "SIS First Login", desc: "Activate your account", badge: "Day 1", critical: false },
];

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
        .from("user_tasks")
        .select("task_slug")
        .eq("user_id", data.user.id)
        .eq("completed", true);

      if (tasks) setCompleted(tasks.map(t => t.task_slug));
      setLoading(false);
    }
    load();
  }, [router]);

  async function toggleTask(slug: string) {
  if (!userId) return;
  const isDone = completed.includes(slug);

  if (isDone) {
    setCompleted(completed.filter(s => s !== slug));
    await supabase.from("user_tasks")
      .delete()
      .eq("user_id", userId)
      .eq("task_slug", slug);
  } else {
    setCompleted([...completed, slug]);
    const { error } = await supabase.from("user_tasks")
      .insert({
        user_id: userId,
        task_slug: slug,
        completed: true,
        completed_at: new Date().toISOString()
      });
    if (error) {
      await supabase.from("user_tasks")
        .update({ completed: true, completed_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("task_slug", slug);
    }
  }
}

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--pg-light)" }}>
      <p style={{ color: "#888" }}>Loading...</p>
    </main>
  );

  const critical = TASKS.filter(t => t.critical && !completed.includes(t.slug));
  const upcoming = TASKS.filter(t => !t.critical && !completed.includes(t.slug));
  const done = TASKS.filter(t => completed.includes(t.slug));
  const progress = Math.round((done.length / TASKS.length) * 100);

  return (
    <main className="min-h-screen pb-20" style={{ background: "var(--pg-light)" }}>

      <div className="px-5 pt-8 pb-5" style={{ background: "var(--pg-navy)" }}>
        <h1 className="text-white text-2xl font-bold">My Tasks</h1>
        <p className="text-blue-200 text-xs mt-1">First 2 weeks checklist</p>
        <div className="mt-4 bg-white/10 rounded-2xl p-3">
          <div className="flex justify-between mb-2">
            <span className="text-white text-xs">{done.length} of {TASKS.length} completed</span>
            <span className="text-white text-xs font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5">
            <div className="h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%`, background: "var(--pg-teal)" }}/>
          </div>
        </div>
      </div>

      {critical.length > 0 && (
        <div className="px-5 mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#C8102E" }}>
            Critical — Do immediately
          </h2>
          {critical.map(task => (
            <TaskCard key={task.slug} task={task} done={false} onToggle={toggleTask} />
          ))}
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="px-5 mt-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#888" }}>
            Academic
          </h2>
          {upcoming.map(task => (
            <TaskCard key={task.slug} task={task} done={false} onToggle={toggleTask} />
          ))}
        </div>
      )}

      {done.length > 0 && (
        <div className="px-5 mt-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#00A693" }}>
            Completed
          </h2>
          {done.map(task => (
            <TaskCard key={task.slug} task={task} done={true} onToggle={toggleTask} />
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}

function TaskCard({ task, done, onToggle }: {
  task: typeof TASKS[0];
  done: boolean;
  onToggle: (slug: string) => void;
}) {
  return (
    <div
      onClick={() => onToggle(task.slug)}
      className="flex items-center gap-3 p-3 rounded-xl mb-2 bg-white border cursor-pointer active:scale-95 transition-transform"
      style={{ borderColor: "#e5e7eb", opacity: done ? 0.5 : 1 }}>

      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: done ? "var(--pg-teal)" : "transparent",
          border: done ? "none" : `1.5px solid ${task.critical ? "#C8102E" : "#ccc"}`
        }}>
        {done && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium" style={{ color: "#1a1a2e" }}>{task.title}</p>
        <p className="text-xs" style={{ color: "#888" }}>{task.desc}</p>
      </div>

      <span className="text-xs px-2 py-1 rounded-full flex-shrink-0"
        style={{
          background: done ? "#E0F5F3" : task.critical ? "#FBEAED" : "#F5F6F8",
          color: done ? "#00A693" : task.critical ? "#C8102E" : "#888"
        }}>
        {done ? "Done" : task.badge}
      </span>
    </div>
  );
}