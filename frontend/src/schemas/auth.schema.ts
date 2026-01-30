import { z } from 'zod';

import { createResourceResponseSchema } from './common.schema';

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

/**
 * User schema
 */
export const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.string().email(),
  email_verified_at: z.string().datetime().nullable(),
  role: z.string().optional(),
  avatar_url: z.string().url().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

/**
 * Login input schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  remember: z.boolean().optional(),
});

/**
 * Register input schema
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Họ tên không được để trống')
      .max(255, 'Họ tên không được quá 255 ký tự'),
    email: z
      .string()
      .min(1, 'Email không được để trống')
      .email('Email không hợp lệ'),
    password: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
      ),
    password_confirmation: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['password_confirmation'],
  });

/**
 * Auth tokens schema
 */
export const authTokensSchema = z.object({
  token: z.string(),
  refresh_token: z.string().optional(),
  expires_at: z.string().datetime().optional(),
});

/**
 * Login response schema
 */
export const loginResponseSchema = createResourceResponseSchema(
  z.object({
    user: userSchema,
    tokens: authTokensSchema,
  })
);

/**
 * Register response schema
 */
export const registerResponseSchema = loginResponseSchema;

/**
 * Current user response schema
 */
export const currentUserResponseSchema = createResourceResponseSchema(userSchema);

// ============================================================================
// INFERRED TYPES
// ============================================================================

export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthTokens = z.infer<typeof authTokensSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type CurrentUserResponse = z.infer<typeof currentUserResponseSchema>;
