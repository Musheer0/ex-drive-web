import { SessionUser } from '@/lib/type'
import {create} from 'zustand'
interface ZustandStore{
    user:SessionUser|null,
    setUser :(data:SessionUser)=>void,
    RemoveUser:()=>void
}
export const useUser = create<ZustandStore>((set)=>({
  user:null,
  setUser:(data)=>set({user:data}),
  RemoveUser:()=>set({user:null})
}));