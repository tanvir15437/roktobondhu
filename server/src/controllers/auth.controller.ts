import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { StoreService } from '../services/store.service';
import { signToken, setAuthCookie, clearAuthCookie } from '../utils/jwt';
import { successResponse, errorResponse } from '../utils/response';
import { calculateEligibility } from '../utils/eligibility';
import { AuthRequest } from '../middleware/auth.middleware';

const toSafeUser = (user: any) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.passwordHash;
  delete obj.__v;

  const eligibility = calculateEligibility(obj.lastDonationDate);
  return {
    ...obj,
    id: obj._id?.toString() || obj.id,
    isEligible: eligibility.isEligible,
    nextEligibleDate: obj.nextEligibleDate || eligibility.nextEligibleDate,
  };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, bloodGroup, division, location, dateOfBirth, rolePreference } = req.body;

    console.log(`[Auth] Registration request received: phone=${phone}, email=${email}`);

    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const cleanPhone = phone ? phone.trim() : '';

    if (!cleanPhone) {
      errorResponse(res, 'Phone number is required.', 400);
      return;
    }

    if (cleanEmail) {
      const existingEmail = await StoreService.findUserByEmailOrPhone(cleanEmail);
      if (existingEmail) {
        errorResponse(res, 'An account with this email address already exists.', 409);
        return;
      }
    }

    const existingPhone = await StoreService.findUserByEmailOrPhone(cleanPhone);
    if (existingPhone) {
      errorResponse(res, 'An account with this phone number already exists.', 409);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const initialEligibility = calculateEligibility(null);

    const user = await StoreService.createUser({
      name: name ? name.trim() : 'Anonymous Donor',
      email: cleanEmail || `${cleanPhone.replace(/\D/g, '')}@roktobondhu.org`,
      phone: cleanPhone,
      passwordHash,
      bloodGroup,
      division: division || 'Dhaka',
      location: location || division || 'Dhaka',
      dateOfBirth: dateOfBirth || '',
      role: 'user',
      isAvailable: true,
      lastDonationDate: null,
      nextEligibleDate: initialEligibility.nextEligibleDate,
      totalDonations: 0,
      settings: {
        smsUrgentAlerts: true,
        emailDigest: false,
        hidePhoneUntilContact: false,
        showInDonorDirectory: true,
      },
    });

    const userId = (user._id || user.id || '').toString();
    const token = signToken({
      userId,
      role: user.role || 'user',
      email: user.email,
    });

    setAuthCookie(res, token);
    console.log(`[Auth] User registered successfully: ${user.name} (ID: ${userId})`);
    successResponse(res, { user: toSafeUser(user), token }, 'Registration successful! Welcome to RoktoBondhu.', 201);
  } catch (error: any) {
    console.error('[Registration Error Details]', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      errorResponse(res, `An account with this ${field} already exists.`, 409);
      return;
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors || {}).map((val: any) => val.message);
      errorResponse(res, 'Validation error', 400, messages);
      return;
    }
    errorResponse(res, error.message || 'Registration failed', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    const user = await StoreService.findUserByEmailOrPhone(identifier);
    if (!user) {
      errorResponse(res, 'Invalid email/phone or password.', 401);
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      errorResponse(res, 'Invalid email/phone or password.', 401);
      return;
    }

    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    setAuthCookie(res, token);
    successResponse(res, { user: toSafeUser(user), token }, 'Logged in successfully.');
  } catch (error: any) {
    errorResponse(res, error.message || 'Login failed', 500);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  clearAuthCookie(res);
  successResponse(res, null, 'Logged out successfully.');
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    errorResponse(res, 'Unauthorized', 401);
    return;
  }
  successResponse(res, { user: toSafeUser(req.user) }, 'Session active.');
};

export const demoLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.params; // 'donor' | 'requester'
    const targetEmail = role === 'requester' ? 'tanjil.hasan@example.com' : 'rahim.ahmed@example.com';
    
    let user = await StoreService.findUserByEmailOrPhone(targetEmail);
    if (!user) {
      const defaultHash = await bcrypt.hash('password123', 10);
      user = await StoreService.createUser({
        name: role === 'requester' ? 'Tanjil Hasan' : 'Rahim Ahmed',
        email: targetEmail,
        phone: role === 'requester' ? '+880 1819-234567' : '+880 1712-345678',
        passwordHash: defaultHash,
        bloodGroup: role === 'requester' ? 'B+' : 'O+',
        division: 'Dhaka',
        location: role === 'requester' ? 'Shahbagh, Dhaka' : 'Dhanmondi, Dhaka',
        role: 'user',
        isAvailable: true,
        totalDonations: role === 'requester' ? 2 : 8,
        lastDonationDate: role === 'requester' ? '2025-11-20' : '2026-09-12',
        nextEligibleDate: role === 'requester' ? '2026-02-20' : '2026-12-15',
        settings: {
          smsUrgentAlerts: true,
          emailDigest: false,
          hidePhoneUntilContact: false,
          showInDonorDirectory: true,
        },
      });
    }

    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    setAuthCookie(res, token);
    successResponse(res, { user: toSafeUser(user), token }, `Switched to ${user.name} demo session.`);
  } catch (error: any) {
    errorResponse(res, error.message, 500);
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.body;
    const user = await StoreService.findUserByEmailOrPhone(identifier);

    if (!user) {
      errorResponse(res, 'No account found with this phone number or email address.', 404);
      return;
    }

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    const userId = (user._id || user.id).toString();
    await StoreService.updateUser(userId, {
      resetPasswordOtp: otp,
      resetPasswordExpires: expires,
    });

    console.log(`--------------------------------------------------`);
    console.log(`[PASSWORD RESET OTP]`);
    console.log(`User: ${user.name} | Identifier: ${identifier}`);
    console.log(`OTP Code: ${otp} (Valid for 10 minutes)`);
    console.log(`--------------------------------------------------`);

    successResponse(
      res,
      {
        identifier,
        phone: user.phone,
        email: user.email,
        demoOtp: otp, // surfaced for development & instant testing without paid SMS gateway
        expiresIn: '10 minutes',
      },
      `A 6-digit recovery code has been generated. Use code ${otp} to verify.`
    );
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to process password recovery request', 500);
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, otp, newPassword } = req.body;
    const user = await StoreService.findUserByEmailOrPhone(identifier);

    if (!user) {
      errorResponse(res, 'Account not found.', 404);
      return;
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp.trim()) {
      errorResponse(res, 'Invalid verification code. Please check the code and try again.', 400);
      return;
    }

    if (user.resetPasswordExpires && new Date() > new Date(user.resetPasswordExpires)) {
      errorResponse(res, 'Verification code has expired. Please request a new one.', 400);
      return;
    }

    // Hash the new password securely
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const userId = (user._id || user.id).toString();

    await StoreService.updateUser(userId, {
      passwordHash,
      resetPasswordOtp: null,
      resetPasswordExpires: null,
    });

    console.log(`[Password Reset Success] Password updated for ${user.name} (${user.phone})`);

    successResponse(
      res,
      null,
      'Your password has been successfully updated! You can now sign in with your new password.'
    );
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to reset password', 500);
  }
};

