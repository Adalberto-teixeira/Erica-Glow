import { services } from "@/lib/services";
import { ServiceCard } from "@/components/ServiceCard";

export default function ServicesPage() {
  return (
    <section className="page">
      <p className="eyebrow">Erica Glow</p>
      <h1>Prestations & tarifs</h1>
      <p className="lead">Choisissez la prestation qui vous correspond.</p>
      <div className="grid">
        {services.map((service) => <ServiceCard key={service.id} {...service} />)}
      </div>
    </section>
  );
}
