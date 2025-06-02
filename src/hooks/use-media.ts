/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/DB/dexi";
import { apiFetch } from "@/lib/api-fetch";
import { Media } from "@/lib/type";
import {toast} from 'sonner'
export class useMedia {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  async getMedia(setIsLoading?:(data:boolean)=>void) {
    const id = this.id;
    if (!id) return { error: 'no id found' };

    try {
      // 🔒 Cache check first
      if(setIsLoading) setIsLoading(true)
      const media = await db.media.get(id);

      if (media) return {media,error: null};

      // 🛰️ Fetch from API if not cached
      const response = await apiFetch<Media>(`/v1/media/file/${id}`, { method: 'GET' });
      if (!response || (response as any).error) {
        return { error: '404 not found' ,media:null};
      }

      // 💾 Optionally cache after fetch
      await db.media.put(response); // Use put instead of add to avoid constraint errors

      return {media: response,error: null};
    } catch {
      return { error :'something went wrong',media:null};
    }
    finally{
        if(setIsLoading) setIsLoading(false)
    }
  }
  async getPublicMedia(setIsLoading?:(data:boolean)=>void) {
    const id = this.id;
    if (!id) return { error: 'no id found' };

    try {
      // 🔒 Cache check first
      if(setIsLoading) setIsLoading(true)
      const media = await db.media.get(id);

      if (media) return {media,error: null};

      // 🛰️ Fetch from API if not cached
      const response = await apiFetch<Media>(`/v1/media/public/${id}`, { method: 'GET' });

      if (!response || (response as any).error) {
        return { error: '404 not found' ,media:null};
      }
      return {media: response,error: null};
    } catch {
      return { error :'something went wrong',media:null};
    }
    finally{
        if(setIsLoading) setIsLoading(false)
    }
  }
  // Cache media manually if needed
  async cacheMedia(media: Media) {
    try {
      const id = await db.media.add(media);
      return { id };
    } catch (error) {
      if ((error as any)?.name === 'ConstraintError') {
        return { error: 'Already exists' };
      } else {
        return { error };
      }
    }
  }
  async deleteCacheById() {
  const id = this.id;
  if (!id) return { error: 'No ID provided in instance' };

  try {
    const existing = await db.media.get(id);
    if (!existing) return { error: 'Not found in cache' };

    await db.media.delete(id);
    return { success: true, deleted: existing };
  } catch (error) {
    return { error };
  }
        }
 async TogglePrivacy(){
      const id = this.id;
      const media = await this.getMedia()
  if (!id) return { error: 'No ID provided in instance' };
  try {
    const response =  await apiFetch<Media>('/v1/media/privacy/'+id,
    {
        method:'PATCH',
        body: {
             isPrivate: !media.media?.is_private
        }

    });
    await db.media.update(id, response)
    return  !media.media?.is_private
  } catch {
     toast.error("error changing privacy")
  }

  }
  async DeleteMedia(){
      const id = this.id;
      const media = await this.getMedia()
  if (!id ||!media) return { error: 'No ID provided in instance' };
      await this.deleteCacheById()
  try {
    toast.loading("delete media",{id})
    await apiFetch('/v1/media/delete/'+id,
    {
        method:'DELETE',
        body: {
            public_id: media.media?.public_id
        }

    });
    


    return  true
  } catch (error) {
      console.log(error)
     toast.error("error deleting media");
     return false
  }
  finally{
        toast.dismiss(id)
  }

  }

}
