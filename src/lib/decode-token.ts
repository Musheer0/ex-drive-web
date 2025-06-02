import {  jwtVerify } from 'jose'
import { Session } from './type';

export const decode_token = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(process.env.SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as Session
  } catch {
    return null;
  }
}
