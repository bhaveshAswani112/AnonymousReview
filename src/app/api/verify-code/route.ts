import { VerifySchema } from "@/Schemas/Verify";
import { connectDb } from "@/lib/dbConnection";
import { UserModel } from "@/model/User";
import {z} from "zod"
import { UsernameValidation } from "@/Schemas/SignUp";


const UsernameQuerySchema = z.object({
    username : UsernameValidation,
})


export async function POST(request : Request){
    try {
        await connectDb()
        const {username , code} = await request.json()
        // console.log(username,code)
        // console.log(UsernameQuerySchema.safeParse({username}).success)
        // console.log(VerifySchema.safeParse({code}).success)
        const resp = UsernameQuerySchema.safeParse({username}).success && VerifySchema.safeParse({code}).success
        if(!resp){
            return Response.json({
                message : "Invalid details sent",
                success : false
            },{
                status : 400
            })
        }

        const user = await UserModel.findOne({
            username
        })

        if(!user){
            return Response.json({
                message : "No user exist with this username",
                success : false
            },{
                status : 400
            })
        }
        if(user.isVerified){
            return Response.json({
                message : "User is already verified.",
                success : false
            },{
                status : 400
            })
        }
        const date = new Date()
        if(user.verifyCode!==code){
            return Response.json({
                message : "Wrong OTP entered",
                success : false
            },{
                status : 400
            })
        }
        if(user.verifyCodeExpiry<date){
            return Response.json({
                message : "OTP expired",
                success : false
            },{
                status : 400
            })
        }

        user.isVerified = true;
        await user.save()
        return Response.json({
            message : "User verified successfully.",
            success : true
        },{
            status : 200
        })


    } catch (error) {
        return Response.json({
                message : "Error in verifying code",
                success : false
            },
            {
                status : 500
            })
    }
}