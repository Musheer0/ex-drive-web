"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { useEffect, useState } from "react"
import { LogOut, Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/hooks/use-user"
import { Auth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useMultiSession } from "@/multi-session/use-multi-session"
import { DexiSession } from "@/lib/type"

export default function UserButton({className}:{className?:string}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const multiSession = new useMultiSession();
  const [MultiSessionSupported, setIsMultiSessionSupported] = useState(false);
  const [sessions, SetSessions] = useState<DexiSession[]>([])
  const { user } = useUser()
  const router = useRouter()
  const auth = new Auth()
  const { theme, setTheme } = useTheme()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const AddSession = async()=>{
    if(!user) return;
    setIsLoading(true);
    await multiSession.AddSession()
    setIsLoading(false);
  }
  const SwitchSession = async(oldsession:DexiSession)=>{
    if(!user) return;
    setIsLoading(true);
    await multiSession.SwitchSession(oldsession)
    setIsLoading(false);
  }

  const Logout_error = () => {}

  const handleLogout = async () => {
    setIsOpen(false)
    setIsLoading(true)
    await auth.Logout(() => router.push("/onboard"), Logout_error)
    setIsLoading(false)
  }

  useEffect(() => {
    if ("indexedDB" in window) {
      setIsMultiSessionSupported(true)
    }
  }, []);
  const InitializeSessions = async()=>{
    setIsLoading(true)
    const accounts = await multiSession.GetSessions();
    SetSessions(accounts)
    setIsLoading(false)
  }
 useEffect(()=>{
    InitializeSessions()
 },[])
  if (user)
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger onClick={(e)=>{
          e.stopPropagation()
        }} disabled={isLoading} asChild>
          <Button
            variant="ghost"
            className={cn(
              "relative h-10 w-10 rounded-full p-0 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:ring-2 hover:ring-blue-500/20 hover:scale-105",
              className
            )}
          >
            <Avatar className="h-10 w-10 transition-all duration-200">
              <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
         onClick={(e)=>{
          e.stopPropagation()
        }}
          className="w-72 p-0 rounded-2xl overflow-hidden shadow-lg border-zinc-200 dark:border-gray-800"
          side="bottom"
          sideOffset={5}
          forceMount
        >
          <div className="bg-zinc-200 dark:bg-zinc-800 rounded-2xl">
            <div className="main bg-white dark:bg-zinc-900 p-2 shadow-sm rounded-b-xl">
              <DropdownMenuLabel className="p-0">
                <div className="flex items-center gap-3 p-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {MultiSessionSupported ? (
                <>
                  {/* ////other accunt */}
                  <div className=" py-1">
                    <p className="text-xs text-muted-foreground dark:text-zinc-400 px-2 py-1">Other accounts</p>
                      {sessions.map((session, i)=>{
                        return(
                               <DropdownMenuItem
                               onClick={async()=>{
                                  await SwitchSession(session)
                               }}
                               key={i} className="cursor-pointer transition-all duration-200 hover:bg-zinc-500 dark:hover:bg-zinc-800">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={session.image} alt="Sarah Wilson" />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white text-xs">
                          SW
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{session.email}</span>
                    </DropdownMenuItem>
                        )
                      })}
                  </div>
                  <DropdownMenuSeparator />
                  {/* //add account */}
                  <DropdownMenuItem
                    disabled={isLoading}
                    onClick={AddSession}
                    className="cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 mr-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">+</span>
                    </div>
                    <span>Add account</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <></>
              )}
              <DropdownMenuSeparator />

              {/* Theme Switcher */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-800">
                  <div className="flex items-center">
                    {theme === "light" && <Sun className="mr-2 h-4 w-4" />}
                    {theme === "dark" && <Moon className="mr-2 h-4 w-4" />}
                    {theme === "system" && <Monitor className="mr-2 h-4 w-4" />}
                    <span>Theme</span>
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="rounded-xl bg-zinc-100 dark:bg-zinc-900 dark:border-gray-800">
                  <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                    {theme === "light" && <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                    {theme === "dark" && <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className="cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>System</span>
                    {theme === "system" && <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={isLoading}
                className="cursor-pointer text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 dark:hover:text-red-400 hover:shadow-sm focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/30 dark:focus:text-red-400"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </div>
            <div className="secureby px-4 py-3 text-center shadow-inner dark:bg-zinc-800/50">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Secured by ex-drive</p>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
}
