import { z } from "zod"

export const signupSchema = z.object({
    first_name:z.string().min(0,"First name is required!")
})