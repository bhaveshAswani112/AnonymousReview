import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { connectDb } from "@/lib/dbConnection";
import { UserModel } from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

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
        const userId = new mongoose.Types.ObjectId(sessionUser._id)
        const messages = await UserModel.aggregate([
            {$match : {id : userId}},
            {$unwind : '$Messages'},
            {$sort : {"Messages.createdAt" : -1}},
            {$group : {_id : "$_id" , Messages : {$push : "$Messages"}}}
        ])

        if(!messages){
            return Response.json({
                message : "User not found",
                success : false,
            },{
                status : 400
            })
        }
        if(messages.length==0){
            return Response.json({
                message : "No Messages for user",
                success : false
            },{
                status : 400
            })
        }
        return Response.json({
            messages : messages[0].Messages,
            success : true
        },{
            status : 200
        })
    } catch (error : any) {
        console.log("Error during get message " + error.message)
        return Response.json({
            message : "Error in get messages",
            success : false
        },{
            status : 500
        })
    }
}