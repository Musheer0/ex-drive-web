import { dashboardtype } from '@/lib/type'
import {create} from 'zustand'
interface Store{
    dashboard: null|dashboardtype,
    setDashoard:(dashboard:dashboardtype|null)=>void,
}

export const DashboardStore  = create<Store>((set)=>({
    dashboard: null,
    setDashoard:(data)=>set({dashboard:data})
}));