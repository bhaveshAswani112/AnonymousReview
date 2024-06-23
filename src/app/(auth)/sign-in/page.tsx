"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInSchema } from "@/Schemas/SignIn"
import { useRouter } from "next/navigation"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react';
import Link from "next/link"
import { signIn } from "next-auth/react"


function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',  
      password: ''
    }
  })
  
  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    try {
      setIsSubmitting(true)
      const resp = await signIn('credentials', {
        redirect: false,
        email: data.email,  
        password: data.password
      })
      console.log(resp)
      if (resp?.error) {
        toast({
          title: "Failed",
          description: resp.error,
          variant: "destructive"
        })
        return
      }
      toast({
        title: "Success",
        description: "Sign in successful"
      })
      router.push('/dashboard')  
    } catch (error) {
      console.log(error)
      toast({
        title: "Failed",
        description: "Sign in failed",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-2xl mb-6">
            Welcome again to anonymous review
          </h1>
          <p className="mb-4">Sign In</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    {...field}
                    placeholder="Enter your email id"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} placeholder="Enter your password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Do not have an account?
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page
