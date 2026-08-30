import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const apiKey = "AIzaSyAVFiSCqnQpqmpJXpBY2RCT6ZN0OJCTz-I";
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char] || char));

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const authResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    });
    const authData = await authResponse.json();
    if (!authResponse.ok || authData.users?.[0]?.email !== "contact@erica-glow.fr") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const required = ["reference", "name", "email", "service", "date", "time"];
    if (required.some(key => typeof body[key] !== "string" || !body[key].trim())) return NextResponse.json({ error: "Données incomplètes" }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(body.email)) return NextResponse.json({ error: "E-mail invalide" }, { status: 400 });

    const password = process.env.SMTP_PASSWORD;
    if (!password) return NextResponse.json({ error: "SMTP non configuré" }, { status: 503 });
    const host = process.env.SMTP_HOST || "smtp.mail.ovh.net";
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER || "contact@erica-glow.fr";
    const transporter = nodemailer.createTransport({ host, port, secure: false, requireTLS: true, auth: { user, pass: password } });
    const safe = Object.fromEntries(Object.entries(body).map(([key, value]) => [key, escapeHtml(String(value ?? ""))]));
    await transporter.sendMail({
      from: `Erica Glow <${user}>`,
      to: body.email,
      subject: `Votre rendez-vous est confirmé — ${body.reference}`,
      html: `<h2>Votre rendez-vous est confirmé</h2><p>Bonjour ${safe.name},</p><p>Erica Glow confirme votre rendez-vous.</p><p><strong>Référence :</strong> ${safe.reference}</p><p><strong>Prestation :</strong> ${safe.service}</p><p><strong>Date :</strong> ${safe.date} à ${safe.time}</p><p><strong>Durée :</strong> ${safe.duration} min</p><p><strong>Tarif :</strong> ${safe.price} €</p><p>À bientôt,<br><strong>Erica Glow</strong></p>`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Confirmation email error", error);
    return NextResponse.json({ error: "Envoi impossible" }, { status: 500 });
  }
}
