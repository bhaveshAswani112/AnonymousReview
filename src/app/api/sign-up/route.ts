import { sendEmail } from "@/helpers/VerifyEmail";
import { connectDb } from "@/lib/dbConnection";
import { UserModel } from "@/model/User";
import bcrypt from "bcryptjs"

export async function POST(request : Request) {
    try {
        await connectDb()
        const {username , email , password} = await request.json()
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours()+1)
        const existingUser = await UserModel.findOne({
            email
        })
        if(existingUser){
            if(existingUser?.isVerified){
                return Response.json({
                    success : false,
                    message : "User with this mail id already exist"
                },
                {
                    status : 400
                })
            }
            else{
                const hashedPassword = await bcrypt.hash(password,10)
                existingUser.password = hashedPassword
                existingUser.verifyCode = verifyCode
                existingUser.verifyCodeExpiry = expiryDate
                await existingUser.save()
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password,10)
            await UserModel.create({
                username,
                email,
                password : hashedPassword,
                verifyCode,
                verifyCodeExpiry : expiryDate

            })
        }
            const emailVerification = await sendEmail(username,email,verifyCode)
            // console.log(emailVerification)
            if(!emailVerification.success){
                return Response.json({
                    success : false,
                    message : emailVerification.message
                },
                {
                    status : 500
                })
            }
            return Response.json({
                success : true,
                message : "User registered successfully. Please verify your email."
            },
            {
                status : 200
            })
        
    } catch (error : any) {
        console.error("Error registring user " + error.message)
        Response.json({
            message : "User registration failed",
            success : false
        },
    {
        status : 500
    })
    }
}