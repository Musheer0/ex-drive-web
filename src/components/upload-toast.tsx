"use client"

import { motion } from "framer-motion"
import { X, RotateCcw, CheckCircle, AlertCircle, Upload, ExternalLink } from "lucide-react"
import type { UploadTask } from "@/stores/upload-store"

interface UploadToastProps {
  task: UploadTask
  onCancel: () => void
  onRetry?: () => void
  onRemove?: () => void
}

export function UploadToast({ task, onCancel, onRetry, onRemove }: UploadToastProps) {
  const getStatusIcon = () => {
    switch (task.status) {
      case "uploading":
        return <Upload className="h-4 w-4 text-blue-500 animate-pulse" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = () => {
    switch (task.status) {
      case "uploading":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
      case "completed":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
      case "failed":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
    }
  }

  const truncateFileName = (name: string, maxLength = 20) => {
    if (name.length <= maxLength) return name
    const extension = name.split(".").pop()
    const nameWithoutExt = name.substring(0, name.lastIndexOf("."))
    const truncated = nameWithoutExt.substring(0, maxLength - extension!.length - 4)
    return `${truncated}...${extension}`
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-lg border p-3 shadow-sm ${getStatusColor()}`}
    >
      <div className="flex items-center gap-3">
        {getStatusIcon()}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{truncateFileName(task.file.name)}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(task.file.size)}</p>
            </div>

            <div className="flex items-center gap-1">
              {task.status === "completed" && (
                <a

                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-background/50 rounded transition-colors"
                  title="View uploaded file"
                >
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              )}
              {task.status === "failed" && onRetry && (
                <button
                  onClick={onRetry}
                  className="p-1 hover:bg-background/50 rounded transition-colors"
                  title="Retry upload"
                >
                  <RotateCcw className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
              <button
                onClick={task.status === "uploading" ? onCancel : onRemove}
                className="p-1 hover:bg-background/50 rounded transition-colors"
                title={task.status === "uploading" ? "Cancel upload" : "Remove"}
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          </div>

          {task.status === "uploading" && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Uploading...</span>
                <span>{Math.round(task.progress)}%</span>
              </div>
              <div className="w-full bg-background/50 rounded-full h-1.5">
                <motion.div
                  className="bg-blue-500 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${task.progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {task.status === "completed" && (
            <div className="mt-1">
              <p className="text-xs text-green-600 dark:text-green-400">Upload completed successfully</p>
            </div>
          )}

          {task.status === "failed" && (
            <div className="mt-1">
              <p className="text-xs text-red-600 dark:text-red-400">Upload failed</p>
              <p className="text-xs text-muted-foreground">Click retry to try again</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
