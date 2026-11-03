import { z } from 'zod';

export const createRequestSchema = z.object({
  body: z.object({
    patientName: z.string().min(2, 'Patient name is required'),
    patientRelation: z.string().min(2, 'Patient relation is required'),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
    unitsRequired: z.number().int().min(1).max(10),
    hospitalName: z.string().min(3, 'Hospital name is required'),
    hospitalLocation: z.string().min(2, 'Hospital location is required'),
    division: z.enum([
      'Dhaka',
      'Chattogram',
      'Barishal',
      'Khulna',
      'Rajshahi',
      'Sylhet',
      'Rangpur',
      'Mymensingh',
    ]),
    requiredDate: z.string().min(5, 'Required date is required'),
    requiredTime: z.string().min(2, 'Required time is required'),
    contactPhone: z.string().min(10, 'Primary contact phone is required'),
    alternatePhone: z.string().optional(),
    description: z.string().optional(),
    urgency: z.enum(['normal', 'urgent', 'critical']).default('urgent'),
  }),
});

export const updateRequestSchema = z.object({
  body: z.object({
    unitsRequired: z.number().int().min(1).max(10).optional(),
    requiredDate: z.string().optional(),
    requiredTime: z.string().optional(),
    hospitalName: z.string().optional(),
    hospitalLocation: z.string().optional(),
    description: z.string().optional(),
    contactPhone: z.string().optional(),
    urgency: z.enum(['normal', 'urgent', 'critical']).optional(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['active', 'partially_fulfilled', 'fulfilled', 'expired', 'cancelled']),
    unitsFulfilled: z.number().int().min(0).optional(),
  }),
});

