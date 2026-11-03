import { Router } from 'express';
import { getProfile, updateProfile, updateAvailability, getDonors } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema } from '../validations/auth.validation';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, validate(updateProfileSchema), updateProfile);
router.patch('/availability', authenticate, updateAvailability);
router.get('/donors', getDonors);

export default router;

