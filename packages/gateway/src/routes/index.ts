import { Router, type Router as ExpressRouter } from 'express';
import { healthCheck } from './health.js';

export const router: ExpressRouter = Router();

router.get('/', healthCheck);
