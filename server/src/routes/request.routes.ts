import { Router } from 'express';
import {
  getAllRequests,
  getUrgentRequests,
  getRequestById,
  createRequest,
  updateRequest,
  updateStatus,
  deleteRequest,
  getMyRequests,
} from '../controllers/request.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createRequestLimiter } from '../middleware/rateLimit.middleware';
import {
  createRequestSchema,
  updateRequestSchema,
  updateStatusSchema,
} from '../validations/request.validation';

const router = Router();

// Public discovery endpoints
router.get('/', getAllRequests);
router.get('/urgent', getUrgentRequests);
router.get('/my/requests', authenticate, getMyRequests);
router.get('/:id', getRequestById);

// Protected endpoints
router.post('/', authenticate, createRequestLimiter, validate(createRequestSchema), createRequest);
router.patch('/:id', authenticate, validate(updateRequestSchema), updateRequest);
router.patch('/:id/status', authenticate, validate(updateStatusSchema), updateStatus);
router.delete('/:id', authenticate, deleteRequest);

export default router;
