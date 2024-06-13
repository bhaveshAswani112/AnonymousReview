import {z} from "zod"

export const AcceptingSchema = z.object({
    acceptingMessage : z.boolean()
})