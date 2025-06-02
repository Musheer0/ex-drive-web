"use client";

import React, { useEffect } from "react";
import useSocket from "@/hooks/use-socket";
import { Media } from "@/lib/type";
import useDashboard from "@/hooks/use-dashboard";

const SocketListener = () => {
  const socket = useSocket();
 const {EditDashboard, DeleteFile,AddFile,GetFIle} = useDashboard()

  // Stable callback to handle upload event
  const handleUpload = (data: Media) => {
    if (!data) return;
    AddFile(data);
                 EditDashboard((dash)=>{
          return {
              ...dash,
              storage:dash.storage+(data.size/1000),
              files_this_week: dash.files_this_week +1
            }
          });
    console.log("Received upload:", data);
  };
 const handleDelete = (file:Media)=>{
             EditDashboard((dash)=>{
          return {
              ...dash,
              files: dash.files?.filter((f)=>file.id!==f.id),
              storage:dash.storage-(file.size/1000),
              files_this_week: dash.files_this_week -1
            }
          });
          DeleteFile(file.id);
 };
 const handleToggle = ({id,private:isPrivate}:{id:string,private:boolean})=>{
      const cb = (file:Media)=>{
        AddFile({
          ...file,
          is_private: isPrivate
        });
      };
      GetFIle(id,cb);
    

 }
  useEffect(() => {
        console.log(!!socket.current)

    socket.current?.on("upload", handleUpload);
    socket.current?.on("delete",handleDelete);
    socket.current?.on("toggle",handleToggle);
    return () => {
      socket.current?.off("upload", handleUpload);
      socket.current?.off("delete",handleDelete);
      socket.current?.off("toggle",handleToggle);
    };
  }, [socket.current]); // added socket to deps — safer

  return (
    <div className="socker"></div>
  )
};

export default SocketListener;
