"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/shared/BottomNav";
import { useRouter } from "next/navigation";

type Slot = {
  id: number;
  course: string;
  code: string;
  room: string;
  day_of_week: number;
  start_hour: number;
  end_hour: number;
  color: string;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16];
const COLORS = ["#E8EEF7", "#E0F5F3", "#EEEDFE", "#FAEEDA", "#FAECE7"];
const TEXT_COLORS = ["#003580", "#00A693", "#534AB7", "#854F0B", "#993C1D"];

function detectConflicts(slots: Slot[]): number[] {
  const ids: number[] = [];
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i], b = slots[j];
      if (a.day_of_week === b.day_of_week && a.start_hour < b.end_hour && b.start_hour < a.end_hour) {
        ids.push(a.id, b.id);
      }
    }
  }
  return [...new Set(ids)];
}

function toICSDate(dayOfWeek: number, hour: number): string {
  // Find the next occurrence of this weekday from a fixed reference Monday (2025-09-29)
  const refMonday = new Date(2025, 8, 29); // Sep 29 2025 = Monday
  const date = new Date(refMonday);
  date.setDate(refMonday.getDate() + dayOfWeek);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(hour).padStart(2, "0");
  return `${y}${m}${d}T${h}0000`;
}

export default function Timetable() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    course: "", code: "", room: "",
    day: 0, start: 8, end: 10, colorIndex: 0,
  });
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { router.push("/"); return; }
      setUserId(data.user.id);

      const { data: dbSlots } = await supabase
        .from("timetable_slots")
        .select("*")
        .eq("user_id", data.user.id);

      if (dbSlots) setSlots(dbSlots);
      setLoading(false);
    }
    load();
  }, [router]);

  async function addSlot() {
    if (!form.course.trim() || !userId) return;
    if (form.end <= form.start) return;

    const newSlot = {
      user_id: userId,
      course: form.course.trim(),
      code: form.code.trim(),
      room: form.room.trim(),
      day_of_week: form.day,
      start_hour: form.start,
      end_hour: form.end,
      color: COLORS[form.colorIndex],
    };

    const { data, error } = await supabase.from("timetable_slots").insert(newSlot).select().single();
    if (!error && data) {
      setSlots(prev => [...prev, data]);
      setShowModal(false);
      setForm({ course: "", code: "", room: "", day: 0, start: 8, end: 10, colorIndex: 0 });
    }
  }

  async function removeSlot(id: number) {
    const { error } = await supabase.from("timetable_slots").delete().eq("id", id);
    if (!error) setSlots(prev => prev.filter(s => s.id !== id));
  }

  function exportICS() {
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}Z`;

    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ErasmusBuddy//EN", "CALSCALE:GREGORIAN"];
    slots.forEach((slot, i) => {
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:erasmusbuddy-${slot.id}-${i}@erasmus-buddy-pg.vercel.app`);
      lines.push(`DTSTAMP:${stamp}`);
      lines.push(`DTSTART:${toICSDate(slot.day_of_week, slot.start_hour)}`);
      lines.push(`DTEND:${toICSDate(slot.day_of_week, slot.end_hour)}`);
      lines.push(`SUMMARY:${slot.course}${slot.code ? ` (${slot.code})` : ""}`);
      if (slot.room) lines.push(`LOCATION:${slot.room}`);
      lines.push("RRULE:FREQ=WEEKLY;COUNT=16");
      lines.push("END:VEVENT");
    });
    lines.push("END:VCALENDAR");

    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "erasmusbuddy-timetable.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  const conflicts = detectConflicts(slots);

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--pg-light)" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: "var(--pg-blue)", borderTopColor: "transparent" }} />
        <p className="text-sm" style={{ color: "#888" }}>Loading timetable...</p>
      </div>
    </main>
  );

  const endOptions = HOURS.filter(h => h > form.start);

  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--pg-light)" }}>

      <div className="px-5 pt-10 pb-4" style={{ background: "var(--pg-navy)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">Timetable</h1>
            <p className="text-blue-200 text-xs mt-1">{slots.length} course{slots.length !== 1 ? "s" : ""} added</p>
          </div>
          <button onClick={exportICS}
            className="text-xs px-3 py-2 rounded-xl font-medium flex items-center gap-1.5"
            style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v7M5 7l3 3 3-3M3 13h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            .ics
          </button>
        </div>
        {conflicts.length > 0 && (
          <div className="mt-3 px-3 py-2 rounded-xl flex items-center gap-2"
            style={{ background: "#C8102E" }}>
            <div className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
            <p className="text-white text-xs">{conflicts.length} conflict{conflicts.length !== 1 ? "s" : ""} detected — check your schedule</p>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="px-3 mt-4 overflow-x-auto">
        <div style={{ minWidth: 300 }}>
          <div className="grid mb-1" style={{ gridTemplateColumns: "34px repeat(5, 1fr)", gap: 2 }}>
            <div />
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-medium py-1" style={{ color: "#888" }}>{d}</div>
            ))}
          </div>
          {HOURS.map(hour => (
            <div key={hour} className="grid mb-0.5" style={{ gridTemplateColumns: "34px repeat(5, 1fr)", gap: 2 }}>
              <div className="text-right pr-1.5 text-xs" style={{ color: "#bbb", paddingTop: 2, fontSize: 9 }}>{hour}:00</div>
              {DAYS.map((_, dayIdx) => {
                const slot = slots.find(s => s.day_of_week === dayIdx && s.start_hour === hour);
                const isConflict = slot && conflicts.includes(slot.id);
                const isCovered = slots.some(s => s.day_of_week === dayIdx && s.start_hour < hour && s.end_hour > hour);
                if (isCovered) return <div key={dayIdx} />;
                if (slot) {
                  const span = slot.end_hour - slot.start_hour;
                  const colorIdx = COLORS.indexOf(slot.color);
                  return (
                    <div key={dayIdx} className="rounded-lg px-1.5 py-1 relative"
                      style={{
                        background: isConflict ? "#FBEAED" : slot.color,
                        border: isConflict ? "1.5px solid #C8102E" : "none",
                        minHeight: span * 34,
                      }}>
                      <p style={{ fontSize: 9, fontWeight: 600, color: isConflict ? "#C8102E" : TEXT_COLORS[colorIdx] ?? "#003580", lineHeight: 1.3 }}>
                        {slot.course}
                      </p>
                      {slot.room && <p style={{ fontSize: 8, color: "#999", marginTop: 1 }}>{slot.room}</p>}
                      <button onClick={() => removeSlot(slot.id)}
                        className="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center rounded-full"
                        style={{ color: "#aaa", fontSize: 12, lineHeight: 1 }}>×</button>
                    </div>
                  );
                }
                return <div key={dayIdx} className="rounded-lg" style={{ minHeight: 34, background: "rgba(0,0,0,0.03)" }} />;
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Add Button */}
      <div className="px-5 mt-5">
        <button onClick={() => setShowModal(true)}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
          style={{ background: "var(--pg-navy)", color: "white" }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Course
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-end justify-center z-50"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="w-full rounded-t-3xl p-6 pb-8" style={{ background: "white", maxWidth: 430 }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: "#1a1a2e" }}>Add Course</h2>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "#F5F6F8", color: "#888", fontSize: 18 }}>×</button>
            </div>

            <input placeholder="Course name *" value={form.course}
              onChange={e => setForm({ ...form, course: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border mb-3 text-sm outline-none focus:border-blue-400"
              style={{ borderColor: "#e5e7eb" }} />

            <div className="grid grid-cols-2 gap-3 mb-3">
              <input placeholder="Code (e.g. CS101)" value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })}
                className="px-4 py-3 rounded-xl border text-sm outline-none focus:border-blue-400"
                style={{ borderColor: "#e5e7eb" }} />
              <input placeholder="Room" value={form.room}
                onChange={e => setForm({ ...form, room: e.target.value })}
                className="px-4 py-3 rounded-xl border text-sm outline-none focus:border-blue-400"
                style={{ borderColor: "#e5e7eb" }} />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <p className="text-xs mb-1.5 font-medium" style={{ color: "#888" }}>Day</p>
                <select value={form.day} onChange={e => setForm({ ...form, day: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "#e5e7eb" }}>
                  {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs mb-1.5 font-medium" style={{ color: "#888" }}>Start</p>
                <select value={form.start}
                  onChange={e => {
                    const s = Number(e.target.value);
                    setForm({ ...form, start: s, end: s + 1 > 16 ? 16 : s + 2 });
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "#e5e7eb" }}>
                  {HOURS.filter(h => h < 16).map(h => <option key={h} value={h}>{h}:00</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs mb-1.5 font-medium" style={{ color: "#888" }}>End</p>
                <select value={form.end} onChange={e => setForm({ ...form, end: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "#e5e7eb" }}>
                  {endOptions.map(h => <option key={h} value={h}>{h}:00</option>)}
                </select>
              </div>
            </div>

            <p className="text-xs mb-2 font-medium" style={{ color: "#888" }}>Color</p>
            <div className="flex gap-2 mb-6">
              {COLORS.map((c, i) => (
                <button key={c} onClick={() => setForm({ ...form, colorIndex: i })}
                  className="w-9 h-9 rounded-full border-2 transition-transform active:scale-90"
                  style={{ background: c, borderColor: form.colorIndex === i ? "#003580" : "transparent" }} />
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-3.5 rounded-2xl text-sm font-medium"
                style={{ background: "#F5F6F8", color: "#888" }}>
                Cancel
              </button>
              <button onClick={addSlot}
                disabled={!form.course.trim()}
                className="flex-1 py-3.5 rounded-2xl text-sm font-semibold transition-opacity"
                style={{
                  background: "var(--pg-navy)",
                  color: "white",
                  opacity: form.course.trim() ? 1 : 0.4,
                }}>
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
