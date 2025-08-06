import { z } from "zod";

export const signInSchema = z.object({
  email: z.string()
    .min(1, "Email is required!")
    .email("Please enter a valid email address")
    .describe("The user's email address")
    .transform(val => val.toLowerCase().trim()),
    
  password: z.string()
    .min(1, "Password is required!")
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be less than 64 characters")
    .describe("The user's password (8-64 characters)")
})
.required()
.refine(data => !data.password.includes(" "), {
  message: "Password cannot contain spaces",
  path: ["password"]
});

// Type inference
export type SignInFormData = z.infer<typeof signInSchema>;