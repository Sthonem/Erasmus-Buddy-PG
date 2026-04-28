import BottomNav from "@/components/shared/BottomNav";
import Link from "next/link";

type Place = {
  name: string;
  detail: string;
  note?: string;
  tag?: string;
  icon: string;
  link?: string;
};

type Category = {
  id: string;
  title: string;
  color: string;
  textColor: string;
  bgColor: string;
  icon: string;
  places: Place[];
};

const categories: Category[] = [
  {
    id: "groceries",
    title: "Grocery Stores",
    color: "#00A693",
    textColor: "#00A693",
    bgColor: "#E0F5F3",
    icon: "🛒",
    places: [
      {
        name: "Biedronka",
        detail: "ul. Partyzantów 71 & many locations",
        note: "Most affordable. Closest to PG campus. Open daily 6:00–23:00. Good for everyday basics.",
        tag: "Closest to PG",
        icon: "🛒",
      },
      {
        name: "Lidl",
        detail: "ul. Kartuska 245 & other locations",
        note: "Great for fresh produce, bakery and weekly deals. Slightly better quality than Biedronka.",
        icon: "🛒",
      },
      {
        name: "Kaufland",
        detail: "ul. Kartuska 245 (near Lidl)",
        note: "Large hypermarket — best selection for a big weekly shop. Includes a pharmacy and household goods.",
        icon: "🏪",
      },
      {
        name: "Żabka",
        detail: "Multiple locations, including near dormitories",
        note: "Convenience store — open 6:00–23:00, 7 days a week. More expensive but ideal for quick top-ups.",
        icon: "🏬",
      },
      {
        name: "ALDI",
        detail: "ul. Podmłyńska 3 & other locations",
        note: "Good value, especially for brand-name products. Similar to Lidl.",
        icon: "🛒",
      },
    ],
  },
  {
    id: "pharmacy",
    title: "Pharmacy (Apteka)",
    color: "#C8102E",
    textColor: "#C8102E",
    bgColor: "#FBEAED",
    icon: "💊",
    places: [
      {
        name: "Dr. Max Apteka",
        detail: "Galeria Bałtycka & city centre",
        note: "Largest chain in Poland. Most medications available over-the-counter. Some English-speaking staff.",
        tag: "Most common",
        icon: "💊",
        link: "https://www.drmax.pl",
      },
      {
        name: "Apteka Kopernika",
        detail: "ul. Kopernika 26, Gdańsk",
        note: "Good local pharmacy close to the city centre.",
        icon: "💊",
      },
      {
        name: "24h Emergency Pharmacy",
        detail: "ul. Podwale Grodzkie 8 (near Gdańsk Główny station)",
        note: "Open around the clock for emergencies. Taxi or night bus from campus.",
        tag: "24/7",
        icon: "🚨",
      },
      {
        name: "Find nearest pharmacy",
        detail: "Search 'apteka' on Google Maps",
        note: "Look for the green cross ➕ sign. Most pharmacies are open Mon–Fri 8:00–20:00, Sat 9:00–15:00.",
        icon: "🔍",
      },
    ],
  },
  {
    id: "transport",
    title: "Public Transport",
    color: "#003580",
    textColor: "#003580",
    bgColor: "#E8EEF7",
    icon: "🚌",
    places: [
      {
        name: "ZTM Gdańsk — Trams & Buses",
        detail: "ztm.gda.pl · App: Jakdojade or moBiLET",
        note: "Buy tickets at machines on board or with the app. Validate (skasuj) immediately when boarding — inspectors are frequent.",
        tag: "Most used",
        icon: "🚌",
        link: "https://ztm.gda.pl",
      },
      {
        name: "SKM — Szybka Kolej Miejska",
        detail: "Gdańsk ↔ Wrzeszcz ↔ Sopot ↔ Gdynia",
        note: "Fastest way to Sopot (12 min) and Gdynia (25 min). Gdańsk Wrzeszcz station is a 10-min walk from PG.",
        tag: "Trójmiasto rail",
        icon: "🚆",
        link: "https://skm.pkp.pl",
      },
      {
        name: "Student Discount — 50% off",
        detail: "Show student ID at ticket machines or in-app",
        note: "Both ZTM and SKM offer 50% student discount with a valid PG student ID. Essential — saves a lot over a semester.",
        tag: "Save 50%",
        icon: "🎓",
      },
      {
        name: "MEVO Bike-sharing",
        detail: "Docking stations across Gdańsk",
        note: "Download the MEVO app. First 20 min free with a daily pass. Great for short trips in good weather.",
        icon: "🚲",
        link: "https://rowermevo.pl",
      },
      {
        name: "Bolt / Free Now — Taxi",
        detail: "Apps available on iOS & Android",
        note: "Cheaper than traditional taxis. Always use Bolt or Free Now — avoid unmarked taxi cabs.",
        icon: "🚗",
      },
      {
        name: "Airport Bus (line 210)",
        detail: "GDN Airport ↔ Gdańsk Wrzeszcz",
        note: "Bus 210 runs from Lech Wałęsa Airport to Wrzeszcz in ~45 min. Runs every 30 min, cheap with ZTM ticket.",
        icon: "✈️",
      },
    ],
  },
  {
    id: "city",
    title: "City Centre & Shopping",
    color: "#534AB7",
    textColor: "#534AB7",
    bgColor: "#EEEDFE",
    icon: "🏙️",
    places: [
      {
        name: "Stare Miasto — Old Town",
        detail: "~20 min by tram from PG (lines 3, 6, 9)",
        note: "Historic city centre — stunning architecture, great restaurants, bars and cafés. Długi Targ (Long Market) is the heart.",
        tag: "Must see",
        icon: "🏰",
      },
      {
        name: "Galeria Bałtycka",
        detail: "ul. Grunwaldzka 141 (near Wrzeszcz SKM station)",
        note: "Largest mall near PG — H&M, Zara, MediaMarkt, food court. 5-min walk from the train station.",
        tag: "Closest mall",
        icon: "🛍️",
      },
      {
        name: "Forum Gdańsk",
        detail: "ul. Targ Sienny 7 (city centre)",
        note: "Modern mall in the city centre. Cinema, IKEA Pick-Up, restaurants, great food hall.",
        icon: "🛍️",
      },
      {
        name: "Manufaktura PG (campus shop)",
        detail: "On campus, near Main Building",
        note: "PG branded merchandise, stationery and university publications.",
        icon: "🎓",
      },
    ],
  },
  {
    id: "food",
    title: "Food & Cafés",
    color: "#854F0B",
    textColor: "#854F0B",
    bgColor: "#FAEEDA",
    icon: "🍽️",
    places: [
      {
        name: "PG Student Canteen (Stołówka)",
        detail: "On campus — Gmach B & other faculty buildings",
        note: "Hot meals from around 12–20 PLN. Closes during holidays. Cheapest hot food on campus — soup, mains, salads.",
        tag: "Cheapest",
        icon: "🍽️",
      },
      {
        name: "Bar Mleczny — Milk Bar",
        detail: "Various locations in Gdańsk",
        note: "Traditional Polish subsidised canteen. Pierogi, barszcz, kotlet schabowy from 10–25 PLN. Authentic and very cheap.",
        icon: "🥟",
      },
      {
        name: "Trójmiejski Coffee (local cafés)",
        detail: "Wrzeszcz neighbourhood near campus",
        note: "Lots of independent speciality coffee shops in Wrzeszcz. Try Karma Coffee, Sowa or Coffeedesk.",
        icon: "☕",
      },
      {
        name: "Sopot — Day trip",
        detail: "12 min by SKM from Gdańsk Wrzeszcz",
        note: "Poland's beach resort — beautiful pier (molo), restaurants and nightlife. A must-visit on warm days.",
        tag: "Day trip",
        icon: "🏖️",
      },
    ],
  },
  {
    id: "emergency",
    title: "Emergency & Health",
    color: "#993C1D",
    textColor: "#993C1D",
    bgColor: "#FAECE7",
    icon: "🆘",
    places: [
      {
        name: "Emergency — 112",
        detail: "European emergency number (police, ambulance, fire)",
        note: "Works from any phone, with or without a SIM. English-speaking operators available.",
        tag: "Call anytime",
        icon: "🆘",
      },
      {
        name: "UCK — University Clinical Centre",
        detail: "ul. Dębinki 7, Gdańsk (10 min from PG)",
        note: "Main hospital near campus. Emergency department (SOR) open 24/7. For serious medical issues.",
        icon: "🏥",
      },
      {
        name: "NFZ GP Clinic",
        detail: "Register with a local clinic (POZ) after ZUS",
        note: "With ZUS health insurance you can see a GP for free. Show your ZUS confirmation and PESEL.",
        icon: "🩺",
      },
      {
        name: "Police — 997 (or 112)",
        detail: "City of Gdańsk Police",
        note: "For non-emergencies: Komisariat I, ul. Nowe Ogrody 27, Gdańsk.",
        icon: "👮",
      },
    ],
  },
];

export default function Places() {
  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--pg-light)" }}>

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
        <h1 className="text-white text-2xl font-bold">Places</h1>
        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
          Useful spots in Gdańsk
        </p>

        {/* Quick jump pills */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {categories.map(cat => (
            <a key={cat.id} href={`#${cat.id}`}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.10)" }}>
              {cat.icon} {cat.title.split(" ")[0]}
            </a>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 mt-4">
        {categories.map(cat => (
          <div key={cat.id} id={cat.id} className="mb-6">
            {/* Category header */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                style={{ background: cat.bgColor }}>
                {cat.icon}
              </div>
              <h2 className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>{cat.title}</h2>
            </div>

            {cat.places.map((place, i) => (
              <PlaceCard key={i} place={place} bg={cat.bgColor} text={cat.textColor} />
            ))}
          </div>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}

function PlaceCard({ place, bg, text }: { place: Place; bg: string; text: string }) {
  const content = (
    <div className="bg-white rounded-2xl border mb-2" style={{ borderColor: "#e5e7eb" }}>
      <div className="p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
          style={{ background: bg }}>
          {place.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <p className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>{place.name}</p>
            {place.tag && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                style={{ background: bg, color: text }}>
                {place.tag}
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5 font-medium" style={{ color: text }}>{place.detail}</p>
          {place.note && (
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "#777" }}>{place.note}</p>
          )}
        </div>
      </div>
    </div>
  );

  if (place.link) {
    return (
      <a href={place.link} target="_blank" rel="noopener noreferrer" className="block active:scale-[0.98] transition-transform">
        {content}
      </a>
    );
  }

  return content;
}
