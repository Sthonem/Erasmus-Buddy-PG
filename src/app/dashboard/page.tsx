"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/shared/BottomNav";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TOTAL_TASKS = 8;

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
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

      if (tasks) setCompletedCount(tasks.length);
    }
    load();
  }, [router]);

  if (!user) return null;

  const progress = Math.round((completedCount / TOTAL_TASKS) * 100);

  return (
    <main className="min-h-screen pb-20" style={{ background: "var(--pg-light)" }}>

      <div className="px-5 pt-8 pb-4" style={{ background: "var(--pg-navy)" }}>
        <p className="text-blue-200 text-sm">Welcome back 👋</p>
        <h1 className="text-white text-2xl font-bold mt-1">{user.name}</h1>
        <p className="text-blue-200 text-xs mt-1">Gdańsk University of Technology</p>

        <div className="mt-4 bg-white/10 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-sm font-medium">Onboarding Progress</span>
            <span className="text-white text-sm font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="h-2 rounded-full transition-all"
              style={{ width: `${progress}%`, background: "var(--pg-teal)" }}/>
          </div>
          <p className="text-blue-200 text-xs mt-2">{completedCount} of {TOTAL_TASKS} tasks completed</p>
        </div>
      </div>

      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold mb-3" style={{ color: "#1a1a2e" }}>Priority Tasks</h2>
        <Link href="/tasks">
          <div className="flex items-center gap-3 p-3 rounded-xl mb-2 bg-white border"
            style={{ borderColor: "#e5e7eb" }}>
            <div className="w-5 h-5 rounded-full flex-shrink-0"
              style={{ border: "1.5px solid #C8102E" }}/>
            <span className="flex-1 text-sm" style={{ color: "#1a1a2e" }}>PESEL Application</span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#FBEAED", color: "#C8102E" }}>Critical</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl mb-2 bg-white border"
            style={{ borderColor: "#e5e7eb" }}>
            <div className="w-5 h-5 rounded-full flex-shrink-0"
              style={{ border: "1.5px solid #C8102E" }}/>
            <span className="flex-1 text-sm" style={{ color: "#1a1a2e" }}>Open Bank Account</span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#FBEAED", color: "#C8102E" }}>Critical</span>
          </div>
        </Link>
        <Link href="/tasks">
          <p className="text-xs text-center mt-2" style={{ color: "#005DAA" }}>
            See all tasks →
          </p>
        </Link>
      </div>

      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold mb-3" style={{ color: "#1a1a2e" }}>Quick Access</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "Guides", sub: "PESEL, bank, SIS", color: "#E8EEF7", icon: "📖", href: "/guides" },
            { title: "Timetable", sub: "Build your schedule", color: "#E0F5F3", icon: "📅", href: "/timetable" },
            { title: "Offices", sub: "Buildings & hours", color: "#EEEDFE", icon: "🏛️", href: "/offices" },
            { title: "FAQ", sub: "Quick answers", color: "#FAEEDA", icon: "❓", href: "/guides" },
          ].map((item) => (
            <Link key={item.title} href={item.href}>
              <div className="p-4 rounded-2xl" style={{ background: item.color }}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-sm font-medium" style={{ color: "#1a1a2e" }}>{item.title}</p>
                <p className="text-xs" style={{ color: "#888" }}>{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}