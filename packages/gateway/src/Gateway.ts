import type { Application } from 'express';
import express from 'express';
import { logger } from './logger/index.js';
import { router } from './routes/index.js';

export class Gateway {
  private readonly app: Application;

  constructor() {
    this.app = express();

    this.settings();
    this.middlewares();

    this.routes();
  }

  private settings() {
    this.app.set('logger', logger);
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private routes() {
    this.app.use('/', router);
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
