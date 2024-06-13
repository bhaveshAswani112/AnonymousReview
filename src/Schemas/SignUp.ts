import {z} from "zod"

export const UsernameValidation = z.string().min(2,{message : "Username must contains atleast 2 characters"}).max(20,{message : "Username should not be greater than 20 character"}).regex(/^[a-zA-Z0-9_]+$/,"Username should not contain special characters other than underscore")


export const SignUpSchema = z.object({
    username : UsernameValidation,
    password : z.string().min(6,{message : "Password should be of atleast 6 characters"}),
    email : z.string().email({message : "Invalid email"}),

})