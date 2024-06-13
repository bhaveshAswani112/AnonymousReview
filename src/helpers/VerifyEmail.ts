import {resend} from "@/lib/resendMail"
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export const sendEmail = async (username : string , email : string , verifyCode : string) : Promise<ApiResponse> => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anonymous Review verification code',
            react: VerificationEmail({username,otp:verifyCode})
          });
        return {success : true , message : "Verification email sent successfully."}
    } catch (error) {
        console.error("Error during sending email")
        return {success : false , message : "Error in sending verification email"}
    }
}