"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const navItems = [
  {
    href: "/dashboard",
    labelKey: "nav.home" as TranslationKey,
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
    labelKey: "nav.tasks" as TranslationKey,
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
    labelKey: "nav.timetable" as TranslationKey,
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
    href: "/places",
    labelKey: "nav.explore" as TranslationKey,
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          fill={active ? "rgba(0,93,170,0.12)" : "none"}
          stroke={active ? "var(--pg-blue)" : "#B0B8CC"}
          strokeWidth="1.75"
        />
        <circle cx="12" cy="9" r="2.5"
          stroke={active ? "var(--pg-blue)" : "#B0B8CC"}
          strokeWidth="1.75"
        />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40"
      style={{
        background: "var(--surface)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "var(--shadow-nav)",
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
        borderTop: "1px solid var(--border)",
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
                  color: active ? "var(--pg-blue)" : "var(--text-tertiary)",
                  letterSpacing: "0.1px",
                }}
              >
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
