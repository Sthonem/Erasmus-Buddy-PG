import BottomNav from "@/components/shared/BottomNav";
import Link from "next/link";

type Office = {
  name: string;
  building: string;
  hours: string;
  note?: string;
  email?: string;
  icon: string;
  color: string;
  textColor: string;
};

const offices: Office[] = [
  {
    name: "International Students Office",
    building: "Main Building (Gmach Główny) — Building A, Room 14",
    hours: "Mon–Fri: 9:00–15:00",
    note: "English-speaking staff. Your first stop for OLA, enrollment & general queries.",
    email: "international@pg.edu.pl",
    icon: "🌍",
    color: "#E8EEF7",
    textColor: "#003580",
  },
  {
    name: "Dean's Office",
    building: "Your faculty building (check faculty website)",
    hours: "Mon–Fri: 9:00–14:00",
    note: "Student ID cards, enrollment certificates, academic matters.",
    icon: "🎓",
    color: "#EEEDFE",
    textColor: "#534AB7",
  },
  {
    name: "Library (Biblioteka PG)",
    building: "Main Library building — ul. Gabriela Narutowicza 11/12",
    hours: "Mon–Fri: 8:00–20:00\nSat: 9:00–15:00",
    note: "Access with student ID. Study rooms bookable online.",
    icon: "📚",
    color: "#E0F5F3",
    textColor: "#00A693",
  },
  {
    name: "Student Dormitories",
    building: "DS1–DS6 — on campus (Siedlce district)",
    hours: "Reception: 24/7",
    note: "Check-in at your assigned dorm reception. Bring ID and booking confirmation.",
    email: "domy@pg.edu.pl",
    icon: "🏠",
    color: "#FAEEDA",
    textColor: "#854F0B",
  },
  {
    name: "Student Affairs Office (DKS)",
    building: "Main Building — Ground Floor",
    hours: "Mon–Fri: 9:00–15:00",
    note: "Scholarships, social matters, student welfare.",
    icon: "🤝",
    color: "#FAECE7",
    textColor: "#993C1D",
  },
  {
    name: "IT Help Desk",
    building: "CI PG Building — ul. Siedlicka",
    hours: "Mon–Fri: 8:00–16:00",
    note: "PG email setup, Eduroam Wi-Fi, IT account issues.",
    email: "pomoc@pg.edu.pl",
    icon: "💻",
    color: "#F5F6F8",
    textColor: "#555",
  },
];

export default function Offices() {
  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--pg-light)" }}>

      {/* Header */}
      <div className="px-5 pt-10 pb-5" style={{ background: "var(--pg-navy)" }}>
        <h1 className="text-white text-2xl font-bold">Offices</h1>
        <p className="text-blue-200 text-xs mt-1">Key offices & buildings at PG campus</p>
      </div>

      {/* Quick tip */}
      <div className="px-5 mt-4">
        <div className="p-3.5 rounded-2xl flex items-start gap-3" style={{ background: "#E8EEF7" }}>
          <span className="text-lg">💡</span>
          <p className="text-xs leading-relaxed" style={{ color: "#003580" }}>
            Start with the <strong>International Students Office</strong> — they speak English and can guide you to any other department.
          </p>
        </div>
      </div>

      {/* Office cards */}
      <div className="px-5 mt-4">
        {offices.map((office, i) => (
          <OfficeCard key={i} office={office} />
        ))}
      </div>

      {/* Campus map link */}
      <div className="px-5 mt-2 mb-4">
        <a href="https://pg.edu.pl/en/campus" target="_blank" rel="noopener noreferrer">
          <div className="p-4 rounded-2xl border flex items-center gap-3 active:scale-[0.98] transition-transform"
            style={{ background: "#E8EEF7", borderColor: "#B3C6E0" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "#003580" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="9" r="2.5" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "#003580" }}>PG Campus Map</p>
              <p className="text-xs mt-0.5" style={{ color: "#666" }}>View interactive map at pg.edu.pl</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
              <path d="M6 4l4 4-4 4" stroke="#005DAA" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </a>
      </div>

      <BottomNav />
    </main>
  );
}

function OfficeCard({ office }: { office: Office }) {
  return (
    <div className="bg-white rounded-2xl border mb-3 overflow-hidden" style={{ borderColor: "#e5e7eb" }}>
      {/* Color bar + icon */}
      <div className="px-4 pt-4 pb-3 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
          style={{ background: office.color }}>
          {office.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-snug" style={{ color: "#1a1a2e" }}>{office.name}</p>
          <p className="text-xs mt-1 leading-snug" style={{ color: "#666" }}>{office.building}</p>
        </div>
      </div>

      {/* Hours */}
      <div className="mx-4 px-3 py-2.5 rounded-xl mb-3 flex items-start gap-2"
        style={{ background: office.color }}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
          <circle cx="8" cy="8" r="6" stroke={office.textColor} strokeWidth="1.5"/>
          <path d="M8 5v3.5l2 1.5" stroke={office.textColor} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <p className="text-xs font-medium whitespace-pre-line" style={{ color: office.textColor }}>
          {office.hours}
        </p>
      </div>

      {/* Note + email */}
      {(office.note || office.email) && (
        <div className="px-4 pb-4 space-y-1.5">
          {office.note && (
            <p className="text-xs leading-relaxed" style={{ color: "#888" }}>{office.note}</p>
          )}
          {office.email && (
            <a href={`mailto:${office.email}`}
              className="text-xs flex items-center gap-1.5"
              style={{ color: "var(--pg-blue)" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 5.5l6 4 6-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {office.email}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
