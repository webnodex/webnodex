import type { Application } from 'express';
import express from 'express';
import { router } from './routes/index.js';
import { logger } from './logger/index.js';

export class Gateway {
  private readonly app: Application;

  constructor() {
    this.app = express();
    this.middlewares();

    this.app.use('/', router);
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  public start(port: number) {
    this.app.listen(port, () => {
      logger.info(`Gateway is running on port ${port}`);
    });
  }
}
