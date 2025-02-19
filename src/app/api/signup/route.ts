import connectDb from "@/config/dbConnect";
import { generateVerificationCode } from "@/helpers/generatingOTP";
import { sendVerificationEmail } from "@/helpers/sendEmailVerification";
import UserModel from "@/model/User";
import { IApiResponse } from "@/types/ApiResponse";
import bcrypt from "bcryptjs";
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
    const { username, email, password } = await req.json();

    const isVerifiedUserAlreadyByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (isVerifiedUserAlreadyByUsername) {
      return NextResponse.json<IApiResponse>(
        {
          success: false,
          message: "UserName already exists",
        },
        {
          status: 400,
        }
      );
    }

    const isUserByEmail = await UserModel.findOne({ email });
    // generate verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiryTime = new Date(
      Date.now() + 2 * 60 * 60 * 1000
    );
    if (isUserByEmail) {
      if (isUserByEmail.isVerified) {
        // user already exists and is verified
        return NextResponse.json<IApiResponse>(
          {
            success: false,
            message: "User already exists with this email and is verified",
          },
          {
            status: 400,
          }
        );
      } else {
        // Update existing unverified user
        const passwordHash = await bcrypt.hash(password, 10);
        // updating user info
        isUserByEmail.password = passwordHash;
        isUserByEmail.verificationToken = verificationCode;
        isUserByEmail.verificationTokenExpiry = verificationCodeExpiryTime;
        await isUserByEmail.save();
      }
    } else {
      // Create new user
      const passwordHash = await bcrypt.hash(password, 10);
      await UserModel.create({
        username,
        email,
        password: passwordHash,
        verificationToken: verificationCode,
        verificationTokenExpiry: verificationCodeExpiryTime,
        messages: [],
      });
    }
    // send verification email
    const sendEmailResponse = await sendVerificationEmail(
      email,
      username,
      verificationCode
    );
    if (!sendEmailResponse.success) {
      return NextResponse.json<IApiResponse>(
        {
          success: false,
          message: sendEmailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json<IApiResponse>(
      {
        success: true,
        message: "User registered successfully, Now verify your email",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error registering the user", error);
    return NextResponse.json<IApiResponse>(
      {
        success: false,
        message: "Failed to register the user",
      },
      {
        status: 500,
      }
    );
  }
}
