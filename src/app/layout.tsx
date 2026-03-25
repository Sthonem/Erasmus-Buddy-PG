import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ErasmusBuddy",
  description: "Your guide to Gdańsk University of Technology",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}