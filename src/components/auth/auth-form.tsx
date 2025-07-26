"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, MessageCircle, Mail, Lock, Eye, EyeOff } from "lucide-react"

export function AuthForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const validateSignUp = () => {
        if (!email || !password || !confirmPassword) {
            toast({
                title: "Missing Fields",
                description: "Please fill in all required fields.",
                variant: "destructive",
            })
            return false
        }

        if (password.length < 6) {
            toast({
                title: "Password Too Short",
                description: "Password must be at least 6 characters long.",
                variant: "destructive",
            })
            return false
        }

        if (password !== confirmPassword) {
            toast({
                title: "Passwords Don't Match",
                description: "Please make sure both passwords are identical.",
                variant: "destructive",
            })
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast({
                title: "Invalid Email",
                description: "Please enter a valid email address.",
                variant: "destructive",
            })
            return false
        }

        return true
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateSignUp()) return

        setLoading(true)

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) {
                if (error.message.includes("already registered")) {
                    toast({
                        title: "Account Already Exists",
                        description: "This email is already registered. Please sign in instead.",
                        variant: "destructive",
                    })
                } else {
                    throw error
                }
                return
            }

            if (data.user && !data.session) {
                toast({
                    title: "Check Your Email!",
                    description: "We've sent you a confirmation link. Please check your email to activate your account.",
                })
            } else {
                toast({
                    title: "Account Created!",
                    description: "Welcome to AI Chat! You can now start chatting with AI models.",
                })
            }

            // Clear form
            setEmail("")
            setPassword("")
            setConfirmPassword("")
        } catch (error: any) {
            console.error("Sign up error:", error)
            toast({
                title: "Sign Up Failed",
                description: error.message || "An unexpected error occurred. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            toast({
                title: "Missing Credentials",
                description: "Please enter both email and password.",
                variant: "destructive",
            })
            return
        }

        setLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            })

            if (error) {
                if (error.message.includes("Invalid login credentials")) {
                    toast({
                        title: "Invalid Credentials",
                        description: "The email or password you entered is incorrect. Please try again.",
                        variant: "destructive",
                    })
                } else if (error.message.includes("Email not confirmed")) {
                    toast({
                        title: "Email Not Confirmed",
                        description: "Please check your email and click the confirmation link before signing in.",
                        variant: "destructive",
                    })
                } else {
                    throw error
                }
                return
            }

            toast({
                title: "Welcome Back!",
                description: "You have been signed in successfully.",
            })

            // Clear form
            setEmail("")
            setPassword("")
        } catch (error: any) {
            console.error("Sign in error:", error)
            toast({
                title: "Sign In Failed",
                description: error.message || "An unexpected error occurred. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <CardHeader className="text-center space-y-4">
                <div className="mx-auto p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-fit">
                    <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Welcome to AI Chat
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                        Sign in to your account or create a new one to start chatting with AI models.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
                        <TabsTrigger value="signin" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                            Sign In
                        </TabsTrigger>
                        <TabsTrigger value="signup" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                            Sign Up
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin" className="mt-6">
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signin-email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </Label>
                                <Input
                                    id="signin-email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11"
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signin-password" className="flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="signin-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 pr-10"
                                        disabled={loading}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="signup" className="mt-6">
                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </Label>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11"
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password" className="flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="signup-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password (min 6 characters)"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="h-11 pr-10"
                                        disabled={loading}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password" className="flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="h-11 pr-10"
                                        disabled={loading}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={loading}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Account
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}