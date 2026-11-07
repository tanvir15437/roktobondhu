import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Valid email address is required'),
    phone: z.string().min(10, 'Valid Bangladeshi phone number is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], {
      errorMap: () => ({ message: 'Please select a valid blood group' }),
    }),
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
    location: z.string().min(2, 'Location is required'),
    dateOfBirth: z.string().optional(),
    rolePreference: z.enum(['donor', 'requester', 'both']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(3, 'Email or phone number is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
    email: z.string().email().optional(),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).optional(),
    division: z
      .enum(['Dhaka', 'Chattogram', 'Barishal', 'Khulna', 'Rajshahi', 'Sylhet', 'Rangpur', 'Mymensingh'])
      .optional(),
    location: z.string().optional(),
    dateOfBirth: z.string().optional(),
    isAvailable: z.boolean().optional(),
    settings: z
      .object({
        smsUrgentAlerts: z.boolean().optional(),
        emailDigest: z.boolean().optional(),
        hidePhoneUntilContact: z.boolean().optional(),
        showInDonorDirectory: z.boolean().optional(),
      })
      .optional(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    identifier: z.string().min(3, 'Phone number or email is required'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    identifier: z.string().min(3, 'Phone number or email is required'),
    otp: z.string().min(6, '6-digit verification code is required').max(6, 'Verification code must be 6 digits'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});

