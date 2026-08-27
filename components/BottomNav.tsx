"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, Sparkles, UserRound, Clock3 } from "lucide-react";

const items = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/services", label: "Services", icon: Sparkles },
  { href: "/reserver", label: "Réserver", icon: CalendarDays, featured: true },
  { href: "/mes-rdv", label: "Mes RDV", icon: Clock3 },
  { href: "/profil", label: "Profil", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${active ? "active" : ""} ${item.featured ? "featured" : ""}`}
          >
            <span className="icon-wrap"><Icon size={21} strokeWidth={1.8} /></span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
