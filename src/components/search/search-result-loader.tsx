"use client"

import { Card, CardContent } from "@/components/ui/card"

interface SearchResultsLoadingProps {
  count?: number
}

export default function SearchResultsLoading({ count = 6 }: SearchResultsLoadingProps) {
  const getGradientByIndex = (index: number) => {
    const gradients = [
      "from-blue-50/30 to-indigo-100/30 dark:from-blue-950/20 dark:to-indigo-900/20",
      "from-purple-50/30 to-pink-100/30 dark:from-purple-950/20 dark:to-pink-900/20",
      "from-green-50/30 to-emerald-100/30 dark:from-green-950/20 dark:to-emerald-900/20",
      "from-orange-50/30 to-red-100/30 dark:from-orange-950/20 dark:to-red-900/20",
      "from-cyan-50/30 to-blue-100/30 dark:from-cyan-950/20 dark:to-blue-900/20",
      "from-yellow-50/30 to-orange-100/30 dark:from-yellow-950/20 dark:to-orange-900/20",
      "from-rose-50/30 to-pink-100/30 dark:from-rose-950/20 dark:to-pink-900/20",
      "from-teal-50/30 to-cyan-100/30 dark:from-teal-950/20 dark:to-cyan-900/20",
    ]
    return gradients[index % gradients.length]
  }

  return (
    <div className="w-full  mx-auto p-4 sm:p-6 bg-background">
      <div className="mb-4 sm:mb-6">
        <div className="h-6 sm:h-8 bg-muted rounded-md w-48 animate-pulse mb-2"></div>
        <div className="h-4 bg-muted rounded-md w-32 animate-pulse"></div>
      </div>

      <div
        className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        role="status"
        aria-label="Loading search results"
      >
        {Array.from({ length: count }).map((_, index) => (
          <Card
            key={index}
            className={`bg-gradient-to-br ${getGradientByIndex(index)} border border-border/30 backdrop-blur-sm overflow-hidden relative`}
          >
            <CardContent className="p-3 sm:p-4 bg-background/60 backdrop-blur-sm rounded-lg">
              {/* Shimmer overlay */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

              {/* Top section with icon and badge */}
              <div className="flex items-start justify-between mb-2 sm:mb-3 pr-5 sm:pr-6">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-4 h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-5 bg-muted rounded-full w-12 animate-pulse"></div>
                </div>
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-muted rounded animate-pulse"></div>
              </div>

              {/* File name */}
              <div className="mb-2 sm:mb-3">
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
              </div>

              {/* File details */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-muted rounded w-8 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-12 animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-muted rounded w-12 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <span className="sr-only">Loading search results...</span>
    </div>
  )
}
