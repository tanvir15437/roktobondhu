import { Router } from 'express';
import { getDonations, addDonation, deleteDonation } from '../controllers/donation.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createDonationSchema } from '../validations/donation.validation';

const router = Router();

router.use(authenticate);

router.get('/', getDonations);
router.post('/', validate(createDonationSchema), addDonation);
router.delete('/:id', deleteDonation);

export default router;
