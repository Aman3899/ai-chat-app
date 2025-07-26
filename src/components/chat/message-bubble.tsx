"use client"

import { formatDistanceToNow } from "date-fns"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { User, Bot, Sparkles, Brain, Zap, Star } from "lucide-react"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    created_at: string
    model_tag?: string
}

interface MessageBubbleProps {
    message: Message
    isUser: boolean
}

const getModelIcon = (tag?: string) => {
    if (!tag) return <Bot className="h-4 w-4" />
    if (tag.includes("gemini")) return <Sparkles className="h-4 w-4" />
    if (tag.includes("gpt")) return <Brain className="h-4 w-4" />
    if (tag.includes("claude")) return <Zap className="h-4 w-4" />
    return <Star className="h-4 w-4" />
}

const getModelColor = (tag?: string) => {
    if (!tag) return "from-blue-500 to-cyan-500"
    if (tag.includes("gemini")) return "from-purple-500 to-pink-500"
    if (tag.includes("gpt-4o")) return "from-green-500 to-emerald-500"
    if (tag.includes("gpt")) return "from-blue-500 to-cyan-500"
    if (tag.includes("claude")) return "from-orange-500 to-red-500"
    return "from-gray-500 to-slate-500"
}

export function MessageBubble({ message, isUser }: MessageBubbleProps) {
    return (
        <div className={cn("flex gap-4 max-w-full group", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <div className="flex-shrink-0 relative">
                    <div
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br",
                            getModelColor(message.model_tag),
                        )}
                    >
                        <div className="text-white">{getModelIcon(message.model_tag)}</div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></div>
                </div>
            )}

            <div className={cn("max-w-[85%] sm:max-w-[75%] md:max-w-[65%] space-y-2", isUser ? "order-1" : "order-2")}>
                <Card
                    className={cn(
                        "p-4 shadow-lg border-0 backdrop-blur-sm transition-all duration-200 hover:shadow-xl group-hover:scale-[1.02]",
                        isUser
                            ? "bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 text-white"
                            : "bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700",
                    )}
                >
                    <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.content}</div>

                    <div
                        className={cn(
                            "flex items-center justify-between mt-3 pt-2 border-t text-xs",
                            isUser
                                ? "border-blue-400/30 text-blue-100"
                                : "border-gray-200 dark:border-gray-700 text-muted-foreground",
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className={cn("w-1.5 h-1.5 rounded-full", isUser ? "bg-blue-200" : "bg-green-500 animate-pulse")}
                            ></div>
                            <span className="font-medium">
                                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                            </span>
                        </div>

                        {!isUser && message.model_tag && (
                            <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 font-mono px-2 py-1 shadow-sm">
                                {message.model_tag}
                            </Badge>
                        )}
                    </div>
                </Card>
            </div>

            {isUser && (
                <div className="flex-shrink-0 relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                        <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                </div>
            )}
        </div>
    )
}