import { fileArray, fileSchema } from "@/validators/media_validator";
import z from 'zod'

export type SessionUser = {
    name:string,
    email:string,
    image:string,
    id:string
}
export type Session ={
    user_id:string,
    token:string,
      exp?: number;
  iat?: number;
}|null

export interface DexiSession {
  id?: number; 
  email:string,
  image:string,
  token:string
}
export interface DecryptedDexiSession {
  token: string;
  email:string,
  id:string
}
export const dashboard = z.object({
  userId:z.string().uuid(),
  storage:z.number(),
  folders_this_week:z.number(),
  files_this_week:z.number(),
  files:z.array(fileSchema).nullable().optional()
});



export type dashboardtype = z.infer<typeof dashboard>
export type MediaResults = z.infer<typeof fileArray>
export type Media = z.infer<typeof fileSchema>