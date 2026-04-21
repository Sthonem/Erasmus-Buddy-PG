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
        .from("user_tasks")
        .select("task_slug")
        .eq("user_id", data.user.id)
        .eq("completed", true);

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
      setCompleted(completed.filter(s => s !== slug));
      const { error } = await supabase.from("user_tasks")
        .delete()
        .eq("user_id", userId)
        .eq("task_slug", slug);
      if (error) setCompleted(prev);
    } else {
      const prev = completed;
      setCompleted([...completed, slug]);
      const { error } = await supabase.from("user_tasks")
        .upsert({
          user_id: userId,
          task_slug: slug,
          completed: true,
          completed_at: new Date().toISOString(),
        }, { onConflict: "user_id,task_slug" });
      if (error) setCompleted(prev);
    }
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--pg-light)" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: "var(--pg-blue)", borderTopColor: "transparent" }} />
        <p className="text-sm" style={{ color: "#888" }}>Loading tasks...</p>
      </div>
    </main>
  );

  const critical = TASKS.filter(t => t.critical && !completed.includes(t.slug));
  const upcoming = TASKS.filter(t => !t.critical && !completed.includes(t.slug));
  const done = TASKS.filter(t => completed.includes(t.slug));
  const progress = Math.round((done.length / TASKS.length) * 100);

  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--pg-light)" }}>

      <div className="px-5 pt-10 pb-5" style={{ background: "var(--pg-navy)" }}>
        <h1 className="text-white text-2xl font-bold">My Tasks</h1>
        <p className="text-blue-200 text-xs mt-1">First 2 weeks checklist</p>
        <div className="mt-4 rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div className="flex justify-between mb-2">
            <span className="text-white text-xs">{done.length} of {TASKS.length} completed</span>
            <span className="text-white text-xs font-bold">{progress}%</span>
          </div>
          <div className="w-full rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.2)" }}>
            <div className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "var(--pg-teal)" }} />
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
        <div className="px-5 mt-4 mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#00A693" }}>
            Completed
          </h2>
          {done.map(task => (
            <TaskCard key={task.slug} task={task} done={true} onToggle={toggleTask} />
          ))}
        </div>
      )}

      {critical.length === 0 && upcoming.length === 0 && done.length > 0 && (
        <div className="px-5 mt-4">
          <div className="p-5 rounded-2xl text-center" style={{ background: "#E0F5F3" }}>
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-sm font-semibold" style={{ color: "#00A693" }}>All tasks completed!</p>
            <p className="text-xs mt-1" style={{ color: "#555" }}>You're all set — enjoy your Erasmus!</p>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}

function TaskCard({ task, done, onToggle }: {
  task: Task;
  done: boolean;
  onToggle: (slug: string) => void;
}) {
  return (
    <div
      onClick={() => onToggle(task.slug)}
      className="flex items-center gap-3 p-3.5 rounded-xl mb-2 bg-white border cursor-pointer active:scale-[0.98] transition-transform"
      style={{ borderColor: "#e5e7eb", opacity: done ? 0.55 : 1 }}>

      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: done ? "var(--pg-teal)" : "transparent",
          border: done ? "none" : `1.5px solid ${task.critical ? "#C8102E" : "#ccc"}`
        }}>
        {done && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "#1a1a2e" }}>{task.title}</p>
        <p className="text-xs mt-0.5" style={{ color: "#888" }}>{task.desc}</p>
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
