"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import type { UploadTask } from "@/stores/upload-store"

interface MobileToastBannerProps {
  currentTask: UploadTask | null
  totalTasks: number
  onExpand: () => void
  isExpanded: boolean
}

export function MobileToastBanner({ currentTask, totalTasks, onExpand, isExpanded }: MobileToastBannerProps) {
  if (!currentTask && totalTasks === 0) return null

  const truncateFileName = (name: string, maxLength = 15) => {
    if (name.length <= maxLength) return name
    const extension = name.split(".").pop()
    const nameWithoutExt = name.substring(0, name.lastIndexOf("."))
    const truncated = nameWithoutExt.substring(0, maxLength - extension!.length - 4)
    return `${truncated}...${extension}`
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-sm border-b shadow-sm"
    >
      <button
        onClick={onExpand}
        className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {currentTask && (
            <>
              <div className="relative">
                <div className="w-8 h-8 rounded-full border-2 border-muted flex items-center justify-center">
                  <motion.div
                    className="w-6 h-6 rounded-full bg-blue-500"
                    initial={{ scale: 0 }}
                    animate={{
                      scale: currentTask.progress / 100,
                      rotate: currentTask.status === "uploading" ? 360 : 0,
                    }}
                    transition={{
                      scale: { duration: 0.3 },
                      rotate: {
                        duration: 2,
                        repeat: currentTask.status === "uploading" ? Number.POSITIVE_INFINITY : 0,
                        ease: "linear",
                      },
                    }}
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">
                  {Math.round(currentTask.progress / 10)}
                </div>
              </div>

              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-foreground truncate">
                  {truncateFileName(currentTask.file.name)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentTask.status === "uploading" && `${currentTask.progress}% uploading`}
                  {currentTask.status === "completed" && "Completed"}
                  {currentTask.status === "failed" && "Failed"}
                  {totalTasks > 1 && ` • ${totalTasks - 1} more`}
                </p>
              </div>
            </>
          )}

          {!currentTask && totalTasks > 0 && (
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">Upload Queue</p>
              <p className="text-xs text-muted-foreground">
                {totalTasks} task{totalTasks > 1 ? "s" : ""} pending
              </p>
            </div>
          )}
        </div>

        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </button>
    </motion.div>
  )
}
