"use client"
import React, { FormEvent } from 'react'
import { Input } from '../ui/input'
import {SearchIcon} from 'lucide-react'
import {  useRouter } from 'next/navigation'
import { useSearchContext } from '../context/search-bar-context'
const SearchBar = ({onSubmit}:{onSubmit:()=>void}) => {
    const router = useRouter();
    const {query ,setQuery} = useSearchContext()
    const HandleSearch = (e:FormEvent)=>{
        e.preventDefault();
          router.push('/search?query='+query)
        onSubmit()
    }
  return (
    <form
    onSubmit={HandleSearch}
  
    className='flex flex-1 relative  md:max-w-xl'>
        <SearchIcon 
        className='absolute text-muted-foreground  top-1/2 -translate-y-1/2 left-2.5' 
        size={16}/>
        <Input 

        value={query}
        onChange={(e)=>{
            setQuery(e.target.value)
        }}
        placeholder='Search in Ex-drive' className='pl-8 md:bg-transparent border-transparent bg-muted-foreground/10 md:border-muted-foreground/10  focus:outline-none pr-[4rem] md:pr-1 rounded-full py-4 md:py-3'/>

    </form>
  )
}

export default SearchBar