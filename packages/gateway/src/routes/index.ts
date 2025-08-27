import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { healthHandler } from './handlers/health.js';

export const router: ExpressRouter = Router();

router.get('/', healthHandler);
