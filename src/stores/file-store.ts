import { Media } from '@/lib/type'
import { create } from 'zustand'

interface Store {
  files: Media[]
  cursor: string | null

  AddFiles: (data: Media[]) => void
  AddFile: (file: Media) => void
  DeleteFile: (id: string) => void
  SetCursor: (cursor: string | null) => void
  GetFIle:(id:string,cb:(data:Media)=>void)=>void,
}

export const FileStore = create<Store>((set,get) => ({
  files: [],
  cursor: null,

  AddFiles: (data) =>
    set((state) => {
      const existingIds = new Set(state.files.map((f) => f.id))
      const newFiles = data.filter((file) => !existingIds.has(file.id))
      console.log(newFiles,'newwwww')
      return {
        files: [...state.files, ...newFiles],
      }
    }),

  AddFile: (file) =>
    set((state) => {
      const exists = state.files.some((f) => f.id === file.id)
      if (exists) return state // No changes if duplicate
      return {
        files: [file, ...state.files],
      }
    }),

  DeleteFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    })),
    GetFIle:(id:string,cb:(data:Media)=>void)=>{
      const file = get().files.filter((f)=>f.id===id)[0];
      if(!file) return;
      get().DeleteFile(id);
      cb(file)
    },
  SetCursor: (cursor) => set({ cursor }),
}))
