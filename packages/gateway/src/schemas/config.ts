import { z } from 'zod';

export const GatewayConfigSchema = z.object({
  port: z
    .optional(
      z.union([
        z.coerce
          .number<string>()
          .int()
          .positive()
          .min(1024, { message: 'Port must be greater than or equal to 1024.' })
          .max(65535, {
            message: 'Port must be less than or equal to 65535.',
          }),
        z
          .number()
          .int()
          .positive()
          .min(1024, { message: 'Port must be greater than or equal to 1024.' })
          .max(65535, {
            message: 'Port must be less than or equal to 65535.',
          }),
      ])
    )
    .default(3000),
});
