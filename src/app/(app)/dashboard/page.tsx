"use client"


import React, { useCallback, useEffect, useState } from 'react'
import { Message } from '@/model/User'
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AcceptingSchema } from '@/Schemas/Accepting';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { User } from 'next-auth';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCcw } from 'lucide-react';
import MessageCard from '@/components/MessageCard';
function page() {
  const [messages , setMessages] = useState<Message[]>([]);
  const [isLoading , setIsLoading] = useState(false)
  const [isSwitchLoading , setIsSwitchLoading] = useState(false)
  const {toast} = useToast()

  const {data : session} = useSession()
  const form = useForm({
    resolver : zodResolver(AcceptingSchema)
  })
  const {register , watch , setValue} = form
  const acceptMessages = watch('acceptMessages')

  const handleMessageDelete = (MessageId : string) => {
    setMessages(messages.filter((message) => message._id != MessageId))
  }

  const fetchAcceptMessage = useCallback(async () => {
    try {
      // console.log("Hello")
      setIsSwitchLoading(true)
      const resp = await axios.get<ApiResponse>("/api/accept-messages")
      // console.log(resp)
      setValue('acceptMessages' , resp.data.isAcceptingMessage)
    } catch (error : any) {
      toast({
        title : "Failed",
        description : error?.response?.data?.message || "Failed to fetch accept message setting",
        variant : "destructive"
      })
    } finally{
      setIsSwitchLoading(false)
    }

  },[setValue,toast])

  const fetchMessages = useCallback(async (refresh : boolean = false) => {
    try {
      setIsLoading(true)
      setIsSwitchLoading(true)
      const resp  = await axios.post<ApiResponse>("/api/get-messages")
      console.log(resp)
      setMessages(resp?.data?.messages || [])
      if(refresh){
        toast({
          title : "Getting fresh messages",
        })
      }
    } catch (error : any) {
      toast({
        title : "Failed",
        description : error?.response?.data?.message || "Failed to fetch messages",
        variant : "destructive"
      })
    }
    finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  },[setMessages,setIsLoading,toast])

  useEffect(() => {
    if(!session || !session?.user)return
    fetchMessages()
    fetchAcceptMessage()
  },[session, setValue, toast, fetchAcceptMessage, fetchMessages])
  const handleSwitchChange = async () => {
    try {
      console.log("Hello from handleSwitchChange")
      const resp = await axios.post<ApiResponse>("/api/accept-messages",{
        acceptMessages : !acceptMessages
      })
      setValue('acceptMessages',!acceptMessages)
      toast({
        title : "Success",
        description : resp?.data?.message || "Message state updated successfully"
      })
    } catch (error : any) {
      console.log("error in handleSwitchChange")
      console.log(error)
      toast({
      title : "Failed",
      description : error?.response?.data?.message || "Failed to update accept message state",
      variant : "destructive"
    })
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title : "Profile URL copied"
    })
  }


  if(!session || !session?.user){
    return <div className='text-center mt-2 font-semibold'>Please Login</div>
  }
  const {username}  = session?.user as User
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
            key={index}
            Message={message}
            handleMessageDelete={handleMessageDelete}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default page