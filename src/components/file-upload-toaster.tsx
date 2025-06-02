/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUploadStore } from "@/stores/upload-store"
import { UploadToast } from "./upload-toast"
import { MobileToastBanner } from "./mobile-toast-banner"
import UseUploadFile from "@/hooks/use-upload-file"
import useDashboard from "@/hooks/use-dashboard"
import useSocket from "@/hooks/use-socket"

export function FileUploadToaster() {
  const {
    tasks,
    failedTasks,
    completedTasks,
    updateTaskProgress,
    moveToCompleted,
    moveToFailed,
    removeTask,
    retryTask,
    cancelTask,
    parent,
    clearParent
  } = useUploadStore()

  const [isMobile, setIsMobile] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const isUploading = useRef(false)
 const {EditDashboard,AddFile} = useDashboard();
 const socket = useSocket()
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Auto-remove completed tasks after 10 seconds
  useEffect(() => {
    completedTasks.forEach((task) => {
      const timer = setTimeout(() => {
        removeTask(task.id, "completed")
      }, 10000)

      return () => clearTimeout(timer)
    })
  }, [completedTasks, removeTask])

  // Queue system - process one file at a time
  useEffect(() => {
    const processNextTask = async () => {
      // If already uploading or no tasks, return
      if (isUploading.current || tasks.length === 0) return

      // Get the first task that hasn't started
      const nextTask = tasks.find((task) => task.progress === 0)
      if (!nextTask) return

      // Mark as uploading
      isUploading.current = true

      try {
        const result = await UseUploadFile({
          file: nextTask.file,
          onProgress: (progress) => updateTaskProgress(nextTask.id, progress),
          SetIsLoading: () => {},
          controller: nextTask.abortController,
          parent
        })

        if (result?.data) {
          EditDashboard((data)=>{
            if(!data)return data
            else{
                
               return{
                ...data,
                storage: data.storage+(result.data.size/1000),
                files_this_week:data.files_this_week++
               }
            }
          });
          AddFile(result.data);
          moveToCompleted(nextTask.id, result.data);
          if(socket.current){
            try {
              socket.current.emit(`upload`,result.data);
            } catch (error) {
              console.log(error);
              return
            }
          }
      
        } else if (result?.error) {
          moveToFailed(nextTask.id, result.error)
        }

      } catch (error: any) {
        if (!nextTask.abortController.signal.aborted) {
          const errorMessage = error?.response?.data?.message || error?.message || "Upload failed"
          moveToFailed(nextTask.id, errorMessage)
        }
      } finally {
        // Mark as not uploading
        isUploading.current = false
        clearParent()
      }
    }

    processNextTask()
  }, [tasks, updateTaskProgress, moveToCompleted, moveToFailed])

  const allTasks = [...tasks, ...failedTasks, ...completedTasks].sort((a, b) => b.createdAt - a.createdAt)

  const currentTask = tasks[0] || null
  const totalActiveTasks = tasks.length + failedTasks.length

  const handleRetry = (taskId: string) => {
    retryTask(taskId)
  }

  const handleCancel = (taskId: string) => {
    cancelTask(taskId)
  }

  const handleRemove = (taskId: string, section: "tasks" | "failed" | "completed") => {
    removeTask(taskId, section)
  }

  if (isMobile) {
    return (
      <>
        <AnimatePresence>
          {(currentTask || totalActiveTasks > 0) && (
            <MobileToastBanner
              currentTask={currentTask}
              totalTasks={totalActiveTasks}
              onExpand={() => setIsExpanded(!isExpanded)}
              isExpanded={isExpanded}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-16 left-0 right-0 bottom-0 z-40 bg-background/95 backdrop-blur-sm overflow-y-auto"
            >
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Upload Tasks</h3>

                {allTasks.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No upload tasks</p>
                  </div>
                )}

                <AnimatePresence mode="popLayout">
                  {allTasks.map((task) => (
                    <UploadToast
                      key={task.id}
                      task={task}
                      onCancel={() => handleCancel(task.id)}
                      onRetry={task.status === "failed" ? () => handleRetry(task.id) : undefined}
                      onRemove={
                        task.status !== "uploading"
                          ? () => handleRemove(task.id, task.status === "failed" ? "failed" : "completed")
                          : undefined
                      }
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-h-96 overflow-hidden">
      <div className="space-y-2 max-h-full overflow-y-auto">

        <AnimatePresence mode="popLayout">
          {allTasks.map((task) => (
            <UploadToast
              key={task.id}
              task={task}
              onCancel={() => handleCancel(task.id)}
              onRetry={task.status === "failed" ? () => handleRetry(task.id) : undefined}
              onRemove={
                task.status !== "uploading"
                  ? () => handleRemove(task.id, task.status === "failed" ? "failed" : "completed")
                  : undefined
              }
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
