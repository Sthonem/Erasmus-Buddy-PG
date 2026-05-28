"use client";

import { use } from "react";
import BottomNav from "@/components/shared/BottomNav";
import Link from "next/link";
import { useI18n, type TranslationKey } from "@/lib/i18n";

type GuideConfig = {
  slug: string;
  category: "Admin" | "Academic" | "Campus";
  urgent: boolean;
  stepsCount: number;
  docsCount: number;
  faqCount: number;
  hasLink: boolean;
  linkUrl?: string;
};

const GUIDES: GuideConfig[] = [
  { slug: "pesel", category: "Admin", urgent: true, stepsCount: 4, docsCount: 4, faqCount: 4, hasLink: true, linkUrl: "https://pg.edu.pl/en/international-students" },
  { slug: "bank", category: "Admin", urgent: true, stepsCount: 4, docsCount: 3, faqCount: 3, hasLink: true, linkUrl: "https://www.pkobp.pl" },
  { slug: "zus", category: "Admin", urgent: true, stepsCount: 4, docsCount: 3, faqCount: 2, hasLink: true, linkUrl: "https://www.zus.pl" },
  { slug: "ola", category: "Academic", urgent: true, stepsCount: 7, docsCount: 4, faqCount: 5, hasLink: true, linkUrl: "https://learning-agreement.eu" },
  { slug: "sis", category: "Academic", urgent: false, stepsCount: 4, docsCount: 2, faqCount: 2, hasLink: true, linkUrl: "https://sis.pg.edu.pl" },
  { slug: "student-id", category: "Academic", urgent: false, stepsCount: 3, docsCount: 2, faqCount: 2, hasLink: false },
  { slug: "offices", category: "Campus", urgent: false, stepsCount: 4, docsCount: 0, faqCount: 2, hasLink: true, linkUrl: "https://campus.pg.edu.pl/" },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  Admin:    { bg: "#FEF3C7", text: "#D97706" },
  Academic: { bg: "#E8EEF7", text: "#003580" },
  Campus:   { bg: "#E0F5F3", text: "#00A693" },
};

export default function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t } = useI18n();
  const guide = GUIDES.find(g => g.slug === slug);

  if (!guide) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-3 px-5"
        style={{ background: "var(--pg-light)" }}>
        <p className="text-4xl">🔍</p>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{t("guide.notFound")}</p>
        <Link href="/places">
          <span style={{ fontSize: 13, color: "var(--pg-blue)" }}>← {t("guide.backToExplore")}</span>
        </Link>
      </main>
    );
  }

  const cat = categoryColors[guide.category] ?? { bg: "#F5F6F8", text: "#888" };
  const title = t(`guide.${slug}.title` as TranslationKey);
  const time = t(`guide.${slug}.time` as TranslationKey);
  const intro = t(`guide.${slug}.intro` as TranslationKey);
  const catLabel = t(`guide.cat.${guide.category}` as TranslationKey);

  const steps = Array.from({ length: guide.stepsCount }, (_, i) => ({
    title: t(`guide.${slug}.s${i + 1}` as TranslationKey),
    desc: t(`guide.${slug}.s${i + 1}d` as TranslationKey),
  }));

  const documents = Array.from({ length: guide.docsCount }, (_, i) =>
    t(`guide.${slug}.doc${i + 1}` as TranslationKey)
  );

  const faq = Array.from({ length: guide.faqCount }, (_, i) => ({
    q: t(`guide.${slug}.faq${i + 1}q` as TranslationKey),
    a: t(`guide.${slug}.faq${i + 1}a` as TranslationKey),
  }));

  const linkLabel = guide.hasLink ? t(`guide.${slug}.link` as TranslationKey) : "";

  return (
    <main className="min-h-screen" style={{ background: "var(--pg-light)", paddingBottom: 90 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(165deg, var(--header-from) 0%, var(--header-mid) 40%, var(--header-to) 100%)", padding: "52px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,93,170,0.4), transparent 70%)", pointerEvents: "none" }} />
        <Link href="/places">
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {t("guide.backToExplore")}
          </span>
        </Link>
        <h1 style={{ color: "white", fontSize: 22, fontWeight: 800, lineHeight: 1.25 }}>{title}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99,
            background: cat.bg, color: cat.text,
          }}>
            {catLabel}
          </span>
          {guide.urgent && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99,
              background: "#D97706", color: "white",
            }}>
              {t("guide.critical")}
            </span>
          )}
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ display: "inline", verticalAlign: "-1px", marginRight: 3 }}>
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            {time}
          </span>
        </div>
      </div>

      {/* Intro */}
      <div style={{ padding: "0 20px", marginTop: 20 }}>
        <div style={{
          background: "var(--surface)", borderRadius: 14, padding: "16px",
          border: "1px solid var(--border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text-secondary)" }}>{intro}</p>
        </div>
      </div>

      {/* Steps */}
      <div style={{ padding: "0 20px", marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#003580" }} />
          <h2 style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase" as const, color: "#003580", margin: 0 }}>
            {t("explore.steps")}
          </h2>
        </div>
        <div style={{ position: "relative" }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 14, position: "relative" }}>
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
                {i < steps.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: "var(--border)", minHeight: 20 }} />
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: i < steps.length - 1 ? 20 : 0 }}>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3, marginTop: 3 }}>{step.title}</p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.55 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      {documents.length > 0 && (
        <div style={{ padding: "0 20px", marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00A693" }} />
            <h2 style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase" as const, color: "#00A693", margin: 0 }}>
              {t("explore.documents")}
            </h2>
          </div>
          <div style={{
            background: "var(--surface)", borderRadius: 14, padding: "4px 0",
            border: "1px solid var(--border)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            {documents.map((doc, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 16px",
                borderBottom: i < documents.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <rect x="3" y="2" width="10" height="12" rx="1.5" stroke="#00A693" strokeWidth="1.2"/>
                  <path d="M6 6h4M6 8.5h3" stroke="#00A693" strokeWidth="1" strokeLinecap="round"/>
                </svg>
                <p style={{ fontSize: 13, color: "var(--text-primary)" }}>{doc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* External Link */}
      {guide.hasLink && guide.linkUrl && (
        <div style={{ padding: "0 20px", marginTop: 20 }}>
          <a href={guide.linkUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
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
              <p style={{ fontSize: 13, flex: 1, fontWeight: 600, color: "#003580" }}>{linkLabel}</p>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <path d="M6 4l4 4-4 4" stroke="#005DAA" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </a>
        </div>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <div style={{ padding: "0 20px", marginTop: 24, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D97706" }} />
            <h2 style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase" as const, color: "#D97706", margin: 0 }}>
              {t("explore.faq")}
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {faq.map((item, i) => (
              <div key={i} style={{
                background: "var(--surface)", borderRadius: 14, padding: "14px 16px",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#D97706", flexShrink: 0, marginTop: 1 }}>Q</span>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>{item.q}</p>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#003580", flexShrink: 0, marginTop: 1 }}>A</span>
                  <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.55 }}>{item.a}</p>
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
