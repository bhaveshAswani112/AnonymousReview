import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDb } from "@/lib/dbConnection";
import { UserModel } from "@/model/User";



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
                    const existingUser = await UserModel.findOne({
                        email : credentials?.email
                    })
                    if(existingUser){
                        if(existingUser.isVerified){
                            return existingUser
                        }
                        else{
                            throw new Error("User is not verified.")
                        }
                    }
                    else{
                        throw new Error("User does not exist")
                    }
                } catch (error) {
                    throw new Error("Error during sign in")
                }
            }
        })
    ],
    pages : {
        signIn : "/sign-in"
    },
    session : {
        strategy : "jwt"
    },
    secret : process.env.NEXTAUTH_SECRET,
    callbacks : {
        async jwt({ token , user}) {
            if(user){
                token._id = user._id
                token.isVerified = user.isVerified,
                token._isAcceptingMessages = user.isAccesptingMessages
                token.username = user.username
            }
            return token
        },

        async session({session , token}) {
            if(token){
                session.user._id = token._id
                session.user.username = token.username
                session.user.isVerified = token.isVerified
                session.user.isAccesptingMessages = token.isAcceptingMessages
            }
            return session
        },
    }
}