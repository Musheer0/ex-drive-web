"use client"
import { sidebarLinks } from '@/lib/links'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
const MobileNav = () => {
      const pathname = usePathname();
      const isActive = (path:string)=> pathname===path
  return (
    <div className="links fixed  bottom-0 z-50 px-1 w-full sm:hidden flex justify-between bg-background border-t  py-2 pb-5">
          {sidebarLinks.map((link,i)=>{
            return(
              <Link href={link.path} key={i} className={
                cn(
                   !isActive(link.path) && 'hover:bg-foreground/5',
                  'flex items-center  px-1 flex-col relative rounded-lg py-2 text-sm  cursor-pointer'
                )
              }>
               <span
               className={
                    cn(
                      isActive(link.path) && 'bg-[var(--active)] px-3',
                  'flex items-center transition-all duration-300  flex-col rounded-full py-1 '
                )
               }
               >
                 <link.icon size={14}/>
               </span>
                {link.label}
              </Link>
            )
          })}
        </div>
  )
}

export default MobileNav