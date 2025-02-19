import connnectDb from "@/config/dbConnect";
import UserModel from "@/model/User";
import { IApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const usernameQueryValidation = z.object({
  username: z
    .string()
    .min(3, "must be at least 3 characters long")
    .max(24, "must be at most 24 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters"),
});

export async function GET(req: NextRequest) {
  connnectDb();
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = usernameQueryValidation.safeParse(queryParams);
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return NextResponse.json<IApiResponse>(
        {
          message:
            usernameError?.length > 0
              ? usernameError.join(", ")
              : "Invalid Query Parameters",
          success: false,
        },
        {
          status: 400,
        }
      );
    }
    const { username } = result.data;

    const alreadyVerifedUserExists = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (alreadyVerifedUserExists) {
      return NextResponse.json<IApiResponse>(
        {
          message: "Username already exists",
          success: false,
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json<IApiResponse>(
      {
        message: "Username is available",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error checking username", error);
    return NextResponse.json<IApiResponse>(
      {
        message: "Error checking username",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
