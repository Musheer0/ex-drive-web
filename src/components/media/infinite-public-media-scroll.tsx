"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ImageIcon, FileText, File, Folder } from "lucide-react"
import { apiFetch } from "@/lib/api-fetch"
import { Media } from "@/lib/type"



function getFileIcon(type: string) {
  if (type.startsWith("image/")) {
    return <ImageIcon className="h-5 w-5 text-blue-500" />
  }
  if (type === "application/pdf") {
    return <FileText className="h-5 w-5 text-red-500" />
  }
  if (type.startsWith("video/")) {
    return <File className="h-5 w-5 text-purple-500" />
  }
  return <File className="h-5 w-5 text-muted-foreground" />
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function InfinitePublicMedia() {
  const [files, setFiles] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const GetFirstPage = async () => {
    if (files.length !== 0) return
    setLoading(true)
    try {
      const response = await apiFetch<{ data: Media[]; cursor: string | null }>("/v1/pages/public", {
      })
      if (response.data) {
        setFiles(response.data)
        setCursor(response.cursor)
        setHasMore(response.cursor !== null)
      }
    } catch (err) {
      console.log(err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const LoadNextPage = async () => {
    if (!cursor || loadingMore) return
    setLoadingMore(true)
    try {
      const response = await apiFetch<{ data: Media[]; cursor: string | null }>(
        `/v1/pages/media${cursor ? `?cursor=${cursor}` : ""}`,
        { method: "POST" },
      )
      if (response.data) {
        console.log(response)
        setFiles((prev) => [...prev, ...response.data])
        setCursor(response.cursor)
        setHasMore(response.cursor !== null)
      }
    } catch (err) {
      console.log(err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoadingMore(false)
    }
  }

  const loadMore = useCallback(() => {
    if (cursor && hasMore && !loadingMore) {
      LoadNextPage()
    }
  }, [cursor, hasMore, loadingMore])

  useEffect(() => {
    GetFirstPage()
  }, [])

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore()
        }
      },
      { threshold: 0.1 },
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loadingMore, loadMore])

  const handleFileClick = (fileId: string) => {
    router.push(`/media/${fileId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 rounded" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-20 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Error loading files</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Public File Browser</h1>
          <p className="text-muted-foreground">
            {files.length} {files.length === 1 ? "file" : "files"} found
          </p>
        </div>

        {files.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No files found</h2>
            <p className="text-muted-foreground">Upload some files to get started.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => (
                <Card
                  key={file.id}
                  className="hover:shadow-md transition-shadow cursor-pointer hover:bg-accent/50"
                  onClick={() => handleFileClick(file.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate mb-1">{file.name}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{formatFileSize(file.size)}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(file.created_at!)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Loading more indicator */}
            {loadingMore && (
              <div className="flex justify-center py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Skeleton className="h-5 w-5 rounded" />
                          <div className="flex-1 min-w-0">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-3 w-20 mb-1" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Intersection observer target */}
            <div ref={loadMoreRef} className="h-4" />

            {/* End of results indicator */}
            {!hasMore && files.length > 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You&apos;ve reached the end of the files.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
