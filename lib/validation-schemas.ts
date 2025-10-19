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
  name: requiredString("Name").min(
    2,
    "Name must be at least 2 characters"
  ),
  email: emailSchema,
  phone: phoneSchema,
  role: requiredString("Role"),
  specialization: z.string().optional(),
  isActive: z.boolean(),
});

export const planSchema = z.object({
  name: requiredString("Name").min(
    2,
    "Name must be at least 2 characters"
  ),

  durationValue: requiredNumber("Duration Value"),
  durationUnit: requiredString("Duration Unit"),
  price: requiredString("Price"),
  features: requiredString("Features"),
  description: requiredString("Description"),
  freezeDays: z.string().optional(),
});

export const memberSchema = z.object({
  name: requiredString("Name").min(
    2,
    "Name must be at least 2 characters"
  ),
  email: emailSchema,
  phone: phoneSchema,
  planType: requiredString("Plan type"),
  startDate: requiredString("startDate"),
  amount: requiredString("amount"),
  photo: requiredString("photo"),
  dob: requiredString("dob"),
  gender: requiredString("gender"),
  weight: requiredString("weight"),
  height: requiredString("height"),
  batch: requiredString("batch"),
});

export type StaffFormData = z.infer<typeof staffSchema>;
export type planFormData = z.infer<typeof planSchema>;
export type memberFormData = z.infer<typeof memberSchema>;

