import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(31),
  email: z.string().email(),
  password_hash: z.string().min(6).max(255).nullable(),
  github_id: z.string().nullable().optional(),
  google_id: z.string().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = userSchema
  .pick({ id: true, username: true, email: true })
  .merge(z.object({ password: z.string().min(6).max(255) }));

export type CreateUser = z.infer<typeof createUserSchema>;

export const createOAuthUserSchema = userSchema
  .pick({
    id: true,
    username: true,
    email: true,
    github_id: true,
    google_id: true,
  })
  .extend({ password_hash: z.null() });

export type CreateOAuthUser = z.infer<typeof createOAuthUserSchema>;
