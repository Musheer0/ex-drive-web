import React from 'react'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";

const Onboarding = () => {
    const oauth ='https://accounts.google.com/o/oauth2/v2/auth?client_id=614982614746-u115r4ci3ngldnl7hbjjslpde7fsn360.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3002%2Fapi%2Fauth%2Foauth%2Fgoogle&response_type=code&scope=openid+email+profile+&access_type=offline&prompt=consent'


  return (
  <section className="orboarding w-full h-[100dvh] flex items-center justify-center">
    <img src="/onboarding.png" className="max-w-xl h-[58%] object-contain sm:h-[70%]" alt="orboarding image" />
    <div className="absolute left-1/2  shadow-inner sm:shadow-none -translate-x-1/2 w-full max-w-lg p-2 flex-col rounded-t-2xl border sm:border-none flex items-center justify-center  border-white sm:bg-transparent bg-zinc-50 bottom-0">
   <a href={oauth} className='w-full'>
     <Button
    variant={'company'} size={'free'} className="w-full font-bold border border-[#7ea2dd]  shadow-md flex items-center text-[17px] rounded-full py-4">
     Continue with Google
          <FaGoogle />

    </Button>
   </a>
    <p className="text-xs text-center text-muted-foreground py-2">
      By clicking on  continue with google you agree to our  
     <Link href={'/tamdc'} className="text-[#89A9DE] px-1 hover:underline">
       terms & conditions
     </Link>
    </p>

    </div>
  </section>
  )
}

export default Onboarding