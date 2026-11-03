import { ENV } from '../config/env';

export interface EligibilityResult {
  isEligible: boolean;
  nextEligibleDate: string; // YYYY-MM-DD
  daysRemaining: number;
  disclaimer: string;
}

export const MEDICAL_DISCLAIMER =
  'Eligibility calculation is an informational estimation based on a standard interval (default 90 days) and does not constitute medical advice. Actual donation eligibility is determined on-site by clinical staff based on hemoglobin levels, blood pressure, and medical history.';

/**
 * Calculates next eligible donation date based on configurable recovery days.
 * @param lastDonationDate YYYY-MM-DD or Date object
 * @param intervalDays Configurable recovery days (defaults to ENV.DEFAULT_ELIGIBILITY_DAYS)
 */
export const calculateEligibility = (
  lastDonationDate: string | Date | null | undefined,
  intervalDays: number = ENV.DEFAULT_ELIGIBILITY_DAYS
): EligibilityResult => {
  if (!lastDonationDate) {
    const todayStr = new Date().toISOString().split('T')[0];
    return {
      isEligible: true,
      nextEligibleDate: todayStr,
      daysRemaining: 0,
      disclaimer: MEDICAL_DISCLAIMER,
    };
  }

  const lastDate = new Date(lastDonationDate);
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + intervalDays);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = nextDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isEligible = diffDays <= 0;
  const nextEligibleStr = nextDate.toISOString().split('T')[0];

  return {
    isEligible,
    nextEligibleDate: nextEligibleStr,
    daysRemaining: isEligible ? 0 : diffDays,
    disclaimer: MEDICAL_DISCLAIMER,
  };
};
