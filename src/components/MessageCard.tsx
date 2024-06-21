"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"

  import { X } from "lucide-react"
import { Message } from "@/model/User"
import axios from "axios"
import { toast } from "./ui/use-toast"
  


type MessageType = {
    Message : Message,
    handleMessageDelete : (messageId : string) => void
}

function MessageCard({Message , handleMessageDelete} : MessageType) {

    const handleDelete = async () => {
        try {
            console.log(Message._id)
            const res = await axios.delete(`/api/delete-message/${Message._id}`)
            toast({
                title : "Success",
                description : res?.data?.message || "Message deleted successfully."
            })
            // @ts-ignore
            handleMessageDelete(Message._id)
        } catch (error : any) {
          console.log(error)
            toast({
                title : "Failed",
                description : error?.response?.data?.message || "Error in Message deletion.",
                variant : "destructive"
            })
        }
    }
  return (
<Card>
  <CardHeader>
    <CardTitle>{Message.content}</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="py-2 px-1"  variant="destructive"><X className="w-5 h-5" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    
  </CardHeader>
</Card>

  )
}

export default MessageCard