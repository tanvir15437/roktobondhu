import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { StoreService } from '../services/store.service';
import { successResponse, errorResponse } from '../utils/response';
import { calculateEligibility } from '../utils/eligibility';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await StoreService.findUserById(req.user!._id);
    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }
    const eligibility = calculateEligibility(user.lastDonationDate);
    const data = {
      ...(user.toObject ? user.toObject() : user),
      isEligible: eligibility.isEligible,
      nextEligibleDate: user.nextEligibleDate || eligibility.nextEligibleDate,
      eligibilityDetails: eligibility,
    };
    successResponse(res, data, 'User profile retrieved');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const allowedUpdates = [
      'name',
      'phone',
      'email',
      'bloodGroup',
      'division',
      'location',
      'dateOfBirth',
      'settings',
    ];

    const updates: Record<string, any> = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedUser = await StoreService.updateUser(req.user!._id, updates);
    if (!updatedUser) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    const eligibility = calculateEligibility(updatedUser.lastDonationDate);
    successResponse(
      res,
      {
        ...(updatedUser.toObject ? updatedUser.toObject() : updatedUser),
        isEligible: eligibility.isEligible,
      },
      'Profile updated successfully'
    );
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const updateAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { isAvailable } = req.body;
    if (typeof isAvailable !== 'boolean') {
      errorResponse(res, 'isAvailable must be a boolean', 400);
      return;
    }

    const user = await StoreService.updateUser(req.user!._id, { isAvailable });

    successResponse(
      res,
      { isAvailable: user?.isAvailable },
      `Availability status updated to ${isAvailable ? 'Available' : 'Unavailable'}`
    );
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const getDonors = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bloodGroup, division, isAvailable } = req.query;

    const filter: Record<string, any> = {
      'settings.showInDonorDirectory': true,
    };

    if (bloodGroup && bloodGroup !== 'ALL') {
      filter.bloodGroup = bloodGroup;
    }

    if (division && division !== 'ALL') {
      filter.division = division;
    }

    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === 'true';
    }

    const donors = await StoreService.findDonors(filter);

    const formattedDonors = donors.map((d: any) => {
      const eligibility = calculateEligibility(d.lastDonationDate);
      return {
        ...d,
        isEligible: eligibility.isEligible,
      };
    });

    successResponse(res, formattedDonors, 'Donors retrieved successfully');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};
