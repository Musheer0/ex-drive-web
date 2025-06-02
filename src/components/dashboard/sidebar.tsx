"use client"
import { sidebarLinks } from '@/lib/links'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Sidebar = () => {
  const pathname = usePathname();
  const isActive = (path:string)=> pathname===path
  return (
    <div className='w-full max-w-[250px] sticky top-0 hidden sm:flex flex-col h-full min-h-screen bg-muted-foreground/5 border-r border-muted-foreground/10 p-2'>
                <div className="logo">
          <h1 className='text-lg font-bold leading-none'>Ex-Drive</h1>
          <p className='text-xs text-muted-foreground leading-none opacity-50'>garib drive</p>
        </div>
        <div className="links w-full flex flex-col gap-0.5 py-4">
          {sidebarLinks.map((link,i)=>{
            return(
              <Link href={link.path} key={i} className={
                cn(
                      isActive(link.path) && 'bg-[var(--active)] hover:bg-[var(--custom)]',
                  'flex items-center gap-2 px-4 rounded-full py-2 text-sm hover:bg-muted-foreground/10 cursor-pointer'
                )
              }>
                <link.icon size={14}/>
                {link.label}
              </Link>
            )
          })}
        </div>
    </div>
  )
}

export default Sidebar