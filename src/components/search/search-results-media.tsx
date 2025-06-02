/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import UseSearch from '@/hooks/use-search'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { File, FileImage, FileCode, ExternalLink} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useRef, type KeyboardEvent } from "react"
import SearchResultsLoading from './search-result-loader'
import NoFilesFound from './no-results'
import { useSearchContext } from '../context/search-bar-context'

export default function SearchResults() {
  const {results:searchResults,isLoading }= UseSearch()
  const router = useRouter();
  const {query} = useSearchContext()
  const [_, setFocusedIndex] = useState<number | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const formatSize = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2) + " MB"

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FileImage className="w-4 h-4" aria-hidden="true" />
    if (type.includes("svg")) return <FileCode className="w-4 h-4" aria-hidden="true" />
    return <File className="w-4 h-4" aria-hidden="true" />
  }

  const getFileTypeLabel = (type: string) => {
    const label =
      type === "image/vnd.microsoft.icon"
        ? "ICO"
        : type === "image/svg+xml"
        ? "SVG"
        : type.split("/")[1]?.toUpperCase() || "FILE"
    return label.length > 10 ? `${label.substring(0, 7)}...` : label
  }

  const getGradientByIndex = (index: number) => {
    const gradients = [
      "from-blue-50/50 to-indigo-100/50 dark:from-blue-950/30 dark:to-indigo-900/30",
      "from-purple-50/50 to-pink-100/50 dark:from-purple-950/30 dark:to-pink-900/30",
      "from-green-50/50 to-emerald-100/50 dark:from-green-950/30 dark:to-emerald-900/30",
      "from-orange-50/50 to-red-100/50 dark:from-orange-950/30 dark:to-red-900/30",
      "from-cyan-50/50 to-blue-100/50 dark:from-cyan-950/30 dark:to-blue-900/30",
      "from-yellow-50/50 to-orange-100/50 dark:from-yellow-950/30 dark:to-orange-900/30",
      "from-rose-50/50 to-pink-100/50 dark:from-rose-950/30 dark:to-pink-900/30",
      "from-teal-50/50 to-cyan-100/50 dark:from-teal-950/30 dark:to-cyan-900/30",
    ]
    return gradients[index % gradients.length]
  }

  const getBadgeGradientByIndex = (index: number) => {
    const gradients = [
      "from-blue-100 to-indigo-200 dark:from-blue-900/60 dark:to-indigo-800/60",
      "from-purple-100 to-pink-200 dark:from-purple-900/60 dark:to-pink-800/60",
      "from-green-100 to-emerald-200 dark:from-green-900/60 dark:to-emerald-800/60",
      "from-orange-100 to-red-200 dark:from-orange-900/60 dark:to-red-800/60",
      "from-cyan-100 to-blue-200 dark:from-cyan-900/60 dark:to-blue-800/60",
      "from-yellow-100 to-orange-200 dark:from-yellow-900/60 dark:to-orange-800/60",
      "from-rose-100 to-pink-200 dark:from-rose-900/60 dark:to-pink-800/60",
      "from-teal-100 to-cyan-200 dark:from-teal-900/60 dark:to-cyan-800/60",
    ]
    return gradients[index % gradients.length]
  }

  const handleCardClick = (Id: string) => {
    router.push(`/media/${Id}`)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number, publicId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleCardClick(publicId)
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      const nextIndex = Math.min(index + 1, searchResults.length - 1)
      setFocusedIndex(nextIndex)
      cardRefs.current[nextIndex]?.focus()
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      const prevIndex = Math.max(index - 1, 0)
      setFocusedIndex(prevIndex)
      cardRefs.current[prevIndex]?.focus()
    }
  }
if(!query)
    return (
        <div className='text-center'>
            Start searching
        </div>
    )
if(searchResults.length===0 && !isLoading && query)
    return <NoFilesFound searchQuery={query}/>
if(!isLoading)
  return (
    <div className="w-full  mx-auto p-4 sm:p-6 bg-background">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Search Results</h2>
        <p className="text-sm text-muted-foreground">
          Found {searchResults.length} {searchResults.length === 1 ? "file" : "files"}
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Search results">
        {searchResults.map((file, index) => (
          <Card
            key={file.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] bg-gradient-to-br ${getGradientByIndex(index)} border border-border/50 backdrop-blur-sm`}
            onClick={() => handleCardClick(file.id)}
            onKeyDown={(e) => handleKeyDown(e, index, file.id)}
            tabIndex={0}
            role="listitem"
            aria-label={`${file.name}, ${getFileTypeLabel(file.type)} file, ${formatSize(file.size)}`}
          >
            <CardContent className="p-3 sm:p-4 relative bg-background/80 rounded-lg">
              <div className="absolute top-2 right-2 opacity-60 group-hover:opacity-100">
                <ExternalLink className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                {getFileIcon(file.type)}
                <Badge
                  variant="secondary"
                  className={`text-xs bg-gradient-to-r ${getBadgeGradientByIndex(index)} text-foreground border border-border/50 px-2 py-0.5`}
                >
                  {getFileTypeLabel(file.type)}
                </Badge>
           
              </div>

              <h3 className="font-medium text-sm truncate" title={file.name}>
                {file.name}
              </h3>

              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground/80">Size:</span>
                  <span>{formatSize(file.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground/80">Updated:</span>
                  <span>{formatDate(file.updated_at!)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
else 
   return<SearchResultsLoading/>
}
