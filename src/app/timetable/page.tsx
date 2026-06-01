"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/shared/BottomNav";
import GuestBanner from "@/components/shared/GuestBanner";
import { useRouter } from "next/navigation";
import { useI18n, type TranslationKey } from "@/lib/i18n";

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

const DAY_KEYS: TranslationKey[] = ["day.mon", "day.tue", "day.wed", "day.thu", "day.fri"];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16];
const COLORS = ["#E8EEF7", "#E0F5F3", "#EEEDFE", "#FAEEDA", "#FDE68A"];
const TEXT_COLORS = ["#003580", "#00A693", "#534AB7", "#854F0B", "#78350F"];

// Sample timetable shown in guest preview mode so the page isn't empty
const SAMPLE_SLOTS: Slot[] = [
  { id: -1, course: "Cartography",        code: "GIS 110", room: "Room 204", day_of_week: 0, start_hour: 8,  end_hour: 10, color: "#FDE68A" },
  { id: -2, course: "GIS Fundamentals",   code: "GIS 101", room: "Room 312", day_of_week: 1, start_hour: 10, end_hour: 12, color: "#E0F5F3" },
  { id: -3, course: "Spatial Databases",  code: "GIS 205", room: "Room 108", day_of_week: 2, start_hour: 12, end_hour: 14, color: "#E0F5F3" },
  { id: -4, course: "Remote Sensing",     code: "GIS 301", room: "Room 208", day_of_week: 3, start_hour: 9,  end_hour: 11, color: "#EEEDFE" },
];

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
  const [isGuest, setIsGuest] = useState(false);
  const [guestToast, setGuestToast] = useState(false);
  const [form, setForm] = useState({
    course: "", code: "", room: "",
    day: 0, start: 8, end: 10, colorIndex: 0,
  });
  const router = useRouter();
  const { t } = useI18n();
  const DAYS = DAY_KEYS.map(k => t(k));

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        const guestMode = typeof window !== "undefined" && localStorage.getItem("guest_mode") === "true";
        if (!guestMode) { router.push("/"); return; }
        setIsGuest(true);
        setSlots(SAMPLE_SLOTS);
        setLoading(false);
        return;
      }
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
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{t("timetable.loading")}</p>
      </div>
    </main>
  );

  const endOptions = HOURS.filter(h => h > form.start);

  return (
    <main className="min-h-screen" style={{ background: "var(--pg-light)", paddingBottom: 90 }}>

      <div style={{ background: "linear-gradient(165deg, var(--header-from) 0%, var(--header-mid) 40%, var(--header-to) 100%)", padding: "52px 20px 16px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,93,170,0.4), transparent 70%)", pointerEvents: "none" }} />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">{t("timetable.title")}</h1>
            <p className="text-blue-200 text-xs mt-1">{slots.length} {slots.length !== 1 ? t("timetable.coursesPlural") : t("timetable.courses")} {t("timetable.added")}</p>
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
            style={{ background: "#D97706" }}>
            <div className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
            <p className="text-white text-xs">{conflicts.length} {conflicts.length !== 1 ? t("timetable.conflictsPlural") : t("timetable.conflicts")} {t("timetable.conflictMsg")}</p>
          </div>
        )}
      </div>

      {/* ── Calendar canvas ── */}
      <div style={{ padding: "16px 18px 0" }}>
        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "38px repeat(5, 1fr)", marginBottom: 8 }}>
          <div />
          {DAYS.map(d => (
            <div key={d} style={{
              textAlign: "center", fontSize: 10, fontWeight: 700,
              letterSpacing: ".6px", color: "var(--text-tertiary)", textTransform: "uppercase" as const,
              padding: "8px 0",
            }}>{d}</div>
          ))}
        </div>

        {/* Continuous canvas */}
        <div style={{
          position: "relative",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
        }}>
          {/* Background grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "38px repeat(5, 1fr)",
            gridTemplateRows: `repeat(${HOURS.length}, 56px)`,
          }}>
            {HOURS.map((hour, i) => (
              <div key={`row-${hour}`} style={{ display: "contents" }}>
                <div style={{
                  display: "flex", justifyContent: "flex-end",
                  padding: "4px 6px 0 0",
                  fontSize: 9.5, color: "var(--text-tertiary)", fontWeight: 500,
                  borderBottom: i < HOURS.length - 1 ? "1px solid var(--border-light)" : "none",
                }}>
                  {hour}:00
                </div>
                {DAYS.map((_, dayIdx) => (
                  <div key={`cell-${hour}-${dayIdx}`} style={{
                    borderLeft: "1px solid var(--border-light)",
                    borderBottom: i < HOURS.length - 1 ? "1px solid var(--border-light)" : "none",
                  }} />
                ))}
              </div>
            ))}
          </div>

          {/* Course blocks — overlaid */}
          {slots.map(slot => {
            const colorIdx = COLORS.indexOf(slot.color);
            const isConflict = conflicts.includes(slot.id);
            const startIdx = HOURS.indexOf(slot.start_hour);
            const span = slot.end_hour - slot.start_hour;
            const top = startIdx * 56 + 4;
            const height = span * 56 - 8;
            const dayWidth = `calc((100% - 38px) / 5)`;
            const left = `calc(38px + ${dayWidth} * ${slot.day_of_week} + 4px)`;
            const width = `calc(${dayWidth} - 8px)`;
            const railColor = isConflict ? "#D97706" : (TEXT_COLORS[colorIdx] ?? "#003580");

            return (
              <div key={slot.id} style={{
                position: "absolute", top, left, width, height,
                background: isConflict ? "#FEF3C7" : slot.color,
                borderLeft: `3px solid ${railColor}`,
                borderRadius: 6,
                padding: "6px 8px",
                overflow: "hidden",
              }}>
                <p style={{ fontSize: 10.5, fontWeight: 600, color: railColor, lineHeight: 1.25 }}>
                  {slot.course}
                </p>
                {slot.room && <p style={{ fontSize: 9, color: "var(--text-secondary)", marginTop: 2 }}>{slot.room}</p>}
                {span >= 2 && (
                  <p style={{ fontSize: 8.5, color: "var(--text-tertiary)", marginTop: 3 }}>
                    {slot.start_hour}:00–{slot.end_hour}:00
                  </p>
                )}
                <button onClick={() => removeSlot(slot.id)}
                  style={{
                    position: "absolute", top: 2, right: 4,
                    width: 14, height: 14, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    borderRadius: "50%", border: "none", background: "transparent",
                    color: "var(--text-tertiary)", fontSize: 11, lineHeight: 1, cursor: "pointer",
                  }}>×</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Button */}
      <div style={{ padding: "0 20px", marginTop: 20, marginBottom: 16 }}>
        <button onClick={() => {
            if (isGuest) { setGuestToast(true); setTimeout(() => setGuestToast(false), 2500); return; }
            setShowModal(true);
          }}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
          style={{ background: "var(--pg-navy)", color: "white" }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> {t("timetable.addCourse")}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-end justify-center z-50"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="w-full rounded-t-3xl p-6 pb-8" style={{ background: "var(--surface)", maxWidth: 430 }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{t("timetable.addCourse")}</h2>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "var(--surface-raised)", color: "var(--text-tertiary)", fontSize: 18 }}>×</button>
            </div>

            <input placeholder={t("timetable.courseName")} value={form.course}
              onChange={e => setForm({ ...form, course: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border mb-3 text-sm outline-none focus:border-blue-400"
              style={{ borderColor: "var(--border)" }} />

            <div className="grid grid-cols-2 gap-3 mb-3">
              <input placeholder={t("timetable.code")} value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })}
                className="px-4 py-3 rounded-xl border text-sm outline-none focus:border-blue-400"
                style={{ borderColor: "var(--border)" }} />
              <input placeholder={t("timetable.room")} value={form.room}
                onChange={e => setForm({ ...form, room: e.target.value })}
                className="px-4 py-3 rounded-xl border text-sm outline-none focus:border-blue-400"
                style={{ borderColor: "var(--border)" }} />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <p className="text-xs mb-1.5 font-medium" style={{ color: "var(--text-tertiary)" }}>{t("timetable.day")}</p>
                <select value={form.day} onChange={e => setForm({ ...form, day: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "var(--border)" }}>
                  {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs mb-1.5 font-medium" style={{ color: "var(--text-tertiary)" }}>{t("timetable.start")}</p>
                <select value={form.start}
                  onChange={e => {
                    const s = Number(e.target.value);
                    setForm({ ...form, start: s, end: s + 1 > 16 ? 16 : s + 2 });
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "var(--border)" }}>
                  {HOURS.filter(h => h < 16).map(h => <option key={h} value={h}>{h}:00</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs mb-1.5 font-medium" style={{ color: "var(--text-tertiary)" }}>{t("timetable.end")}</p>
                <select value={form.end} onChange={e => setForm({ ...form, end: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "var(--border)" }}>
                  {endOptions.map(h => <option key={h} value={h}>{h}:00</option>)}
                </select>
              </div>
            </div>

            <p className="text-xs mb-2 font-medium" style={{ color: "var(--text-tertiary)" }}>{t("timetable.color")}</p>
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
                style={{ background: "var(--surface-raised)", color: "var(--text-tertiary)" }}>
                {t("timetable.cancel")}
              </button>
              <button onClick={addSlot}
                disabled={!form.course.trim()}
                className="flex-1 py-3.5 rounded-2xl text-sm font-semibold transition-opacity"
                style={{
                  background: "var(--pg-navy)",
                  color: "white",
                  opacity: form.course.trim() ? 1 : 0.4,
                }}>
                {t("timetable.addCourse")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest toast */}
      {guestToast && (
        <div style={{
          position: "fixed", bottom: 130, left: "50%", transform: "translateX(-50%)",
          background: "#78350F", color: "white", padding: "10px 20px", borderRadius: 12,
          fontSize: 13, fontWeight: 600, zIndex: 100, boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          whiteSpace: "nowrap",
        }}>
          {t("guest.signupForTimetable")}
        </div>
      )}

      {isGuest && <GuestBanner />}
      <BottomNav />
    </main>
  );
}
