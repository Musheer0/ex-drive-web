"use client"

import type React from "react"
import { useRef } from "react"
import { Upload } from "lucide-react"
import { useUploadStore } from "@/stores/upload-store"

export function FileUploadDemo() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addTask } = useUploadStore()

  // Handle file input change
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Convert FileList to array and pass directly
    addTask(Array.from(files))

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle drag and drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files

    if (files.length > 0) {
      // Convert FileList to array and pass directly
      addTask(Array.from(files))
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* File Input Button */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">File Input</h3>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Select Files
            </button>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">Drag & Drop</h3>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center text-sm text-muted-foreground hover:border-muted-foreground/50 transition-colors cursor-pointer"
          >
            Drop files here
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <h3 className="text-sm font-medium text-foreground mb-2">Usage:</h3>
        <pre className="text-xs text-muted-foreground overflow-x-auto">
          {`import { useUploadStore } from "@/stores/upload-store"

const { addTask } = useUploadStore()

// Single file
addTask(file)

// Multiple files
addTask([file1, file2, file3])

// From file input
addTask(Array.from(event.target.files))`}
        </pre>
      </div>
    </div>
  )
}
