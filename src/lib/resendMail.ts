import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// console.log("I am resend api key " + process.env.RESEND_API_KEY)

const api_key : string = process.env.RESEND_API_KEY || "re_123"
export const resend = new Resend(api_key);



const transporter = nodemailer.createTransport({
    service: 'gmail', // Use a service like Gmail, Outlook, etc.
    auth: {
      user: process.env.SENDER, 
      pass: process.env.PASSWORD,   
    },
  });

export {transporter}
