"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TASKS } from "@/lib/tasks-data";
import BottomNav from "@/components/shared/BottomNav";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { router.push("/"); return; }

      setUser({
        name: data.user.user_metadata?.full_name?.split(" ")[0] || "Student",
        email: data.user.email || "",
      });

      const { data: tasks } = await supabase
        .from("user_tasks")
        .select("task_slug")
        .eq("user_id", data.user.id)
        .eq("completed", true);

      setCompletedSlugs(tasks ? tasks.map((t: { task_slug: string }) => t.task_slug) : []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--pg-light)" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--pg-blue)", borderTopColor: "transparent" }} />
        <p className="text-sm" style={{ color: "#888" }}>Loading...</p>
      </div>
    </main>
  );

  const completedCount = TASKS.filter(t => completedSlugs.includes(t.slug)).length;
  const progress = Math.round((completedCount / TASKS.length) * 100);
  const priorityTasks = TASKS.filter(t => !completedSlugs.includes(t.slug)).slice(0, 3);

  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--pg-light)" }}>

      {/* Header */}
      <div className="px-5 pt-10 pb-5" style={{ background: "var(--pg-navy)" }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-sm">Welcome back 👋</p>
            <h1 className="text-white text-2xl font-bold mt-0.5">{user?.name}</h1>
            <p className="text-blue-200 text-xs mt-0.5">Gdańsk University of Technology</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-1 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.12)" }}
            title="Sign out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="mt-4 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-sm font-medium">Onboarding Progress</span>
            <span className="text-white text-sm font-bold">{progress}%</span>
          </div>
          <div className="w-full rounded-full h-2" style={{ background: "rgba(255,255,255,0.2)" }}>
            <div className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "var(--pg-teal)" }} />
          </div>
          <p className="text-blue-200 text-xs mt-2">
            {completedCount} of {TASKS.length} tasks completed
            {progress === 100 && " 🎉"}
          </p>
        </div>
      </div>

      {/* Priority Tasks */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>Priority Tasks</h2>
          <Link href="/tasks">
            <span className="text-xs font-medium" style={{ color: "var(--pg-blue)" }}>See all →</span>
          </Link>
        </div>

        {priorityTasks.length === 0 ? (
          <div className="p-4 rounded-2xl text-center" style={{ background: "#E0F5F3" }}>
            <p className="text-2xl mb-1">🎉</p>
            <p className="text-sm font-medium" style={{ color: "#00A693" }}>All tasks completed!</p>
            <p className="text-xs mt-0.5" style={{ color: "#555" }}>Great work settling in.</p>
          </div>
        ) : (
          priorityTasks.map(task => (
            <Link key={task.slug} href="/tasks">
              <div className="flex items-center gap-3 p-3.5 rounded-xl mb-2 bg-white border active:scale-[0.98] transition-transform"
                style={{ borderColor: "#e5e7eb" }}>
                <div className="w-5 h-5 rounded-full flex-shrink-0"
                  style={{ border: `1.5px solid ${task.critical ? "#C8102E" : "#ccc"}` }} />
                <span className="flex-1 text-sm font-medium" style={{ color: "#1a1a2e" }}>{task.title}</span>
                <span className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                  style={{
                    background: task.critical ? "#FBEAED" : "#F0F0F8",
                    color: task.critical ? "#C8102E" : "#888"
                  }}>
                  {task.critical ? "Critical" : task.badge}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Quick Access */}
      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold mb-3" style={{ color: "#1a1a2e" }}>Quick Access</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "Guides",    sub: "PESEL, bank, OLA",     color: "#E8EEF7", icon: "📖", href: "/guides"    },
            { title: "Timetable", sub: "Build your schedule",  color: "#E0F5F3", icon: "📅", href: "/timetable" },
            { title: "Offices",   sub: "Buildings & hours",    color: "#EEEDFE", icon: "🏛️", href: "/offices"   },
            { title: "Places",    sub: "Shops, transport",     color: "#FAEEDA", icon: "📍", href: "/places"    },
          ].map((item) => (
            <Link key={item.title} href={item.href}>
              <div className="p-4 rounded-2xl active:scale-[0.97] transition-transform" style={{ background: item.color }}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>{item.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "#888" }}>{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
