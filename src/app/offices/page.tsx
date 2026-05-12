import BottomNav from "@/components/shared/BottomNav";
import Link from "next/link";

type Office = {
  name: string;
  nameLocal?: string;
  address: string;
  room?: string;
  hours: string[];
  note: string;
  email?: string;
  phone?: string;
  website?: string;
  icon: string;
  color: string;
  textColor: string;
  tag?: string;
};

const offices: Office[] = [
  {
    name: "International Students Office",
    nameLocal: "Biuro ds. Studentów Zagranicznych",
    address: "ul. Gabriela Narutowicza 11/12, Gdańsk",
    room: "Main Building (Gmach Główny), Room 124",
    hours: ["Mon–Fri: 10:00–14:00"],
    note: "Your first stop for everything Erasmus-related. English-speaking staff. Handles enrollment, OLA approvals, EHIC questions and general support.",
    email: "international@pg.edu.pl",
    website: "https://pg.edu.pl/en/international-students",
    icon: "🌍",
    color: "#E8EEF7",
    textColor: "#003580",
    tag: "Start here",
  },
  {
    name: "Dean's Office",
    nameLocal: "Dziekanat",
    address: "Your faculty building — check pg.edu.pl for your faculty",
    hours: ["Mon–Fri: 10:00–14:00", "Wed also: 15:00–17:00"],
    note: "Student ID cards, enrollment certificates, course registration issues, grade queries. Each faculty has its own dean's office.",
    icon: "🎓",
    color: "#EEEDFE",
    textColor: "#534AB7",
  },
  {
    name: "Library — PG Biblioteka Główna",
    address: "ul. Gabriela Narutowicza 11/12 (separate library building)",
    hours: ["Mon–Fri: 8:00–20:00", "Sat: 9:00–15:00", "Sun: Closed"],
    note: "Access with student ID. Study rooms can be booked online. Printing, scanning and inter-library loans available.",
    email: "biblioteka@pg.edu.pl",
    website: "https://pg.edu.pl/biblioteka",
    icon: "📚",
    color: "#E0F5F3",
    textColor: "#00A693",
  },
  {
    name: "Student Dormitories",
    nameLocal: "Domy Studenckie DS1–DS6",
    address: "ul. Wyspiańskiego, Gdańsk-Wrzeszcz (on-campus)",
    hours: ["Reception: 24/7"],
    note: "Six dorms on campus. Present your booking confirmation + passport at the reception when checking in. Bring bedsheets for the first night.",
    email: "domy@pg.edu.pl",
    phone: "+48 58 347 12 00",
    icon: "🏠",
    color: "#FAEEDA",
    textColor: "#854F0B",
  },
  {
    name: "Student Affairs Office",
    nameLocal: "Dział Kształcenia i Spraw Studenckich (DKS)",
    address: "Main Building (Gmach Główny), Ground Floor",
    hours: ["Mon–Fri: 9:00–15:00"],
    note: "Scholarships, student welfare, social support and general administrative matters.",
    email: "dks@pg.edu.pl",
    icon: "🤝",
    color: "#FAECE7",
    textColor: "#993C1D",
  },
  {
    name: "IT Help Desk / CI PG",
    address: "CI PG Building, ul. Siedlicka (near dormitories)",
    hours: ["Mon–Fri: 8:00–16:00"],
    note: "PG email activation, Eduroam Wi-Fi setup, account problems, Microsoft 365 for students.",
    email: "pomoc@pg.edu.pl",
    website: "https://helpdesk.pg.edu.pl",
    icon: "💻",
    color: "#F5F6F8",
    textColor: "#555",
  },
  {
    name: "Finance Office (Grants)",
    nameLocal: "Dział Finansowy",
    address: "Main Building, 1st Floor",
    hours: ["Mon–Fri: 9:00–14:00"],
    note: "For Erasmus grant payments and financial matters. Bring your Polish bank account details.",
    email: "finanse@pg.edu.pl",
    icon: "💰",
    color: "#E0F5F3",
    textColor: "#00A693",
  },
];

export default function Offices() {
  return (
    <main className="min-h-screen" style={{ background: "var(--pg-light)", paddingBottom: 90 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(165deg, #001a4d 0%, #002e75 40%, #003580 100%)", padding: "52px 20px 24px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,93,170,0.4), transparent 70%)", pointerEvents: "none" }} />
        <Link href="/dashboard">
          <span className="text-xs flex items-center gap-1 mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Back
          </span>
        </Link>
        <h1 className="text-white text-2xl font-bold">Offices</h1>
        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
          Key offices at Politechnika Gdańska
        </p>

        {/* Address pill */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <path d="M8 2C5.79 2 4 3.79 4 6c0 3.5 4 8 4 8s4-4.5 4-8c0-2.21-1.79-4-4-4z" fill="rgba(255,255,255,0.6)"/>
          </svg>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
            ul. Gabriela Narutowicza 11/12, Gdańsk
          </span>
        </div>
      </div>

      {/* Start here tip */}
      <div className="px-5 mt-4">
        <div className="p-3.5 rounded-2xl flex items-start gap-3"
          style={{ background: "#E8EEF7", border: "1px solid #d1dff5" }}>
          <span className="text-base flex-shrink-0">💡</span>
          <p className="text-xs leading-relaxed" style={{ color: "#003580" }}>
            <span className="font-semibold">New arrival?</span> Go to the{" "}
            <span className="font-semibold">International Students Office</span> (Room 124, Main Building) first — they speak English and will guide you through everything.
          </p>
        </div>
      </div>

      {/* Office cards */}
      <div className="px-5 mt-4">
        {offices.map((office, i) => (
          <OfficeCard key={i} office={office} />
        ))}
      </div>

      {/* Campus map */}
      <div className="px-5 mt-2 mb-4">
        <a href="https://pg.edu.pl/en/campus" target="_blank" rel="noopener noreferrer">
          <div className="p-4 rounded-2xl border flex items-center gap-3 active:scale-[0.98] transition-transform"
            style={{ background: "#E8EEF7", borderColor: "#B3C6E0" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
              style={{ background: "#003580" }}>
              🗺️
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "#003580" }}>Interactive Campus Map</p>
              <p className="text-xs mt-0.5" style={{ color: "#666" }}>pg.edu.pl/en/campus</p>
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
      <div className="px-4 pt-4 pb-3 flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
          style={{ background: office.color }}>
          {office.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <p className="text-sm font-semibold leading-snug" style={{ color: "#1a1a2e" }}>
              {office.name}
            </p>
            {office.tag && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                style={{ background: "#003580", color: "white" }}>
                {office.tag}
              </span>
            )}
          </div>
          {office.nameLocal && (
            <p className="text-xs mt-0.5" style={{ color: "#bbb", fontStyle: "italic" }}>{office.nameLocal}</p>
          )}
          <p className="text-xs mt-1 leading-snug" style={{ color: "#888" }}>
            {office.room ? `${office.room}` : office.address}
          </p>
          {office.room && (
            <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{office.address}</p>
          )}
        </div>
      </div>

      {/* Hours */}
      <div className="mx-4 px-3 py-2.5 rounded-xl mb-3 flex items-start gap-2"
        style={{ background: office.color }}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
          <circle cx="8" cy="8" r="6" stroke={office.textColor} strokeWidth="1.5"/>
          <path d="M8 5v3.5l2 1.5" stroke={office.textColor} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div>
          {office.hours.map((h, i) => (
            <p key={i} className="text-xs font-medium" style={{ color: office.textColor }}>{h}</p>
          ))}
        </div>
      </div>

      {/* Note + contacts */}
      <div className="px-4 pb-4 space-y-2">
        <p className="text-xs leading-relaxed" style={{ color: "#777" }}>{office.note}</p>
        <div className="flex flex-wrap gap-3 pt-1">
          {office.email && (
            <a href={`mailto:${office.email}`} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--pg-blue)" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 5.5l6 4 6-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {office.email}
            </a>
          )}
          {office.phone && (
            <a href={`tel:${office.phone}`} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--pg-blue)" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 2h2.5l1 3-1.5 1.5a10 10 0 004.5 4.5L11 9.5l3 1V13a2 2 0 01-2 2A12 12 0 011 4a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              {office.phone}
            </a>
          )}
          {office.website && (
            <a href={office.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs" style={{ color: "var(--pg-blue)" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 2c-2 2-2 8 0 12M8 2c2 2 2 8 0 12M2 8h12" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
