import type { Application } from 'express';
import express from 'express';
import type { Logger } from 'pino';
import pino from 'pino';
import { ConfigSchema } from './schemas/config.js';
import type { Config } from './types/config.js';

export class Gateway {
  private readonly app: Application;
  private config: Config;
  private logger: Logger;

  constructor(config: Config) {
    this.app = express();
    this.logger = this.configureLogger();
    this.config = this.validateConfig(config);

    this.settings();
    this.middlewares();
  }

  private validateConfig(config: Config) {
    const result = ConfigSchema.safeParse(config);
    if (!result.success) {
      this.logger.error(`Invalid config: ${result.error}`);
      process.exit(1);
    }

    return result.data;
  }

  private configureLogger(): Logger {
    if (process.env.NODE_ENV !== 'production') {
      return pino({
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      });
    }

    return pino();
  }

  private settings(): void {
    const app = this.app;

    app.set('port', this.config.port);
    app.set('logger', this.logger);
  }

  private middlewares(): void {
    const app = this.app;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }

  public start() {
    const app = this.app;
    const port = app.get('port');
    const logger = app.get('logger');

    app
      .listen(port, () => {
        logger.info(`Gateway started on port ${port}`);
      })
      .on('error', (err: Error) => {
        logger.error(`Error starting gateway: ${err.message}`);
      });
  }
}
