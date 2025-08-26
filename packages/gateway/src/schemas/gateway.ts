import z from 'zod';

export const GatewayOptionsSchema = z.object({
  configPath: z.string().min(1, 'Config path is required'),
  port: z.number().int().positive().default(3000),
});

export type GatewayOptions = z.infer<typeof GatewayOptionsSchema>;
