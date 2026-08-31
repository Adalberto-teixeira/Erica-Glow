import { collection, doc, getDocs, query, runTransaction, serverTimestamp, where } from "firebase/firestore";
import { db } from "./firebase";

export async function getReservedTimes(date:string){
  const snapshot=await getDocs(query(collection(db,"slots"),where("date","==",date)));
  return new Set(snapshot.docs.map(item=>item.data().time as string));
}

export async function createBooking(input:{id:string;service:string;serviceId:string;price:number;duration:number;date:string;time:string;name:string;contact:string;notes:string;reviewToken:string}){
  const [hours,minutes]=input.time.split(":").map(Number); const start=hours*60+minutes; const slots:string[]=[];
  for(let minute=start;minute<start+input.duration;minute+=30) slots.push(`${String(Math.floor(minute/60)).padStart(2,"0")}:${String(minute%60).padStart(2,"0")}`);
  await runTransaction(db,async transaction=>{
    const refs=slots.map(time=>doc(db,"slots",`${input.date}_${time.replace(":","-")}`));
    const existing=await Promise.all(refs.map(ref=>transaction.get(ref)));
    if(existing.some(item=>item.exists())) throw new Error("SLOT_TAKEN");
    refs.forEach((ref,index)=>transaction.set(ref,{date:input.date,time:slots[index],bookingId:input.id,createdAt:serverTimestamp()}));
    transaction.set(doc(db,"bookings",input.id),{...input,status:"confirmed",createdAt:serverTimestamp(),endsAt:new Date(`${input.date}T${input.time}:00`).getTime()+input.duration*60000});
  });
}
