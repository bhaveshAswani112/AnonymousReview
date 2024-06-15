import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { connectDb } from "@/lib/dbConnection";
import { UserModel } from "@/model/User";
import { User } from "next-auth";


export async function POST(request : Request){
    try {
        await connectDb()
        const session = await getServerSession(authOptions)
        const sessionUser : User  = session?.user as User
        if(!session || !sessionUser){
            return Response.json({
                message : "You are not authorized",
                success : false
            },{
                status : 400
            })
        }
        const {acceptMessages} = await request.json()
        const user  = await UserModel.findByIdAndUpdate(sessionUser._id , {
            isAccepting : acceptMessages
        },{
            new : true
        })
        if(!user){
            return Response.json({
                message : "Failed to update accept messages",
                success : false,
                user
            },{
                status : 400
            })
        }
        return Response.json({
            message : "Message acceptance status updated",
            success : true
        },{
            status : 200
        })

    } catch (error) {
        return Response.json({
            message : "Failed to update accept messages",
            success : false
        },{
            status : 500
        })
    }
    
}

export async function GET(request : Request) {
    try {
        await connectDb()
        const session = await getServerSession()
        const sessionUser : User = session?.user as User
        if(!session || !sessionUser){
            return Response.json({
                message : "You are not authorized",
                success : false
            },{
                status : 400
            })
        }
        const user = await UserModel.findOne({_id : sessionUser._id})
        if(!user){
            return Response.json({
                message : "Failed to get accept messages status",
                success : false
            },{
                status : 400
            })
        }
        return Response.json({
            message : "Accepting message status received",
            success : false,
            isAcceptingMessage : user.isAccepting
        },{
            status : 200
        })
    } catch (error) {
        console.log(error)
        return Response.json({
            
            message : "Failed to get accept messages status",
            success : false
        },{
            status : 500
        })
    }
}