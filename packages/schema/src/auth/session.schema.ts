import z from "zod";

export const sessionSchema = z.object({
  device: z.record(z.any()),
  refreshToken: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastUsedAt: z.string(),
  expiresAt: z.date(),
  isRevoked: z.boolean(),
});

export type Session = z.infer<typeof sessionSchema>;