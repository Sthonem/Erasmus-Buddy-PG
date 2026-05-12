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
  ola: {
    title: "Online Learning Agreement (OLA)",
    category: "Academic",
    time: "~1 hour",
    urgent: true,
    intro: "The Online Learning Agreement (OLA) is the official digital document that defines the courses you will study at PG as part of your Erasmus programme. It must be approved by both your home institution and PG before or shortly after arrival.",
    steps: [
      { title: "Log in to the OLA platform", desc: "Go to learning-agreement.eu and sign in with your home university credentials" },
      { title: "Create a new Learning Agreement", desc: "Select PG as the host institution and your home university as the sending institution" },
      { title: "Add your courses (Table A)", desc: "List the courses you plan to take at PG with ECTS credits. Use the SIS course catalogue at pg.edu.pl" },
      { title: "Add component at home (Table B)", desc: "Map PG courses to equivalent courses at your home university" },
      { title: "Send for approval", desc: "Submit to your home coordinator first, then it goes to PG's International Office" },
      { title: "Wait for both signatures", desc: "The process typically takes 1-2 weeks. Check your email for status updates" },
      { title: "Download the signed copy", desc: "Save a PDF copy once fully approved — you may need it for your grant documentation" },
    ],
    documents: [
      "Erasmus grant letter / nomination confirmation",
      "PG course catalogue (from SIS or pg.edu.pl)",
      "Home university coordinator contact",
      "Your student ID number at PG",
    ],
    faq: [
      { q: "What is the deadline for OLA?", a: "Usually within the first 2-3 weeks of arrival. Check with your home coordinator — missing the deadline can affect your grant." },
      { q: "Can I change courses after submitting?", a: "Yes, you can submit a Changes to the Learning Agreement form. Try to finalise within the first 5 weeks." },
      { q: "Who is the PG coordinator?", a: "The International Students Office (Building A, room 14) handles OLA approvals at PG." },
      { q: "What if I can't find a course in OLA?", a: "Search by ECTS code or partial name. Contact the International Office if a course is missing from the system." },
      { q: "Does OLA replace the paper Learning Agreement?", a: "Yes — OLA is the digital replacement. Most universities now require OLA only, but verify with your home institution." },
    ],
    link: { label: "Open OLA platform — learning-agreement.eu", url: "https://learning-agreement.eu" },
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

const categoryColors: Record<string, { bg: string; text: string }> = {
  Admin:    { bg: "#FEF3C7", text: "#D97706" },
  Academic: { bg: "#E8EEF7", text: "#003580" },
  Campus:   { bg: "#E0F5F3", text: "#00A693" },
};

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guideData[slug];

  if (!guide) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-3 px-5"
        style={{ background: "var(--pg-light)" }}>
        <p className="text-4xl">🔍</p>
        <p className="text-sm font-medium" style={{ color: "#1a1a2e" }}>Guide not found</p>
        <Link href="/places">
          <span style={{ fontSize: 13, color: "var(--pg-blue)" }}>← Back to Explore</span>
        </Link>
      </main>
    );
  }

  const cat = categoryColors[guide.category] ?? { bg: "#F5F6F8", text: "#888" };

  return (
    <main className="min-h-screen" style={{ background: "var(--pg-light)", paddingBottom: 90 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(165deg, #001a4d 0%, #002e75 40%, #003580 100%)", padding: "52px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,93,170,0.4), transparent 70%)", pointerEvents: "none" }} />
        <Link href="/places">
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Back to Explore
          </span>
        </Link>
        <h1 style={{ color: "white", fontSize: 22, fontWeight: 800, lineHeight: 1.25 }}>{guide.title}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99,
            background: cat.bg, color: cat.text,
          }}>
            {guide.category}
          </span>
          {guide.urgent && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99,
              background: "#D97706", color: "white",
            }}>
              Critical
            </span>
          )}
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ display: "inline", verticalAlign: "-1px", marginRight: 3 }}>
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            {guide.time}
          </span>
        </div>
      </div>

      {/* Intro */}
      <div style={{ padding: "0 20px", marginTop: 20 }}>
        <div style={{
          background: "white", borderRadius: 14, padding: "16px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "#444" }}>{guide.intro}</p>
        </div>
      </div>

      {/* Steps */}
      <div style={{ padding: "0 20px", marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#003580" }} />
          <h2 style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase" as const, color: "#003580", margin: 0 }}>
            Steps
          </h2>
        </div>
        <div style={{ position: "relative" }}>
          {guide.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < guide.steps.length - 1 ? 0 : 0, position: "relative" }}>
              {/* Timeline rail */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 28 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#003580", color: "white",
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                  boxShadow: "0 2px 6px rgba(0,53,128,0.2)",
                }}>
                  {i + 1}
                </div>
                {i < guide.steps.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: "#E5E7EB", minHeight: 20 }} />
                )}
              </div>
              {/* Content */}
              <div style={{ flex: 1, paddingBottom: i < guide.steps.length - 1 ? 20 : 0 }}>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1a2e", lineHeight: 1.3, marginTop: 3 }}>{step.title}</p>
                <p style={{ fontSize: 12, color: "#666", marginTop: 4, lineHeight: 1.55 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      {guide.documents.length > 0 && (
        <div style={{ padding: "0 20px", marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00A693" }} />
            <h2 style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase" as const, color: "#00A693", margin: 0 }}>
              Documents needed
            </h2>
          </div>
          <div style={{
            background: "white", borderRadius: 14, padding: "4px 0",
            border: "1px solid #E5E7EB",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            {guide.documents.map((doc, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 16px",
                borderBottom: i < guide.documents.length - 1 ? "1px solid #F3F4F6" : "none",
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <rect x="3" y="2" width="10" height="12" rx="1.5" stroke="#00A693" strokeWidth="1.2"/>
                  <path d="M6 6h4M6 8.5h3" stroke="#00A693" strokeWidth="1" strokeLinecap="round"/>
                </svg>
                <p style={{ fontSize: 13, color: "#1a1a2e" }}>{doc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* External Link */}
      {guide.link && (
        <div style={{ padding: "0 20px", marginTop: 20 }}>
          <a href={guide.link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <div className="card-interactive" style={{
              padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
              background: "#E8EEF7", border: "1.5px solid #B3C6E0",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "#003580",
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3h5v5M13 3L7 9M5 4H3v9h9v-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ fontSize: 13, flex: 1, fontWeight: 600, color: "#003580" }}>{guide.link.label}</p>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <path d="M6 4l4 4-4 4" stroke="#005DAA" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </a>
        </div>
      )}

      {/* FAQ */}
      {guide.faq.length > 0 && (
        <div style={{ padding: "0 20px", marginTop: 24, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D97706" }} />
            <h2 style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase" as const, color: "#D97706", margin: 0 }}>
              FAQ
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {guide.faq.map((item, i) => (
              <div key={i} style={{
                background: "white", borderRadius: 14, padding: "14px 16px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#D97706", flexShrink: 0, marginTop: 1 }}>Q</span>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", lineHeight: 1.4 }}>{item.q}</p>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#003580", flexShrink: 0, marginTop: 1 }}>A</span>
                  <p style={{ fontSize: 12.5, color: "#555", lineHeight: 1.55 }}>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
