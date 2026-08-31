import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./fidelity.css";
import "./interaction-fixes.css";
import "./guest-booking.css";
import "./menu-fixes.css";
import "./brand-refresh.css";
import { BottomNav } from "@/components/BottomNav";
import { PwaRegister } from "@/components/PwaRegister";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Erica Glow",
  description: "Réservation en ligne — Erica Glow Lash Technician",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Erica Glow",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F2EA",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <PwaRegister />
        <main className="app-shell"><SiteHeader />{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
