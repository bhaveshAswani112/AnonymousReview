"use client"

import {useState} from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { toast } from "@/components/ui/use-toast"
import { ApiResponse } from "@/types/ApiResponse"


export default function Page({params} : any ) {
  const [isSending , setIsSending] = useState(false)
  const username = params.username
  const [message,setMessage] = useState("")

  const sendMessage = async () => {
    try {
      setIsSending(true)
      const resp = await axios.post<ApiResponse>("/api/send-message",{
        username,content : message
      })
      console.log(resp)
      toast({
        title : "Success",
        description : resp.data.message
      })
    } catch (error : any) {
        toast({
          title : "Failed",
          description : error.response.data.message || "Message send failed",
          variant : "destructive"
        })
      
    }
  }

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input onChange={(e) => {
        setMessage(e.target.value)
      }}  type="text" placeholder="Write your Review" />
      <Button onClick={sendMessage} type="button">Send</Button>
    </div>
  )
}