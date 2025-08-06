import { z } from "zod";
export declare const signInSchema: z.ZodEffects<z.ZodObject<{
    email: z.ZodEffects<z.ZodString, string, string>;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type SignInFormData = z.infer<typeof signInSchema>;
//# sourceMappingURL=signin.schema.d.ts.map