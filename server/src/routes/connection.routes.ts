import { Router } from 'express';
import {
  createConnection,
  getRequestConnections,
  getMyConnections,
} from '../controllers/connection.controller';
import { optionalAuth, authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createConnectionSchema } from '../validations/connection.validation';

const router = Router();

// Calling or texting requester can be initiated with optional auth (guest donors supported)
router.post('/', optionalAuth, validate(createConnectionSchema), createConnection);
router.get('/request/:requestId', authenticate, getRequestConnections);
router.get('/my', authenticate, getMyConnections);

export default router;

