"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {useDebounceCallback, useDebounceValue} from "usehooks-ts"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUpSchema } from "@/Schemas/SignUp"
import {z} from "zod"
import axios from "axios"
import { redirect } from 'next/navigation'
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




export default function page() {
  const [username , setUsername] = useState("");
  const [usernameMessage , setUsernameMessage] = useState("")
  const [checkingUsername , setCheckingUsername] = useState(false)
  const [issubmitting , setIsSubmitting] = useState(false)
  const debounced  = useDebounceCallback(setUsername,500)
  const { toast } = useToast()
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
      setCheckingUsername(true)
      setUsernameMessage('')
      axios.get(`/api/check-username-unique?username=${username}`).then((resp) => resp.data).then((data) => {
          setUsernameMessage(data.message)
      }).catch(error => {
        console.log(error.response.data.message)
        setUsernameMessage(error.response.data.message ?? "Error checking username")
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
      redirect(`/verify?username=${username}`)
    } catch (error : any) {
        toast({
          title : "Failed",
          description : error.resp?.data?.message || "Sign up failed",
          variant : "destructive"
      })
    }
    finally{
      setIsSubmitting(false)
    }

  }
  return (
    <>
      {checkingUsername ? <div>checking</div> : null}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    debounced(e.target.value)
                  }} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field}
                   />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your passowrd" {...field}
                   />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <Button type="submit" disabled={issubmitting}>Submit</Button>
        </form>
      </Form>
  </>
  )
}
