"use client"
import { Auth } from '@/lib/auth'
import { useRouter } from 'next/navigation';
import React from 'react'

const Logout = () => {
    const auth =new  Auth();
    const router = useRouter();
    const HandleLogout = async(e:React.MouseEvent<HTMLButtonElement,MouseEvent>)=>{
        e.stopPropagation()
        const callback = ()=>{
            router.push('/onboard')
        }
        const fallback = ()=>{
            
        }
      await auth.Logout(callback, fallback);
    }
  return HandleLogout
}

export default Logout