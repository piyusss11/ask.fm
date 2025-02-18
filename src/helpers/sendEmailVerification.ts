import VerificationEmail from "@/components/emailTemplate/VerificationEmail";
import { resend } from "@/lib/resend";
import { IApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  VerifyCode: string
): Promise<IApiResponse> {
  try {
    await resend.emails.send({
      from: "you@example.com",
      to: email,
      subject: "Askme.fm | Verification Code",
      react: VerificationEmail({ username, otp: VerifyCode }),
    });
    return { message: "Verification email sent successfully", success: true };
  } catch (error) {
    console.error("Error sending verification Email", error);
    return { message: "Failed to send verification email", success: false };
  }
}
