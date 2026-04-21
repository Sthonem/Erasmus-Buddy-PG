import BottomNav from "@/components/shared/BottomNav";

type Place = {
  name: string;
  detail: string;
  note?: string;
  icon: string;
};

type Category = {
  title: string;
  color: string;
  textColor: string;
  bgColor: string;
  places: Place[];
};

const categories: Category[] = [
  {
    title: "Supermarkets",
    color: "#00A693",
    textColor: "#00A693",
    bgColor: "#E0F5F3",
    places: [
      { name: "Biedronka", detail: "Multiple locations in Gdańsk", note: "Budget-friendly, everyday essentials. Closest to PG: ul. Wileńska.", icon: "🛒" },
      { name: "Lidl", detail: "ul. Kartuska & other locations", note: "Good for fresh produce and weekly deals.", icon: "🛒" },
      { name: "Kaufland", detail: "ul. Kartuska 245 (large format)", note: "Biggest selection, good for bulk shopping.", icon: "🏪" },
      { name: "Żabka", detail: "Near campus & city centre", note: "Convenience store — open early/late, 7 days a week.", icon: "🏬" },
    ],
  },
  {
    title: "Pharmacy (Apteka)",
    color: "#C8102E",
    textColor: "#C8102E",
    bgColor: "#FBEAED",
    places: [
      { name: "Apteka (general)", detail: "Look for green cross ➕ signs", note: "Available across the city. Most open Mon-Fri 8:00-20:00, Sat 9:00-15:00.", icon: "💊" },
      { name: "24h Pharmacy", detail: "ul. Podwale Grodzkie 8 (near main station)", note: "Open 24/7 — for emergencies outside normal hours.", icon: "🚨" },
    ],
  },
  {
    title: "Public Transport",
    color: "#003580",
    textColor: "#003580",
    bgColor: "#E8EEF7",
    places: [
      { name: "ZTM Gdańsk — Trams & Buses", detail: "App: Jakdojade or Google Maps", note: "Buy tickets at machines (kasownik) or use the ZTM app. Validate on board!", icon: "🚌" },
      { name: "SKM (Fast City Rail)", detail: "Connects Gdańsk ↔ Gdynia ↔ Sopot", note: "Great for trips to Sopot and Gdynia. Runs frequently.", icon: "🚆" },
      { name: "MEVO Bikes", detail: "Bike-sharing across the city", note: "Docking stations near campus. Download the MEVO app to rent.", icon: "🚲" },
      { name: "Student Discount", detail: "50% off public transport", note: "Show your PG student ID at ticket machines or use in-app discount.", icon: "🎓" },
    ],
  },
  {
    title: "City Centre",
    color: "#534AB7",
    textColor: "#534AB7",
    bgColor: "#EEEDFE",
    places: [
      { name: "Stare Miasto (Old Town)", detail: "~20 min by tram from campus", note: "Historic centre — beautiful, great for walks and restaurants.", icon: "🏰" },
      { name: "Galeria Bałtycka", detail: "ul. Grunwaldzka 141", note: "Largest shopping mall in Gdańsk. Closest major mall to PG.", icon: "🛍️" },
      { name: "Forum Gdańsk", detail: "ul. Targ Sienny 7 (city centre)", note: "Modern mall with IKEA access, cinema, food court.", icon: "🛍️" },
      { name: "Długi Targ (Long Market)", detail: "Historic heart of Gdańsk", note: "Neptune Fountain, restaurants, tourist shops. Great for visitors.", icon: "⛲" },
    ],
  },
  {
    title: "Food & Cafés",
    color: "#854F0B",
    textColor: "#854F0B",
    bgColor: "#FAEEDA",
    places: [
      { name: "PG Student Canteen", detail: "On campus — multiple locations", note: "Cheapest hot meals during term time. Check pg.edu.pl for locations.", icon: "🍽️" },
      { name: "Mleczarnia Gdańsk", detail: "Traditional bar mleczny (milk bar)", note: "Very cheap traditional Polish food. Expect pierogi, barszcz, kotlet.", icon: "🥟" },
      { name: "Starbucks / Costa", detail: "Galeria Bałtycka & city centre", note: "If you need familiar coffee. More expensive than local cafés.", icon: "☕" },
    ],
  },
  {
    title: "Emergency & Health",
    color: "#993C1D",
    textColor: "#993C1D",
    bgColor: "#FAECE7",
    places: [
      { name: "Emergency: 112", detail: "European emergency number", note: "Works from any phone, even without a SIM. Connects to police, ambulance, fire.", icon: "🆘" },
      { name: "UCK — University Clinical Centre", detail: "ul. Dębinki 7 — near PG", note: "Main hospital near campus. For serious medical issues.", icon: "🏥" },
      { name: "Non-emergency medical", detail: "NFZ registered GP clinics", note: "With ZUS registration you can visit NFZ-contracted clinics for free.", icon: "🩺" },
    ],
  },
];

export default function Places() {
  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--pg-light)" }}>

      {/* Header */}
      <div className="px-5 pt-10 pb-5" style={{ background: "var(--pg-navy)" }}>
        <h1 className="text-white text-2xl font-bold">Places</h1>
        <p className="text-blue-200 text-xs mt-1">Useful spots in Gdańsk</p>
      </div>

      {/* Categories */}
      <div className="px-5 mt-4">
        {categories.map((cat) => (
          <div key={cat.title} className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-4 rounded-full" style={{ background: cat.color }} />
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
  return (
    <div className="bg-white rounded-2xl border mb-2 p-4" style={{ borderColor: "#e5e7eb" }}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
          style={{ background: bg }}>
          {place.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>{place.name}</p>
          <p className="text-xs mt-0.5" style={{ color: text }}>{place.detail}</p>
          {place.note && (
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "#888" }}>{place.note}</p>
          )}
        </div>
      </div>
    </div>
  );
}
