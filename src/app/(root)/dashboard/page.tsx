/* eslint-disablereact/no-unescaped-entities */

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  HardDrive,
  FileText,

} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/hooks/use-user"
import useDashboard from "@/hooks/use-dashboard"
import InfiniteMediaScroll from "@/components/media/infinite-media-scroll"





function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}


function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("")
  const {user} = useUser();
const {InitailizeDashboard, dashboard} = useDashboard()
  useEffect(() => {
    setGreeting(getGreeting());
    InitailizeDashboard()
  }, []);

if(user)
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Welcome Message */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{greeting}, {user.name}👋</h1>
          <p className="text-muted-foreground mt-2">Here&apos;s what&apos;s happening with your files today.</p>
        </motion.div>

      {/* Dashboard  */}
      {dashboard &&
      <>
         {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{((dashboard.storage/1024)/500).toFixed(3)}%</div>
              <p className="text-xs text-muted-foreground">{formatFileSize(dashboard.storage*1000)} of 500mb userd</p>
              <p className="text-xs text-muted-foreground">Across all your files</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Files This Week</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.files_this_week}</div>
              <p className="text-xs text-muted-foreground">Files uploaded recently</p>
            </CardContent>
          </Card>
        </motion.div>

      </>
      }
        {/* Recent Files */}
      <InfiniteMediaScroll/>
      </motion.div>
    </div>
  )
}
