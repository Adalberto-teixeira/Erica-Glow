"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, ChevronLeft, Clock3, ShieldCheck, UserRoundCheck } from "lucide-react";
import { services } from "@/lib/services";

const slots=["09:00","10:30","12:00","14:00","15:30","17:00","18:30"];
const today=new Date().toISOString().split("T")[0];
type Step="service"|"details"|"review"|"done";
type Draft={id:string;service:string;serviceId:string;price:number;duration:number;date:string;time:string;name:string;contact:string;notes:string;status:string;createdAt:string};

function BookingForm(){
  const params=useSearchParams();
  const initial=params.get("service")??services[0].id;
  const [step,setStep]=useState<Step>("service");
  const [serviceId,setServiceId]=useState(initial);
  const [date,setDate]=useState("");
  const [time,setTime]=useState("");
  const [name,setName]=useState("");
  const [contact,setContact]=useState("");
  const [notes,setNotes]=useState("");
  const [error,setError]=useState("");
  const [reference,setReference]=useState("");
  const service=useMemo(()=>services.find(s=>s.id===serviceId)??services[0],[serviceId]);
  const progress=step==="service"?1:step==="details"?2:3;
  const chooseDate=(value:string)=>{setDate(value);setTime("");const day=new Date(`${value}T12:00:00`).getDay();setError(day===0?"Les réservations ne sont pas disponibles le dimanche.":"")};
  const save=()=>{const ref=`EG-${Date.now().toString().slice(-6)}`;const draft:Draft={id:ref,service:service.name,serviceId:service.id,price:service.price,duration:service.duration,date,time,name:name.trim(),contact:contact.trim(),notes:notes.trim(),status:"Demande à confirmer",createdAt:new Date().toISOString()};const current:Draft[]=JSON.parse(localStorage.getItem("erica-glow-bookings")||"[]");localStorage.setItem("erica-glow-bookings",JSON.stringify([...current,draft]));setReference(ref);setStep("done")};
  return <section className="page booking-page">
    <div className="booking-heading"><div><p className="eyebrow">Réservation sans compte</p><h1>Prendre rendez-vous</h1><p className="lead">Aucun compte ni mot de passe n’est nécessaire.</p></div>{step!=="done"&&<div className="progress-wrap" aria-label={`Étape ${progress} sur 3`}><span>Étape {progress}/3</span><div className="progress-track"><i style={{width:`${progress/3*100}%`}}/></div></div>}</div>
    {step!=="done"&&<div className="guest-banner"><UserRoundCheck/><div><strong>Vous continuez comme invitée</strong><span>Indiquez simplement un e-mail ou un téléphone pour être recontactée.</span></div></div>}
    {step==="done"?<div className="form-card booking-success" role="status"><span className="success-icon"><Check/></span><p className="eyebrow">Demande enregistrée</p><h2>Merci, {name.split(" ")[0]} !</h2><p>Votre demande <strong>{reference}</strong> est conservée sur cet appareil. Elle reste en attente de confirmation par Erica Glow.</p><div className="receipt"><span>{service.name}</span><strong>{date} · {time}</strong><span>{service.duration} min</span><strong>{service.price} €</strong></div><Link className="primary-button full" href="/mes-rdv">Suivre ma demande</Link><Link className="text-button" href="/">Retour à l’accueil</Link></div>:
    <div className="booking-layout"><div className="form-card">
      {step==="service"&&<><h2>Choisissez votre créneau</h2><label>Prestation<select value={serviceId} onChange={e=>setServiceId(e.target.value)}>{services.map(s=><option key={s.id} value={s.id}>{s.name} — {s.price} €</option>)}</select></label><div className="service-summary"><span><Clock3/> Durée</span><strong>{service.duration} min</strong><span>Tarif</span><strong>{service.price} €</strong></div><label>Date<input type="date" min={today} value={date} onChange={e=>chooseDate(e.target.value)}/></label>{error&&<p className="form-error" role="alert">{error}</p>}<div><span className="label">Heure disponible</span><div className="slot-grid">{slots.map(slot=><button type="button" key={slot} disabled={!date||!!error} onClick={()=>setTime(slot)} className={time===slot?"slot selected":"slot"}>{slot}</button>)}</div></div><button type="button" className="primary-button full" disabled={!date||!time||!!error} onClick={()=>setStep("details")}>Continuer</button></>}
      {step==="details"&&<><button className="back-button" type="button" onClick={()=>setStep("service")}><ChevronLeft/> Retour</button><h2>Vos coordonnées d’invitée</h2><p className="muted">Pas de création de compte. Ces informations servent uniquement à confirmer votre rendez-vous.</p><label>Nom et prénom<input autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Nom et prénom"/></label><label>E-mail ou téléphone<input autoComplete="email" value={contact} onChange={e=>setContact(e.target.value)} placeholder="E-mail ou téléphone"/></label><label>Note pour Erica Glow <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Facultatif : allergies, souhait particulier…" maxLength={300}/><small>{notes.length}/300</small></label><button type="button" className="primary-button full" disabled={name.trim().length<2||contact.trim().length<5} onClick={()=>setStep("review")}>Vérifier ma demande</button></>}
      {step==="review"&&<><button className="back-button" type="button" onClick={()=>setStep("details")}><ChevronLeft/> Retour</button><h2>Vérifiez votre demande</h2><div className="review-list"><div><span>Prestation</span><strong>{service.name}</strong></div><div><span>Date et heure</span><strong>{date} · {time}</strong></div><div><span>Durée</span><strong>{service.duration} min</strong></div><div><span>Tarif</span><strong>{service.price} €</strong></div><div><span>Cliente</span><strong>{name}</strong></div><div><span>Contact</span><strong>{contact}</strong></div></div><div className="privacy-note"><ShieldCheck/><span>Votre demande est enregistrée sur cet appareil jusqu’à la connexion du système de confirmation.</span></div><button type="button" className="primary-button full" onClick={save}>Enregistrer ma demande</button></>}
    </div><aside className="booking-aside"><p className="eyebrow">Votre sélection</p><h2>{service.name}</h2><div><span>Durée estimée</span><strong>{service.duration} min</strong></div><div><span>Prix</span><strong>{service.price} €</strong></div>{date&&<div><span>Créneau</span><strong>{date}{time&&` · ${time}`}</strong></div>}<p>La demande ne devient définitive qu’après confirmation.</p></aside></div>}
  </section>
}
export default function BookingPage(){return <Suspense fallback={<section className="page"><p>Chargement…</p></section>}><BookingForm/></Suspense>}
