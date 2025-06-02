import { NextRequest, NextResponse } from "next/server";
import { decode_token } from "./lib/decode-token";
const auth_route = ['/onboard'];
const private_route = ['/dashboard']
 const Middlewere = async(req:NextRequest)=>{
    const{nextUrl} = req;
   const token = req.cookies.get("token")?.value;
   const userInfo =await decode_token(token!);
   const is_authenticated = userInfo && userInfo.user_id;
   console.log(is_authenticated)
const is_AuthRoute = auth_route.includes(nextUrl.pathname);
const is_privatedroute =private_route.includes(nextUrl.pathname)
   if(is_AuthRoute){
       if(is_authenticated){
         const redirect_route = nextUrl.clone();
         redirect_route.pathname = '/dashboard'
            return NextResponse.redirect(redirect_route)
       }
   }
   else if (is_privatedroute){
            if(!is_authenticated){
         const redirect_route = nextUrl.clone();
         redirect_route.pathname = '/onboard'
            return NextResponse.redirect(redirect_route)
       }
   }
}

export default Middlewere