import BottomNav from "@/components/shared/BottomNav";
import Link from "next/link";

const guideData: Record<string, {
  title: string;
  category: string;
  time: string;
  urgent: boolean;
  intro: string;
  steps: { title: string; desc: string }[];
  documents: string[];
  faq: { q: string; a: string }[];
  link?: { label: string; url: string };
}> = {
  pesel: {
    title: "PESEL Application",
    category: "Admin",
    time: "~2 hours",
    urgent: true,
    intro: "PESEL is your Polish national identification number. You need it to open a bank account, register for health insurance, and many other services.",
    steps: [
      { title: "Prepare your documents", desc: "Passport + university acceptance letter + passport photo" },
      { title: "Go to Urząd Miejski", desc: "Address: Wały Jagiellońskie 1, Gdańsk. Open Mon-Fri 8:00-16:00" },
      { title: "Fill in the form", desc: "Ask for 'Zgłoszenie pobytu czasowego' (temporary residence registration)" },
      { title: "Submit your application", desc: "It's free. PESEL is usually issued the same day or within 1-2 days." },
    ],
    documents: ["Passport (original)", "University acceptance letter", "1 passport photo", "Completed residence form"],
    faq: [
      { q: "Can I open a bank account without PESEL?", a: "Some banks allow it, but PESEL makes the process much easier. Get it first." },
      { q: "How long does it take?", a: "Usually same day or 1-2 business days." },
      { q: "Is the office open on weekends?", a: "No, Mon-Fri only, 8:00-16:00." },
      { q: "Is it free?", a: "Yes, completely free of charge." },
    ],
    link: { label: "PG International Office — official info", url: "https://pg.edu.pl/en/international-students" },
  },
  bank: {
    title: "Open Bank Account",
    category: "Admin",
    time: "~1 hour",
    urgent: true,
    intro: "You need a Polish bank account to receive your Erasmus grant, pay rent, and manage daily expenses.",
    steps: [
      { title: "Get your PESEL first", desc: "Most banks require PESEL to open an account" },
      { title: "Choose your bank", desc: "PKO BP and Santander are most popular among students" },
      { title: "Visit the branch", desc: "Bring passport + PESEL confirmation + student ID" },
      { title: "Activate online banking", desc: "Set up the mobile app for easy transfers" },
    ],
    documents: ["Passport (original)", "PESEL number", "Student ID or acceptance letter"],
    faq: [
      { q: "Which bank is best for students?", a: "PKO BP and Santander both offer free student accounts." },
      { q: "Can I do it online?", a: "Some banks offer online registration but usually require in-person verification." },
      { q: "How long does it take?", a: "Account is usually active within 1-2 business days." },
    ],
    link: { label: "PKO BP Student Account info", url: "https://www.pkobp.pl" },
  },
  zus: {
    title: "ZUS Registration",
    category: "Admin",
    time: "~30 min",
    urgent: true,
    intro: "ZUS is the Polish Social Insurance Institution. Erasmus students need to register for health insurance coverage during their stay.",
    steps: [
      { title: "Check if you need it", desc: "EU students with EHIC card may be exempt — check with the international office" },
      { title: "Get your PESEL first", desc: "Required for ZUS registration" },
      { title: "Visit ZUS office or register online", desc: "ZUS Gdańsk: ul. Chmielna 27/33" },
      { title: "Submit ZZA or ZUA form", desc: "Ask at the office which form applies to you" },
    ],
    documents: ["Passport", "PESEL number", "University enrollment confirmation"],
    faq: [
      { q: "Do I need ZUS if I have EHIC?", a: "EHIC covers emergency care. ZUS provides broader coverage. Check with the international office." },
      { q: "Is it free?", a: "Students are usually exempt from contributions. Registration itself is free." },
    ],
    link: { label: "ZUS official website", url: "https://www.zus.pl" },
  },
  sis: {
    title: "SIS Registration",
    category: "Academic",
    time: "~1 hour",
    urgent: false,
    intro: "SIS (Student Information System) is PG's platform for course selection, grades, and academic management.",
    steps: [
      { title: "Activate your PG account", desc: "Check your email for login credentials from PG" },
      { title: "Log in to SIS", desc: "Visit: sis.pg.edu.pl" },
      { title: "Select your courses", desc: "Browse the catalogue and add courses to your schedule" },
      { title: "Confirm your selection", desc: "Submit before the registration deadline" },
    ],
    documents: ["PG student email", "Student ID number"],
    faq: [
      { q: "What is the registration deadline?", a: "Check with your faculty — usually within the first 2 weeks." },
      { q: "Can I change courses after registering?", a: "Yes, during the add/drop period. Check SIS for dates." },
    ],
    link: { label: "SIS login page", url: "https://sis.pg.edu.pl" },
  },
  "student-id": {
    title: "Student ID Card",
    category: "Academic",
    time: "~20 min",
    urgent: false,
    intro: "Your student ID card gives you access to university buildings, library, and student discounts.",
    steps: [
      { title: "Complete SIS registration first", desc: "ID is issued after you are fully enrolled" },
      { title: "Go to the dean's office", desc: "Bring your passport and enrollment confirmation" },
      { title: "Collect your card", desc: "Usually ready within a few days of enrollment" },
    ],
    documents: ["Passport", "Enrollment confirmation from SIS"],
    faq: [
      { q: "What can I use it for?", a: "Library access, building entry, student discounts on transport and culture." },
      { q: "What if I lose it?", a: "Report to the dean's office. Replacement fee applies." },
    ],
  },
  offices: {
    title: "Key Offices & Buildings",
    category: "Campus",
    time: "Reference",
    urgent: false,
    intro: "The most important offices and buildings you will need during your first weeks at PG.",
    steps: [
      { title: "International Students Office", desc: "Building A, room 14. Mon-Fri 9:00-15:00" },
      { title: "Dean's Office", desc: "Check your faculty building. Mon-Fri 9:00-14:00" },
      { title: "Library (PG Biblioteka)", desc: "Main Library building. Mon-Fri 8:00-20:00, Sat 9:00-15:00" },
      { title: "Student Dormitories", desc: "DS1-DS6 on campus. Contact: domy@pg.edu.pl" },
    ],
    documents: [],
    faq: [
      { q: "Where is the International Office?", a: "Main building (Gmach Główny), Building A, room 14." },
      { q: "Can I get help in English?", a: "Yes, the International Students Office staff speaks English." },
    ],
    link: { label: "PG campus map", url: "https://pg.edu.pl/en/campus" },
  },
};

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guideData[slug];

  if (!guide) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p style={{ color: "#888" }}>Guide not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20" style={{ background: "var(--pg-light)" }}>

      {/* Top Bar */}
      <div className="px-5 pt-8 pb-5" style={{ background: "var(--pg-navy)" }}>
        <Link href="/guides">
          <p className="text-blue-200 text-xs mb-2">← Back to Guides</p>
        </Link>
        <h1 className="text-white text-xl font-bold">{guide.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          {guide.urgent && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "#C8102E", color: "white" }}>
              Critical
            </span>
          )}
          <span className="text-blue-200 text-xs">⏱ {guide.time}</span>
        </div>
      </div>

      {/* Intro */}
      <div className="px-5 mt-5">
        <p className="text-sm leading-relaxed" style={{ color: "#444" }}>{guide.intro}</p>
      </div>

      {/* Steps */}
      <div className="px-5 mt-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#003580" }}>
          Steps
        </h2>
        {guide.steps.map((step, i) => (
          <div key={i} className="flex gap-3 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "#E8EEF7", color: "#003580", fontSize: 11, fontWeight: 600 }}>
              {i + 1}
            </div>
            <div className="flex-1 pb-3 border-b" style={{ borderColor: "#e5e7eb" }}>
              <p className="text-sm font-medium" style={{ color: "#1a1a2e" }}>{step.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "#888" }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Documents */}
      {guide.documents.length > 0 && (
        <div className="px-5 mt-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#003580" }}>
            Documents needed
          </h2>
          <div className="bg-white rounded-xl p-4 border" style={{ borderColor: "#e5e7eb" }}>
            {guide.documents.map((doc, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#00A693" }}/>
                <p className="text-sm" style={{ color: "#1a1a2e" }}>{doc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* External Link */}
      {guide.link && (
        <div className="px-5 mt-4">
          <a href={guide.link.url} target="_blank" rel="noopener noreferrer">
            <div className="p-4 rounded-xl border flex items-center gap-3"
              style={{ background: "#E8EEF7", borderColor: "#B3C6E0" }}>
              <p className="text-sm flex-1" style={{ color: "#003580" }}>{guide.link.label}</p>
              <span style={{ color: "#005DAA" }}>→</span>
            </div>
          </a>
        </div>
      )}

      {/* FAQ */}
      <div className="px-5 mt-5 mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#003580" }}>
          Frequently asked questions
        </h2>
        {guide.faq.map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border mb-2" style={{ borderColor: "#e5e7eb" }}>
            <p className="text-sm font-medium mb-1" style={{ color: "#1a1a2e" }}>{item.q}</p>
            <p className="text-xs" style={{ color: "#888" }}>{item.a}</p>
          </div>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}