import { NextRequest, NextResponse } from "next/server";

export const POST = async(req:NextRequest)=>{
    const token = req.cookies.get("token")?.value;
    const token1 = req.cookies.get('token-1')?.value;
    if(!token) return NextResponse.json({error:'token not found'},{status:400});
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/v1/internal/token/verify`,{
        method:'POST',
        headers:{
            'Authorization':"Bearer "+token,
            'x-internal-auth':process.env.INTERNAL_AUTH!
        }
    });
    const user = await response.json();
    if(user.data){
        const {email, image} = user.data;
        if(!email || !image)   return NextResponse.json({success:false,message:'inavlid token'},{status:400})
        const res = NextResponse.json({email, image,token:token1 ? 'token-2':'token-1'});
        res.cookies.set(token1 ? 'token-2':'token-1',token);
        res.cookies.delete('token')
        return res
    }
    else{
         return NextResponse.json({success:false,message:'inavlid token'},{status:400})

    }
    } catch (error) {
        console.log(error)
            return NextResponse.json({success:false,message:'internal server error'},{status:400})

    }
}