"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  FileImage,
  FileVideo,
  Music,
  Archive,
  File,
  Calendar,
  Weight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button" // import your button component
import { FileStore } from "@/stores/file-store"
import { apiFetch } from "@/lib/api-fetch"
import { Media } from "@/lib/type"
import { useRouter } from "next/navigation"

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return FileImage
  if (type.startsWith("video/")) return FileVideo
  if (type.startsWith("audio/")) return Music
  if (type.includes("pdf")) return FileText
  if (type.includes("zip") || type.includes("archive")) return Archive
  return File
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

const InfiniteMediaScroll = () => {
  const { files, AddFiles, cursor, SetCursor } = FileStore()
  const [loading, setIsLoading] = useState(false)
  const router = useRouter()

  const OpenFile = (id: string) => {
    router.push(`/media/${id}`)
  }

  const GetFirstPage = async () => {
    if (files.length !== 0) return
    console.log('first page!!!!')
    setIsLoading(true)
    const response = await apiFetch<{ data: Media[]; cursor: string | null }>(
      "/v1/pages/media",
      { method: "POST" }
    )
    if (response.data) {
      try {
        AddFiles(response.data)
        SetCursor(response.cursor)
      } 
      catch(er){
        console.log(er)
      }
      finally {
        setIsLoading(false)
      }
    }
  }

  const LoadNextPage = async () => {
    console.log('nexxxx')
    if (!cursor) return
    setIsLoading(true)
    const response = await apiFetch<{ data: Media[]; cursor: string | null }>(
      `/v1/pages/media${cursor? `?cursor=${cursor}`:''}`,
      {
        method: "POST"
      }
    )
    if (response.data) {
      try {
        AddFiles(response.data)
        SetCursor(response.cursor)
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    GetFirstPage()
  }, [])

  return (
    <motion.div variants={itemVariants}>
      <h2 className="text-xl font-semibold text-foreground mb-4">Recent Files</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    <span className="sr-only">File type</span>
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Size</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Modified</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => {
                  const FileIcon = getFileIcon(file.type)
                  return (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/50 transition-colors duration-150 cursor-pointer focus-within:bg-muted/50"
                      tabIndex={0}
                      role="button"
                      aria-label={`Open file ${file.name}, ${formatFileSize(file.size)}, modified ${formatDate(file.updated_at || "")}`}
                      onClick={() => OpenFile(file.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          OpenFile(file.id)
                        }
                      }}
                    >
                      <td className="p-4">
                        <FileIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground truncate">{file.name.slice(0,10)}</span>
                          {file.is_private && (
                            <Badge variant="outline" className="text-xs">
                              Private
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground hidden sm:table-cell">
                        <div className="flex items-center space-x-1">
                          <Weight className="h-3 w-3" aria-hidden="true" />
                          <span>{formatFileSize(file.size)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" aria-hidden="true" />
                          <span>{formatDate(file.updated_at || "")}</span>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Load More Button */}
      {cursor && (
        <div className="mt-4 flex justify-center">
          <Button onClick={LoadNextPage} disabled={loading} variant="outline">
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </motion.div>
  )
}

export default InfiniteMediaScroll
