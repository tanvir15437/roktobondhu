import { z } from 'zod';

export const createConnectionSchema = z.object({
  body: z.object({
    requestId: z.string().min(1, 'Request ID is required'),
    contactMethod: z.enum(['call', 'sms', 'whatsapp']).default('call'),
    donorName: z.string().optional(),
    donorPhone: z.string().optional(),
  }),
});
