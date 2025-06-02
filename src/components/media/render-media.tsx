/* eslint-disable @typescript-eslint/no-unused-expressions */

"use client"
import { useMedia } from "@/hooks/use-media"
import { useUser } from "@/hooks/use-user"
import type { Media } from "@/lib/type"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Download, Trash2, File,Lock, Calendar, HardDrive, EyeOff, CopyIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { formatBytes } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { BackButton } from "../back-button"
import useSocket from "@/hooks/use-socket"
import { db } from "@/DB/dexi"



interface RenderMediaProps {
    id: string,
    isPublic?:boolean

}

const RenderMedia = ({ id,isPublic}: RenderMediaProps) => {
    const media = new useMedia(id)
    const baseUrl = process.env.NEXT_PUBLIC_API
  const [file, setFile] = useState<Media | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser()
  const router = useRouter()
  const [error, setError] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [disabledPrivary, setDisablePrivacy] = useState(false);
  const  socket = useSocket();
  const copy_share_url = async()=>{
     await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE}/media/public/${file?.id}`);
     toast.success("copied to clipboard")
  }
  const handleGetMedia = async () => {
    const response = isPublic? await media.getPublicMedia(setIsLoading):await media.getMedia(setIsLoading)
    console.log(error)
    if (response.error) setError(response.error)
    else {
      setFile(response.media!)
    }
  }
 const HandleTogglePrivacy = async()=>{
    setDisablePrivacy(true)
    if(file?.user_id!==user?.id) return
   await media.TogglePrivacy();
    if(file ){
        setFile({
        ...file,
        is_private: !file.is_private
    });
    if(socket.current){
      socket.current.emit("toggle",{id:file.id,private:!file.is_private})
    }
    setDisablePrivacy(false)
    }
 }
 const HandleRealtimeTogglePrivacy =async (data:boolean)=>{
   await db.media.delete(id)
  if(file?.user_id!==user?.id) if(!data) window.location.reload()
  setFile({
      ...file!,
      is_private:data
    });
 }

  useEffect(()=>{
    console.log(!!socket.current)
   if(!socket.current) return;
   socket.current?.on(`media-${id}`,HandleRealtimeTogglePrivacy)
   return ()=>{
    socket.current?.off(`media-${id}`,HandleRealtimeTogglePrivacy)
   }
  },[socket.current])
  useEffect(() => {
    handleGetMedia()
  }, [id]);
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // Call delete method and clear cache
      const isdeleted =await media.DeleteMedia();
    if(isdeleted){
               if(socket.current){
            try {
              socket.current.emit(`upload`,file!);
            } catch (error) {
              console.log(error);
              return
            }
          }
        setFile(null);
        router.push('/dashboard')
    }
      setShowDeleteModal(false)
      
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("somthing went wrong")
    } finally {
      setIsDeleting(false)
    }
  }

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || ""
  }

  const isVideo = (filename: string) => {
    const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"]
    return videoExtensions.includes(getFileExtension(filename))
  }

  const isImage = (filename: string) => {
    const imageExtensions = [
  "webp",   // lean, modern, supported almost everywhere now
  "avif",   // ultra-compressed, great for perf, needs fallback
  "png",    // transparent, clean, reliable
  "jpeg",   // legacy but still valid, good quality
  "jpg",    // same as jpeg, just vibes different
  "svg",    // vector graphics, scales like a boss
  "gif",    // for basic animations, memes, fallback stuff
  "ico"     // mostly for favicons, but browser-safe
];
    return imageExtensions.includes(getFileExtension(filename))
  }

  const getPreviewUrl = (file: Media) => {
   if(isPublic){
    console.log(`${baseUrl}/v1/download/${file.user_id}/${file.public_id}`);
    return `${baseUrl}/v1/download/${file.user_id}/${file.public_id}`
   }
    if (isVideo(file.name)) {
      return `${baseUrl}/v1/media/${file?.user_id!==user?.id ? 'download':'display'}/${file.public_id.replace(/\.[^/.]+$/, "")}.mp4`
    }
    if(isImage(file.name)){
              return `${baseUrl}/v1/media/${file?.user_id!==user?.id ? 'download':'display'}/${file.public_id.replace(/\.[^/.]+$/, "")}.${file.name.split('.')[1]}`
    }
    return `${baseUrl}/v1/media/${file?.user_id!==user?.id ? 'download':'display'}/${file.public_id}`
  }

  const getDownloadUrl =async () => {

    if(!file){
        return }
    const atag = document.createElement("a");
    atag.href =`${baseUrl}/v1/download/${file.user_id}/${file.public_id}`
    atag.download;
    atag.click();
  }

  // Permission checks
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center p-8"
      >
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <EyeOff className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">Please sign in to view this media</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center p-8"
      >
        <Card className="w-full max-w-md border-destructive">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <EyeOff className="h-6 w-6 text-destructive" />
            </div>
            <p className="text-center text-destructive">{error}</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center p-8">
        <Card className="w-full ">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-48 bg-muted rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (!file) return null

  // Check if user can view private file
  if (file.is_private && user.id !== file.user_id) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center p-8"
      >
        <Card className="w-full  border-destructive">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-destructive" />
            </div>
            <p className="text-center text-destructive">
              This file is private and you don&apos;t have permission to view it
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const canDelete =user.id === file.user_id

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full mx-auto p-4"
      >
        <Card className="overflow-hidden border-0 shadow-lg bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
   {file?.user_id===user?.id
   &&
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="bg-primary/10 text-primary">{user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">Uploaded by {user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
                 }
              <div className="flex items-center gap-2">
                 <BackButton/>
                      {file?.user_id===user?.id &&
                       <button 
                       onClick={HandleTogglePrivacy}
                       disabled={disabledPrivary}
                       >
                         <Badge  variant={file.is_private ? "secondary": "default"} className="gap-1">
                    <Lock className="h-3 w-3" />
             {file.is_private ? "private": "public"} 
                  </Badge>
                       </button>
                      }
                {canDelete && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="destructive" size="sm" onClick={() => setShowDeleteModal(true)} className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Preview Section */}
            <motion.div
              className="relative rounded-lg overflow-hidden bg-muted/50"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {isImage(file.name) ? (
                <div className="relative flex items-center justify-center aspect-video">
                  <img
                    src={getPreviewUrl(file) || "/placeholder.svg"}
                    alt={file.name}
                    className="object-contain"
                    crossOrigin="use-credentials"
                  />
                </div>
              ) : isVideo(file.name) ? (
                <video controlsList="nodownload" controls className="w-full aspect-video" crossOrigin="use-credentials">
                  <source src={getPreviewUrl(file)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                  >
                    <File className="h-8 w-8 text-primary" />
                  </motion.div>
                  <p className="text-muted-foreground mb-4">No preview available for this file type</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                    onClick={getDownloadUrl}
                    variant="outline" className="gap-2">
                       <Download className="h-4 w-4" />
                        Download File
                    </Button>
                  </motion.div>
                </div>
              )}
            </motion.div>

            <Separator />

            {/* File Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2 truncate">{file.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <HardDrive className="h-4 w-4" />
                    <span>{formatBytes(file.size)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Updated:</span>
                    <span className="text-foreground">{new Date(file.updated_at!).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline">{file.type}</Badge>
                  </div>
                {!file.is_private &&
                   <button 
                       onClick={copy_share_url}
                       disabled={disabledPrivary}
                       >
                         <Badge  variant={file.is_private ? "secondary": "default"} className="gap-1">
                    <CopyIcon className="h-3 w-3" />
            copy public url
                  </Badge>
                       </button>
                }
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                
                  {(isImage(file.name) || isVideo(file.name)) && (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                      onClick={getDownloadUrl}
                      variant="outline" className="w-full gap-2">
                     <>
                       <Download className="h-4 w-4" />
                          Download
                     </>
                      </Button>
                    </motion.div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium">ID:</span> {file.id}
                  </p>
                  <p>
                    <span className="font-medium">Public ID:</span> {file.public_id}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  Delete File
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete &quot;{file.name}&quot;? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="gap-2">
                  {isDeleting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}

export default RenderMedia
