// server/api/routers/models.ts
import { publicProcedure, router } from "@/server/trpc"
import { supabase } from "@/lib/supabase"

export const modelsRouter = router({
    getAvailable: publicProcedure.query(async () => {
        const { data, error } = await supabase.from("models").select("*")

        if (error) {
            console.error("Supabase fetch error:", error)
            throw new Error("Failed to fetch models")
        }

        console.log("Fetched models:", data)

        return data
    }),
})