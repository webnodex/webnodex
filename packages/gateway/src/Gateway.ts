import type { Application } from 'express';
import express from 'express';
import { router } from './routes/index.js';
import { logger } from './logger/index.js';

export class Gateway {
  private readonly app: Application;

  constructor() {
    this.app = express();

    this.settings();
    this.middlewares();

    this.app.use('/', router);
  }

  private settings() {
    this.app.set('logger', logger);
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  public start(port: number) {
    const logger = this.app.get('logger');

    this.app
      .listen(port, () => {
        logger.info(`Gateway is running on port ${port}`);
      })
      .on('error', (err: NodeJS.ErrnoException) => {
        logger.error(`Error starting gateway: ${err.message}`);
        process.exit(1);
      });
  }
}
