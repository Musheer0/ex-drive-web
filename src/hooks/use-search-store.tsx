import { MediaResults} from '@/lib/type'
import {create} from 'zustand'

interface ZustandStore{
    results:MediaResults
    setResults :(data:MediaResults)=>void,
    RemoveResult:()=>void
}
export const useSearchStore = create<ZustandStore>((set)=>({
  results:[],
  setResults:(data)=>set({results:data}),
  RemoveResult:()=>set({results:[]})
}));