import { z } from "zod";

export const createServiceValidationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters long"),
  price: z.coerce.number().min(0, "Price must be greater than or equal to 0"),
  estimatedDuration: z.coerce.number().positive().optional(),
  serviceType: z.enum(["FREE", "PAID"]).default("FREE"),
  departmentId: z.string().trim().min(1, "Department ID is required"),
  categoryId: z.string().trim().min(1, "Category ID is required"),
});

export const createCategoryValidationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters long"),
  departmentId: z.string().trim().min(1, "Department ID is required"),
});

export const createRequestValidationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("COMPLAINT"),
    title: z.string().trim().min(3, "Title must be at least 3 characters long"),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters long"),
    categoryId: z.string().trim().min(1, "Category ID is required"),
    serviceId: z.string().trim().optional(),
    location: z.object({
      address: z
        .string()
        .trim()
        .min(5, "Address must be at least 5 characters long"),
      latitude: z.string().trim().optional(),
      longitude: z.string().trim().optional(),
      area: z.string().trim().min(2, "Area must be at least 2 characters long"),
      city: z.string().trim().min(2, "City must be at least 2 characters long"),
    }),
  }),
  z.object({
    type: z.literal("SERVICE_REQUEST"),
    serviceId: z.string().trim().min(1, "Service ID is required"),
    location: z.object({
      address: z
        .string()
        .trim()
        .min(5, "Address must be at least 5 characters long"),
      latitude: z.string().trim().optional(),
      longitude: z.string().trim().optional(),
      area: z.string().trim().min(2, "Area must be at least 2 characters long"),
      city: z.string().trim().min(2, "City must be at least 2 characters long"),
    }),
  }),
]);

export const feedbackValidationSchema = z.object({
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z.string().trim().max(1000).optional(),
});
