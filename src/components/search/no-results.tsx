"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileX, Search, Upload, RefreshCw } from "lucide-react"

interface NoFilesFoundProps {
  searchQuery?: string
  onRetry?: () => void
  onClearSearch?: () => void
  onUpload?: () => void
  showUploadOption?: boolean
  showRetryOption?: boolean
  customMessage?: string
  customDescription?: string
}

export default function NoFilesFound({
  searchQuery,
  onRetry,
  onClearSearch,
  onUpload,
  showUploadOption = true,
  showRetryOption,
  customMessage,
  customDescription,
}: NoFilesFoundProps) {
  const hasSearchQuery = searchQuery && searchQuery.trim().length > 0

  const getMessage = () => {
    if (customMessage) return customMessage
    if (hasSearchQuery) return `No files found for "${searchQuery}"`
    return "No files found"
  }

  const getDescription = () => {
    if (customDescription) return customDescription
    if (hasSearchQuery) {
      return "We couldn't find any files matching your search criteria. Try adjusting your search terms or browse all files."
    }
    return "It looks like you don't have any files yet. Upload your first file to get started."
  }

  const getIcon = () => {
    if (hasSearchQuery) {
      return <Search className="w-16 h-16 text-muted-foreground/50" aria-hidden="true" />
    }
    return <FileX className="w-16 h-16 text-muted-foreground/50" aria-hidden="true" />
  }

  return (
    <div className="w-full  mx-auto p-4 sm:p-6 bg-background">
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Card className="w-full max-w-md border-dashed border-2 border-border/50 bg-muted/20">
          <CardContent className="p-8 sm:p-12">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-muted/50">{getIcon()}</div>
            </div>

            {/* Message */}
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">{getMessage()}</h3>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted-foreground mb-8 leading-relaxed">{getDescription()}</p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {hasSearchQuery && onClearSearch && (
                <Button
                  variant="outline"
                  onClick={onClearSearch}
                  className="flex items-center gap-2"
                  aria-label="Clear search and show all files"
                >
                  <Search className="w-4 h-4" aria-hidden="true" />
                  Clear Search
                </Button>
              )}

              {showRetryOption && onRetry && (
                <Button
                  variant="outline"
                  onClick={onRetry}
                  className="flex items-center gap-2"
                  aria-label="Retry search"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  Try Again
                </Button>
              )}

              {showUploadOption && onUpload && (
                <Button onClick={onUpload} className="flex items-center gap-2" aria-label="Upload new files">
                  <Upload className="w-4 h-4" aria-hidden="true" />
                  {hasSearchQuery ? "Upload Files" : "Upload Your First File"}
                </Button>
              )}
            </div>

            {/* Additional Help Text */}
            {hasSearchQuery && (
              <div className="mt-6 pt-6 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  <strong>Search tips:</strong> Try using different keywords, check for typos, or use broader search
                  terms.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-purple-100/20 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-green-100/20 to-cyan-100/20 dark:from-green-900/10 dark:to-cyan-900/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Screen reader content */}
      <div className="sr-only">
        {hasSearchQuery
          ? `No search results found for ${searchQuery}. You can clear your search, try again, or upload new files.`
          : "No files available. You can upload files to get started."}
      </div>
    </div>
  )
}
