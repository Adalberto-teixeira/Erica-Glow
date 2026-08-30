"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
type Booking={id:number;service:string;date:string;time:string;status:string};
export default function Page(){const [bookings,setBookings]=useState<Booking[]|null>(null);useEffect(()=>{setBookings(JSON.parse(localStorage.getItem("erica-glow-bookings")||"[]"))},[]);return <section className="page"><p className="eyebrow">Erica Glow</p><h1>Mes rendez-vous</h1><p className="lead">Retrouvez ici les demandes enregistrées sur cet appareil.</p>{bookings===null?<div className="empty-card">Chargement…</div>:bookings.length===0?<div className="empty-card"><p>Aucune demande enregistrée.</p><Link className="primary-button" href="/reserver">Prendre rendez-vous</Link></div>:<div className="booking-list">{bookings.map(b=><article className="booking-item" key={b.id}><div><strong>{b.service}</strong><p>{b.date} à {b.time}</p></div><span>{b.status}</span></article>)}</div>}</section>}
