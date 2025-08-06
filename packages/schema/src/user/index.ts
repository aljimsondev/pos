import z from "zod";

export const userSchema =  z.object({});


export type User = z.infer<typeof userSchema>