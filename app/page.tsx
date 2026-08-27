import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/services";
import { ServiceCard } from "@/components/ServiceCard";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="topline">
          <div className="brand-mini">
            <Image src="/icons/icon-192.png" alt="" width={44} height={44} />
            <div>
              <span className="brand-script">Erica Glow</span>
              <small>LASH TECHNICIAN</small>
            </div>
          </div>
          <Link className="ghost-button" href="/reserver">Réserver</Link>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">Beauté du regard</p>
          <h1>Révélez votre <em>regard</em>, révélez votre <em>éclat.</em></h1>
          <p>Extensions de cils sur mesure, dans une expérience simple, douce et élégante.</p>
          <div className="hero-actions">
            <Link className="primary-button" href="/reserver">Prendre rendez-vous</Link>
            <Link className="text-link" href="/services">Voir les services →</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Prestations</p>
            <h2>Mes services</h2>
          </div>
          <Link href="/services">Tout voir</Link>
        </div>
        <div className="cards-scroll">
          {services.slice(0, 4).map((service) => <ServiceCard key={service.id} {...service} />)}
        </div>
      </section>

      <section className="section compact">
        <div className="quote-card">
          <p className="eyebrow">Réservation simple</p>
          <h2>Choisissez votre prestation, votre jour et votre heure.</h2>
          <p>Vous pouvez réserver avec un compte ou continuer en invitée avec votre e-mail ou téléphone.</p>
          <Link className="primary-button" href="/reserver">Réserver maintenant</Link>
        </div>
      </section>
    </>
  );
}
