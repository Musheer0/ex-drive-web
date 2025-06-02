/**
 * FileUpload Component
 *
 * A comprehensive file upload component with the following features:
 * - Multiple file upload with 500MB limit
 * - File preview cards (images/videos show preview, others show file icon)
 * - Drag and drop functionality
 * - Copy paste from clipboard
 * - Edit file name (not extension) before upload
 * - Remove files functionality
 * - Upload state management with backdrop
 * - Blocked file extensions with toast notifications
 *
 * The component uses:
 * - shadcn UI components for consistent styling
 * - Framer Motion for animations
 * - React hooks for state management
 * - Next.js router for navigation after upload
 */

"use client"

import type React from "react"
import { useSearchParams } from 'next/navigation';

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Upload, X, File, ImageIcon, Video, FileText, Music, Archive,Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUploadStore } from "@/stores/upload-store"

/**
 * List of blocked file extensions that are not allowed to be uploaded
 * These are typically executable files or compressed archives that could contain malicious code
 */
const cloudinaryBlockedExtensions = [
  "action",
  "apk",
  "app",
  "bat",
  "bin",
  "cmd",
  "com",
  "command",
  "cpl",
  "csh",
  "exe",
  "gadget",
  "inf1",
  "ins",
  "inx",
  "ipa",
  "isu",
  "job",
  "jse",
  "ksh",
  "lnk",
  "msc",
  "msi",
  "msp",
  "mst",
  "osx",
  "out",
  "paf",
  "pif",
  "prg",
  "ps1",
  "reg",
  "rgs",
  "run",
  "sct",
  "shb",
  "shs",
  "u3p",
  "vb",
  "vbe",
  "vbs",
  "vbscript",
  "workflow",
  "ws",
  "wsf",
  "zip",
  "rar",
  "tar.gz",
]

/**
 * Extended File interface that includes additional properties for UI management
 * - id: Unique identifier for each file
 * - preview: Data URL for image/video previews
 * - customName: User-editable name for the file (without extension)
 */
interface FileWithPreview extends File {
  id: string
  preview?: string
  customName?: string
}

// Maximum file size limit (500MB)
const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB

export default function FileUpload() {
  // State for managing the list of files to be uploaded
  const [files, setFiles] = useState<FileWithPreview[]>([])

//add task utility from upload store to add files to queu
const {addTask,tasks,setParent } = useUploadStore()


  // State for tracking drag over status for visual feedback
  const [isDragOver, setIsDragOver] = useState(false)

  // State for tracking upload process - disables interactions during upload
  const [isUploading] = useState(tasks.length>9)



  // Reference to the hidden file input element
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Next.js router for navigation after upload
  const router = useRouter()

  /**
   * Determines the appropriate icon to display based on file type
   * @param file - The file object to analyze
   * @returns - The Lucide icon component to display
   */
  const getFileIcon = (file: File) => {
    const extension = file.name?.split(".").pop()?.toLowerCase()

    // Return appropriate icon based on file extension
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")) {
      return ImageIcon
    }
    if (["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(extension || "")) {
      return Video
    }
    if (["mp3", "wav", "flac", "aac", "ogg"].includes(extension || "")) {
      return Music
    }
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension || "")) {
      return FileText
    }
    if (["zip", "rar", "7z", "tar", "gz"].includes(extension || "")) {
      return Archive
    }
    // Default file icon for other file types
    return File
  }

  /**
   * Validates if a file is allowed to be uploaded based on its extension
   * @param file - The file to validate
   * @returns boolean - Whether the file is valid
   */
  const isValidFile = (file: File): boolean => {
    const extension = file.name.split(".").pop()?.toLowerCase()
    return !cloudinaryBlockedExtensions.includes(extension || "")
  }

  /**
   * Creates a preview for image and video files
   * For images: Creates a data URL
   * For videos: Captures a frame as a thumbnail
   *
   * @param file - The file to create a preview for
   * @returns Promise<string | undefined> - Data URL for the preview or undefined
   */
  const createFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      // Handle image files
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      }
      // Handle video files - create a thumbnail from a video frame
      else if (file.type.startsWith("video/")) {
        const video = document.createElement("video")
        video.preload = "metadata"
        video.onloadedmetadata = () => {
          // Jump to 1 second to avoid black frames at the beginning
          video.currentTime = 1
        }
        video.onseeked = () => {
          // Create a canvas and draw the current video frame to it
          const canvas = document.createElement("canvas")
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext("2d")
          ctx?.drawImage(video, 0, 0)
          resolve(canvas.toDataURL())
        }
        video.src = URL.createObjectURL(file)
      } else {
        // For other file types, no preview is created
        resolve(undefined)
      }
    })
  }

  /**
   * Processes a list of files:
   * - Validates file extensions
   * - Checks file size limits
   * - Creates previews for images and videos
   * - Adds files to the state
   *
   * @param fileList - List of files to process
   */
  const processFiles = async (fileList: FileList | File[]) => {
    // Prevent processing if already uploading
    if (isUploading) return

    const newFiles: FileWithPreview[] = []

    for (const file of Array.from(fileList)) {
      // Check if file extension is allowed
      if (!isValidFile(file)) {
        toast.error(`File "${file.name}" has a blocked extension and cannot be uploaded.`)
        continue
      }

      // Check if file size is within limits
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File "${file.name}" exceeds the 500MB limit.`)
        continue
      }

      // Create preview and prepare file object with additional properties
      const preview = await createFilePreview(file)
      const fileWithPreview: FileWithPreview = Object.assign(file, {
        id: Math.random().toString(36).substr(2, 9), // Generate unique ID
        preview,
        customName: file.name.split(".").slice(0, -1).join("."), // Extract name without extension
      })

      newFiles.push(fileWithPreview)
    }

    // Add new files to existing files
    setFiles((prev) => [...prev, ...newFiles])
  }

  /**
   * Handles file selection from the file input
   * @param e - Change event from file input
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files)
    }
  }

  /**
   * Handles drag over event for visual feedback
   * Uses useCallback to optimize performance for drag events
   */
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (isUploading) return
      e.preventDefault()
      setIsDragOver(true)
    },
    [isUploading],
  )

  /**
   * Handles drag leave event to reset visual feedback
   */
  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      if (isUploading) return
      e.preventDefault()
      setIsDragOver(false)
    },
    [isUploading],
  )

  /**
   * Handles file drop event
   * Processes files that were dropped into the drop zone
   */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (isUploading) return
      e.preventDefault()
      setIsDragOver(false)

      if (e.dataTransfer.files) {
        processFiles(e.dataTransfer.files)
      }
    },
    [isUploading],
  )

  /**
   * Handles paste event for clipboard files
   * Allows users to paste files from clipboard (Ctrl+V)
   */
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (isUploading) return
      if (e.clipboardData?.files) {
        processFiles(e.clipboardData.files)
      }
    },
    [isUploading],
  )

  /**
   * Removes a file from the list by its ID
   * @param id - ID of the file to remove
   */
  const removeFile = (id: string) => {
    if (isUploading) return
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  /**
   * Starts the file name editing process
   * @param file - The file whose name is being edited
   */

  /**
   * Handles the upload process
   * - Sets uploading state to show backdrop
   * - Logs files to console (for demo purposes)
   * - Navigates to dashboard after upload
   */
  const handleUpload = async () => {
    if (isUploading) return
    if (files.length === 0) {
      toast.error("Please select files to upload.")
      return
    }
    setParent(parentid)
    addTask(files)
    router.push("/dashboard")
  }

  /**
   * Formats file size in human-readable format (Bytes, KB, MB, GB)
   * @param bytes - File size in bytes
   * @returns Formatted file size string
   */
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Add paste event listener to document for clipboard paste support
  useState(() => {
    document.addEventListener("paste", handlePaste)
    return () => document.removeEventListener("paste", handlePaste)
  })
  const searchParams = useSearchParams();
  const parentid = searchParams.get('parent'); // ?userId=69
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Upload backdrop - shown during upload process */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background border rounded-lg p-8 text-center space-y-4"
            >
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-lg font-medium">Please wait until your files have been uploaded</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop zone - area for drag and drop file upload */}
      <motion.div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"}
          ${isUploading ? "pointer-events-none opacity-50" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Drop files here or click to upload</h3>
        <p className="text-muted-foreground mb-4">
          Support for multiple files. Max 500MB per file.
          <br />
          You can also paste files from clipboard (Ctrl+V)
        </p>
        <Button onClick={() => !isUploading && fileInputRef.current?.click()} disabled={isUploading} variant="outline">
          Select Files
        </Button>
        {/* Hidden file input - triggered by the button above */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </motion.div>

      {/* File list - only shown when files are selected */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Selected Files ({files.length})</h3>
              {/* Display total size of all files */}
              <Badge variant="secondary">
                Total: {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}
              </Badge>
            </div>

            {/* Grid of file cards - responsive layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {files.map((file) => {
                  const FileIcon = getFileIcon(file)
                  const extension = file.name.split(".").pop()

                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                    >
                      <Card className="overflow-hidden">
                        <CardContent className="p-4">
                          {/* File preview area - shows image/video preview or icon */}
                          <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                            {file.preview ? (
                              file.type.startsWith("image/") ? (
                                <img
                                  src={file.preview || "/placeholder.svg"}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src={file.preview || "/placeholder.svg"}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              )
                            ) : (
                              <FileIcon className="h-12 w-12 text-muted-foreground" />
                            )}
                          </div>

                          {/* File name editing section */}
                          <div className="space-y-2">
                               <div className="flex items-center gap-2">
                                <p className="text-sm font-medium truncate flex-1">
                                  {file.customName}.{extension}
                                </p>
                          
                              </div>

                            {/* File size and remove button */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFile(file.id)}
                                disabled={isUploading}
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Upload button - only shown when files are selected */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center pt-4">
              <Button
                onClick={handleUpload}
                disabled={isUploading || files.length === 0}
                size="lg"
                className="min-w-32 fixed bottom-[8rem] sm:bottom-5 left-1/2 -translate-x-1/2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
