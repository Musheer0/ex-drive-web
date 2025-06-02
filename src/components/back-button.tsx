"use client"
"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Component() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Back Button Examples</h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Default usage:</p>
            <BackButton />
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">With onClick handler:</p>
            <BackButton />
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">In a card context:</p>
            <div className="border rounded-lg p-4 bg-card">
              <BackButton />
              <h3 className="text-lg font-medium mt-4">Page Content</h3>
              <p className="text-muted-foreground">This is some example content to show the button in context.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BackButton() {
    const router = useRouter()
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={()=>router.back()}
      className="h-auto p-0 hover:bg-muted/50 hover:px-2 hover:py-1 hover:rounded-md transition-all duration-200 flex items-center gap-1 text-sm font-normal"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  )
}
