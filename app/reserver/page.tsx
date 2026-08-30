"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { services } from "@/lib/services";

const slots = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];

function BookingForm() {
  const params = useSearchParams();
  const initialService = params.get("service") ?? services[0].id;
  const [serviceId, setServiceId] = useState(initialService);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const service = useMemo(() => services.find((s) => s.id === serviceId) ?? services[0], [serviceId]);

  return (
    <section className="page booking-page">
      <p className="eyebrow">Réservation</p>
      <h1>Prendre rendez-vous</h1>
      <p className="lead">Première version du parcours de réservation.</p>

      <div className="form-card">
        <label>
          Prestation
          <select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
            {services.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.price} €</option>)}
          </select>
        </label>

        <div className="summary-line">
          <span>Durée estimée</span>
          <strong>{service.duration} min</strong>
        </div>

        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <div>
          <span className="label">Heure</span>
          <div className="slot-grid">
            {slots.map((slot) => (
              <button
                type="button"
                key={slot}
                onClick={() => setTime(slot)}
                className={time === slot ? "slot selected" : "slot"}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <button className="primary-button full" disabled={!date || !time}>
          Continuer
        </button>
      </div>
    </section>
  );
}

export default function BookingPage() {
  return <Suspense fallback={<section className="page"><p>Chargement…</p></section>}><BookingForm /></Suspense>;
}
