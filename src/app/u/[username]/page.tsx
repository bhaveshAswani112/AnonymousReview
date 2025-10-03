"use client"
import { useEffect, useState } from "react"
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
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

const formSchema = z.object({
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

export default function Page({ params }: { params: { username: string } }) {
  const username = params.username
  const [isLoading, setIsLoading] = useState(false)
  const [getMessage , setGetMessage] = useState(false)
  const [messages , setMessages] = useState<string[]>([])
  const { data: session } = useSession()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })
  const router = useRouter()

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

  const fetchingMessages = async () => {
    try {
      setGetMessage(true)
      const response = await axios.post<ApiResponse>("/api/suggest-message")
      const mess = response.data.message.split("||")
      setMessages(mess)
      toast({
        title: "Success",
        description: "Messages fetched successfully"
      })
    } catch (error: any) {
      console.log(error)
      toast({
        title: "Failed",
        description: error.response.data.message || "Can't able to get messages",
        variant: "destructive"
      })
    } finally {
      setGetMessage(false)
    }
  }

  const handleNavigationClick = () => {
    if (session) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 to-black">
      <div className="absolute top-4 right-4">
        <Button 
          onClick={handleNavigationClick}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg transition-all duration-300"
        >
          {session ? 'Dashboard' : 'Login'}
        </Button>
      </div>
      <div className="bg-gray-900 rounded-lg shadow-lg p-10 max-w-lg w-full text-center mb-6">
        <h1 className="text-3xl font-extrabold mb-6 text-white">Send a Message to {username}</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Your Message</FormLabel>
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
      <div className="bg-gray-900 rounded-lg shadow-lg p-10 max-w-lg w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Message Suggestions</h2>
        <Button 
          disabled={getMessage} 
          onClick={fetchingMessages} 
          className={`mb-4 w-full py-2 px-4 rounded-lg transition-all duration-300 ${
            getMessage ? 'bg-blue-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
          } text-white`}
        >
          Suggest Messages
        </Button>
        <div className="text-white">
          {messages && messages.length > 0 ? (
            messages.map((mess, index) => (
              <div key={index} className="mb-2">
                {mess}
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  )
}