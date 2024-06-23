"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {VerifySchema} from "@/Schemas/Verify"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from "@/components/ui/use-toast"
import { useParams , useRouter } from "next/navigation"
import axios from "axios"



export default function Page() {
  
  const form = useForm<z.infer<typeof VerifySchema>>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      code: "",
    },
  })
  const router = useRouter()
  const {username} = useParams()
  async function onSubmit(data: z.infer<typeof VerifySchema>) {
      const finaldata = {
        username,
        code : data.code
      }
      try {
        const resp = await axios.post("/api/verify-code",finaldata)
        toast({
          title : "Success",
          description : resp?.data?.message
        })
        router.replace("/sign-in")
      } catch (error : any) {
        toast({
          title : "Failed",
          description : error?.response?.data?.message || "OTP verification failed",
          variant : "destructive"
        })
      }

  }

  return (
    <div className="h-screen flex justify-center items-center dark:bg-slate-800 bg-slate-800">
      <div className="w-full max-w-md p-8 bg-white rounded-md shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="text-black">
                    Please enter the one-time password sent to your mail id.
                  </FormDescription>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-blue-500 text-white">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
