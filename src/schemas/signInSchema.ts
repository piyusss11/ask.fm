import { z } from "zod";

export const signinValidation = z.object({
  identifier: z.string(),
  password: z.string(),
});
