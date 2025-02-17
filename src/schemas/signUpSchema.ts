import { z } from "zod";

export const signupValidation = z.object({
  username: z
    .string()
    .min(3, "must be at least 3 characters long")
    .max(24, "must be at most 24 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters"),
  email: z.string().email("Please use a valid email address"),
  password: z
    .string()
    .min(8, "must be at least 8 characters long")
    .max(32, "must be at most 32 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    ),
});


