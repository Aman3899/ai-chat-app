import { initTRPC, TRPCError } from "@trpc/server"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"
import { GoogleGenerativeAI } from "@google/generative-ai"

const t = initTRPC.create()

export const router = t.router
export const publicProcedure = t.procedure

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const googleAIKey = process.env.GOOGLE_AI_API_KEY

if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

// Initialize Google AI
let genAI: GoogleGenerativeAI | null = null
if (googleAIKey) {
    genAI = new GoogleGenerativeAI(googleAIKey)
    console.log("✅ Google AI initialized successfully")
} else {
    console.log("⚠️ Google AI API key not found - using simulated responses")
}

// Create Supabase client - use anon key if service key is not available
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// Create admin client only if service key is available
let supabaseAdmin: ReturnType<typeof createClient> | null = null
if (supabaseServiceKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}

// Helper function to generate AI response
async function generateAIResponse(modelTag: string, prompt: string, modelName: string): Promise<string> {
    if (modelTag === "gemini-2.0-flash-exp" && genAI) {
        try {
            console.log("🤖 Generating real Gemini response...")

            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

            const result = await model.generateContent({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
            })

            const response = await result.response
            const text = response.text()

            if (!text) {
                throw new Error("Empty response from Gemini API")
            }

            console.log("✅ Gemini response generated successfully")
            return text
        } catch (error: any) {
            console.error("❌ Gemini API error:", error)

            // Fallback to simulated response if API fails
            return `[Gemini API Error - Fallback Response] I apologize, but I encountered an issue connecting to the Gemini API (${error.message}). Here's a simulated response: You said "${prompt}". This would normally be processed by Google's Gemini 2.0 Flash model for an intelligent response.`
        }
    }

    // Simulated responses for other models
    const modelResponses = {
        "gpt-4o": `[GPT-4o Simulated Response] You said: "${prompt}". This is a simulated response from OpenAI's GPT-4o model. In a real implementation, this would call the OpenAI API for intelligent responses.`,
        "gpt-4o-mini": `[GPT-4o Mini Simulated Response] You said: "${prompt}". This is a simulated response from OpenAI's GPT-4o Mini model.`,
        "gpt-3.5-turbo": `[GPT-3.5 Turbo Simulated Response] You said: "${prompt}". This is a simulated response from OpenAI's GPT-3.5 Turbo model.`,
        "claude-3-sonnet": `[Claude 3 Sonnet Simulated Response] You said: "${prompt}". This is a simulated response from Anthropic's Claude 3 Sonnet model.`,
        "claude-3-haiku": `[Claude 3 Haiku Simulated Response] You said: "${prompt}". This is a simulated response from Anthropic's Claude 3 Haiku model.`,
    }

    return (
        modelResponses[modelTag as keyof typeof modelResponses] ||
        `[${modelName} Simulated Response] You said: "${prompt}". This is a simulated response from ${modelName}.`
    )
}

// Models router
export const modelsRouter = router({
    getAvailable: publicProcedure.query(async () => {
        try {
            console.log("Fetching models from Supabase...")

            // Use admin client if available, otherwise use regular client
            const client = supabaseAdmin || supabaseClient
            const { data, error } = await client.from("models").select("*").order("name")

            if (error) {
                console.error("Supabase error:", error)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Failed to fetch models: ${error.message}`,
                })
            }

            console.log("Models fetched successfully:", data?.length || 0, "models")
            return data || []
        } catch (error) {
            console.error("Error in getAvailable:", error)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch models from database",
            })
        }
    }),
})

// Chat router
export const chatRouter = router({
    history: publicProcedure.input(z.object({ userId: z.string() })).query(async ({ input }) => {
        try {
            console.log("Fetching chat history for user:", input.userId)

            // Use admin client if available, otherwise use regular client
            const client = supabaseAdmin || supabaseClient
            const { data, error } = await client
                .from("messages")
                .select("*")
                .eq("user_id", input.userId)
                .order("created_at", { ascending: true })

            if (error) {
                console.error("Supabase error:", error)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Failed to fetch chat history: ${error.message}`,
                })
            }

            console.log("Chat history fetched:", data?.length || 0, "messages")
            return data || []
        } catch (error) {
            console.error("Error in chat history:", error)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch chat history",
            })
        }
    }),

    send: publicProcedure
        .input(
            z.object({
                userId: z.string(),
                modelTag: z.string(),
                prompt: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            try {
                console.log("Sending message:", { userId: input.userId, modelTag: input.modelTag })

                // Use admin client if available, otherwise use regular client
                const client = supabaseAdmin || supabaseClient

                // First, verify the model exists
                const { data: modelData, error: modelError } = await client
                    .from("models")
                    .select("*")
                    .eq("tag", input.modelTag)
                    .single()

                if (modelError || !modelData) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Model ${input.modelTag} not found`,
                    })
                }

                // Save user message
                const { error: userMessageError } = await client.from("messages").insert({
                    user_id: input.userId,
                    model_tag: input.modelTag,
                    role: "user",
                    content: input.prompt,
                })

                if (userMessageError) {
                    console.error("Error saving user message:", userMessageError)
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: `Failed to save user message: ${userMessageError.message}`,
                    })
                }

                // Generate AI response
                const aiResponse = await generateAIResponse(input.modelTag, input.prompt, modelData.name)

                // Save AI response
                const { error: aiMessageError } = await client.from("messages").insert({
                    user_id: input.userId,
                    model_tag: input.modelTag,
                    role: "assistant",
                    content: aiResponse,
                })

                if (aiMessageError) {
                    console.error("Error saving AI message:", aiMessageError)
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: `Failed to save AI response: ${aiMessageError.message}`,
                    })
                }

                console.log("Message exchange completed successfully")
                return { success: true }
            } catch (error) {
                console.error("Error in send mutation:", error)
                if (error instanceof TRPCError) {
                    throw error
                }
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to process message",
                })
            }
        }),
})

export const appRouter = router({
    models: modelsRouter,
    chat: chatRouter,
})

export type AppRouter = typeof appRouter