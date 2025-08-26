import { z } from 'zod';

export const WebnodexConfigSchema = z.object({
  services: z.record(
    z.string().min(1), // service name
    z.union([z.url(), z.httpUrl()])
  ),
});

export type WebnodexConfig = z.infer<typeof WebnodexConfigSchema>;
