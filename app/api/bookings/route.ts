import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const escapeHtml=(value:string)=>value.replace(/[&<>'"]/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]||char));

export async function POST(request:Request){
  try{
    const body=await request.json();
    const required=["reference","name","email","service","date","time"];
    if(required.some(key=>typeof body[key]!=="string"||!body[key].trim()))return NextResponse.json({error:"Données incomplètes"},{status:400});
    if(!/^\S+@\S+\.\S+$/.test(body.email))return NextResponse.json({error:"E-mail invalide"},{status:400});
    const password=process.env.SMTP_PASSWORD;
    if(!password)return NextResponse.json({error:"SMTP non configuré"},{status:503});
    const host=process.env.SMTP_HOST||"smtp.mail.ovh.net";
    const port=Number(process.env.SMTP_PORT||587);
    const user=process.env.SMTP_USER||"contact@erica-glow.fr";
    const transporter=nodemailer.createTransport({host,port,secure:false,requireTLS:true,auth:{user,pass:password}});
    const safe=Object.fromEntries(Object.entries(body).map(([key,value])=>[key,escapeHtml(String(value??""))]));
    const details=`<p><strong>Référence :</strong> ${safe.reference}</p><p><strong>Prestation :</strong> ${safe.service}</p><p><strong>Date :</strong> ${safe.date} à ${safe.time}</p><p><strong>Durée :</strong> ${safe.duration} min</p><p><strong>Tarif :</strong> ${safe.price} €</p>${safe.notes?`<p><strong>Note :</strong> ${safe.notes}</p>`:""}`;
    await Promise.all([
      transporter.sendMail({from:`Erica Glow <${user}>`,to:"contact@erica-glow.fr",replyTo:body.email,subject:`Nouvelle demande ${body.reference} — ${body.name}`,html:`<h2>Nouvelle demande de réservation</h2><p><strong>Cliente :</strong> ${safe.name}</p><p><strong>E-mail :</strong> ${safe.email}</p>${details}`}),
      transporter.sendMail({from:`Erica Glow <${user}>`,to:body.email,subject:`Votre demande de réservation ${body.reference}`,html:`<h2>Merci ${safe.name}</h2><p>Nous avons bien reçu votre demande. Erica Glow vous contactera pour confirmer le créneau.</p>${details}<p>À bientôt,<br><strong>Erica Glow</strong></p>`}),
    ]);
    return NextResponse.json({ok:true});
  }catch(error){console.error("Booking email error",error);return NextResponse.json({error:"Envoi impossible"},{status:500})}
}
