import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { StoreService } from '../services/store.service';
import { calculateEligibility } from '../utils/eligibility';
import { successResponse, errorResponse } from '../utils/response';

export const getDonations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const donations = await StoreService.findDonationsByDonor(req.user!._id);
    const eligibility = calculateEligibility(req.user!.lastDonationDate);

    successResponse(
      res,
      {
        donations,
        stats: {
          totalDonations: donations.length,
          lastDonationDate: req.user!.lastDonationDate,
          nextEligibleDate: req.user!.nextEligibleDate || eligibility.nextEligibleDate,
          isEligible: eligibility.isEligible,
          eligibilityDetails: eligibility,
        },
      },
      'Donation records retrieved'
    );
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const addDonation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const donorId = req.user!._id;
    const { donationDate, hospitalName, location, bloodGroup, units = 1, notes } = req.body;

    const donation = await StoreService.createDonation({
      donorId,
      donationDate,
      hospitalName,
      location,
      bloodGroup,
      units,
      notes: notes || '',
      verified: true,
    });

    const userDonations = await StoreService.findDonationsByDonor(donorId);
    const totalDonations = userDonations.length;
    const latestDonation = userDonations[0];

    const eligibility = calculateEligibility(latestDonation?.donationDate);

    const updatedUser = await StoreService.updateUser(donorId, {
      totalDonations,
      lastDonationDate: latestDonation?.donationDate || null,
      nextEligibleDate: eligibility.nextEligibleDate,
    });

    successResponse(
      res,
      {
        donation,
        user: {
          totalDonations: updatedUser?.totalDonations,
          lastDonationDate: updatedUser?.lastDonationDate,
          nextEligibleDate: updatedUser?.nextEligibleDate,
          isEligible: eligibility.isEligible,
          disclaimer: eligibility.disclaimer,
        },
      },
      'Donation record saved successfully',
      201
    );
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const deleteDonation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const removed = await StoreService.deleteDonation(id, req.user!._id);

    if (!removed) {
      errorResponse(res, 'Donation record not found', 404);
      return;
    }

    const userDonations = await StoreService.findDonationsByDonor(req.user!._id);
    const totalDonations = userDonations.length;
    const latestDonation = userDonations[0];
    const eligibility = calculateEligibility(latestDonation?.donationDate);

    await StoreService.updateUser(req.user!._id, {
      totalDonations,
      lastDonationDate: latestDonation?.donationDate || null,
      nextEligibleDate: latestDonation ? eligibility.nextEligibleDate : null,
    });

    successResponse(res, null, 'Donation record removed');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};
