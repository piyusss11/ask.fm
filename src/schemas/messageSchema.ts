import { z } from "zod";

export const messageValidation = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(400, "Message cannot be longer than 400 characters"),
});
