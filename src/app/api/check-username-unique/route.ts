import { UsernameValidation } from "@/Schemas/SignUp";
import { connectDb } from "@/lib/dbConnection";
import {z} from "zod"
import { UserModel } from "@/model/User";

const UsernameQuerySchema = z.object({
    username : UsernameValidation 
})




export async function GET(request : Request) {
    try {
        await connectDb()
        const {searchParams} = new URL(request.url)
        const queryparam = {
            username : searchParams.get("username")
        }
        console.log(searchParams.get("username"))
        const resp = UsernameQuerySchema.safeParse(queryparam)
        // console.log(resp.error?.message)
        if(!resp.success){
            const usernameErrors = resp.error.format().username?._errors || []
            return Response.json({
                message : usernameErrors?.length>0 ? usernameErrors?.join(", ") : "Invalid username",
                success : false
            },{
                status : 400
            })
        }
        const {username} = resp.data
        const existingUser = await UserModel.findOne({
            username,
            isVerified : true
        })
        if(existingUser){
            return Response.json({
                message : "Username is taken",
                success : false
            },{
                status : 400
            })
        }
        return Response.json({
            message : "Username is available",
            success : true
        },{
            status : 200
        })
    } catch (error) {
        return Response.json({
            message : "Error in checking username",
            success : false
        },{
            status : 500
        })
    }
}   