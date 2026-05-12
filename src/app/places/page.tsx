"use client";

import { useState } from "react";
import BottomNav from "@/components/shared/BottomNav";
import Link from "next/link";

// ── GUIDES DATA ─────────────────────────────────────────────────────────────
const guides = [
  { slug: "pesel",      title: "PESEL Application",        desc: "Polish legal ID — required for bank, ZUS and most registrations", category: "Admin",    urgent: true,  time: "~2 hours", when: "Day 1–3"  },
  { slug: "bank",       title: "Open Bank Account",         desc: "PKO BP or Santander — needed to receive your Erasmus grant",      category: "Admin",    urgent: true,  time: "~1 hour",  when: "Day 3–7"  },
  { slug: "zus",        title: "ZUS Registration",          desc: "Health insurance registration — required for GP access",           category: "Admin",    urgent: true,  time: "~30 min",  when: "Day 1–7"  },
  { slug: "ola",        title: "Online Learning Agreement", desc: "Digital OLA — must be submitted and approved before the deadline",  category: "Academic", urgent: true,  time: "~1 hour",  when: "Week 1"   },
  { slug: "sis",        title: "SIS Course Registration",   desc: "Choose and confirm your courses on the PG student portal",         category: "Academic", urgent: false, time: "~1 hour",  when: "Week 1–2" },
  { slug: "student-id", title: "Student ID Card",           desc: "Collect from the dean's office — needed for library & discounts",  category: "Academic", urgent: false, time: "~20 min",  when: "Week 2"   },
  { slug: "offices",    title: "Key Offices & Buildings",   desc: "International Office, library, dorms — locations & hours",         category: "Campus",   urgent: false, time: "Reference",when: "Anytime"  },
];

const CAT: Record<string, { bg: string; text: string }> = {
  Admin:    { bg: "#FDE68A", text: "#78350F" },
  Academic: { bg: "#C5D8F8", text: "#002A6B" },
  Campus:   { bg: "#B2F0E8", text: "#006B5A" },
};

// ── PLACES DATA ─────────────────────────────────────────────────────────────
type Place = {
  name: string;
  detail: string;
  note?: string;
  tag?: string;
  icon: string;
  link?: string;
  hours?: string[];
  email?: string;
};

type Category = {
  id: string;
  title: string;
  color: string;
  accent: string;
  border: string;
  icon: string;
  places: Place[];
};

const categories: Category[] = [
  {
    id: "campus", title: "Campus Offices",
    color: "#C5D8F8", accent: "#002A6B", border: "#9BBDEF", icon: "🏫",
    places: [
      { name: "International Students Office", detail: "Main Building, Room 124", note: "Your first stop — English-speaking staff. Handles enrollment, OLA, EHIC.", tag: "Start here", icon: "🌍", hours: ["Mon–Fri: 10:00–14:00"], email: "international@pg.edu.pl" },
      { name: "Dean's Office", detail: "Your faculty building", note: "Student ID cards, enrollment certificates, course issues.", icon: "🎓", hours: ["Mon–Fri: 10:00–14:00", "Wed: 15:00–17:00"] },
      { name: "Library", detail: "ul. Narutowicza 11/12", note: "Access with student ID. Study rooms, printing, scanning.", icon: "📚", hours: ["Mon–Fri: 8:00–20:00", "Sat: 9:00–15:00"], link: "https://pg.edu.pl/biblioteka" },
      { name: "Student Dormitories (DS1–DS6)", detail: "ul. Wyspiańskiego, on-campus", note: "Present booking + passport at reception.", icon: "🏠", hours: ["Reception: 24/7"] },
      { name: "IT Help Desk", detail: "CI PG Building, ul. Siedlicka", note: "PG email, Eduroam Wi-Fi, Microsoft 365.", icon: "💻", hours: ["Mon–Fri: 8:00–16:00"], email: "pomoc@pg.edu.pl" },
      { name: "Finance Office (Grants)", detail: "Main Building, 1st Floor", note: "Erasmus grant payments. Bring Polish bank details.", icon: "💰", hours: ["Mon–Fri: 9:00–14:00"] },
    ],
  },
  {
    id: "groceries", title: "Grocery Stores",
    color: "#B2F0E8", accent: "#006B5A", border: "#7DE0D2", icon: "🛒",
    places: [
      { name: "Biedronka", detail: "ul. Partyzantów 71 & many locations", note: "Most affordable. Closest to PG. Open 6:00–23:00.", tag: "Closest to PG", icon: "🛒" },
      { name: "Lidl", detail: "ul. Kartuska 245 & others", note: "Great fresh produce, bakery and weekly deals.", icon: "🛒" },
      { name: "Kaufland", detail: "ul. Kartuska 245", note: "Large hypermarket — best for big weekly shop.", icon: "🏪" },
      { name: "Żabka", detail: "Near dormitories & everywhere", note: "Convenience store — 6:00–23:00. Quick top-ups.", icon: "🏬" },
    ],
  },
  {
    id: "transport", title: "Public Transport",
    color: "#C5D8F8", accent: "#002A6B", border: "#9BBDEF", icon: "🚌",
    places: [
      { name: "ZTM — Trams & Buses", detail: "ztm.gda.pl · Jakdojade / moBiLET", note: "Buy tickets on board or in-app. Validate immediately!", tag: "Most used", icon: "🚌", link: "https://ztm.gda.pl" },
      { name: "SKM — City Rail", detail: "Gdańsk ↔ Sopot ↔ Gdynia", note: "Sopot in 12 min, Gdynia in 25 min. Wrzeszcz station 10 min from PG.", tag: "Trójmiasto", icon: "🚆" },
      { name: "Student Discount — 50%", detail: "Show student ID", note: "ZTM and SKM both offer 50% off. Essential!", tag: "Save 50%", icon: "🎓" },
      { name: "Bolt / Free Now", detail: "Taxi apps on iOS & Android", note: "Cheaper than traditional taxis. Avoid unmarked cabs.", icon: "🚗" },
    ],
  },
  {
    id: "pharmacy", title: "Pharmacy (Apteka)",
    color: "#FDE68A", accent: "#78350F", border: "#FBD34D", icon: "💊",
    places: [
      { name: "Dr. Max Apteka", detail: "Galeria Bałtycka & city centre", note: "Largest chain. Most meds OTC. Some English staff.", tag: "Most common", icon: "💊" },
      { name: "24h Emergency Pharmacy", detail: "ul. Podwale Grodzkie 8", note: "Open around the clock for emergencies.", tag: "24/7", icon: "🚨" },
    ],
  },
  {
    id: "city", title: "City & Shopping",
    color: "#DDD6FE", accent: "#4C1D95", border: "#C4B5FD", icon: "🏙️",
    places: [
      { name: "Stare Miasto — Old Town", detail: "~20 min by tram", note: "Stunning architecture, restaurants, bars. Długi Targ is the heart.", tag: "Must see", icon: "🏰" },
      { name: "Galeria Bałtycka", detail: "ul. Grunwaldzka 141", note: "Largest mall near PG — H&M, Zara, food court. 5-min walk.", tag: "Closest mall", icon: "🛍️" },
      { name: "Forum Gdańsk", detail: "City centre", note: "Modern mall — cinema, IKEA Pick-Up, great food hall.", icon: "🛍️" },
    ],
  },
  {
    id: "food", title: "Food & Cafés",
    color: "#FDE68A", accent: "#78350F", border: "#FBD34D", icon: "🍽️",
    places: [
      { name: "PG Student Canteen", detail: "On campus — Gmach B", note: "Hot meals 12–20 PLN. Cheapest on campus.", tag: "Cheapest", icon: "🍽️" },
      { name: "Bar Mleczny (Milk Bar)", detail: "Various locations", note: "Traditional Polish canteen. Pierogi, barszcz 10–25 PLN.", icon: "🥟" },
      { name: "Coffee Shops", detail: "Wrzeszcz neighbourhood", note: "Karma Coffee, Sowa, Coffeedesk — great cafés near campus.", icon: "☕" },
    ],
  },
  {
    id: "emergency", title: "Emergency & Health",
    color: "#FECDD5", accent: "#9F1239", border: "#FDA4AF", icon: "🆘",
    places: [
      { name: "Emergency — 112", detail: "European emergency number", note: "Works from any phone. English operators available.", tag: "Call anytime", icon: "🆘" },
      { name: "UCK Hospital", detail: "ul. Dębinki 7 (10 min from PG)", note: "Main hospital. Emergency (SOR) open 24/7.", icon: "🏥" },
      { name: "NFZ GP Clinic", detail: "Register after ZUS", note: "Free GP visits with ZUS insurance + PESEL.", icon: "🩺" },
    ],
  },
];

// ── COMPONENT ───────────────────────────────────────────────────────────────
export default function Explore() {
  const [tab, setTab] = useState<"guides" | "places">("guides");

  return (
    <main className="min-h-screen" style={{ background: "var(--pg-light)", paddingBottom: 90 }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(165deg, #001a4d 0%, #002e75 40%, #003580 100%)",
        padding: "52px 20px 20px",
        position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,93,170,0.4), transparent 70%)", pointerEvents: "none" }} />

        <h1 style={{ color: "white", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>Explore</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 3 }}>
          Guides, offices & useful spots 📍
        </p>

        {/* Tab Switcher */}
        <div style={{
          marginTop: 16,
          display: "flex",
          background: "rgba(255,255,255,0.10)",
          borderRadius: 14,
          padding: 3,
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <button
            onClick={() => setTab("guides")}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 11,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              transition: "all 0.2s ease",
              background: tab === "guides" ? "rgba(255,255,255,0.95)" : "transparent",
              color: tab === "guides" ? "#003580" : "rgba(255,255,255,0.55)",
              boxShadow: tab === "guides" ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
            }}
          >
            📖 Guides
          </button>
          <button
            onClick={() => setTab("places")}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 11,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              transition: "all 0.2s ease",
              background: tab === "places" ? "rgba(255,255,255,0.95)" : "transparent",
              color: tab === "places" ? "#003580" : "rgba(255,255,255,0.55)",
              boxShadow: tab === "places" ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
            }}
          >
            📍 Places
          </button>
        </div>
      </div>

      {/* ── GUIDES TAB ── */}
      {tab === "guides" && (
        <div style={{ padding: "0 16px" }}>
          {/* Urgent */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D97706" }} />
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase", color: "#D97706" }}>Start with these</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {guides.filter(g => g.urgent).map(g => <GuideCard key={g.slug} guide={g} />)}
            </div>
          </div>

          {/* Rest */}
          <div style={{ marginTop: 24, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D0D5DD" }} />
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase", color: "var(--text-tertiary)" }}>Also important</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {guides.filter(g => !g.urgent).map(g => <GuideCard key={g.slug} guide={g} />)}
            </div>
          </div>
        </div>
      )}

      {/* ── PLACES TAB ── */}
      {tab === "places" && (
        <div style={{ padding: "0 16px" }}>
          {/* Quick jump pills */}
          <div style={{
            display: "flex", gap: 6, marginTop: 16, overflowX: "auto", paddingBottom: 8,
            scrollbarWidth: "none",
          }}>
            {categories.map(cat => (
              <a key={cat.id} href={`#${cat.id}`} style={{
                flexShrink: 0, padding: "7px 14px", borderRadius: 99,
                fontSize: 11, fontWeight: 600, textDecoration: "none",
                background: cat.color, color: cat.accent,
                border: `1.5px solid ${cat.border}`,
                lineHeight: 1,
              }}>
                {cat.title.split("(")[0].split("—")[0].trim().split(" ")[0]}
              </a>
            ))}
          </div>

          {categories.map(cat => (
            <div key={cat.id} id={cat.id} style={{ marginTop: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: cat.accent, flexShrink: 0 }} />
                <h2 style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase" as const, color: cat.accent }}>{cat.title}</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {cat.places.map((place, i) => (
                  <PlaceCard key={i} place={place} cat={cat} />
                ))}
              </div>
            </div>
          ))}

          {/* Campus map */}
          <div style={{ marginTop: 24, marginBottom: 8 }}>
            <a href="https://pg.edu.pl/en/campus" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <div className="card-interactive" style={{
                padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
                background: "#C5D8F8", border: "1.5px solid #9BBDEF",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#002A6B",
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4l4-2 4 2 4-2v10l-4 2-4-2-4 2V4z" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
                    <path d="M6 2v10M10 4v10" stroke="white" strokeWidth="1.3"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#002A6B" }}>Interactive Campus Map</p>
                  <p style={{ fontSize: 11, color: "#555", marginTop: 2 }}>pg.edu.pl/en/campus</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="#002A6B" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </a>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}

// ── SUB-COMPONENTS ──────────────────────────────────────────────────────────
function GuideCard({ guide }: { guide: typeof guides[0] }) {
  const cat = CAT[guide.category];
  return (
    <Link href={`/guides/${guide.slug}`}>
      <div className="card-interactive" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 4 }}>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{guide.title}</p>
            <span className="badge" style={{ background: cat.bg, color: cat.text, border: `1px solid ${cat.text}22`, flexShrink: 0 }}>{guide.category}</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{guide.desc}</p>
          <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "var(--pg-teal)", fontWeight: 500 }}>⏱ {guide.time}</span>
            <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>📅 {guide.when}</span>
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <path d="M6 4l4 4-4 4" stroke="#C8CDD8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </Link>
  );
}

function PlaceCard({ place, cat }: { place: Place; cat: Category }) {
  const inner = (
    <div className="card-interactive" style={{
      padding: "12px 16px",
      borderLeft: `3px solid ${cat.accent}`,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>{place.name}</p>
            {place.tag && (
              <span className="badge" style={{ background: cat.color, color: cat.accent, border: `1px solid ${cat.border}`, flexShrink: 0 }}>
                {place.tag}
              </span>
            )}
          </div>
          <p style={{ fontSize: 11, color: cat.accent, fontWeight: 500 }}>{place.detail}</p>
          {place.note && <p style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.5 }}>{place.note}</p>}
          {place.hours && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5 }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke={cat.accent} strokeWidth="1.2"/>
                <path d="M8 5v3.5l2.5 1.5" stroke={cat.accent} strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <p style={{ fontSize: 10.5, color: cat.accent, fontWeight: 500 }}>{place.hours.join(" · ")}</p>
            </div>
          )}
          {place.email && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="var(--pg-blue)" strokeWidth="1.2"/>
                <path d="M2 5.5l6 4 6-4" stroke="var(--pg-blue)" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <p style={{ fontSize: 10.5, color: "var(--pg-blue)", fontWeight: 500 }}>{place.email}</p>
            </div>
          )}
        </div>
        {place.link && (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 4 }}>
            <path d="M6 4l4 4-4 4" stroke="#C8CDD8" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </div>
    </div>
  );

  if (place.link) {
    return <a href={place.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>{inner}</a>;
  }
  return inner;
}
