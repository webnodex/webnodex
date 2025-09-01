import { z } from 'zod';
import { ConfigSchema } from '../schemas/config.js';

export type Config = z.infer<typeof ConfigSchema>;
