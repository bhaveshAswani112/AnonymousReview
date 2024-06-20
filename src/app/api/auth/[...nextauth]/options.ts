import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDb } from "@/lib/dbConnection";
import { UserModel } from "@/model/User";
import bcrypt from "bcryptjs"



export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            name : "Credentials",
            credentials : {
                email : {label : "Email" , type:"email",placeholder:"Enter your mail id"},
                password : {label : "Password" , type:"password",placeholder:"Enter your password"}
            },
            async authorize(credentials) : Promise<any>{
                try {
                    await connectDb()
                    console.log(credentials?.email)
                    const existingUser = await UserModel.findOne({
                        email : credentials?.email
                    })
                    if(existingUser){
                        if(!existingUser.isVerified){
                            throw new Error("User is not verified")
                        }
                        const passwordCheck = await bcrypt.compare(credentials?.password || "",existingUser.password)
                        if(!passwordCheck){
                            throw new Error("Incorrect password")
                        }
                        return existingUser
                    }
                    else{
                        throw new Error("User does not exist")
                    }
                } catch (error) {
                    // @ts-ignore
                    throw new Error(error?.message || "Error during sign in")
                }
            }
        })
    ],
    callbacks : {
        async jwt({ token , user}) {
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified,
                token._isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token
        },

        async session({session , token}) {
            if(token){
                session.user._id = token._id
                session.user.username = token.username
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
            }
            return session
        },
    },
    session : {
        strategy : "jwt"
    },
    pages : {
        signIn : "/sign-in"
    },
    secret : process.env.NEXTAUTH_SECRET,
}