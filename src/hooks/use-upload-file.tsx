/* eslint-disable */

"use client"
import { Media } from '@/lib/type';
import axios from 'axios'
interface UploadFileProps{
    file:File,
    onProgress:(data:number)=>void,
    SetIsLoading:(data:boolean)=>void,
    controller: AbortController,
    parent:string|null
}
const UseUploadFile = async({file, onProgress, SetIsLoading,controller,parent}:UploadFileProps) => {
    const formData = new FormData();
    formData.append(
        "file",
        file
    );
    if(!file) return 
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/v1/media/upload${parent? `?folder=${parent}`:''}`,formData,{
        withCredentials: true,
        headers:{
            'Content-Type':'multipart/form-data'
        },
        onUploadProgress: function(progressEvent) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!)
      onProgress((percentCompleted-10)>0 ? percentCompleted-10 : 0)
      console.log(percentCompleted)
    },
        signal: controller.signal
    });
    SetIsLoading(false);
    if(response.status===200){
        return {
            data:response.data as Media
        }
    }
    else{
        return {
            error: response.data||'Error uploading'
        }
    }

}

export default UseUploadFile