"use client"
import { db } from "@/DB/dexi";
import { DexiSession } from "@/lib/type";
import { toast } from "sonner";

export class useMultiSession {
  async AddSession(){
    const response = await fetch('/api/token/add',{
      method: 'POST',
      credentials:'include',
    }).then(async(req)=>await req.json())
    if(response.message) toast.error('Error switiching user');
    await db.sessions.add(response);
    window.location.reload()
  }
  async GetSessions(){
    const session = await db.sessions.toArray();
    return session
  }
  async SwitchSession(oldsession:DexiSession){
      const session = await fetch('/api/token/change/'+oldsession.token,{
      method: 'POST',
      credentials:'include',
    }).then(async(req)=>await req.json())
    if(session.message) toast.error('Error switiching user');
     await db.sessions.delete(oldsession.id);
     await db.media.clear()
     await db.sessions.add(session)
     window.location.reload();
  }
}
