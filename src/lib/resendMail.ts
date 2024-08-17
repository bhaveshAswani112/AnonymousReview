import { Resend } from 'resend';


// console.log("I am resend api key " + process.env.RESEND_API_KEY)
export const resend = new Resend(process.env.RESEND_API_KEY);
