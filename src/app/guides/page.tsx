import BottomNav from "@/components/shared/BottomNav";
import Link from "next/link";

const guides = [
  {
    slug: "pesel",
    title: "PESEL Application",
    desc: "Legal ID number — complete in first 3 days",
    category: "Admin",
    urgent: true,
    time: "~2 hours",
  },
  {
    slug: "bank",
    title: "Open Bank Account",
    desc: "PKO BP or Santander — recommended for students",
    category: "Admin",
    urgent: true,
    time: "~1 hour",
  },
  {
    slug: "zus",
    title: "ZUS Registration",
    desc: "Health insurance registration",
    category: "Admin",
    urgent: true,
    time: "~30 min",
  },
  {
    slug: "sis",
    title: "SIS Registration",
    desc: "Course selection and academic registration",
    category: "Academic",
    urgent: false,
    time: "~1 hour",
  },
  {
    slug: "student-id",
    title: "Student ID Card",
    desc: "Collect from the dean's office",
    category: "Academic",
    urgent: false,
    time: "~20 min",
  },
  {
    slug: "offices",
    title: "Key Offices & Buildings",
    desc: "Locations, hours, and contacts",
    category: "Campus",
    urgent: false,
    time: "Reference",
  },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  Admin:    { bg: "#FBEAED", text: "#C8102E" },
  Academic: { bg: "#E8EEF7", text: "#003580" },
  Campus:   { bg: "#E0F5F3", text: "#00A693" },
};

export default function Guides() {
  const urgent = guides.filter(g => g.urgent);
  const rest = guides.filter(g => !g.urgent);

  return (
    <main className="min-h-screen pb-20" style={{ background: "var(--pg-light)" }}>

      {/* Top Bar */}
      <div className="px-5 pt-8 pb-5" style={{ background: "var(--pg-navy)" }}>
        <h1 className="text-white text-2xl font-bold">Guides</h1>
        <p className="text-blue-200 text-xs mt-1">Step-by-step help for every task</p>
      </div>

      {/* Urgent */}
      <div className="px-5 mt-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#C8102E" }}>
          Do first — critical
        </h2>
        {urgent.map(guide => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>

      {/* Rest */}
      <div className="px-5 mt-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#888" }}>
          Also important
        </h2>
        {rest.map(guide => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>

      <BottomNav />
    </main>
  );
}

function GuideCard({ guide }: { guide: typeof guides[0] }) {
  const cat = categoryColors[guide.category];
  return (
    <Link href={`/guides/${guide.slug}`}>
      <div className="flex items-center gap-3 p-4 rounded-xl mb-2 bg-white border"
        style={{ borderColor: "#e5e7eb" }}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium" style={{ color: "#1a1a2e" }}>{guide.title}</p>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: cat.bg, color: cat.text }}>
              {guide.category}
            </span>
          </div>
          <p className="text-xs" style={{ color: "#888" }}>{guide.desc}</p>
          <p className="text-xs mt-1" style={{ color: "#00A693" }}>⏱ {guide.time}</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </Link>
  );
}