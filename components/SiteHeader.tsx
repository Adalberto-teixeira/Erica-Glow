"use client";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { usePathname } from "next/navigation";
const navItems=[{label:"Accueil",href:"/"},{label:"À propos",href:"/#apropos"},{label:"Services",href:"/services"},{label:"Galerie",href:"/#galerie"},{label:"Avis",href:"/#avis"},{label:"Contact",href:"/#contact"}];
export function SiteHeader(){const pathname=usePathname();return <header className="site-header"><Link className="brand-lockup" href="/" aria-label="Erica Glow — Accueil"><Image className="brand-logo" src="/images/erica-glow-logo-transparent.png" alt="Erica Glow — Lash Technician" width={210} height={96} priority/></Link><nav className="desktop-nav" aria-label="Navigation principale">{navItems.map(item=><Link key={item.label} className={(item.href==="/"&&pathname==="/")||(item.href==="/services"&&pathname==="/services")?"active":""} href={item.href}>{item.label}</Link>)}</nav><Link className="gold-button header-book" href="/reserver">Réserver <CalendarDays size={15}/></Link></header>}
