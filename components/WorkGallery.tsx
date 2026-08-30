"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";

const works = [
  { title: "Technique Glow", detail: "Volume maîtrisé, finition élégante", image: "/images/works/technique-glow.webp" },
  { title: "Design & Modelage", detail: "Une ligne adaptée à chaque regard", image: "/images/works/design-modelation.webp" },
  { title: "Résultat naturel", detail: "Léger, lumineux et confortable", image: "/images/works/resultat-naturel.webp" },
];

export default function WorkGallery() {
  const track = useRef<HTMLDivElement>(null);
  const move = (direction: number) => track.current?.scrollBy({ left: direction * Math.min(track.current.clientWidth * .82, 420), behavior: "smooth" });

  return <section className="work-gallery" id="galerie">
    <div className="work-heading">
      <div><span className="eyebrow">Portfolio</span><h2>Travaux réalisés</h2><p>Des résultats authentiques, réalisés par Erica Glow.</p></div>
      <div className="work-controls" aria-label="Navigation de la galerie">
        <button type="button" onClick={() => move(-1)} aria-label="Travail précédent"><ArrowLeft size={18}/></button>
        <button type="button" onClick={() => move(1)} aria-label="Travail suivant"><ArrowRight size={18}/></button>
      </div>
    </div>
    <div className="work-track" ref={track}>
      <article className="work-card comparison-card">
        <div className="comparison-visual">
          <figure><Image src="/images/works/preparation.webp" alt="Préparation minutieuse des extensions de cils" fill sizes="(max-width: 759px) 44vw, 18vw"/><span>Préparation</span></figure>
          <figure><Image src="/images/works/resultat-naturel.webp" alt="Résultat final des extensions de cils" fill sizes="(max-width: 759px) 44vw, 18vw"/><span>Résultat</span></figure>
        </div>
        <div className="work-copy"><span><Sparkles size={14}/> Avant & après</span><h3>Transformation sur mesure</h3><p>De la préparation au résultat final.</p></div>
      </article>
      {works.map(work => <article className="work-card" key={work.title}>
        <div className="work-visual"><Image src={work.image} alt={`${work.title} par Erica Glow`} fill sizes="(max-width: 759px) 78vw, 28vw"/></div>
        <div className="work-copy"><span><Sparkles size={14}/> Erica Glow</span><h3>{work.title}</h3><p>{work.detail}</p></div>
      </article>)}
    </div>
  </section>;
}
