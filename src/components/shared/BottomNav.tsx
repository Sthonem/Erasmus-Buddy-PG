"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/dashboard",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 12L12 3l9 9" stroke={active ? "#005DAA" : "#888"} strokeWidth="1.8" strokeLinecap="round"/>
        <rect x="5" y="12" width="14" height="9" rx="1.5" stroke={active ? "#005DAA" : "#888"} strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke={active ? "#005DAA" : "#888"} strokeWidth="1.8"/>
        <path d="M8 12h8M8 8h8M8 16h5" stroke={active ? "#005DAA" : "#888"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/timetable",
    label: "Timetable",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="16" rx="2" stroke={active ? "#005DAA" : "#888"} strokeWidth="1.8"/>
        <path d="M8 5V3M16 5V3M3 9h18" stroke={active ? "#005DAA" : "#888"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/guides",
    label: "Guides",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 4a5 5 0 100 10A5 5 0 0012 4z" stroke={active ? "#005DAA" : "#888"} strokeWidth="1.8"/>
        <path d="M5.5 17c-2 .7-3 2-3 3h19c0-.8-.8-2.3-3-3" stroke={active ? "#005DAA" : "#888"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex border-t bg-white"
      style={{ borderColor: "#e5e7eb" }}>
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href}
            className="flex-1 flex flex-col items-center justify-center py-3 gap-1">
            {item.icon(active)}
            <span className="text-[10px]"
              style={{ color: active ? "#005DAA" : "#888", fontWeight: active ? 500 : 400 }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}