import { z } from "zod";

export const tokenValidation = z.object({
  token: z.string().length(6, "Token must be 6 characters long"),
});
