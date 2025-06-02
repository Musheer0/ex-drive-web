"use client"
import { XIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import {motion,AnimatePresence } from 'framer-motion'
const SearchHistory = ({isopen, onClose}:{isopen:boolean,onClose:(data:boolean)=>void}) => {
    const [height ,setHeight] = useState(0);
    const ref = useRef<HTMLDivElement|null>(null)

    const HandleResize = ()=>{
        if(ref.current && isopen){
            const rect = ref.current.getBoundingClientRect();
            const screeny = window.innerHeight;
            setHeight(screeny-rect.y)
        }
    };
    useEffect(()=>{
        HandleResize();
        window.addEventListener("resize",HandleResize);
        return()=>{
            window.removeEventListener("resize",HandleResize)
        }
    },[isopen])
 
  return (
<AnimatePresence mode='wait'>
 {isopen && history.length>0 &&
     <motion.div
     
     style={{
        height: `${height}px`
     }}
     ref={ref}
     key={"search-modal"}
     initial={{
        opacity: 0,
        translateY: '40px',
        scale: 0.95
     }}
      exit={{
        opacity: 0,
        translateY: '40px',
        scale: 0.95
     }}
      animate={{
        opacity: 1,
        translateY: '0px',
        scale: 1
     }}
    className='absolute w-full  top-full  left-0'
    >
        <div 
         onClick={(e)=>{
          e.stopPropagation()
        }}
        className="history p-1 w-full bg-background  top-0 left-0">
            <div className="header flex items-center justify-between py-2">
                <p className='text-sm text-muted-foreground'>Recent Search</p>
                <button
                onClick={()=>{
                    onClose(false)
                }}
                className='p-2 hover:bg-muted-foreground/10 rounded-lg'>
                    <XIcon size={14}/>
                </button>
            </div>
      
        </div>
    </motion.div>
 }
</AnimatePresence>
  )
}

export default SearchHistory