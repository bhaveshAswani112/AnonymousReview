import { Resend } from 'resend';


// console.log("I am resend api key " + process.env.RESEND_API_KEY)

const api_key : string = process.env.RESEND_API_KEY || ""
export const resend = new Resend(api_key);
