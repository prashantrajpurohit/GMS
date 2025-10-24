import { z } from "zod";

// Common validation patterns
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const emailSchema = z.string().email("Please enter a valid email address");
const phoneSchema = z
  .string()
  .regex(phoneRegex, "Please enter a valid phone number");
const requiredString = (val: string) => z.string().min(1, `${val} is required`);
const requiredNumber = (val: string) => z.number().min(1, `${val} is required`);

// Staff/Faculty validation schema
export const staffSchema = z.object({
  fullName: requiredString("Name").min(2, "Name must be at least 2 characters"),
  email: emailSchema,
  phone: phoneSchema,
  role: requiredString("Role"),
  specialization: z.string().optional(),
  isActive: z.boolean(),
});

export const planSchema = z.object({
  code: z.string().min(1, "Plan code is required"),
  name: z.string().min(1, "Plan name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be a positive number"),
  duration: z.number().int().positive("Duration must be a positive integer"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  unit: z.enum(["days", "months", "years"], {
    required_error: "Duration unit is required",
  }),

  isActive: z.boolean(),
});

// Type inference

export const memberSchema = z.object({
  memberCode: z.string().min(1, "Member code is required"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(["male", "female", "other"]),
  weight: z.number().optional(),
  height: z.number().optional(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  address: z.string().min(1, "Address is required"),
  emergencyContact: z.string().optional(),
  photo: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  currentPlanId: z.string().min(1, "Current plan ID is required"),
  notes: z.string().optional(),
  batch: z.string().optional(),
});

export type StaffFormData = z.infer<typeof staffSchema>;
export type PlanInterface = z.infer<typeof planSchema>;
export type MemberInterface = z.infer<typeof memberSchema>;
