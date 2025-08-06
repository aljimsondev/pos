"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = void 0;
const zod_1 = require("zod");
const role_1 = require("./role");
// Reusable email validation
const emailSchema = zod_1.z.string()
    .min(1, "Email is required!")
    .email("Please enter a valid email address")
    .transform(val => val.toLowerCase().trim());
// Strong password requirements
const passwordSchema = zod_1.z.string()
    .min(1, "Password is required!")
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be less than 32 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
// Role enum for type safety
const roleSchema = zod_1.z.enum(role_1.ROLES, {
    errorMap: () => ({ message: `Role must be one of: ${role_1.ROLES.join(", ")}` })
});
exports.signupSchema = zod_1.z.object({
    first_name: zod_1.z.string()
        .min(1, "First name is required!")
        .max(50, "First name must be less than 50 characters")
        .regex(/^[A-Za-z]+$/, "First name can only contain letters"),
    last_name: zod_1.z.string()
        .min(1, "Last name is required!")
        .max(50, "Last name must be less than 50 characters")
        .regex(/^[A-Za-z]+$/, "Last name can only contain letters"),
    role: roleSchema.default("cashier"),
    email: emailSchema,
    password: passwordSchema,
    confirm_password: zod_1.z.string().min(1, "Please confirm your password")
})
    .refine(data => data.password !== `${data.first_name}${data.last_name}`, {
    message: "Password cannot contain your name",
    path: ["password"]
})
    .refine(data => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"]
});
