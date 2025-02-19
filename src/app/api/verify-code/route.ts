import connectDb from "@/config/dbConnect";
import UserModel from "@/model/User";
import { IApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
  } catch (error) {
    console.error("Database connection failed:", error);
    return NextResponse.json<IApiResponse>(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 }
    );
  }
  try {
    const { username, otp } = await req.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return NextResponse.json<IApiResponse>(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    const isOtpValid = user.verificationToken === otp;
    const isOtpExpired = new Date(user.verificationTokenExpiry) < new Date();
    if (!isOtpValid) {
      return NextResponse.json<IApiResponse>(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 400 }
      );
    }
    if (isOtpExpired) {
      return NextResponse.json<IApiResponse>(
        {
          success: false,
          message: "OTP expired",
        },
        { status: 400 }
      );
    }

    if (isOtpValid && !isOtpExpired) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json<IApiResponse>(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Error verifying user", error);
    return NextResponse.json<IApiResponse>(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
