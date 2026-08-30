"use client";

import { CheckCircle2, LockKeyhole, Star } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Booking = { id: string; service: string; date: string; time: string; duration?: number; reviewToken?: string };
type Review = { bookingId: string; name: string; service: string; rating: number; text: string };
const example: Review = { bookingId: "example", name: "Julie D.", service: "Extension de cils", rating: 5, text: "Professionnelle, douce et à l’écoute. Le résultat est toujours au-delà de mes attentes !" };

export default function VerifiedReviews() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setBookings(JSON.parse(localStorage.getItem("erica-glow-bookings") || "[]"));
    getDocs(query(collection(db, "reviews"), where("status", "==", "published")))
      .then(snapshot => setReviews(snapshot.docs.map(item => item.data() as Review)))
      .catch(() => setReviews([]));
  }, []);

  const eligible = useMemo(() => bookings.find(booking =>
    Boolean(booking.reviewToken) &&
    new Date(`${booking.date}T${booking.time}:00`).getTime() + (booking.duration || 60) * 60000 < Date.now()
  ), [bookings]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!eligible?.reviewToken || name.trim().length < 2 || reviewText.trim().length < 10) return;
    setError("");
    const parts = name.trim().split(" ");
    const review = {
      bookingId: eligible.id,
      reviewToken: eligible.reviewToken,
      name: `${parts[0]} ${parts[1]?.[0] || ""}.`.trim(),
      service: eligible.service,
      rating,
      text: reviewText.trim(),
      status: "pending",
      createdAt: serverTimestamp(),
    };
    try {
      await setDoc(doc(db, "reviews", eligible.id), review);
      setSent(true);
    } catch {
      setError("Votre rendez-vous doit d’abord être marqué comme terminé par Erica Glow.");
    }
  };

  const displayedReviews = reviews.length ? reviews.slice(0, 3) : [example];
  return <section className="verified-reviews" id="avis"><div className="reviews-heading"><span className="eyebrow">Avis vérifiés</span><h2>Ce que disent<br/>nos <em>clientes</em></h2><p>Chaque avis publié est lié à un rendez-vous réellement effectué.</p></div><div className="review-cards">{displayedReviews.map((review,index)=><blockquote key={`${review.bookingId}-${index}`}><div className="stars">{Array.from({length:5},(_,i)=><Star key={i} size={14} fill={i<review.rating?"currentColor":"none"}/>)}</div><p>“{review.text}”</p><footer><span>{review.name}</span><small><CheckCircle2/> Réservation vérifiée · {review.service}</small></footer></blockquote>)}</div><div className="review-access">{sent?<div className="review-thanks"><CheckCircle2/><h3>Merci pour votre avis !</h3><p>Il sera visible après validation par Erica Glow.</p></div>:eligible?<form onSubmit={submit}><span className="eyebrow">Après votre rendez-vous</span><h3>Partagez votre expérience</h3><label>Votre note<div className="rating-buttons">{[1,2,3,4,5].map(value=><button type="button" aria-label={`${value} étoiles`} className={value<=rating?"selected":""} onClick={()=>setRating(value)} key={value}><Star fill="currentColor"/></button>)}</div></label><label>Votre prénom<input value={name} onChange={e=>setName(e.target.value)} maxLength={40} required/></label><label>Votre avis<textarea value={reviewText} onChange={e=>setReviewText(e.target.value)} minLength={10} maxLength={400} required/><small>{reviewText.length}/400</small></label>{error&&<p className="form-error">{error}</p>}<button className="primary-button" type="submit">Envoyer mon avis</button></form>:<div className="review-locked"><LockKeyhole/><div><h3>Avis réservé aux clientes</h3><p>Le formulaire se débloque après un rendez-vous enregistré sur cet appareil. Erica Glow valide ensuite que le service a bien été réalisé.</p></div></div>}</div></section>;
}
