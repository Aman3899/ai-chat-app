"use client"

import { Card } from "@/components/ui/card"
import { Bot, Sparkles } from "lucide-react"

export function TypingIndicator() {
    return (
        <div className="flex gap-4 justify-start group">
            <div className="flex-shrink-0 relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></div>
            </div>

            <Card className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 p-4 shadow-lg max-w-[85%] sm:max-w-[75%] md:max-w-[65%] backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                        <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
                        <span className="text-sm text-muted-foreground font-medium">AI is thinking...</span>
                    </div>
                </div>
            </Card>
        </div>
    )
}