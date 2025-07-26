import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Chat from "@/components/Chat";

export default async function ChatPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    return (
        <div className="min-h-screen bg-background">
            <Chat userId={user.id} />
        </div>
    );
}