"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

export default function GuestBanner() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <div
      onClick={() => {
        localStorage.removeItem("guest_mode");
        router.push("/");
      }}
      style={{
        background: "linear-gradient(90deg, #F59E0B, #FBBF24)",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        cursor: "pointer",
        position: "fixed",
        bottom: 70,
        left: 0,
        right: 0,
        zIndex: 90,
      }}
    >
      <span style={{ fontSize: 13 }}>👀</span>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#78350F" }}>
        {t("guest.banner")}
      </p>
      <span style={{
        fontSize: 11,
        fontWeight: 700,
        color: "white",
        background: "#78350F",
        borderRadius: 8,
        padding: "2px 8px",
        marginLeft: 4,
      }}>
        {t("guest.signUp")}
      </span>
    </div>
  );
}
