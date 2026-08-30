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
  const [step, setStep] = useState<"slot" | "details" | "done">("slot");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const service = useMemo(() => services.find((s) => s.id === serviceId) ?? services[0], [serviceId]);

  return (
    <section className="page booking-page">
      <p className="eyebrow">Réservation</p>
      <h1>Prendre rendez-vous</h1>
      <p className="lead">Première version du parcours de réservation.</p>

      {step === "done" ? <div className="form-card booking-success" role="status"><h2>Demande enregistrée</h2><p>Votre rendez-vous apparaît maintenant dans « Mes RDV » sur cet appareil.</p><a className="primary-button full" href="/mes-rdv">Voir mes rendez-vous</a></div> : <div className="form-card">
        {step === "slot" ? <>
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

        <button type="button" className="primary-button full" disabled={!date || !time} onClick={() => setStep("details")}>
          Continuer
        </button>
        </> : <>
          <div className="summary-line"><span>{service.name}</span><strong>{date} · {time}</strong></div>
          <label>Votre nom<input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom et prénom" /></label>
          <label>E-mail ou téléphone<input autoComplete="email" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Pour vous recontacter" /></label>
          <button type="button" className="primary-button full" disabled={!name.trim() || !contact.trim()} onClick={() => { const booking={id:Date.now(),service:service.name,date,time,name,contact,status:"En attente de confirmation"}; const current=JSON.parse(localStorage.getItem("erica-glow-bookings")||"[]"); localStorage.setItem("erica-glow-bookings",JSON.stringify([...current,booking])); setStep("done"); }}>Enregistrer ma demande</button>
          <button type="button" className="text-button" onClick={() => setStep("slot")}>← Modifier la date</button>
        </>}
      </div>}
    </section>
  );
}

export default function BookingPage() {
  return <Suspense fallback={<section className="page"><p>Chargement…</p></section>}><BookingForm /></Suspense>;
}
