"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInSchema = void 0;
const zod_1 = require("zod");
exports.signInSchema = zod_1.z.object({
    email: zod_1.z.string()
        .min(1, "Email is required!")
        .email("Please enter a valid email address")
        .describe("The user's email address")
        .transform(val => val.toLowerCase().trim()),
    password: zod_1.z.string()
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
