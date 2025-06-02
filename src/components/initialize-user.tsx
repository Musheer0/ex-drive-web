"use client"
import { useUser } from '@/hooks/use-user';
import { Auth } from '@/lib/auth'
import React, { useEffect } from 'react'

const InitializeUser = () => {
    const auth = new Auth();
    const { setUser,RemoveUser} = useUser();
    const HandleInitializeUser = async()=>{
        console.log('initializes')
        const session = await auth.User();
        if(!session) {
            RemoveUser();
            return
        }
        setUser(session);
    }
    useEffect(()=>{
        HandleInitializeUser();
    },[])

  return <></>
}

export default InitializeUser