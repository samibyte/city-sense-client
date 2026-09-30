import { z } from "zod";

/** Mirrors the API's CitizenRegisterZodSchema. */
const passwordSchema = z
  .string()
  .min(6, "Password Must Minimum 6 Characters Long.")
  .regex(/[a-z]/, "Password must contain at least 1 Lowercase Letter")
  .regex(/[A-Z]/, "Password must contain at least 1 Uppercase Letter")
  .regex(/[0-9]/, "Password must contain at least 1 Number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 Special Character");

export const loginValidationSchema = z.object({
  email: z.email("Please provide a valid email!"),
  password: z.string().min(1, "Please provide your password"),
});

export const registerValidationSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long!")
      .max(50, "Name must be at most 50 characters long!"),
    email: z.email("Please provide a valid email!"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phone: z.string().optional(),
    address: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const verifyAccountValidationSchema = z.object({
  email: z.email("Please provide a valid email!"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const forgotPasswordValidationSchema = z.object({
  email: z.email("Please provide a valid email!"),
});

export const resetPasswordValidationSchema = z
  .object({
    email: z.email("Please provide a valid email!"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
