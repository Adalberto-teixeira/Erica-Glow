"use client";

import { FormEvent, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { CalendarDays, CheckCircle2, Clock3, LogOut, ShieldCheck, Star, Trash2 } from "lucide-react";
import { auth, db } from "@/lib/firebase";

type Booking = { id: string; name: string; contact: string; service: string; date: string; time: string; duration: number; price: number; notes?: string; status: string };
type Review = { id: string; bookingId: string; name: string; service: string; rating: number; text: string; status: string };

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("contact@erica-glow.fr");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    let stopBookings = () => {};
    let stopReviews = () => {};
    const stopAuth = onAuthStateChanged(auth, current => {
      stopBookings();
      stopReviews();
      setUser(current);
      setLoading(false);
      if (!current) return;
      stopBookings = onSnapshot(
        query(collection(db, "bookings"), orderBy("createdAt", "desc")),
        snapshot => setBookings(snapshot.docs.map(item => ({ ...item.data(), id: item.id } as Booking))),
        () => setError("Impossible de charger les réservations."),
      );
      stopReviews = onSnapshot(
        collection(db, "reviews"),
        snapshot => setReviews(snapshot.docs.map(item => ({ ...item.data(), id: item.id } as Review))),
        () => setError("Impossible de charger les avis."),
      );
    });
    return () => { stopAuth(); stopBookings(); stopReviews(); };
  }, []);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch { setError("E-mail ou mot de passe incorrect."); }
  };

  const setBookingStatus = async (id: string, value: string) => {
    await updateDoc(doc(db, "bookings", id), { status: value, updatedAt: new Date() });
    setBookings(items => items.map(item => item.id === id ? { ...item, status: value } : item));
  };

  const publishReview = async (id: string) => {
    await updateDoc(doc(db, "reviews", id), { status: "published", publishedAt: new Date() });
    setReviews(items => items.map(item => item.id === id ? { ...item, status: "published" } : item));
  };

  const removeReview = async (id: string) => {
    await deleteDoc(doc(db, "reviews", id));
    setReviews(items => items.filter(item => item.id !== id));
  };

  if (loading) return <section className="page"><p>Chargement sécurisé…</p></section>;
  if (!user) return <section className="page admin-login"><div className="admin-lock"><ShieldCheck/></div><p className="eyebrow">Accès professionnel</p><h1>Espace Erica Glow</h1><p className="lead">Réservé à la gestion des rendez-vous.</p><form className="form-card" onSubmit={login}><label>Adresse e-mail<input type="email" value={email} onChange={event => setEmail(event.target.value)} required/></label><label>Mot de passe<input type="password" value={password} onChange={event => setPassword(event.target.value)} required/></label>{error && <p className="form-error">{error}</p>}<button className="primary-button" type="submit">Se connecter</button></form></section>;

  return <section className="page admin-page"><div className="admin-head"><div><p className="eyebrow">Tableau de bord privé</p><h1>Réservations</h1><p className="lead">{bookings.length} demande{bookings.length !== 1 ? "s" : ""}</p></div><button className="outline-button" onClick={() => signOut(auth)}><LogOut/> Déconnexion</button></div><div className="admin-bookings">{bookings.length === 0 ? <div className="empty-card"><CalendarDays/><h2>Aucune réservation</h2></div> : bookings.map(item => <article key={item.id}><header><span className={`status-pill status-${item.status}`}>{item.status}</span><strong>{item.id}</strong></header><h2>{item.name}</h2><p>{item.service}</p><div className="admin-meta"><span><CalendarDays/> {item.date}</span><span><Clock3/> {item.time} · {item.duration} min</span><strong>{item.price} €</strong></div><a href={`mailto:${item.contact}`}>{item.contact}</a>{item.notes && <blockquote>{item.notes}</blockquote>}<div className="admin-actions"><button onClick={() => setBookingStatus(item.id, "confirmed")}>Confirmer</button><button onClick={() => setBookingStatus(item.id, "completed")}><CheckCircle2/> Marquer terminé</button></div></article>)}</div><div className="admin-head admin-review-head"><div><p className="eyebrow">Modération</p><h2>Avis clientes</h2></div></div><div className="admin-bookings">{reviews.length === 0 ? <div className="empty-card"><Star/><h2>Aucun avis à valider</h2></div> : reviews.map(review => <article key={review.id}><header><span className={`status-pill status-${review.status}`}>{review.status}</span><span className="stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < review.rating ? "currentColor" : "none"}/>)}</span></header><h2>{review.name}</h2><p>{review.service}</p><blockquote>{review.text}</blockquote><div className="admin-actions"><button onClick={() => publishReview(review.id)}><CheckCircle2/> Publier</button><button onClick={() => removeReview(review.id)}><Trash2/> Refuser</button></div></article>)}</div></section>;
}
