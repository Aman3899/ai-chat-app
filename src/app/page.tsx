"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { AuthForm } from "@/components/auth/auth-form"
import { ChatInterface } from "@/components/chat/chat-interface"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { LogOut, MessageCircle, Sparkles } from "lucide-react"
import type { User } from "@supabase/supabase-js"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-blue-500 animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Loading AI Chat
            </h2>
            <p className="text-muted-foreground animate-pulse">Initializing your chat experience...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>

        <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
          <AuthForm />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 rounded-xl shadow-lg">
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-bounce"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
                  AI Chat Studio
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <p className="text-sm text-muted-foreground">Powered by advanced AI models</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-full border border-green-200 dark:border-green-800">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">{user.email}</span>
              </div>
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950 dark:hover:border-red-800 bg-transparent transition-all duration-200 hover:scale-105"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 pb-8 relative z-10">
        <ChatInterface user={user} />
      </main>
    </div>
  )
}