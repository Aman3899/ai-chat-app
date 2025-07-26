"use client"

import { useState, useEffect } from "react"
import { trpc } from "@/lib/trpc/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Loader2,
    RefreshCw,
    AlertCircle,
    Sparkles,
    Database,
    Zap,
    Brain,
    Star,
    CheckCircle2,
    Globe,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Model {
    id: string
    tag: string
    name: string
    description?: string
    created_at: string
}

interface ModelSelectorProps {
    selectedModel: string
    onModelChange: (modelTag: string) => void
    disabled?: boolean
}

const getModelIcon = (tag: string) => {
    if (tag.includes("gemini")) return <Sparkles className="h-4 w-4" />
    if (tag.includes("gpt")) return <Brain className="h-4 w-4" />
    if (tag.includes("claude")) return <Zap className="h-4 w-4" />
    return <Star className="h-4 w-4" />
}

const getModelColor = (tag: string) => {
    if (tag.includes("gemini")) return "from-purple-500 to-pink-500"
    if (tag.includes("gpt-4o")) return "from-green-500 to-emerald-500"
    if (tag.includes("gpt")) return "from-blue-500 to-cyan-500"
    if (tag.includes("claude")) return "from-orange-500 to-red-500"
    return "from-gray-500 to-slate-500"
}

const isRealAI = (tag: string) => {
    return tag === "gemini-2.0-flash-exp"
}

export function ModelSelector({ selectedModel, onModelChange, disabled = false }: ModelSelectorProps) {
    const [isRefreshing, setIsRefreshing] = useState(false)
    const { toast } = useToast()

    const {
        data: models,
        isLoading: modelsLoading,
        error: modelsError,
        refetch: refetchModels,
    } = trpc.models.getAvailable.useQuery(undefined, {
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        onError: (error) => {
            console.error("Models fetch error:", error)
            toast({
                title: "Failed to Load Models",
                description: error.message || "Could not connect to database. Please check your configuration.",
                variant: "destructive",
            })
        },
    })

    // Auto-select first model if none selected and models are available
    useEffect(() => {
        if (models && models.length > 0 && !selectedModel) {
            onModelChange(models[0].tag)
            toast({
                title: "🤖 Model Auto-Selected",
                description: `Selected ${models[0].name} as your default AI companion.`,
            })
        }
    }, [models, selectedModel, onModelChange, toast])

    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            await refetchModels()
            toast({
                title: "✨ Models Refreshed",
                description: "AI models have been updated successfully.",
            })
        } catch (error) {
            toast({
                title: "❌ Refresh Failed",
                description: "Failed to refresh models. Please check your connection.",
                variant: "destructive",
            })
        } finally {
            setIsRefreshing(false)
        }
    }

    const selectedModelData = models?.find((m) => m.tag === selectedModel)

    // Loading state with enhanced animation
    if (modelsLoading) {
        return (
            <div className="relative">
                <Card className="border-2 border-dashed border-blue-300 dark:border-blue-600 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center space-x-4">
                            <div className="relative">
                                <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-500"></div>
                                <Database className="absolute inset-0 m-auto h-5 w-5 text-blue-500 animate-pulse" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    Loading AI Models
                                </p>
                                <p className="text-sm text-muted-foreground animate-pulse">Connecting to neural networks...</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-lg animate-pulse"></div>
            </div>
        )
    }

    // Enhanced error state
    if (modelsError || !models || models.length === 0) {
        return (
            <Card className="border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <AlertCircle className="h-6 w-6 text-red-500 animate-bounce" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                                    {modelsError ? "🔌 Database Connection Failed" : "📭 No Models Found"}
                                </h3>
                                <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                                    {modelsError?.message || "Please check your Supabase configuration and database setup"}
                                </p>
                                <div className="space-y-1 text-xs text-red-500 dark:text-red-400">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                        <span>Verify NEXT_PUBLIC_SUPABASE_URL is set</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                        <span>Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is set</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                        <span>Check if models table exists and has data</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="border-red-300 hover:bg-red-100 dark:border-red-700 dark:hover:bg-red-900/20 bg-transparent transition-all duration-200 hover:scale-105"
                        >
                            {isRefreshing ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <RefreshCw className="h-4 w-4 mr-2" />
                            )}
                            Retry Connection
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {/* Enhanced Model Selection Card */}
            <Card className="border-0 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-cyan-950/20 shadow-xl backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Header Section */}
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                                <Database className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    AI Model Selection
                                </h3>
                                <p className="text-sm text-muted-foreground">{models.length} powerful models available</p>
                            </div>
                        </div>

                        {/* Selection Controls */}
                        <div className="flex items-center gap-3 flex-1 lg:justify-end">
                            <div className="flex-1 lg:max-w-xs">
                                <Select value={selectedModel} onValueChange={onModelChange} disabled={disabled || modelsLoading}>
                                    <SelectTrigger className="h-12 bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 backdrop-blur-sm shadow-sm">
                                        <SelectValue placeholder="🤖 Choose your AI companion..." />
                                    </SelectTrigger>
                                    <SelectContent className="max-w-md border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
                                        {models.map((model, index) => (
                                            <SelectItem
                                                key={model.id}
                                                value={model.tag}
                                                className="cursor-pointer p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/30 dark:hover:to-cyan-950/30 transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-3 w-full">
                                                    <div className={cn("p-2 rounded-lg bg-gradient-to-r shadow-sm", getModelColor(model.tag))}>
                                                        <div className="text-white">{getModelIcon(model.tag)}</div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-semibold text-sm">{model.name}</span>
                                                            <div className="flex items-center gap-1">
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 font-mono"
                                                                >
                                                                    {model.tag}
                                                                </Badge>
                                                                {isRealAI(model.tag) && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs px-2 py-0.5 bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300"
                                                                    >
                                                                        <Globe className="h-3 w-3 mr-1" />
                                                                        LIVE API
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {model.description && (
                                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                                {model.description}
                                                                {isRealAI(model.tag) && " • Connected to real Google AI API"}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {selectedModel === model.tag && (
                                                        <CheckCircle2 className="h-4 w-4 text-green-500 animate-pulse" />
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleRefresh}
                                disabled={isRefreshing || disabled}
                                className="h-12 w-12 bg-white/80 dark:bg-gray-800/80 border-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200 hover:scale-105 shadow-sm"
                                title="Refresh models"
                            >
                                {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Enhanced Selected Model Display */}
            {selectedModelData && (
                <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50/50 to-teal-50/50 dark:from-green-950/20 dark:via-emerald-950/10 dark:to-teal-950/10 shadow-lg backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div
                                        className={cn("p-3 rounded-xl bg-gradient-to-r shadow-lg", getModelColor(selectedModelData.tag))}
                                    >
                                        <div className="text-white">{getModelIcon(selectedModelData.tag)}</div>
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-lg font-bold text-green-700 dark:text-green-300">{selectedModelData.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-xs font-medium">ACTIVE</span>
                                            </div>
                                            {isRealAI(selectedModelData.tag) && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                                                >
                                                    <Globe className="h-3 w-3 mr-1" />
                                                    REAL AI
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    {selectedModelData.description && (
                                        <p className="text-sm text-green-600 dark:text-green-400 leading-relaxed">
                                            {selectedModelData.description}
                                            {isRealAI(selectedModelData.tag) && " • Powered by Google's live API"}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-300 font-mono text-xs px-3 py-1 bg-green-100/50 dark:bg-green-900/20"
                            >
                                {selectedModelData.tag}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Enhanced No Model Selected Warning */}
            {!selectedModel && models.length > 0 && (
                <Card className="border-0 bg-gradient-to-br from-amber-50 via-orange-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-yellow-950/10 shadow-lg backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-300">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl shadow-lg">
                                <AlertCircle className="h-5 w-5 text-white animate-bounce" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-amber-700 dark:text-amber-300 mb-1">
                                    🎯 Ready to Start Chatting?
                                </h4>
                                <p className="text-sm text-amber-600 dark:text-amber-400">
                                    Select one of {models.length} available AI models above to begin your conversation
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}