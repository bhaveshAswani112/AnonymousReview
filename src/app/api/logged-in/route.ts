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
        
        const {loggedIn} = await request.json()
        // console.log("I have accept messages")
        // console.log(acceptMessages)
        console.log(loggedIn)
        const user  = await UserModel.findByIdAndUpdate(sessionUser._id , {
            onlyLoggedInUser : loggedIn
        },{
            new : true
        })
        if(!user){
            return Response.json({
                message : "Failed to update logged In status",
                success : false,
            },{
                status : 400
            })
        }
        // console.log(user)
        return Response.json({
            message : "Status updated",
            success : true
        },{
            status : 200
        })

    } catch (error) {
        return Response.json({
            message : "Failed to update logged in status",
            success : false
        },{
            status : 500
        })
    }
    
}

export async function GET(request : Request) {
    try {
        // console.log("Hello from accept message status")
        await connectDb()
        const session = await getServerSession(authOptions)
        const sessionUser : User = session?.user as User
        if(!session || !sessionUser){
            return Response.json({
                message : "You are not authorized",
                success : false
            },{
                status : 400
            })
        }
        // console.log(sessionUser)
        const user = await UserModel.findOne({_id : sessionUser._id})
        if(!user){
            console.log("No user")
            return Response.json({
                message : "Failed to get logged in  status",
                success : false
            },{
                status : 400
            })
        }
        return Response.json({
            message : "Is logged in status received",
            success : true,
            isLoggedIn : user.onlyLoggedInUser
        },{
            status : 200
        })
    } catch (error) {
        console.log("Error in get logged in  status")
        console.log(error)
        return Response.json({
            message : "Failed to get logged in  status",
            success : false
        },{
            status : 500
        })
    }
}