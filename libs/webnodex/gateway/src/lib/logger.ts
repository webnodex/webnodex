import pino from 'pino';
import { z, type ZodError } from 'zod';

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV === 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

export function logZodError(err: ZodError, message = 'Something went wrong') {
  const pretty = z.prettifyError(err);
  logger.error(`${message}\n${pretty}`);
}
