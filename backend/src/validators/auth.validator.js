const { z } = require('zod');

// Email validation with strict rules
const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must not exceed 255 characters')
  .toLowerCase()
  .trim();

// Password validation with security requirements
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Name validation
const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must not exceed 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .trim();

// Role validation
const roleSchema = z.enum(['customer', 'engineer', 'rider', 'admin'], {
  errorMap: () => ({ message: 'Role must be customer, engineer, rider, or admin' })
});

// Sign Up Schema
const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: nameSchema,
  role: roleSchema
});

// Sign In Schema
const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

// Refresh Token Schema
const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

module.exports = {
  signUpSchema,
  signInSchema,
  refreshTokenSchema
};
