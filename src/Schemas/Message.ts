import {z} from "zod"

export const MessageSchema = z.object({
    Content : z.string().min(3,{message : "Content should be of atleast 3 characters"}).max(500,{message : "Content should not be greater than 500 characters"})
})