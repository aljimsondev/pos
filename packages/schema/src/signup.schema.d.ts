import { z } from "zod";
export declare const signupSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    first_name: z.ZodString;
    last_name: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["admin", "manager", "cashier", "inventory", "reporting"]>>;
    email: z.ZodEffects<z.ZodString, string, string>;
    password: z.ZodString;
    confirm_password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: "admin" | "manager" | "cashier" | "inventory" | "reporting";
    confirm_password: string;
}, {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    confirm_password: string;
    role?: "admin" | "manager" | "cashier" | "inventory" | "reporting" | undefined;
}>, {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: "admin" | "manager" | "cashier" | "inventory" | "reporting";
    confirm_password: string;
}, {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    confirm_password: string;
    role?: "admin" | "manager" | "cashier" | "inventory" | "reporting" | undefined;
}>, {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: "admin" | "manager" | "cashier" | "inventory" | "reporting";
    confirm_password: string;
}, {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    confirm_password: string;
    role?: "admin" | "manager" | "cashier" | "inventory" | "reporting" | undefined;
}>;
export type SignupFormData = z.infer<typeof signupSchema>;
//# sourceMappingURL=signup.schema.d.ts.map