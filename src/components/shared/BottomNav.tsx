"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/dashboard",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H15v-6H9v6H4a1 1 0 01-1-1V9.5z"
          fill={active ? "var(--pg-blue)" : "none"}
          stroke={active ? "var(--pg-blue)" : "#B0B8CC"}
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <rect
          x="4" y="4" width="16" height="16" rx="4"
          fill={active ? "rgba(0,93,170,0.12)" : "none"}
          stroke={active ? "var(--pg-blue)" : "#B0B8CC"}
          strokeWidth="1.75"
        />
        <path
          d="M8.5 12l2.5 2.5L15.5 9"
          stroke={active ? "var(--pg-blue)" : "#B0B8CC"}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/timetable",
    label: "Timetable",
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <rect
          x="3" y="5" width="18" height="16" rx="3"
          fill={active ? "rgba(0,93,170,0.12)" : "none"}
          stroke={active ? "var(--pg-blue)" : "#B0B8CC"}
          strokeWidth="1.75"
        />
        <path
          d="M8 3v4M16 3v4M3 10h18"
          stroke={active ? "var(--pg-blue)" : "#B0B8CC"}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <rect x="7" y="14" width="3" height="2.5" rx="1" fill={active ? "var(--pg-blue)" : "#B0B8CC"} opacity={active ? 1 : 0.5} />
        <rect x="14" y="14" width="3" height="2.5" rx="1" fill={active ? "var(--pg-blue)" : "#B0B8CC"} opacity={active ? 1 : 0.5} />
      </svg>
    ),
  },
  {
    href: "/guides",
    label: "Guides",
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14z"
          fill={active ? "rgba(0,93,170,0.12)" : "none"}
          stroke={active ? "var(--pg-blue)" : "#B0B8CC"}
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="M4 19.5A2.5 2.5 0 016.5 17M9 9h6M9 13h4"
          stroke={active ? "var(--pg-blue)" : "#B0B8CC"}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/offices",
    label: "Offices",
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 22h18M4 22V9l8-6 8 6v13"
          stroke={active ? "var(--pg-blue)" : "#B0B8CC"}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="9" y="14" width="6" height="8" rx="1.5"
          fill={active ? "rgba(0,93,170,0.12)" : "none"}
          stroke={active ? "var(--pg-blue)" : "#B0B8CC"}
          strokeWidth="1.75"
        />
        <circle cx="9.8" cy="9.5" r="1" fill={active ? "var(--pg-blue)" : "#B0B8CC"} />
        <circle cx="14.2" cy="9.5" r="1" fill={active ? "var(--pg-blue)" : "#B0B8CC"} />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40"
      style={{
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "var(--shadow-nav)",
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center pt-2.5 pb-2 gap-1 relative"
            >
              {/* Active indicator dot */}
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                  style={{ background: "var(--pg-blue)" }}
                />
              )}
              {item.icon(active)}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--pg-blue)" : "#B0B8CC",
                  letterSpacing: "0.1px",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
