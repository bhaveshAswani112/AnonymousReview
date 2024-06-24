import { connectDb } from "@/lib/dbConnection";
import { UserModel } from "@/model/User";
import {Message} from "@/model/User"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request : Request){
    try {
        await connectDb()
        console.log("Hello from sendmessage")
        const {username , content}  = await request.json()
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                message : "No user exist with this username",
                success : false
            },{
                status : 400
            })
        }
        if(!user.isAccepting){
            return Response.json({
                message : "User is not accepting messages",
                success : false
            },{
                status : 403
            })
        }
        let sessionUser: User | null = null
        if(user?.onlyLoggedInUser){
            const session = await getServerSession(authOptions)
            sessionUser   = session?.user as User
            if(!session || !sessionUser){
                return Response.json({
                    message : "Only Logged in User can send message to this user",
                    success : false
                },{
                    status : 403
                })
            }
        }
        
        const message  = {
            content,
            createdAt : new Date(),
            sentBy : sessionUser
        }
        user.Messages.push(message as Message)
        await user.save()
        return Response.json({
            message : "Message sent successfully",
            success : true
        },
    {
        status : 200
    })

    } catch (error) {
        // @ts-ignore
        console.log("Error in sending message " + error.message)
        return Response.json({
            message : "Error in sending message",
            success : false
        },{
            status : 500
        })
    }
}