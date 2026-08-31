"use client";

import Image from "next/image";
import { Check, Copy, Download, Share2, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export default function PwaInstallSection() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [copied, setCopied] = useState(false);
  const appUrl = "https://erica-glow.fr/";

  useEffect(() => {
    const capture = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    window.addEventListener("beforeinstallprompt", capture);
    return () => window.removeEventListener("beforeinstallprompt", capture);
  }, []);

  const install = async () => { if (!prompt) return; await prompt.prompt(); const choice = await prompt.userChoice; if (choice.outcome === "accepted") setPrompt(null); };
  const share = async () => {
    if (navigator.share) return navigator.share({ title: "Erica Glow", text: "Installez l'application Erica Glow", url: appUrl });
    await navigator.clipboard.writeText(appUrl); setCopied(true); window.setTimeout(() => setCopied(false), 1800);
  };

  return <section className="pwa-install" id="installer" aria-labelledby="pwa-title">
    <div className="pwa-phone" aria-hidden="true"><div className="pwa-logo-panel"><Image src="/images/erica-glow-logo-transparent.png" alt="" width={150} height={100}/></div><small>Réservez en quelques clics</small></div>
    <div className="pwa-copy"><span className="eyebrow"><Smartphone size={14}/> Votre espace beauté</span><h2 id="pwa-title">Erica Glow<br/><em>sur votre téléphone</em></h2><p>Installez l’application gratuitement pour réserver plus rapidement et retrouver vos rendez-vous.</p>
      <div className="pwa-benefits"><span><Check/> Accès rapide</span><span><Check/> Sans téléchargement de boutique</span><span><Check/> Toujours à jour</span></div>
      <div className="pwa-actions">{prompt&&<button className="gold-button" type="button" onClick={install}><Download size={16}/> Installer l’application</button>}<button className="outline-button" type="button" onClick={share}>{copied?<Check size={16}/>:<Share2 size={16}/>} {copied?"Lien copié":"Partager le lien"}</button></div>
      <p className="pwa-help"><b>Sur iPhone :</b> Partager → Sur l’écran d’accueil. <b>Sur Android :</b> Menu du navigateur → Installer l’application.</p>
    </div>
    <div className="pwa-qr"><div><Image src="/images/erica-glow-pwa-qr.png" alt="QR Code pour ouvrir Erica Glow sur le téléphone" width={190} height={190}/></div><b>Scannez avec votre téléphone</b><span><Copy size={13}/> erica-glow.fr</span></div>
  </section>;
}
