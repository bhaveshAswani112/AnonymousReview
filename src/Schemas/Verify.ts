import {z} from "zod"

export const VerifySchema = z.object({
    code : z.string().length(6,"Code should be of length 6")
})