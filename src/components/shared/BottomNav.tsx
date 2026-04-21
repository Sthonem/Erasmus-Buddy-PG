"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/dashboard",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 12L12 3l9 9" stroke={active ? "#005DAA" : "#aaa"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke={active ? "#005DAA" : "#aaa"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2.5" stroke={active ? "#005DAA" : "#aaa"} strokeWidth="1.8"/>
        <path d="M9 12l2 2 4-4" stroke={active ? "#005DAA" : "#aaa"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/timetable",
    label: "Timetable",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="16" rx="2" stroke={active ? "#005DAA" : "#aaa"} strokeWidth="1.8"/>
        <path d="M8 3v4M16 3v4M3 9h18" stroke={active ? "#005DAA" : "#aaa"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/guides",
    label: "Guides",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 19V6a2 2 0 012-2h13a1 1 0 011 1v13" stroke={active ? "#005DAA" : "#aaa"} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M4 19a2 2 0 002 2h13a1 1 0 001-1v-1" stroke={active ? "#005DAA" : "#aaa"} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M9 9h6M9 13h4" stroke={active ? "#005DAA" : "#aaa"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/offices",
    label: "Offices",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 21h18M4 21V8l8-5 8 5v13" stroke={active ? "#005DAA" : "#aaa"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="9" y="13" width="6" height="8" rx="1" stroke={active ? "#005DAA" : "#aaa"} strokeWidth="1.8"/>
        <path d="M9 9h.01M15 9h.01" stroke={active ? "#005DAA" : "#aaa"} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex border-t bg-white z-40"
      style={{ borderColor: "#e5e7eb", paddingBottom: "env(safe-area-inset-bottom)" }}>
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href}
            className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5">
            {item.icon(active)}
            <span className="text-[9px] font-medium"
              style={{ color: active ? "#005DAA" : "#aaa" }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
