"use client"
import { GetUserInfo } from "./get-user-info";

export class Auth {
     async Logout(cb:()=>void, fallback:()=>void){
           const response =  await fetch(`${process.env.NEXT_PUBLIC_API}/v1/token/delete`,{
                method: 'DELETE',
                credentials: 'include'
            });
            if(!response.ok) fallback();
            else cb()
     }
     // async Session(){
     //      const token = await GetToken();
     //      if(!token) return null;
     //      const session= await decode_token(token);
     //      if(!session) return null;
     //      return session
     // }
     async User(){
          const user = await GetUserInfo();
          if(!user?.id) return null;
          return user

     }
}