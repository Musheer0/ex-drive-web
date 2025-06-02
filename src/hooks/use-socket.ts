// hooks/useSocket.ts
import { Media } from '@/lib/type';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from './use-user';

// define the types of your events
type ClientToServerEvents = {
  chat: (msg: string) => void;
  upload:(data:Media)=>void;
  delete:(data:Media)=>void;
  toggle:(data:{id:string, private:boolean})=>void;
  [key: `media-${string}`]: (data: boolean) => void;
};

type ServerToClientEvents = {
  chat: (msg: string) => void;
  upload:(data:Media)=>void;
  delete:(data:Media)=>void;
  toggle:(data:{id:string, private:boolean})=>void;
[key: `media-${string}`]: (data: boolean) => void;
};

const useSocket = () => {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
 const {user} = useUser();
  useEffect(() => {
    if(!user) return
    socketRef.current = io('http://localhost:3004',{
      auth:{
          id:user?.id,
          email:user?.email
      }
    }) as Socket<ServerToClientEvents, ClientToServerEvents>;
    return () => {
      socketRef.current?.disconnect();
    };
  }, [user?.id]);

  return socketRef;
};

export default useSocket;
