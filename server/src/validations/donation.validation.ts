import { z } from 'zod';

export const createDonationSchema = z.object({
  body: z.object({
    donationDate: z.string().min(8, 'Donation date is required'),
    hospitalName: z.string().min(2, 'Hospital name is required'),
    location: z.string().min(2, 'Location is required'),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
    units: z.number().int().min(1).max(3).default(1),
    notes: z.string().optional(),
  }),
});

