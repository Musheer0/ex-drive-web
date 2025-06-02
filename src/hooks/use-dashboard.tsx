"use client"
import { apiFetch } from '@/lib/api-fetch';
import { dashboardtype } from '@/lib/type';
import { DashboardStore } from '@/stores/dashboard-store'
import { FileStore } from '@/stores/file-store';
const useDashboard = () => {
  const {dashboard, setDashoard} = DashboardStore();
  const { AddFile,DeleteFile,GetFIle}  = FileStore()
  const InitailizeDashboard = async()=>{
   if(dashboard) return;
     const response = await apiFetch<dashboardtype>('/v1/pages/dashboard');
    if(response) setDashoard(response);
  }
  const EditDashboard = (fn:(data:dashboardtype)=>dashboardtype|null)=>{
if(!dashboard) return
    setDashoard(fn(dashboard))
  };
  return {dashboard, setDashoard,EditDashboard,InitailizeDashboard,AddFile,DeleteFile,GetFIle}
}

export default useDashboard