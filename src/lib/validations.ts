import { z } from 'zod';

export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  date: z
    .string()
    .min(1, 'Date is required')
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  capacity: z
    .number({ invalid_type_error: 'Capacity must be a number' })
    .int('Capacity must be a whole number')
    .min(1, 'Capacity must be at least 1')
    .max(10000, 'Capacity cannot exceed 10,000'),
});

export const attendeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
});

export type EventFormData = z.infer<typeof eventSchema>;
export type AttendeeFormData = z.infer<typeof attendeeSchema>;
