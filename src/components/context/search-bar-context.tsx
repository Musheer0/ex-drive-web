"use client"
import React, { createContext, useContext, useState } from 'react'
const SearchContext = createContext<null|{ query: string; setQuery: React.Dispatch<React.SetStateAction<string>>; }>(null)
const SearchBarContext = ({children}:{children:React.ReactNode}) => {
  const [query ,setQuery] = useState('')
  
    return (
        <SearchContext.Provider value={{query,setQuery}}>
            {children}
        </SearchContext.Provider>
    )
}

export default SearchBarContext

export const useSearchContext = ()=>{
    const context = useContext(SearchContext);
    if(!context) throw new Error("search context can only be used in search context provider");
    return context
}