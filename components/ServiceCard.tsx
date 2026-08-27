import Link from "next/link";

type Props = {
  name: string;
  price: number;
  duration: number;
  id: string;
};

export function ServiceCard({ name, price, duration, id }: Props) {
  return (
    <article className="service-card">
      <div>
        <p className="eyebrow">Erica Glow</p>
        <h3>{name}</h3>
        <p className="muted">Durée estimée : {duration} min</p>
      </div>
      <div className="service-bottom">
        <strong>{price} €</strong>
        <Link className="small-button" href={`/reserver?service=${id}`}>Choisir</Link>
      </div>
    </article>
  );
}
