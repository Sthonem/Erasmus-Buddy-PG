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
    const newSlot = {
      user_id: userId,
      course: form.course,
      code: form.code,
      room: form.room,
      day_of_week: form.day,
      start_hour: form.start,
      end_hour: form.end,
      color: COLORS[form.colorIndex],
    };
    const { data } = await supabase.from("timetable_slots").insert(newSlot).select().single();
    if (data) setSlots([...slots, data]);
    setShowModal(false);
    setForm({ course: "", code: "", room: "", day: 0, start: 8, end: 10, colorIndex: 0 });
  }

  async function removeSlot(id: number) {
    setSlots(slots.filter(s => s.id !== id));
    await supabase.from("timetable_slots").delete().eq("id", id);
  }

  function exportICS() {
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ErasmusBuddy//EN"];
    slots.forEach(slot => {
      lines.push("BEGIN:VEVENT");
      lines.push(`SUMMARY:${slot.course} (${slot.code})`);
      lines.push(`LOCATION:${slot.room}`);
      lines.push("RRULE:FREQ=WEEKLY");
      lines.push("END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "erasmusbuddy-timetable.ics";
    a.click();
  }

  const conflicts = detectConflicts(slots);

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--pg-light)" }}>
      <p style={{ color: "#888" }}>Loading...</p>
    </main>
  );

  return (
    <main className="min-h-screen pb-20" style={{ background: "var(--pg-light)" }}>

      <div className="px-5 pt-8 pb-4" style={{ background: "var(--pg-navy)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">Timetable</h1>
            <p className="text-blue-200 text-xs mt-1">{slots.length} courses added</p>
          </div>
          <button onClick={exportICS}
            className="text-xs px-3 py-2 rounded-xl font-medium"
            style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
            .ics ↓
          </button>
        </div>
        {conflicts.length > 0 && (
          <div className="mt-3 px-3 py-2 rounded-xl flex items-center gap-2"
            style={{ background: "#C8102E" }}>
            <div className="w-2 h-2 rounded-full bg-white flex-shrink-0"/>
            <p className="text-white text-xs">{conflicts.length} conflict detected — check your schedule</p>
          </div>
        )}
      </div>

      <div className="px-3 mt-4 overflow-x-auto">
        <div style={{ minWidth: 320 }}>
          <div className="grid mb-1" style={{ gridTemplateColumns: "32px repeat(5, 1fr)", gap: 2 }}>
            <div/>
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-medium py-1" style={{ color: "#888" }}>{d}</div>
            ))}
          </div>
          {HOURS.map(hour => (
            <div key={hour} className="grid mb-0.5" style={{ gridTemplateColumns: "32px repeat(5, 1fr)", gap: 2 }}>
              <div className="text-right pr-1 text-xs" style={{ color: "#bbb", paddingTop: 2 }}>{hour}:00</div>
              {DAYS.map((_, dayIdx) => {
                const slot = slots.find(s => s.day_of_week === dayIdx && s.start_hour === hour);
                const isConflict = slot && conflicts.includes(slot.id);
                const isCovered = slots.some(s => s.day_of_week === dayIdx && s.start_hour < hour && s.end_hour > hour);
                if (isCovered) return <div key={dayIdx}/>;
                if (slot) {
                  const span = slot.end_hour - slot.start_hour;
                  return (
                    <div key={dayIdx} className="rounded-lg px-1 py-1 relative"
                      style={{
                        background: isConflict ? "#FBEAED" : slot.color,
                        border: isConflict ? "1.5px solid #C8102E" : "none",
                        minHeight: span * 32,
                      }}>
                      <p style={{ fontSize: 9, fontWeight: 500, color: isConflict ? "#C8102E" : TEXT_COLORS[COLORS.indexOf(slot.color)] || "#003580" }}>
                        {slot.course}
                      </p>
                      <p style={{ fontSize: 8, color: "#888" }}>{slot.room}</p>
                      <button onClick={() => removeSlot(slot.id)}
                        className="absolute top-0.5 right-0.5"
                        style={{ color: "#ccc", fontSize: 10 }}>×</button>
                    </div>
                  );
                }
                return <div key={dayIdx} className="rounded-lg" style={{ minHeight: 32, background: "rgba(0,0,0,0.03)" }}/>;
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4">
        <button onClick={() => setShowModal(true)}
          className="w-full py-3 rounded-2xl font-semibold text-sm"
          style={{ background: "var(--pg-navy)", color: "white" }}>
          + Add Course
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-end justify-center z-50"
          style={{ background: "rgba(0,0,0,0.4)", maxWidth: 430, margin: "0 auto" }}>
          <div className="w-full rounded-t-3xl p-6" style={{ background: "white" }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: "#1a1a2e" }}>Add Course</h2>
            <input placeholder="Course name *" value={form.course}
              onChange={e => setForm({ ...form, course: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border mb-3 text-sm outline-none"
              style={{ borderColor: "#e5e7eb" }}/>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input placeholder="Code (e.g. CS101)" value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })}
                className="px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "#e5e7eb" }}/>
              <input placeholder="Room" value={form.room}
                onChange={e => setForm({ ...form, room: e.target.value })}
                className="px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "#e5e7eb" }}/>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <p className="text-xs mb-1" style={{ color: "#888" }}>Day</p>
                <select value={form.day} onChange={e => setForm({ ...form, day: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "#e5e7eb" }}>
                  {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "#888" }}>Start</p>
                <select value={form.start} onChange={e => setForm({ ...form, start: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "#e5e7eb" }}>
                  {HOURS.map(h => <option key={h} value={h}>{h}:00</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "#888" }}>End</p>
                <select value={form.end} onChange={e => setForm({ ...form, end: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "#e5e7eb" }}>
                  {HOURS.filter(h => h > form.start).map(h => <option key={h} value={h}>{h}:00</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mb-5">
              {COLORS.map((c, i) => (
                <button key={c} onClick={() => setForm({ ...form, colorIndex: i })}
                  className="w-8 h-8 rounded-full border-2"
                  style={{ background: c, borderColor: form.colorIndex === i ? "#003580" : "transparent" }}/>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-2xl text-sm font-medium"
                style={{ background: "#F5F6F8", color: "#888" }}>
                Cancel
              </button>
              <button onClick={addSlot}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold"
                style={{ background: "var(--pg-navy)", color: "white" }}>
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