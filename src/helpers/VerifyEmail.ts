import {resend , transporter} from "@/lib/resendMail"
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export const sendEmail = async (username : string , email : string , verifyCode : string) : Promise<ApiResponse> => {
    try {
        console.log("In send email")
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


export const sendEmailNodemail = async (username: string, email: string, verifyCode: string, url: string): Promise<ApiResponse> => {
    try {
      // Generate email content (convert JSX to HTML if using a component)
      const htmlContent = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <title>Verification Code</title>
  <style>
    @font-face {
      font-family: 'Roboto';
      src: url('https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2') format('woff2');
      font-weight: 500;
      font-style: normal;
    }
    body {
      font-family: 'Roboto', Verdana, sans-serif;
      margin: 0;
      padding: 0;
      line-height: 1.5;
    }
    .section {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .row {
      margin-bottom: 15px;
    }
    .heading {
      font-size: 24px;
      font-weight: bold;
    }
    .text {
      font-size: 16px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #61dafb;
      color: white;
      text-decoration: none;
      font-weight: bold;
      border-radius: 5px;
    }
    .button:hover {
      background-color: #4da6d8;
    }
  </style>
</head>
<body>
  <div class="section">
    <div class="row">
      <h2 class="heading">Hello ${username},</h2>
    </div>
    <div class="row">
      <p class="text">
        Thank you for registering with us. Please use the following verification code to complete your registration with anonify :
      </p>
    </div>
    <div class="row">
      <p class="text" style="font-size: 18px; font-weight: bold;"> ${verifyCode} </p>
    </div>
    <div class="row">
      <p class="text">
        If you did not request this code, please ignore this email.
      </p>
    </div>
    <div class="row">
      <a 
        href="${url}/verify/${username}" 
        class="button"
      >
        Verify here
      </a>
    </div>
  </div>
</body>
</html>
`
  
      // Email options
      const mailOptions : any = {
        from: 'aswanib133@gmail.com', // Sender's email address
        to: email,                    // Receiver's email address
        subject: 'Anonymous Review Verification Code',
        html: htmlContent,            // HTML content of the email
      };
  
      // Send email
      await transporter.sendMail(mailOptions);
  
      return { success: true, message: 'Verification email sent successfully.' };
    } catch (error) {
      console.error('Error during sending email:', error);
      return { success: false, message: 'Error in sending verification email.' };
    }
  };