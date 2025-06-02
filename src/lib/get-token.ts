import { cookies } from "next/headers"

export const GetToken = async()=>{
    const cookie = await cookies()
    return  cookie.get("token")?.value
}