import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignupPage() {
    async function handleSignup(formData: FormData) {
        "use server";
        const supabase = createClient();
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw new Error(error.message);

        return redirect("/chat");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <form action={handleSignup} className="space-y-4 w-full max-w-md p-6">
                <h1 className="text-2xl font-bold">Sign Up</h1>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                </div>
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit">Sign Up</Button>
                <p>
                    Already have an account? <Link href="/login" className="text-primary">Log in</Link>
                </p>
            </form>
        </div>
    );
}