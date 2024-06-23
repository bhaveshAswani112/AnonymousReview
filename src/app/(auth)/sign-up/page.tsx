"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {useDebounceCallback, useDebounceValue} from "usehooks-ts"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUpSchema } from "@/Schemas/SignUp"
import {useRouter} from "next/navigation"
import {z} from "zod"
import axios from "axios"
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




export default function Page() {
  const [username , setUsername] = useState("");
  const [usernameMessage , setUsernameMessage] = useState("")
  const [checkingUsername , setCheckingUsername] = useState(false)
  const [issubmitting , setIsSubmitting] = useState(false)
  const [isUnique,setIsUnique] = useState(false)
  const debounced  = useDebounceCallback(setUsername,500)
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver : zodResolver(SignUpSchema),
    defaultValues : {
      username : '',
      email : '',
      password : ''
    }
  })
  useEffect(() => {
    if(username){
      // console.log("Username is " + username)
      setCheckingUsername(true)
      setUsernameMessage('')
      axios.get(`/api/check-username-unique?username=${username}`).then((resp) => resp.data).then((data) => {
          setUsernameMessage(data.message)
          setIsUnique(data.success)
      }).catch(error => {
        console.log(error.response.data.message)
        setUsernameMessage(error.response.data.message ?? "Error checking username")
        setIsUnique(false)
      }).finally(() => {
        setCheckingUsername(false)
      })
    }
  },[username])

  const onSubmit = async (data : z.infer<typeof SignUpSchema>) => {
    console.log(data)
    setIsSubmitting(true)
    try {
      const resp = await axios.post("/api/sign-up",data)
      toast({
        title : "Success",
        description : resp.data?.message
      })
      router.replace(`/verify/${username}`);
    } catch (error : any) {
      // console.log(error)
        toast({
          title : "Failed",
          description : error?.response?.data?.message || "Sign up failed",
          variant : "destructive"
      })
    }
    finally{
      setIsSubmitting(false)
    }

  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Anonymous Review
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  {checkingUsername && <Loader2 className="animate-spin" />}
                  {!checkingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is available'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
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
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={issubmitting || !isUnique}>
              {issubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
