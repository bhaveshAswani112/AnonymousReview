"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { toast } from "@/components/ui/use-toast"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

export default function Page({ params }: { params: { username: string } }) {
  const username = params.username
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      const resp = await axios.post<ApiResponse>(`/api/send-message`, {
        username,
        content: data.message,
      })
      toast({
        title: "Success",
        description: resp.data.message,
      })
    } catch (error: any) {
      console.log(error)
      toast({
        title: "Failed",
        description: error.response.data.message || "Message send failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 to-black">
      <div className="bg-gray-900 rounded-lg shadow-lg p-10 max-w-lg w-full text-center">
        <h1 className="text-3xl font-extrabold mb-6 text-white">Send a Message to</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{username}</FormLabel>
                  <FormControl>
                    <Input placeholder="Write your message here" {...field} className="bg-gray-800 text-white border-gray-700 focus:ring-blue-500 focus:border-blue-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              type="submit"
              className={`w-full py-2 px-4 rounded-lg transition-all duration-300 ${
                isLoading ? 'bg-blue-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
              } text-white`}
            >
              {isLoading ? <span className="loader"></span> : 'Send'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
