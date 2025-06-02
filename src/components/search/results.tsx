"use client"
import React from 'react'
import { motion} from "framer-motion"
import { File, Folder } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SearchResultsMedia from './search-results-media'
const Results = () => {
  return (
    <Tabs defaultValue="files"  className="w-full">
  <div className="flex w-full mb-6 border-b border-border">
    <TabsList className="h-auto p-0 bg-transparent border-0 w-full justify-start">
      <TabsTrigger
        value="files"
        className="flex items-center gap-2 bg-transparent border-0 rounded-none px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:text-custom data-[state=active]:border-b-4 data-[state=active]:border-custom data-[state=active]:shadow-none hover:bg-transparent hover:text-custom/80 transition-colors group"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="group-data-[state=active]:animate-pulse"
        >
          <File className="h-4 w-4" />
        </motion.div>
        Files
      </TabsTrigger>

      <TabsTrigger
        value="folders"
        className="flex items-center gap-2 bg-transparent border-0 rounded-none px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:text-custom data-[state=active]:border-b-4 data-[state=active]:border-custom data-[state=active]:shadow-none hover:bg-transparent hover:text-custom/80 transition-colors group"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="group-data-[state=active]:animate-pulse"
        >
          <Folder className="h-4 w-4" />
        </motion.div>
        Folders
      </TabsTrigger>
    </TabsList>
  </div>

  <TabsContent value="files" className="mt-0">
   <SearchResultsMedia/>
  </TabsContent>

  <TabsContent value="folders" className="mt-0">
    {/* Content for folders tab goes here */}
  </TabsContent>
</Tabs>

  )
}

export default Results