import { z } from 'zod';
import { GatewayConfigSchema } from '../schemas/config.js';

export type GatewayConfig = z.infer<typeof GatewayConfigSchema>;
