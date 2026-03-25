"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/shared/BottomNav";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/");
      } else {
        setUser({
          name: data.user.user_metadata?.full_name?.split(" ")[0] || "Student",
          email: data.user.email || "",
        });
      }
    });
  }, [router]);

  if (!user) return null;

  return (
    <main className="min-h-screen pb-20" style={{ background: "var(--pg-light)" }}>

      <div className="px-5 pt-8 pb-4" style={{ background: "var(--pg-navy)" }}>
        <p className="text-blue-200 text-sm">Welcome back 👋</p>
        <h1 className="text-white text-2xl font-bold mt-1">{user.name}</h1>
        <p className="text-blue-200 text-xs mt-1">Gdańsk University of Technology</p>

        <div className="mt-4 bg-white/10 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-sm font-medium">Onboarding Progress</span>
            <span className="text-white text-sm font-bold">35%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="h-2 rounded-full" style={{ width: "35%", background: "var(--pg-teal)" }}/>
          </div>
          <p className="text-blue-200 text-xs mt-2">3 of 8 tasks completed</p>
        </div>
      </div>

      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold mb-3" style={{ color: "#1a1a2e" }}>Priority Tasks</h2>
        {[
          { title: "PESEL Application", badge: "Critical", done: false },
          { title: "Open Bank Account", badge: "Critical", done: false },
          { title: "SIS Registration", badge: "Done", done: true },
          { title: "Student ID Card", badge: "Week 2", done: false },
        ].map((task) => (
          <div key={task.title}
            className="flex items-center gap-3 p-3 rounded-xl mb-2 bg-white border"
            style={{ borderColor: "#e5e7eb", opacity: task.done ? 0.5 : 1 }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: task.done ? "var(--pg-teal)" : "transparent",
                border: task.done ? "none" : "1.5px solid #ccc"
              }}>
              {task.done && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            <span className="flex-1 text-sm" style={{ color: "#1a1a2e" }}>{task.title}</span>
            <span className="text-xs px-2 py-1 rounded-full"
              style={{
                background: task.badge === "Critical" ? "#FBEAED" :
                            task.badge === "Done" ? "#E0F5F3" : "#F5F6F8",
                color: task.badge === "Critical" ? "#C8102E" :
                       task.badge === "Done" ? "#00A693" : "#888"
              }}>
              {task.badge}
            </span>
          </div>
        ))}
      </div>

      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold mb-3" style={{ color: "#1a1a2e" }}>Quick Access</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "Guides", sub: "PESEL, bank, SIS", color: "#E8EEF7", icon: "📖" },
            { title: "Timetable", sub: "Build your schedule", color: "#E0F5F3", icon: "📅" },
            { title: "Offices", sub: "Buildings & hours", color: "#EEEDFE", icon: "🏛️" },
            { title: "FAQ", sub: "Quick answers", color: "#FAEEDA", icon: "❓" },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-2xl" style={{ background: item.color }}>
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-sm font-medium" style={{ color: "#1a1a2e" }}>{item.title}</p>
              <p className="text-xs" style={{ color: "#888" }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}