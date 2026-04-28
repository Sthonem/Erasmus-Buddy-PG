import BottomNav from "@/components/shared/BottomNav";
import Link from "next/link";

const guides = [
  { slug: "pesel",      title: "PESEL Application",          desc: "Polish legal ID — required for bank, ZUS and most registrations", category: "Admin",    urgent: true,  time: "~2 hours", when: "Day 1–3"  },
  { slug: "bank",       title: "Open Bank Account",           desc: "PKO BP or Santander — needed to receive your Erasmus grant",      category: "Admin",    urgent: true,  time: "~1 hour",  when: "Day 3–7"  },
  { slug: "zus",        title: "ZUS Registration",            desc: "Health insurance registration — required for GP access",           category: "Admin",    urgent: true,  time: "~30 min",  when: "Day 1–7"  },
  { slug: "ola",        title: "Online Learning Agreement",   desc: "Digital OLA — must be submitted and approved before the deadline",  category: "Academic", urgent: true,  time: "~1 hour",  when: "Week 1"   },
  { slug: "sis",        title: "SIS Course Registration",     desc: "Choose and confirm your courses on the PG student portal",         category: "Academic", urgent: false, time: "~1 hour",  when: "Week 1–2" },
  { slug: "student-id", title: "Student ID Card",             desc: "Collect from the dean's office — needed for library & discounts",  category: "Academic", urgent: false, time: "~20 min",  when: "Week 2"   },
  { slug: "offices",    title: "Key Offices & Buildings",     desc: "International Office, library, dorms — locations & hours",         category: "Campus",   urgent: false, time: "Reference",when: "Anytime"  },
];

const CAT: Record<string, { bg: string; text: string }> = {
  Admin:    { bg: "#FBEAED", text: "#C8102E" },
  Academic: { bg: "#EEF3FB", text: "#003580" },
  Campus:   { bg: "#E5F7F5", text: "#00856f" },
};

export default function Guides() {
  const urgent = guides.filter(g => g.urgent);
  const rest   = guides.filter(g => !g.urgent);

  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--pg-light)" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(165deg, #001a4d 0%, #002e75 40%, #003580 100%)", padding: "52px 20px 24px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,93,170,0.4), transparent 70%)", pointerEvents: "none" }} />
        <h1 style={{ color: "white", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>Guides</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 3 }}>Step-by-step help for every Erasmus task</p>

        {/* Stats pills */}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {[{ n: "4", l: "Critical" }, { n: "3", l: "Academic" }, { n: "1", l: "Campus" }].map(s => (
            <div key={s.l} style={{ flex: 1, background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 12, padding: "9px 10px", textAlign: "center" }}>
              <p style={{ color: "white", fontSize: 17, fontWeight: 800 }}>{s.n}</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10.5, marginTop: 1 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Urgent */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8102E" }} />
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase", color: "#C8102E" }}>Do first — critical</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {urgent.map(g => <GuideCard key={g.slug} guide={g} />)}
          </div>
        </div>

        {/* Rest */}
        <div style={{ marginTop: 24, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D0D5DD" }} />
            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase", color: "var(--text-tertiary)" }}>Also important</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rest.map(g => <GuideCard key={g.slug} guide={g} />)}
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

function GuideCard({ guide }: { guide: typeof guides[0] }) {
  const cat = CAT[guide.category];
  return (
    <Link href={`/guides/${guide.slug}`}>
      <div className="card-interactive" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 4 }}>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{guide.title}</p>
            <span className="badge" style={{ background: cat.bg, color: cat.text, flexShrink: 0 }}>{guide.category}</span>
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
