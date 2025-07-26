"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { trpc } from "@/lib/trpc/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageBubble } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"
import { ModelSelector } from "./model-selector"
import { Send, Loader2, MessageCircle, AlertTriangle, Sparkles, History } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@supabase/supabase-js"

interface ChatInterfaceProps {
    user: User
}

export function ChatInterface({ user }: ChatInterfaceProps) {
    const [selectedModel, setSelectedModel] = useState<string>("")
    const [message, setMessage] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const { data: messages, refetch: refetchMessages } = trpc.chat.history.useQuery(
        { userId: user.id },
        { enabled: !!user.id },
    )

    const sendMessageMutation = trpc.chat.send.useMutation({
        onSuccess: () => {
            refetchMessages()
            setMessage("")
            setIsTyping(false)
            inputRef.current?.focus()
        },
        onError: (error) => {
            toast({
                title: "❌ Message Failed",
                description: error.message,
                variant: "destructive",
            })
            setIsTyping(false)
        },
    })

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation checks
        if (!selectedModel) {
            toast({
                title: "🤖 No Model Selected",
                description: "Please select an AI model before sending a message.",
                variant: "destructive",
            })
            return
        }

        if (!message.trim()) {
            toast({
                title: "📝 Empty Message",
                description: "Please enter a message to send.",
                variant: "destructive",
            })
            return
        }

        if (sendMessageMutation.isLoading) {
            return
        }

        setIsTyping(true)
        sendMessageMutation.mutate({
            userId: user.id,
            modelTag: selectedModel,
            prompt: message.trim(),
        })
    }

    const canSendMessage = selectedModel && message.trim() && !sendMessageMutation.isLoading

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Enhanced Model Selector */}
            <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                disabled={sendMessageMutation.isLoading}
            />

            {/* Enhanced Chat Interface */}
            <Card className="border-0 bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 dark:from-gray-900 dark:via-gray-800/30 dark:to-blue-950/20 shadow-2xl backdrop-blur-sm">
                <CardHeader className="border-b bg-gradient-to-r from-blue-50/50 via-white to-cyan-50/50 dark:from-gray-800/50 dark:via-gray-900 dark:to-blue-950/30 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                                <MessageCircle className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    AI Conversation
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                    {messages && messages.length > 0 ? (
                                        <>
                                            <History className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">{messages.length} messages in history</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">Start a new conversation</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">Online</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col min-h-0 p-0">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[500px] max-h-[600px] scroll-smooth">
                        {!messages || messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
                                <div className="relative">
                                    <div className="p-6 bg-gradient-to-br from-blue-100 via-cyan-100 to-purple-100 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-purple-950/30 rounded-3xl shadow-xl">
                                        <MessageCircle className="h-16 w-16 text-blue-500 mx-auto" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-bounce"></div>
                                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-bounce delay-150"></div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                                        {selectedModel ? "🚀 Ready to Chat!" : "🤖 Welcome to AI Chat"}
                                    </h3>
                                    <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
                                        {selectedModel
                                            ? "Send your first message to start an amazing conversation with AI."
                                            : "Select an AI model above and send your first message to begin your journey."}
                                    </p>
                                    {selectedModel && (
                                        <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-full">
                                            <Sparkles className="h-4 w-4 text-blue-500" />
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                Powered by advanced AI technology
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, index) => (
                                    <div
                                        key={msg.id}
                                        className="animate-in slide-in-from-bottom-2 duration-300"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <MessageBubble message={msg} isUser={msg.role === "user"} />
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="animate-in slide-in-from-bottom-2 duration-300">
                                        <TypingIndicator />
                                    </div>
                                )}
                            </>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Enhanced Message Input */}
                    <div className="border-t bg-gradient-to-r from-gray-50/50 via-white to-blue-50/50 dark:from-gray-800/50 dark:via-gray-900 dark:to-blue-950/30 backdrop-blur-md p-6">
                        {/* Warning if no model selected */}
                        {!selectedModel && (
                            <div className="mb-4 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-xl shadow-sm">
                                    <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg">
                                        <AlertTriangle className="h-5 w-5 text-white animate-bounce" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-amber-700 dark:text-amber-300">
                                            🎯 Select an AI model to enable messaging
                                        </p>
                                        <p className="text-sm text-amber-600 dark:text-amber-400">
                                            Choose your preferred AI companion from the selector above
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSendMessage} className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex-1 relative">
                                    <Input
                                        ref={inputRef}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={
                                            selectedModel ? "💭 Type your message here..." : "🤖 Select a model first to start chatting..."
                                        }
                                        disabled={!selectedModel || sendMessageMutation.isLoading}
                                        className="h-14 pl-6 pr-4 text-base bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm backdrop-blur-sm transition-all duration-200"
                                    />
                                    {message && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        </div>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={!canSendMessage}
                                    size="lg"
                                    className={`h-14 px-6 rounded-xl transition-all duration-200 shadow-lg ${canSendMessage
                                            ? "bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700 hover:scale-105 hover:shadow-xl"
                                            : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50"
                                        }`}
                                >
                                    {sendMessageMutation.isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span className="hidden sm:inline">Sending...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Send className="h-5 w-5" />
                                            <span className="hidden sm:inline">Send</span>
                                        </div>
                                    )}
                                </Button>
                            </div>

                            {/* Message counter */}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    {selectedModel && (
                                        <>
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                            <span>Ready to send</span>
                                        </>
                                    )}
                                </div>
                                <span>{message.length}/1000</span>
                            </div>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}